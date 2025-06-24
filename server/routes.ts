import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { videoStitchRequestSchema } from "@shared/schema";
import { ffmpegService } from "./services/ffmpeg";
import { fileManager } from "./services/fileManager";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create video stitching job
  app.post("/api/stitch", async (req, res) => {
    try {
      const validatedData = videoStitchRequestSchema.parse(req.body);
      const jobId = nanoid();

      // Create job in storage
      await storage.createVideoJob({
        jobId,
        videoUrls: validatedData.videos,
        outputFormat: validatedData.format,
        quality: validatedData.quality,
      });

      // Start processing asynchronously
      processVideoJob(jobId).catch(error => {
        console.error(`Job ${jobId} failed:`, error);
        storage.updateVideoJobError(jobId, error.message);
      });

      res.json({
        jobId,
        status: "pending",
        message: "Video processing job created successfully"
      });

    } catch (error) {
      res.status(400).json({
        error: "Invalid request",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Get job status
  app.get("/api/jobs/:jobId", async (req, res) => {
    try {
      const { jobId } = req.params;
      const job = await storage.getVideoJob(jobId);

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      const response: any = {
        jobId: job.jobId,
        status: job.status,
        progress: job.progress,
        createdAt: job.createdAt,
        expiresAt: job.expiresAt,
      };

      if (job.status === "completed" && job.downloadUrl) {
        response.downloadUrl = job.downloadUrl;
      }

      if (job.status === "failed" && job.errorMessage) {
        response.error = job.errorMessage;
      }

      res.json(response);

    } catch (error) {
      res.status(500).json({
        error: "Failed to get job status",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Download processed video
  app.get("/api/download/:filename", async (req, res) => {
    try {
      const { filename } = req.params;
      const filePath = path.join(fileManager.getOutputDir(), filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "File not found" });
      }

      // Set appropriate headers
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);

      fileStream.on('error', (error) => {
        console.error('Error streaming file:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: "Failed to download file" });
        }
      });

    } catch (error) {
      res.status(500).json({
        error: "Download failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Cleanup expired jobs (called periodically)
  app.post("/api/cleanup", async (req, res) => {
    try {
      await storage.cleanupExpiredJobs();
      res.json({ message: "Cleanup completed" });
    } catch (error) {
      res.status(500).json({
        error: "Cleanup failed",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function processVideoJob(jobId: string): Promise<void> {
  const job = await storage.getVideoJob(jobId);
  if (!job) {
    throw new Error("Job not found");
  }

  try {
    // Update status to processing
    await storage.updateVideoJobStatus(jobId, "processing", 10);

    // Download all videos
    const videoUrls = job.videoUrls as string[];
    const downloadedFiles = await fileManager.downloadAllVideos(videoUrls, jobId);
    
    await storage.updateVideoJobStatus(jobId, "processing", 40);

    // Validate video files
    for (const filePath of downloadedFiles) {
      try {
        await ffmpegService.getVideoInfo(filePath);
      } catch (error) {
        throw new Error(`Invalid video file: ${path.basename(filePath)}`);
      }
    }

    await storage.updateVideoJobStatus(jobId, "processing", 60);

    // Generate output path
    const outputPath = fileManager.generateOutputPath(jobId, job.outputFormat);

    // Stitch videos with progress callback
    await ffmpegService.stitchVideos(
      downloadedFiles,
      outputPath,
      job.outputFormat,
      job.quality,
      (progress) => {
        // Map FFmpeg progress (0-100) to our progress range (60-95)
        const mappedProgress = 60 + (progress * 0.35);
        storage.updateVideoJobStatus(jobId, "processing", Math.round(mappedProgress));
      }
    );

    await storage.updateVideoJobStatus(jobId, "processing", 95);

    // Generate download URL
    const downloadUrl = fileManager.getPublicUrl(outputPath);
    await storage.updateVideoJobDownloadUrl(jobId, downloadUrl);

    // Clean up input files
    fileManager.cleanup(downloadedFiles);

    console.log(`Job ${jobId} completed successfully`);

  } catch (error) {
    console.error(`Job ${jobId} failed:`, error);
    await storage.updateVideoJobError(jobId, error instanceof Error ? error.message : "Unknown error");
    
    // Clean up any files
    try {
      const downloadedFiles = await fileManager.downloadAllVideos(job.videoUrls as string[], jobId);
      fileManager.cleanup(downloadedFiles);
    } catch (cleanupError) {
      console.warn("Failed to cleanup files:", cleanupError);
    }
  }
}

// Schedule periodic cleanup
setInterval(async () => {
  try {
    await storage.cleanupExpiredJobs();
  } catch (error) {
    console.error("Scheduled cleanup failed:", error);
  }
}, 60 * 60 * 1000); // Run every hour
