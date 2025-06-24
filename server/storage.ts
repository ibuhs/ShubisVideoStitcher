import { users, videoJobs, type User, type InsertUser, type VideoJob, type InsertVideoJob } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Video job methods
  createVideoJob(job: InsertVideoJob & { jobId: string }): Promise<VideoJob>;
  getVideoJob(jobId: string): Promise<VideoJob | undefined>;
  updateVideoJobStatus(jobId: string, status: string, progress?: number): Promise<void>;
  updateVideoJobDownloadUrl(jobId: string, downloadUrl: string): Promise<void>;
  updateVideoJobError(jobId: string, errorMessage: string): Promise<void>;
  getActiveVideoJobs(): Promise<VideoJob[]>;
  cleanupExpiredJobs(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private videoJobs: Map<string, VideoJob>;
  private currentUserId: number;
  private currentJobId: number;

  constructor() {
    this.users = new Map();
    this.videoJobs = new Map();
    this.currentUserId = 1;
    this.currentJobId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createVideoJob(job: InsertVideoJob & { jobId: string }): Promise<VideoJob> {
    const id = this.currentJobId++;
    const videoJob: VideoJob = {
      id,
      jobId: job.jobId,
      videoUrls: job.videoUrls,
      outputFormat: job.outputFormat,
      quality: job.quality,
      status: "pending",
      progress: 0,
      downloadUrl: null,
      errorMessage: null,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
    };
    this.videoJobs.set(job.jobId, videoJob);
    return videoJob;
  }

  async getVideoJob(jobId: string): Promise<VideoJob | undefined> {
    return this.videoJobs.get(jobId);
  }

  async updateVideoJobStatus(jobId: string, status: string, progress?: number): Promise<void> {
    const job = this.videoJobs.get(jobId);
    if (job) {
      job.status = status;
      if (progress !== undefined) {
        job.progress = progress;
      }
      this.videoJobs.set(jobId, job);
    }
  }

  async updateVideoJobDownloadUrl(jobId: string, downloadUrl: string): Promise<void> {
    const job = this.videoJobs.get(jobId);
    if (job) {
      job.downloadUrl = downloadUrl;
      job.status = "completed";
      job.progress = 100;
      this.videoJobs.set(jobId, job);
    }
  }

  async updateVideoJobError(jobId: string, errorMessage: string): Promise<void> {
    const job = this.videoJobs.get(jobId);
    if (job) {
      job.status = "failed";
      job.errorMessage = errorMessage;
      this.videoJobs.set(jobId, job);
    }
  }

  async getActiveVideoJobs(): Promise<VideoJob[]> {
    return Array.from(this.videoJobs.values()).filter(
      job => job.status === "pending" || job.status === "processing"
    );
  }

  async cleanupExpiredJobs(): Promise<void> {
    const now = new Date();
    for (const [jobId, job] of this.videoJobs.entries()) {
      if (job.expiresAt && job.expiresAt < now) {
        this.videoJobs.delete(jobId);
      }
    }
  }
}

export const storage = new MemStorage();
