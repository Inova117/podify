import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FileText, Twitter, Linkedin, Instagram, Send, CheckCircle, Share2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { saveSharedResult, copyToClipboard } from "@/utils/shareUtils";

interface ContentResultsProps {
  isVisible: boolean;
  fileName?: string;
}

// Mock generated content data
const mockContent = {
  showNotes: {
    title: "Episode Summary & Key Points",
    content: `
**Episode Overview:**
This episode covers the fundamentals of AI-powered content creation and how podcasters can leverage automation to scale their reach.

**Key Takeaways:**
• AI can reduce content creation time by 90%
• Repurposing audio content drives 3x more engagement
• Cross-platform distribution is essential for growth
• Automated workflows save 10+ hours per episode

**Timestamps:**
[00:00] Introduction to AI content creation
[05:30] Benefits of podcast repurposing
[12:15] Platform-specific optimization strategies
[18:45] Future of automated content workflows
    `
  },
  tweets: [
    "🎙️ Just discovered how AI can turn a 1-hour podcast into 20+ pieces of viral content. The future of content creation is here! #PodcastTips #AIContent",
    "Stop spending hours creating social media posts from your podcast. Let AI do the heavy lifting while you focus on what matters: great conversations 🚀",
    "3 reasons why every podcaster needs content repurposing:\n\n✅ 10x your reach\n✅ Save 90% of time\n✅ Consistent posting across platforms\n\nGame changer! 🎯",
    "The secret to viral podcast content? It's not just about the episode—it's about how you slice, dice, and distribute it across every platform 📈",
    "From one podcast episode to:\n• 5 tweets\n• 3 LinkedIn posts\n• 10 Instagram hooks\n• Complete show notes\n\nAll automated. Mind = blown 🤯"
  ],
  linkedinPosts: [
    {
      hook: "The podcasting landscape is changing rapidly...",
      content: "The podcasting landscape is changing rapidly, and content creators who adapt to AI-powered workflows will dominate the next decade.\n\nHere's what I've learned about scaling podcast content:\n\n→ One episode can become 20+ pieces of content\n→ AI handles the heavy lifting, you focus on creativity\n→ Cross-platform distribution drives exponential growth\n\nThe question isn't whether you should use AI for content creation—it's how quickly you can implement it.\n\nWhat's your biggest challenge with podcast content repurposing?"
    },
    {
      hook: "I used to spend 10 hours creating content from each podcast episode...",
      content: "I used to spend 10 hours creating content from each podcast episode. Now it takes me 10 minutes.\n\nThe difference? AI-powered automation.\n\nHere's my exact workflow:\n\n1. Upload podcast audio\n2. AI generates transcript\n3. Extract key quotes and insights\n4. Create platform-specific content\n5. Schedule across all channels\n\nResult: 900% time savings and 3x more engagement.\n\nThe tools exist. The question is: are you using them?"
    },
    {
      hook: "Content repurposing isn't just a nice-to-have anymore...",
      content: "Content repurposing isn't just a nice-to-have anymore—it's essential for podcast growth.\n\nThink about it:\n• Your audience consumes content differently across platforms\n• A 60-minute episode can yield weeks of social content\n• Each platform has unique algorithm preferences\n\nSmart podcasters aren't just creating episodes—they're building content ecosystems.\n\nEvery piece of audio becomes a multiplier for reach, engagement, and growth.\n\nHow are you maximizing your content's potential?"
    }
  ],
  instagramHooks: [
    "POV: You just discovered how to turn 1 podcast into 20+ viral posts 🤯",
    "The moment you realize your podcast is a content goldmine ✨",
    "Stop creating content the hard way. AI changed everything 🚀",
    "Your podcast episodes are sitting there... full of untapped content 💎",
    "Plot twist: The best content creators aren't creating more—they're repurposing smarter 🧠",
    "When you finally automate your content workflow and get your life back 😌",
    "Tell me you're a podcaster without telling me you're a podcaster... 🎙️",
    "That feeling when AI writes your social posts better than you do 💀",
    "POV: You're about to 10x your content output with zero extra effort 📈",
    "Breaking: Local podcaster discovers the secret to viral content 📰"
  ]
};

