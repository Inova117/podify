
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Clock, FileText, Share2, Zap, Target } from "lucide-react";

const benefits = [
  {
    icon: Upload,
    title: "Simple Upload",
    description: "Just drag and drop your MP3 file. No complex setup or technical knowledge required."
  },
  {
    icon: Clock,
    title: "Save 10+ Hours",
    description: "What takes you hours of manual work is done in minutes with AI-powered automation."
  },
  {
    icon: FileText,
    title: "Complete Show Notes",
    description: "Get professionally formatted show notes with timestamps, key points, and actionable insights."
  },
  {
    icon: Share2,
    title: "Social Media Ready",
    description: "Receive 5 tweets, 3 LinkedIn posts, and 10 Instagram reel hooks optimized for engagement."
  },
  {
    icon: Target,
    title: "Notion Integration",
    description: "All content delivered directly to your Notion workspace, organized and ready to publish."
  },
  {
    icon: Zap,
    title: "Viral Potential",
    description: "AI analyzes your content for viral moments and creates hooks that capture attention."
  }
];

export const Benefits = () => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Why Podcasters{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Love Us
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Transform your podcast episodes into a content goldmine that works across all platforms
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <Card 
              key={index} 
              className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
            >
              <CardContent className="p-6 text-center">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-white/70">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
