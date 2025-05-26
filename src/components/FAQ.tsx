
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Upload, 
  Mic, 
  Sparkles, 
  Clock, 
  Shield, 
  CheckCircle,
  ArrowRight,
  FileAudio,
  Share2
} from "lucide-react";

export const FAQ = () => {
  const scrollToUpload = () => {
    document.getElementById('upload-section')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const steps = [
    {
      icon: Upload,
      title: "Upload Your Audio",
      description: "Drag & drop your podcast file or browse to select. We support MP3, WAV, and M4A formats up to 100MB.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Mic,
      title: "AI Transcription",
      description: "Our advanced AI listens to your entire episode and creates an accurate, timestamped transcript.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Sparkles,
      title: "Content Generation",
      description: "AI analyzes your content and generates 20+ pieces of optimized social media content, show notes, and hooks.",
      color: "from-pink-500 to-pink-600"
    }
  ];

  const faqs = [
    {
      question: "How accurate is the AI transcription?",
      answer: "Our AI achieves 95%+ accuracy for clear audio. It works best with good audio quality and minimal background noise."
    },
    {
      question: "What file formats do you support?",
      answer: "We support MP3, WAV, M4A, and most common audio formats. Files can be up to 100MB in size."
    },
    {
      question: "How long does processing take?",
      answer: "Typically 2-5 minutes for a 60-minute episode. Transcription takes 1-2 minutes, content generation takes another 2-3 minutes."
    },
    {
      question: "Can I edit the generated content?",
      answer: "Absolutely! All content is delivered in an editable format. You can customize everything before publishing."
    },
    {
      question: "Is my audio data secure?",
      answer: "Yes, we use enterprise-grade security. Your audio files are processed securely and automatically deleted after 24 hours."
    },
    {
      question: "What social platforms are supported?",
      answer: "We generate content optimized for Twitter, LinkedIn, Instagram, and general social media with platform-specific formatting."
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-transparent to-black/20">
      <div className="max-w-6xl mx-auto">
        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How It{" "}
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Works
            </span>
          </h2>
          <p className="text-xl text-white/70 mb-12 max-w-3xl mx-auto">
            Three simple steps to transform your podcast into viral social media content
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card 
                  key={index} 
                  className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 group"
                >
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-white text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-white/70 leading-relaxed">{step.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Button 
            onClick={scrollToUpload}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <FileAudio className="w-5 h-5 mr-2" />
            Try It Now - It's Free
          </Button>
        </div>

        {/* FAQ Section */}
        <div className="text-center mb-12">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Frequently Asked{" "}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Questions
            </span>
          </h3>
          <p className="text-lg text-white/70 mb-8">
            Everything you need to know about transforming your podcast content
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <Card 
              key={index} 
              className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300 group"
            >
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-start gap-3 group-hover:text-blue-300 transition-colors duration-300">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  {faq.question}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 leading-relaxed">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to Amplify Your Podcast's Reach?
          </h3>
          <p className="text-white/70 mb-6 text-lg">
            Join thousands of podcasters who've transformed their content strategy with AI
          </p>
          <Button 
            onClick={scrollToUpload}
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};
