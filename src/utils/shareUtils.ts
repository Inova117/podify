
import { supabase } from "@/integrations/supabase/client";

interface ContentData {
  showNotes: { title: string; content: string };
  tweets: string[];
  linkedinPosts: Array<{ hook: string; content: string }>;
  instagramHooks: string[];
}

export const generateShareId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const saveSharedResult = async (
  filename: string,
  content: ContentData
): Promise<string | null> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return null;
    }

    const shareId = generateShareId();
    
    const { error } = await supabase
      .from('shared_results')
      .insert({
        share_id: shareId,
        filename,
        user_id: user.id, // Link content to authenticated user
        show_notes: content.showNotes.content,
        tweets: content.tweets,
        linkedin_posts: content.linkedinPosts,
        instagram_hooks: content.instagramHooks,
      });

    if (error) {
      console.error('Error saving shared result:', error);
      return null;
    }

    return shareId;
  } catch (error) {
    console.error('Error saving shared result:', error);
    return null;
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};
