
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Twitter, Linkedin, Instagram, ArrowLeft, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ContentLoadingSkeleton } from "@/components/LoadingStates";
import { ErrorStates } from "@/components/ErrorStates";

interface SharedResultData {
  filename: string;
  show_notes: string;
  tweets: string[];
  linkedin_posts: Array<{ hook: string; content: string }>;
  instagram_hooks: string[];
  created_at: string;
}

const SharedResult = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [data, setData] = useState<SharedResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSharedResult = async () => {
      if (!shareId) {
        setError("Invalid share link");
        setLoading(false);
        return;
      }

      try {
        const { data: result, error } = await supabase
          .from('shared_results')
          .select('filename, show_notes, tweets, linkedin_posts, instagram_hooks, created_at')
          .eq('share_id', shareId)
          .single();

        if (error) {
          setError("Shared content not found");
        } else {
          // Type-cast the Json types to the expected types
          const typedResult: SharedResultData = {
            filename: result.filename,
            show_notes: result.show_notes,
            tweets: result.tweets as string[],
            linkedin_posts: result.linkedin_posts as Array<{ hook: string; content: string }>,
            instagram_hooks: result.instagram_hooks as string[],
            created_at: result.created_at,
          };
          setData(typedResult);
        }
      } catch (err) {
        setError("Failed to load shared content");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedResult();
  }, [shareId]);

  const retryFetch = () => {
    setError(null);
    setLoading(true);
    // Trigger the useEffect again by creating a small delay
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          
          <div className="relative px-4 py-12">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <Link to="/" className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to AI Podcast Repurposer
                </Link>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Loading Shared Content...
                </h1>
              </div>
              <ContentLoadingSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Link to="/" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to AI Podcast Repurposer
          </Link>
          
          <ErrorStates 
            type="not-found"
            message={error || "This shared link is invalid or has expired."}
            onRetry={retryFetch}
            onReset={() => window.location.href = '/'}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="relative">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%221%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        
        <div className="relative px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <Link to="/" className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to AI Podcast Repurposer
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Shared Podcast Content
              </h1>
              <div className="flex items-center justify-center gap-2 text-white/70 mb-2">
                <FileText className="w-4 h-4" />
                <span className="font-medium">{data.filename}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-white/50 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Generated on {new Date(data.created_at).toLocaleDateString()}</span>
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
                    {data.show_notes}
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
                    Twitter Posts ({data.tweets.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {data.tweets.map((tweet, index) => (
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
                    LinkedIn Posts ({data.linkedin_posts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {data.linkedin_posts.map((post, index) => (
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
                    Instagram Hooks ({data.instagram_hooks.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {data.instagram_hooks.map((hook, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                        <p className="text-white/80 text-sm">{hook}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Call to action */}
            <div className="mt-12 text-center">
              <p className="text-white/70 mb-6">
                Want to create your own AI-powered podcast content?
              </p>
              <Link to="/">
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg font-semibold rounded-full">
                  Try AI Podcast Repurposer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedResult;
