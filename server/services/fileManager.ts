import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { URL } from 'url';

export class FileManager {
  private downloadsDir: string;
  private outputDir: string;

  constructor() {
    this.downloadsDir = path.join(process.cwd(), 'temp', 'downloads');
    this.outputDir = path.join(process.cwd(), 'temp', 'output');
    this.ensureDirectories();
  }

  private ensureDirectories(): void {
    [this.downloadsDir, this.outputDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  async downloadVideo(url: string, jobId: string, index: number): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const parsedUrl = new URL(url);
        const filename = `${jobId}_${index}_${Date.now()}.mp4`;
        const filePath = path.join(this.downloadsDir, filename);
        const file = fs.createWriteStream(filePath);

        const client = parsedUrl.protocol === 'https:' ? https : http;
        
        const request = client.get(url, (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to download video: HTTP ${response.statusCode}`));
            return;
          }

          response.pipe(file);

          file.on('finish', () => {
            file.close();
            resolve(filePath);
          });

          file.on('error', (error) => {
            fs.unlink(filePath, () => {}); // Clean up on error
            reject(error);
          });
        });

        request.on('error', (error) => {
          reject(new Error(`Download failed: ${error.message}`));
        });

        request.setTimeout(30000, () => {
          request.destroy();
          reject(new Error('Download timeout'));
        });

      } catch (error) {
        reject(new Error(`Invalid URL: ${error}`));
      }
    });
  }

  async downloadAllVideos(urls: string[], jobId: string): Promise<string[]> {
    const downloadPromises = urls.map((url, index) => 
      this.downloadVideo(url, jobId, index)
    );

    try {
      return await Promise.all(downloadPromises);
    } catch (error) {
      // Clean up any partially downloaded files
      const partialFiles = await Promise.allSettled(downloadPromises);
      partialFiles.forEach(result => {
        if (result.status === 'fulfilled' && fs.existsSync(result.value)) {
          fs.unlinkSync(result.value);
        }
      });
      throw error;
    }
  }

  generateOutputPath(jobId: string, format: string): string {
    const filename = `stitched_${jobId}.${format}`;
    return path.join(this.outputDir, filename);
  }

  getPublicUrl(filePath: string): string {
    const filename = path.basename(filePath);
    // In production, this would be a CDN URL or proper file serving endpoint
    return `/api/download/${filename}`;
  }

  cleanup(filePaths: string[]): void {
    filePaths.forEach(filePath => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.warn(`Failed to cleanup file ${filePath}:`, error);
      }
    });
  }

  getOutputDir(): string {
    return this.outputDir;
  }
}

export const fileManager = new FileManager();
