
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
          description: "Securely transferring your precious content to our servers...",
          color: "text-purple-400",
          tip: "💡 We use enterprise-grade encryption to keep your content safe"
        };
      case 'transcribing':
        return {
          icon: Loader,
          title: "AI is Listening to Your Podcast",
          description: "Our advanced AI is carefully transcribing every word and identifying key moments...",
          color: "text-blue-400",
          tip: "⚡ This usually takes 1-2 minutes for a 30-minute episode"
        };
      case 'generating':
        return {
          icon: Sparkles,
          title: "Creating Your Content Masterpiece",
          description: "AI is crafting show notes, viral social posts, and Instagram hooks tailored to your content...",
          color: "text-purple-400",
          tip: "✨ Generating 20+ pieces of optimized content from your podcast"
        };
    }
  };

  const config = getStateConfig();
  const Icon = config.icon;

  return (
    <div className="text-center animate-fade-in">
      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full animate-pulse" />
        </div>
        <Icon className={`w-16 h-16 ${config.color} mx-auto relative z-10 ${
          state === 'transcribing' ? 'animate-spin' : 
          state === 'generating' ? 'animate-pulse' : 
          'animate-bounce'
        }`} />
      </div>
      
      <h3 className="text-2xl font-bold text-white mb-4">{config.title}</h3>
      <p className="text-white/70 mb-6 text-lg leading-relaxed max-w-md mx-auto">{config.description}</p>
      
      {progress !== undefined && (
        <div className="mb-6">
          <div className="w-full bg-white/10 rounded-full h-3 mb-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-white/60 text-sm font-medium">{progress}% complete</p>
        </div>
      )}

      <div className={`mt-8 p-6 ${
        state === 'transcribing' ? 'bg-blue-500/20' : 
        state === 'generating' ? 'bg-purple-500/20' : 
        'bg-green-500/20'
      } rounded-xl border border-white/10 backdrop-blur-sm`}>
        <p className={`${
          state === 'transcribing' ? 'text-blue-200' : 
          state === 'generating' ? 'text-purple-200' : 
          'text-green-200'
        } text-sm font-medium`}>
          {config.tip}
        </p>
      </div>
    </div>
  );
};

export const ContentLoadingSkeleton = () => {
  return (
    <div className="grid gap-8 lg:grid-cols-2 animate-fade-in">
      {[1, 2, 3, 4].map((index) => (
        <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg bg-white/20 animate-pulse" />
              <Skeleton className="h-6 w-32 bg-white/20 animate-pulse" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full bg-white/20 animate-pulse" />
              <Skeleton className="h-4 w-3/4 bg-white/20 animate-pulse" />
              <Skeleton className="h-4 w-1/2 bg-white/20 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