export const ContentResults = ({ isVisible, fileName = "podcast-episode.mp3" }: ContentResultsProps) => {
  const [showNotionModal, setShowNotionModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [isGeneratingLink, setIsGeneratingLink] = useState(false);
  const { toast } = useToast();

  const handleGenerateShareLink = async () => {
    setIsGeneratingLink(true);
    
    try {
      const shareId = await saveSharedResult(fileName, mockContent);
      
      if (shareId) {
        const url = `${window.location.origin}/share/${shareId}`;
        setShareUrl(url);
        setShowShareModal(true);
        
        toast({
          title: "Share link created!",
          description: "Your content is now ready to share with others.",
        });
      } else {
        toast({
          title: "Failed to create share link",
          description: "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error creating share link",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingLink(false);
    }
  };

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareUrl);
    
    if (success) {
      toast({
        title: "Link copied!",
        description: "Share link has been copied to your clipboard.",
      });
    } else {
      toast({
        title: "Failed to copy link",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  if (!isVisible) return null;

  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your Content is{" "}
            <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Ready!
            </span>
          </h2>
          <p className="text-xl text-white/70 mb-8">
            AI has generated all your social media content and show notes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setShowNotionModal(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Send className="w-5 h-5 mr-2" />
              Send to Notion
            </Button>
            <Button 
              onClick={handleGenerateShareLink}
              disabled={isGeneratingLink}
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-full"
            >
              <Share2 className="w-5 h-5 mr-2" />
              {isGeneratingLink ? "Creating Link..." : "Share Results"}
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Show Notes */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-10 h-10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                Show Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-white/80 whitespace-pre-line text-sm leading-relaxed max-h-80 overflow-y-auto">
                {mockContent.showNotes.content}
              </div>
            </CardContent>
          </Card>

          {/* Tweets */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 w-10 h-10 rounded-lg flex items-center justify-center">
                  <Twitter className="w-5 h-5 text-white" />
                </div>
                Twitter Posts ({mockContent.tweets.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {mockContent.tweets.map((tweet, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-white/80 text-sm">{tweet}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* LinkedIn Posts */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 w-10 h-10 rounded-lg flex items-center justify-center">
                  <Linkedin className="w-5 h-5 text-white" />
                </div>
                LinkedIn Posts ({mockContent.linkedinPosts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {mockContent.linkedinPosts.map((post, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-blue-300 text-sm font-medium mb-2">{post.hook}</p>
                    <p className="text-white/80 text-sm whitespace-pre-line">{post.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Instagram Hooks */}
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 w-10 h-10 rounded-lg flex items-center justify-center">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                Instagram Hooks ({mockContent.instagramHooks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {mockContent.instagramHooks.map((hook, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <p className="text-white/80 text-sm">{hook}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notion Success Modal */}
        <Dialog open={showNotionModal} onOpenChange={setShowNotionModal}>
          <DialogContent className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <DialogHeader>
              <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <DialogTitle className="text-2xl text-center text-white">
                Content Delivered to Notion!
              </DialogTitle>
              <DialogDescription className="text-center text-white/70 text-base">
                Your podcast content has been successfully organized and delivered to your Notion workspace. 
                You can now edit, customize, and publish your content across all platforms.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 text-center">
              <Button 
                onClick={() => setShowNotionModal(false)}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 rounded-full"
              >
                View in Notion
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Share Link Modal */}
        <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
          <DialogContent className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
            <DialogHeader>
              <div className="flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mx-auto mb-4">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <DialogTitle className="text-2xl text-center text-white">
                Share Your Results!
              </DialogTitle>
              <DialogDescription className="text-center text-white/70 text-base">
                Your content is now available via a shareable link. Anyone with this link can view your generated content.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-6 space-y-4">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-white/60 text-sm mb-2">Shareable Link:</p>
                <p className="text-white text-sm break-all font-mono">{shareUrl}</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={handleCopyLink}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Link
                </Button>
                <Button 
                  onClick={() => setShowShareModal(false)}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};
