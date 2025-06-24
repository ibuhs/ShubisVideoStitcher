# VideoStitch Application

## Overview

VideoStitch is a full-stack web application that provides video concatenation services through a simple API. Users can submit multiple video URLs to be stitched together into a single output video file. The application features a modern React frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence and FFmpeg for video processing.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API endpoints
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Video Processing**: FFmpeg for video manipulation
- **File Management**: Custom file manager for handling downloads and temporary files
- **Session Management**: In-memory storage with optional PostgreSQL session store

### Database Schema
- **Users Table**: Basic user management (id, username, password)
- **Video Jobs Table**: Job tracking with status, progress, URLs, and metadata
- **Job States**: pending → processing → completed/failed
- **Data Validation**: Zod schemas for type-safe data handling

## Key Components

### API Endpoints
- `POST /api/stitch` - Create new video stitching job
- `GET /api/jobs/:jobId` - Get job status and progress
- File download endpoints for completed jobs

### Video Processing Pipeline
1. **Job Creation**: Validate input URLs and create database record
2. **File Download**: Asynchronously download videos from provided URLs
3. **Video Processing**: Use FFmpeg to concatenate videos
4. **Output Generation**: Create downloadable file with specified format/quality
5. **Cleanup**: Remove temporary files after processing

### Frontend Features
- **Landing Page**: Hero section with API documentation and features
- **Video Stitching Interface**: Form for submitting video URLs and options
- **Real-time Progress**: Live updates on job status and progress
- **Download Management**: Secure download links for completed jobs

## Data Flow

1. **User Input**: User submits video URLs through React interface
2. **Job Creation**: Frontend sends POST request to create stitching job
3. **Async Processing**: Backend downloads videos and processes them with FFmpeg
4. **Status Updates**: Frontend polls job status endpoint for progress updates
5. **File Delivery**: Completed jobs provide download URLs for processed videos
6. **Cleanup**: Temporary files are cleaned up after job completion or expiration

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database operations and migrations
- **@radix-ui/***: Headless UI components for accessibility
- **@tanstack/react-query**: Server state management and caching
- **class-variance-authority**: Type-safe component variants

### Video Processing
- **FFmpeg**: External binary required for video processing operations
- **File System**: Local storage for temporary video files during processing

### Development Tools
- **TypeScript**: Type safety across frontend and backend
- **ESBuild**: Fast JavaScript bundling for production
- **Tailwind CSS**: Utility-first styling framework

## Deployment Strategy

### Development Environment
- **Runtime**: Node.js 20 with PostgreSQL 16
- **Dev Server**: Concurrent frontend (Vite) and backend (tsx) processes
- **File Watching**: Hot reload for both client and server code
- **Port Configuration**: Backend on 5000, proxied through Vite dev server

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: ESBuild compiles TypeScript server to `dist/index.js`
- **Static Serving**: Express serves built frontend assets in production
- **Database**: Drizzle migrations handle schema changes

### Replit Configuration
- **Autoscale Deployment**: Configured for automatic scaling based on traffic
- **Port Mapping**: Internal port 5000 mapped to external port 80
- **Build Process**: npm run build creates production-ready application
- **Environment**: PostgreSQL module provides managed database instance

## Changelog
- June 24, 2025. Initial setup
- June 24, 2025. Applied deployment fixes:
  - Added SESSION_SECRET environment variable handling with fallback
  - Implemented proper NODE_ENV detection and validation
  - Added session middleware configuration for production
  - Enhanced error handling for server startup
  - Added health check endpoint (/health) for deployment verification
  - Improved production environment configuration

## User Preferences

Preferred communication style: Simple, everyday language.