import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileAudio, CheckCircle, Loader, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ContentResults } from "./ContentResults";

type UploadState = 'idle' | 'uploading' | 'uploaded' | 'transcribing' | 'generating' | 'completed';

export const AudioUpload = () => {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState<string>('');
  const { toast } = useToast();

  const handleFileUpload = useCallback((file: File) => {
    if (!file.type.includes('audio')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an audio file (MP3, WAV, etc.)",
        variant: "destructive"
      });
      return;
    }

    setFileName(file.name);
    setUploadState('uploading');
    setUploadProgress(0);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setUploadState('uploaded');
          
          // Simulate transcription after upload
          setTimeout(() => {
            setUploadState('transcribing');
            
            // Simulate content generation after transcription
            setTimeout(() => {
              setUploadState('generating');
              
              // Simulate completion
              setTimeout(() => {
                setUploadState('completed');
                toast({
                  title: "Content Generation Complete!",
                  description: "Your podcast has been processed and all content is ready.",
                });
              }, 4000);
            }, 3000);
          }, 1000);
          
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  }, [toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const resetUpload = () => {
    setUploadState('idle');
    setUploadProgress(0);
    setFileName('');
  };

  return (
    <>
      <section id="upload-section" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Transform
              </span>{" "}
              Your Podcast?
            </h2>
            <p className="text-xl text-white/70">
              Upload your MP3 file and watch the magic happen
            </p>
          </div>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-2xl text-white text-center">
                Upload Your Podcast
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {uploadState === 'idle' && (
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-white/30 rounded-lg p-12 text-center hover:border-white/50 transition-colors cursor-pointer"
                >
                  <Upload className="w-16 h-16 text-white/60 mx-auto mb-6" />
                  <h3 className="text-xl text-white mb-4">
                    Drag and drop your audio file here
                  </h3>
                  <p className="text-white/60 mb-6">
                    or click to browse your files
                  </p>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleInputChange}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload">
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-full"
                      asChild
                    >
                      <span>Choose Audio File</span>
                    </Button>
                  </label>
                  <p className="text-sm text-white/40 mt-4">
                    Supports MP3, WAV, M4A files up to 100MB
                  </p>
                </div>
              )}

              {uploadState === 'uploading' && (
                <div className="text-center">
                  <FileAudio className="w-16 h-16 text-purple-400 mx-auto mb-6" />
                  <h3 className="text-xl text-white mb-4">Uploading {fileName}</h3>
                  <Progress value={uploadProgress} className="mb-4" />
                  <p className="text-white/60">{uploadProgress}% uploaded</p>
                </div>
              )}

              {uploadState === 'uploaded' && (
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
                  <h3 className="text-xl text-white mb-4">Upload Complete!</h3>
                  <p className="text-white/60">Preparing for transcription...</p>
                </div>
              )}

              {uploadState === 'transcribing' && (
                <div className="text-center">
                  <Loader className="w-16 h-16 text-blue-400 mx-auto mb-6 animate-spin" />
                  <h3 className="text-xl text-white mb-4">Transcribing Your Podcast</h3>
                  <p className="text-white/60">
                    Our AI is listening to your content and generating transcripts...
                  </p>
                  <div className="mt-6 p-4 bg-blue-500/20 rounded-lg">
                    <p className="text-blue-200 text-sm">
                      💡 This usually takes 1-2 minutes for a 30-minute episode
                    </p>
                  </div>
                </div>
              )}

              {uploadState === 'generating' && (
                <div className="text-center">
                  <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-6 animate-pulse" />
                  <h3 className="text-xl text-white mb-4">Generating Content</h3>
                  <p className="text-white/60 mb-4">
                    AI is creating your show notes, social media posts, and Instagram hooks...
                  </p>
                  <div className="mt-6 p-4 bg-purple-500/20 rounded-lg">
                    <p className="text-purple-200 text-sm">
                      ✨ Creating 20+ pieces of content from your podcast
                    </p>
                  </div>
                </div>
              )}

              {uploadState === 'completed' && (
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
                  <h3 className="text-xl text-white mb-4">All Content Generated!</h3>
                  <p className="text-white/60 mb-6">
                    Your podcast has been processed and all content is ready below
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      onClick={resetUpload}
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-full"
                    >
                      Upload Another Episode
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Demo note */}
          <div className="mt-8 text-center">
            <p className="text-white/40 text-sm">
              🚀 This is a demo version. In production, files will be securely stored and processed.
            </p>
          </div>
        </div>
      </section>

      {/* Content Results Section with filename */}
      <ContentResults isVisible={uploadState === 'completed'} fileName={fileName} />
    </>
  );
};
