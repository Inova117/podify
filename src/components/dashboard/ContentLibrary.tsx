import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileAudio, Search, Calendar, Share2, Eye, Download, Trash2 } from "lucide-react";
import { LoadingStates } from "@/components/LoadingStates";
import { ErrorStates } from "@/components/ErrorStates";
import { EmptyStates } from "@/components/EmptyStates";
import { useToast } from "@/hooks/use-toast";

interface ContentItem {
  id: string;
  filename: string;
  created_at: string;
  share_id: string | null;
  show_notes: string;
  tweets: any;
  linkedin_posts: any;
  instagram_hooks: any;
}

interface ContentLibraryProps {
  onRetry: () => void;
}

export const ContentLibrary = ({ onRetry }: ContentLibraryProps) => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    // Filter content based on search query
    const filtered = content.filter(item =>
      item.filename.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredContent(filtered);
  }, [content, searchQuery]);

  const loadContent = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('shared_results')
        .select('id, filename, created_at, share_id, show_notes, tweets, linkedin_posts, instagram_hooks')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setContent(data || []);
    } catch (err) {
      console.error('Error loading content:', err);
      setError('Failed to load your content library');
      toast({
        title: "Error",
        description: "Failed to load your content library. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (shareId: string) => {
    window.open(`/share/${shareId}`, '_blank');
  };

  const handleDelete = async (id: string, filename: string) => {
    if (!confirm(`Are you sure you want to delete "${filename}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('shared_results')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setContent(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Success",
        description: "Content deleted successfully",
      });
    } catch (err) {
      console.error('Error deleting content:', err);
      toast({
        title: "Error",
        description: "Failed to delete content. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <LoadingStates state="transcribing" />;
  }

  if (error) {
    return (
      <ErrorStates 
        type="api" 
        message={error}
        onRetry={() => {
          loadContent();
          onRetry();
        }}
      />
    );
  }

  if (content.length === 0) {
    return (
      <EmptyStates 
        type="upload"
        onAction={() => window.location.href = '/'}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
            <Input
              placeholder="Search by filename..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid gap-6">
        {filteredContent.map((item) => (
          <Card key={item.id} className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/15 transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <FileAudio className="w-6 h-6 text-purple-400" />
                  <div>
                    <CardTitle className="text-white text-lg">{item.filename}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-white/60" />
                      <span className="text-white/60 text-sm">
                        {new Date(item.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.share_id && (
                    <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                      <Share2 className="w-3 h-3 mr-1" />
                      Shared
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Content Preview */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2">Show Notes Preview</h4>
                  <p className="text-white/70 text-sm line-clamp-3">
                    {item.show_notes ? item.show_notes.substring(0, 200) + '...' : 'No show notes available'}
                  </p>
                </div>

                {/* Content Stats */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-500/20 rounded-lg p-3">
                    <div className="text-blue-300 text-lg font-semibold">
                      {Array.isArray(item.tweets) ? item.tweets.length : 0}
                    </div>
                    <div className="text-white/60 text-xs">Tweets</div>
                  </div>
                  <div className="bg-purple-500/20 rounded-lg p-3">
                    <div className="text-purple-300 text-lg font-semibold">
                      {Array.isArray(item.linkedin_posts) ? item.linkedin_posts.length : 0}
                    </div>
                    <div className="text-white/60 text-xs">LinkedIn Posts</div>
                  </div>
                  <div className="bg-pink-500/20 rounded-lg p-3">
                    <div className="text-pink-300 text-lg font-semibold">
                      {Array.isArray(item.instagram_hooks) ? item.instagram_hooks.length : 0}
                    </div>
                    <div className="text-white/60 text-xs">IG Hooks</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {item.share_id && (
                    <Button
                      onClick={() => handleView(item.share_id!)}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDelete(item.id, item.filename)}
                    size="sm"
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContent.length === 0 && searchQuery && (
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="py-12 text-center">
            <Search className="w-12 h-12 text-white/40 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">No results found</h3>
            <p className="text-white/60">Try adjusting your search query</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
