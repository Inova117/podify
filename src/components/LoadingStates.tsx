
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader, FileAudio, Sparkles } from "lucide-react";

interface LoadingStatesProps {
  state: 'uploading' | 'transcribing' | 'generating';
  fileName?: string;
  progress?: number;
}

export const LoadingStates = ({ state, fileName, progress }: LoadingStatesProps) => {
  const getStateConfig = () => {
    switch (state) {
      case 'uploading':
        return {
          icon: FileAudio,
          title: `Uploading ${fileName}`,
          description: "Securely transferring your file...",
          color: "text-purple-400"
        };
      case 'transcribing':
        return {
          icon: Loader,
          title: "Transcribing Your Podcast",
          description: "Our AI is listening to your content and generating transcripts...",
          color: "text-blue-400"
        };
      case 'generating':
        return {
          icon: Sparkles,
          title: "Generating Content",
          description: "AI is creating your show notes, social media posts, and Instagram hooks...",
          color: "text-purple-400"
        };
    }
  };

  const config = getStateConfig();
  const Icon = config.icon;

  return (
    <div className="text-center">
      <Icon className={`w-16 h-16 ${config.color} mx-auto mb-6 ${state === 'transcribing' ? 'animate-spin' : state === 'generating' ? 'animate-pulse' : ''}`} />
      <h3 className="text-xl text-white mb-4">{config.title}</h3>
      <p className="text-white/60 mb-4">{config.description}</p>
      
      {progress !== undefined && (
        <div className="mb-4">
          <div className="w-full bg-white/10 rounded-full h-2 mb-2">
            <div 
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/60 text-sm">{progress}% complete</p>
        </div>
      )}

      {state === 'transcribing' && (
        <div className="mt-6 p-4 bg-blue-500/20 rounded-lg">
          <p className="text-blue-200 text-sm">
            💡 This usually takes 1-2 minutes for a 30-minute episode
          </p>
        </div>
      )}

      {state === 'generating' && (
        <div className="mt-6 p-4 bg-purple-500/20 rounded-lg">
          <p className="text-purple-200 text-sm">
            ✨ Creating 20+ pieces of content from your podcast
          </p>
        </div>
      )}
    </div>
  );
};

export const ContentLoadingSkeleton = () => {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {[1, 2, 3, 4].map((index) => (
        <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg bg-white/20" />
              <Skeleton className="h-6 w-32 bg-white/20" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full bg-white/20" />
              <Skeleton className="h-4 w-3/4 bg-white/20" />
              <Skeleton className="h-4 w-1/2 bg-white/20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
