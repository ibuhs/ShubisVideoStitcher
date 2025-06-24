import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VideoStitchInterface from "@/components/VideoStitchInterface";
import { Video, Zap, Cloud, Shield, Code, FileVideo, Smartphone } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">VideoStitch</h1>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">API Docs</a>
                <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Pricing</a>
                <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Support</a>
                <Button className="bg-primary text-white hover:bg-blue-600">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Stitch Videos with a Simple API Call
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Concatenate multiple videos seamlessly with our powerful API. Upload video URLs, get a downloadable link in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white text-primary px-8 py-3 hover:bg-gray-100">
                  Try It Free
                </Button>
                <Button variant="outline" className="border-white text-white px-8 py-3 hover:bg-white hover:text-primary">
                  <Video className="w-4 h-4 mr-2" />
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Video Editor</h3>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="bg-black/50 rounded-lg p-4 aspect-video">
                    <div className="flex items-center justify-center h-full">
                      <Video className="w-16 h-16 text-white/70" />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="bg-white/20 rounded px-3 py-1 text-sm">Video 1</div>
                    <div className="bg-white/20 rounded px-3 py-1 text-sm">Video 2</div>
                    <div className="bg-white/20 rounded px-3 py-1 text-sm">Video 3</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interface Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary mb-4">Test the API</h2>
            <p className="text-xl text-gray-600">Try our video stitching API with the interactive interface below</p>
          </div>

          <VideoStitchInterface />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to concatenate videos at scale</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-primary rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-gray-600">Process videos in seconds with our optimized FFmpeg pipeline</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-accent rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Cloud className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Cloud Processing</h3>
                <p className="text-gray-600">No software installation required. Everything runs in the cloud</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-yellow-500 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                <p className="text-gray-600">Your videos are automatically deleted after processing</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-purple-500 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Simple API</h3>
                <p className="text-gray-600">RESTful API with comprehensive documentation and examples</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-red-500 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <FileVideo className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Multiple Formats</h3>
                <p className="text-gray-600">Support for MP4, WebM, MOV, and other popular video formats</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-blue-500 rounded-lg p-3 w-12 h-12 flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Responsive Design</h3>
                <p className="text-gray-600">Works perfectly on desktop, tablet, and mobile devices</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* API Documentation Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-secondary mb-4">API Documentation</h2>
            <p className="text-xl text-gray-600">Get started with our simple REST API</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4">POST /api/stitch</h3>
                <p className="text-gray-600 mb-6">Submit multiple video URLs for concatenation</p>
                
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm">
                    <code>{`{
  "videos": [
    "https://example.com/video1.mp4",
    "https://example.com/video2.mp4"
  ],
  "format": "mp4",
  "quality": "high"
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4">Response</h3>
                <p className="text-gray-600 mb-6">Get processing status and download link</p>
                
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-blue-400 text-sm">
                    <code>{`{
  "jobId": "abc123",
  "status": "completed",
  "downloadUrl": "/api/download/stitched_abc123.mp4",
  "expiresAt": "2024-01-01T12:00:00Z"
}`}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button className="bg-secondary text-white hover:bg-gray-800">
              View Full Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Start Stitching Videos?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of developers who trust VideoStitch for their video processing needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary px-8 py-3 hover:bg-gray-100">
              Get API Key
            </Button>
            <Button variant="outline" className="border-white text-white px-8 py-3 hover:bg-white hover:text-primary">
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">VideoStitch</h3>
              <p className="text-gray-400">Professional video concatenation API for developers</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">API</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 VideoStitch. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
