
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Mic, Sparkles, ArrowDown, Star, Zap, Target } from "lucide-react";

interface EmptyStatesProps {
  type: 'upload' | 'no-results';
  onAction?: () => void;
}

export const EmptyStates = ({ type, onAction }: EmptyStatesProps) => {
  if (type === 'upload') {
    return (
      <Card className="bg-white/10 backdrop-blur-lg border-white/20 max-w-2xl mx-auto hover:bg-white/15 transition-all duration-300 animate-fade-in">
        <CardContent className="p-12 text-center">
          <div className="relative mb-8">
            {/* Animated background elements */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full animate-pulse" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-full animate-pulse" style={{animationDelay: '0.5s'}} />
            </div>
            <div className="relative flex items-center justify-center">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-20 h-20 rounded-full flex items-center justify-center mb-4 animate-bounce">
                <Mic className="w-10 h-10 text-white" />
              </div>
            </div>
          </div>

          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Go Viral?
          </h3>
          <p className="text-white/70 mb-8 text-lg leading-relaxed">
            Transform your podcast into scroll-stopping content in minutes. Upload your audio and watch AI create show notes, 
            viral social posts, and Instagram hooks that your audience will love.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-8 text-sm">
            <div className="flex items-center gap-3 text-white/60 group hover:text-white/80 transition-colors duration-300">
              <div className="bg-purple-500/20 p-2 rounded-full group-hover:bg-purple-500/30 transition-colors duration-300">
                <Upload className="w-4 h-4 text-purple-400" />
              </div>
              <span className="font-medium">Upload Audio</span>
              <ArrowDown className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-3 text-white/60 group hover:text-white/80 transition-colors duration-300">
              <div className="bg-blue-500/20 p-2 rounded-full group-hover:bg-blue-500/30 transition-colors duration-300">
                <Mic className="w-4 h-4 text-blue-400" />
              </div>
              <span className="font-medium">AI Magic</span>
              <ArrowDown className="w-3 h-3" />
            </div>
            <div className="flex items-center gap-3 text-white/60 group hover:text-white/80 transition-colors duration-300">
              <div className="bg-pink-500/20 p-2 rounded-full group-hover:bg-pink-500/30 transition-colors duration-300">
                <Sparkles className="w-4 h-4 text-pink-400" />
              </div>
              <span className="font-medium">Viral Content</span>
            </div>
          </div>

          <Button 
            onClick={onAction}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 mb-8"
          >
            <Upload className="w-5 h-5 mr-2" />
            Transform My Podcast Now
          </Button>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-400/20 hover:border-purple-400/40 transition-all duration-300 group">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="text-2xl font-bold text-purple-400 mb-1">5+</div>
              <div className="text-white/60 text-sm font-medium">Viral Tweets</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300 group">
              <div className="flex items-center justify-center mb-2">
                <Zap className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="text-2xl font-bold text-blue-400 mb-1">3+</div>
              <div className="text-white/60 text-sm font-medium">LinkedIn Posts</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-pink-500/10 to-pink-600/10 rounded-xl border border-pink-400/20 hover:border-pink-400/40 transition-all duration-300 group">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-5 h-5 text-pink-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="text-2xl font-bold text-pink-400 mb-1">10+</div>
              <div className="text-white/60 text-sm font-medium">Insta Hooks</div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="text-center py-12 animate-fade-in">
      <div className="w-24 h-24 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
        <Sparkles className="w-12 h-12 text-white/40" />
      </div>
      <h3 className="text-xl font-bold text-white mb-4">No Content Yet — Let's Fix That!</h3>
      <p className="text-white/60 mb-6 leading-relaxed">
        Upload your first podcast episode to see the magic happen. Your future viral content is just one upload away!
      </p>
      <Button 
        onClick={onAction}
        variant="outline"
        className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 transition-all duration-300 transform hover:scale-105"
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload Your First Episode
      </Button>
    </div>
  );
};
