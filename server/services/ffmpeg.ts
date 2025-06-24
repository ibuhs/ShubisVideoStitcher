import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

export interface VideoInfo {
  duration: number;
  width: number;
  height: number;
  format: string;
}

export class FFmpegService {
  private tempDir: string;

  constructor() {
    this.tempDir = path.join(process.cwd(), 'temp');
    this.ensureTempDir();
  }

  private ensureTempDir(): void {
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async getVideoInfo(filePath: string): Promise<VideoInfo> {
    return new Promise((resolve, reject) => {
      const ffprobe = spawn('ffprobe', [
        '-v', 'quiet',
        '-print_format', 'json',
        '-show_format',
        '-show_streams',
        filePath
      ]);

      let output = '';
      ffprobe.stdout.on('data', (data) => {
        output += data.toString();
      });

      ffprobe.on('close', (code) => {
        if (code !== 0) {
          reject(new Error('Failed to get video info'));
          return;
        }

        try {
          const info = JSON.parse(output);
          const videoStream = info.streams.find((s: any) => s.codec_type === 'video');
          
          if (!videoStream) {
            reject(new Error('No video stream found'));
            return;
          }

          resolve({
            duration: parseFloat(info.format.duration),
            width: videoStream.width,
            height: videoStream.height,
            format: info.format.format_name
          });
        } catch (error) {
          reject(new Error('Failed to parse video info'));
        }
      });
    });
  }

  async stitchVideos(
    inputFiles: string[],
    outputPath: string,
    format: string = 'mp4',
    quality: string = 'auto',
    onProgress?: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Create a file list for ffmpeg concat
      const fileListPath = path.join(this.tempDir, `filelist_${Date.now()}.txt`);
      const fileListContent = inputFiles.map(file => `file '${file.replace(/'/g, "'\\''")}'`).join('\n');
      fs.writeFileSync(fileListPath, fileListContent);

      const args = [
        '-f', 'concat',
        '-safe', '0',
        '-i', fileListPath,
        '-c', 'copy'
      ];

      // Add quality settings based on the quality parameter
      if (quality !== 'auto') {
        args.push('-c:v', 'libx264');
        switch (quality) {
          case 'high':
            args.push('-crf', '18', '-preset', 'slow');
            break;
          case 'medium':
            args.push('-crf', '23', '-preset', 'medium');
            break;
          case 'low':
            args.push('-crf', '28', '-preset', 'fast');
            break;
        }
      }

      args.push(outputPath);

      const ffmpeg = spawn('ffmpeg', args);

      let totalDuration = 0;
      ffmpeg.stderr.on('data', (data) => {
        const output = data.toString();
        
        // Extract total duration
        const durationMatch = output.match(/Duration: (\d{2}):(\d{2}):(\d{2})\.\d{2}/);
        if (durationMatch && totalDuration === 0) {
          const hours = parseInt(durationMatch[1]);
          const minutes = parseInt(durationMatch[2]);
          const seconds = parseInt(durationMatch[3]);
          totalDuration = hours * 3600 + minutes * 60 + seconds;
        }

        // Extract current time for progress
        const timeMatch = output.match(/time=(\d{2}):(\d{2}):(\d{2})\.\d{2}/);
        if (timeMatch && totalDuration > 0 && onProgress) {
          const hours = parseInt(timeMatch[1]);
          const minutes = parseInt(timeMatch[2]);
          const seconds = parseInt(timeMatch[3]);
          const currentTime = hours * 3600 + minutes * 60 + seconds;
          const progress = Math.min((currentTime / totalDuration) * 100, 100);
          onProgress(progress);
        }
      });

      ffmpeg.on('close', (code) => {
        // Clean up the file list
        try {
          fs.unlinkSync(fileListPath);
        } catch (error) {
          console.warn('Failed to clean up file list:', error);
        }

        if (code !== 0) {
          reject(new Error(`FFmpeg process exited with code ${code}`));
          return;
        }

        resolve();
      });

      ffmpeg.on('error', (error) => {
        reject(new Error(`FFmpeg error: ${error.message}`));
      });
    });
  }

  getTempDir(): string {
    return this.tempDir;
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
}

export const ffmpegService = new FFmpegService();
