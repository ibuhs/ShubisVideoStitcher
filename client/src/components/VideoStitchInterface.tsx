import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Trash2, Video, Wand2, Download, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface VideoStitchJob {
  jobId: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  downloadUrl?: string;
  error?: string;
  createdAt: string;
  expiresAt: string;
}

export default function VideoStitchInterface() {
  const [videoUrls, setVideoUrls] = useState<string[]>(["", ""]);
  const [format, setFormat] = useState("mp4");
  const [quality, setQuality] = useState("auto");
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const { toast } = useToast();

  // Mutation for creating stitch job
  const stitchMutation = useMutation({
    mutationFn: async (data: { videos: string[], format: string, quality: string }) => {
      const response = await apiRequest("POST", "/api/stitch", data);
      return response.json();
    },
    onSuccess: (data) => {
      setCurrentJobId(data.jobId);
      toast({
        title: "Job Created",
        description: "Your video stitching job has been started!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Query for job status
  const { data: jobStatus, isLoading: isLoadingStatus } = useQuery<VideoStitchJob>({
    queryKey: [`/api/jobs/${currentJobId}`],
    enabled: !!currentJobId,
    refetchInterval: 2000,
    refetchIntervalInBackground: false,
  });

  const addVideoUrl = () => {
    if (videoUrls.length < 10) {
      setVideoUrls([...videoUrls, ""]);
    }
  };

  const removeVideoUrl = (index: number) => {
    if (videoUrls.length > 2) {
      setVideoUrls(videoUrls.filter((_, i) => i !== index));
    }
  };

  const updateVideoUrl = (index: number, value: string) => {
    const newUrls = [...videoUrls];
    newUrls[index] = value;
    setVideoUrls(newUrls);
  };

  const handleStitch = () => {
    const validUrls = videoUrls.filter(url => url.trim() !== "");
    
    if (validUrls.length < 2) {
      toast({
        title: "Invalid Input",
        description: "Please provide at least 2 video URLs",
        variant: "destructive",
      });
      return;
    }

    // Validate URLs
    const invalidUrls = validUrls.filter(url => {
      try {
        new URL(url);
        return false;
      } catch {
        return true;
      }
    });

    if (invalidUrls.length > 0) {
      toast({
        title: "Invalid URLs",
        description: "Please provide valid video URLs",
        variant: "destructive",
      });
      return;
    }

    stitchMutation.mutate({
      videos: validUrls,
      format,
      quality,
    });
  };

  const resetInterface = () => {
    setCurrentJobId(null);
    setVideoUrls(["", ""]);
  };

  return (
    <Card className="bg-white rounded-2xl shadow-xl overflow-hidden">
      <CardContent className="p-8">
        {/* URL Input Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-secondary">Add Video URLs</h3>
          <div className="space-y-4">
            {videoUrls.map((url, index) => (
              <div key={index} className="flex gap-3">
                <Input
                  type="url"
                  placeholder={`https://example.com/video${index + 1}.mp4`}
                  value={url}
                  onChange={(e) => updateVideoUrl(index, e.target.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeVideoUrl(index)}
                  disabled={videoUrls.length <= 2}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            onClick={addVideoUrl}
            disabled={videoUrls.length >= 10}
            className="mt-4 text-primary hover:text-blue-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another URL
          </Button>
        </div>

        {/* Video Preview Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-secondary">Video Preview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videoUrls.slice(0, 3).map((url, index) => (
              <div key={index} className="bg-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-300">
                <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                  <Video className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 text-center">Video {index + 1}</p>
                <p className="text-xs text-gray-500 text-center">
                  {url ? "URL provided" : "No URL provided"}
                </p>
              </div>
            ))}
            {videoUrls.length > 3 && (
              <div className="bg-gray-100 rounded-lg p-4 border-2 border-dashed border-gray-300">
                <div className="aspect-video bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 text-center">+{videoUrls.length - 3} more videos</p>
              </div>
            )}
          </div>
        </div>

        {/* Processing Options */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-secondary">Processing Options</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mp4">MP4 (H.264)</SelectItem>
                  <SelectItem value="webm">WebM</SelectItem>
                  <SelectItem value="mov">MOV</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quality</label>
              <Select value={quality} onValueChange={setQuality}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto</SelectItem>
                  <SelectItem value="high">High (1080p)</SelectItem>
                  <SelectItem value="medium">Medium (720p)</SelectItem>
                  <SelectItem value="low">Low (480p)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Process Button */}
        {!currentJobId && (
          <div className="text-center">
            <Button
              onClick={handleStitch}
              disabled={stitchMutation.isPending}
              className="bg-gradient-to-r from-primary to-blue-600 text-white px-12 py-4 text-lg hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg"
            >
              {stitchMutation.isPending ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-5 h-5 mr-2" />
              )}
              Stitch Videos
            </Button>
          </div>
        )}
      </CardContent>

      {/* Progress Section */}
      {currentJobId && jobStatus && (
        <div className="bg-gray-50 p-8 border-t border-gray-200">
          <div className="max-w-md mx-auto">
            {jobStatus.status === "completed" ? (
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-accent mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-secondary mb-2">Video Processing Complete!</h3>
                <p className="text-gray-600 mb-6">Your stitched video is ready for download</p>
                <div className="space-y-4">
                  <Button asChild className="bg-accent text-white hover:bg-green-600">
                    <a href={jobStatus.downloadUrl} download>
                      <Download className="w-4 h-4 mr-2" />
                      Download Video
                    </a>
                  </Button>
                  <Button variant="outline" onClick={resetInterface} className="w-full">
                    Create Another Video
                  </Button>
                </div>
              </div>
            ) : jobStatus.status === "failed" ? (
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-secondary mb-2">Processing Failed</h3>
                <p className="text-gray-600 mb-6">{jobStatus.error || "An error occurred during processing"}</p>
                <Button variant="outline" onClick={resetInterface}>
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-primary mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-secondary mb-2">Processing Your Videos</h3>
                <p className="text-gray-600 mb-6">This may take a few minutes depending on video length</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Downloading videos...</span>
                    <span className={jobStatus.progress > 10 ? "text-accent" : "text-gray-400"}>
                      {jobStatus.progress > 10 ? "✓" : "⏳"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Validating formats...</span>
                    <span className={jobStatus.progress > 40 ? "text-accent" : "text-gray-400"}>
                      {jobStatus.progress > 40 ? "✓" : jobStatus.progress > 10 ? <Loader2 className="w-4 h-4 animate-spin" /> : "⏳"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Stitching videos...</span>
                    <span className={jobStatus.progress > 95 ? "text-accent" : "text-gray-400"}>
                      {jobStatus.progress > 95 ? "✓" : jobStatus.progress > 60 ? <Loader2 className="w-4 h-4 animate-spin" /> : "⏳"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Generating download link...</span>
                    <span className={jobStatus.progress === 100 ? "text-accent" : "text-gray-400"}>
                      {jobStatus.progress === 100 ? "✓" : "⏳"}
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Progress value={jobStatus.progress} className="h-2" />
                  <p className="text-center text-sm text-gray-600 mt-2">{jobStatus.progress}% Complete</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
