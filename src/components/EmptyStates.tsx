
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Mic, Sparkles, ArrowDown } from "lucide-react";

interface EmptyStatesProps {
  type: 'upload' | 'no-results';
  onAction?: () => void;
}

export const EmptyStates = ({ type, onAction }: EmptyStatesProps) => {
  if (type === 'upload') {
    return (
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 max-w-2xl mx-auto">
        <CardContent className="p-12 text-center">
          <div className="relative mb-8">
            {/* Animated background elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full animate-pulse" />
            </div>
            <div className="relative flex items-center justify-center">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <Mic className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Transform Your Podcast?
          </h3>
          <p className="text-white/70 mb-8 text-lg">
            Upload your audio file and watch AI create show notes, social media posts, and viral content in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
            <div className="flex items-center gap-3 text-white/60">
              <Upload className="w-5 h-5 text-purple-400" />
              <span>Upload Audio</span>
              <ArrowDown className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-3 text-white/60">
              <Mic className="w-5 h-5 text-blue-400" />
              <span>AI Transcription</span>
              <ArrowDown className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-3 text-white/60">
              <Sparkles className="w-5 h-5 text-pink-400" />
              <span>Content Created</span>
            </div>
          </div>

          <Button 
            onClick={onAction}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Upload className="w-5 h-5 mr-2" />
            Get Started Now
          </Button>

          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-purple-400 mb-1">5+</div>
              <div className="text-white/60 text-sm">Twitter Posts</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-blue-400 mb-1">3+</div>
              <div className="text-white/60 text-sm">LinkedIn Posts</div>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="text-2xl font-bold text-pink-400 mb-1">10+</div>
              <div className="text-white/60 text-sm">Instagram Hooks</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Sparkles className="w-12 h-12 text-white/40" />
      </div>
      <h3 className="text-xl text-white mb-4">No Content Generated Yet</h3>
      <p className="text-white/60 mb-6">
        Upload a podcast episode to see your generated content here.
      </p>
      <Button 
        onClick={onAction}
        variant="outline"
        className="border-white/30 text-white hover:bg-white/10"
      >
        Upload Your First Episode
      </Button>
    </div>
  );
};
