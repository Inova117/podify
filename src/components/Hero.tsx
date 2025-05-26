
import { Button } from "@/components/ui/button";
import { ArrowDown, BarChart3 } from "lucide-react";

export const Hero = () => {
  const scrollToUpload = () => {
    document.getElementById('upload-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  return (
    <section className="relative py-20 px-4 text-center">
      <div className="max-w-6xl mx-auto">
        {/* Dashboard Link */}
        <div className="absolute top-4 right-4">
          <Button 
            onClick={() => window.location.href = '/dashboard'}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/50"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
        </div>

        {/* Main Headline */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Transform Your{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Podcast
            </span>{" "}
            Into{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Viral Content
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            Upload your audio file and get professionally crafted show notes, engaging social media posts, 
            viral Instagram hooks, and more — all optimized for maximum reach and delivered in minutes.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in" style={{animationDelay: '0.2s'}}>
          <Button 
            onClick={scrollToUpload}
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Creating Content Now
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm transition-all duration-300 hover:border-white/50"
          >
            See How It Works
          </Button>
        </div>

        {/* Scroll indicator */}
        <div className="animate-bounce" style={{animationDelay: '0.4s'}}>
          <ArrowDown className="w-6 h-6 text-white/60 mx-auto" />
        </div>
      </div>
    </section>
  );
};
