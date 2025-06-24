import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const videoJobs = pgTable("video_jobs", {
  id: serial("id").primaryKey(),
  jobId: text("job_id").notNull().unique(),
  status: text("status").notNull(), // 'pending', 'processing', 'completed', 'failed'
  videoUrls: jsonb("video_urls").notNull(),
  outputFormat: text("output_format").notNull().default("mp4"),
  quality: text("quality").notNull().default("auto"),
  downloadUrl: text("download_url"),
  progress: integer("progress").notNull().default(0),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertVideoJobSchema = createInsertSchema(videoJobs).pick({
  videoUrls: true,
  outputFormat: true,
  quality: true,
});

export const videoStitchRequestSchema = z.object({
  videos: z.array(z.string().url()).min(2).max(10),
  format: z.enum(["mp4", "webm", "mov"]).default("mp4"),
  quality: z.enum(["auto", "high", "medium", "low"]).default("auto"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertVideoJob = z.infer<typeof insertVideoJobSchema>;
export type VideoJob = typeof videoJobs.$inferSelect;
export type VideoStitchRequest = z.infer<typeof videoStitchRequestSchema>;
