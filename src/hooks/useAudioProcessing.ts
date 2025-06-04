import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface AudioUpload {
  id: string;
  filename: string;
  original_filename: string;
  file_url: string;
  file_size: number;
  duration?: number;
  status: 'uploading' | 'uploaded' | 'processing' | 'completed' | 'failed' | 'deleted';
  created_at: string;
  updated_at?: string;
}

export interface ProcessingJob {
  id: string;
  upload_id: string;
  job_type: 'transcription' | 'content_generation' | 'full_pipeline';
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  result?: any;
  error_log?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
}

export interface GeneratedContent {
  id: string;
  job_id: string;
  content_type: 'transcript' | 'show_notes' | 'tweets' | 'linkedin_posts' | 'instagram_hooks';
  content_data: any;
  quality_score?: number;
  word_count?: number;
  character_count?: number;
  created_at: string;
}

export const useAudioProcessing = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Fetch user's audio uploads
  const {
    data: audioUploads = [],
    isLoading: isLoadingUploads,
    error: uploadsError
  } = useQuery({
    queryKey: ['audio-uploads', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('audio_uploads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AudioUpload[];
    },
    enabled: !!user?.id,
  });

  // Fetch processing jobs for uploads
  const {
    data: processingJobs = [],
    isLoading: isLoadingJobs,
  } = useQuery({
    queryKey: ['processing-jobs', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('processing_jobs')
        .select(`
          *,
          audio_uploads!inner(user_id)
        `)
        .eq('audio_uploads.user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ProcessingJob[];
    },
    enabled: !!user?.id,
  });

  // Upload audio file
  const uploadAudioMutation = useMutation({
    mutationFn: async ({ file, projectId }: { file: File; projectId?: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Check file size (100MB limit)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        throw new Error('File size must be less than 100MB');
      }

      // Check file type
      const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/m4a', 'audio/mp4', 'audio/x-m4a'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Unsupported file format. Please use MP3, WAV, or M4A files.');
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio-files')
        .getPublicUrl(fileName);

      // Create audio upload record
      const { data: audioUpload, error: dbError } = await supabase
        .from('audio_uploads')
        .insert({
          user_id: user.id,
          filename: fileName,
          original_filename: file.name,
          file_url: publicUrl,
          file_size: file.size,
          mime_type: file.type,
          status: 'uploaded',
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Link to project if provided
      if (projectId && audioUpload) {
        await supabase
          .from('project_uploads')
          .insert({
            project_id: projectId,
            upload_id: audioUpload.id,
          });
      }

      return audioUpload as AudioUpload;
    },
    onSuccess: (data) => {
      toast.success('Audio file uploaded successfully!');
      queryClient.invalidateQueries({ queryKey: ['audio-uploads'] });
      setUploadProgress(0);
    },
    onError: (error: Error) => {
      toast.error(`Upload failed: ${error.message}`);
      setUploadProgress(0);
    },
  });

  // Start transcription job
  const startTranscriptionMutation = useMutation({
    mutationFn: async ({ uploadId, language = 'en', priority = 5 }: {
      uploadId: string;
      language?: string;
      priority?: number;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const upload = audioUploads.find(u => u.id === uploadId);
      if (!upload) throw new Error('Audio upload not found');

      // Call enhanced transcription edge function
      const { data, error } = await supabase.functions.invoke('enhanced-transcribe', {
        body: {
          uploadId,
          audioUrl: upload.file_url,
          language,
          priority,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Transcription started! You will be notified when complete.');
      queryClient.invalidateQueries({ queryKey: ['processing-jobs'] });
    },
    onError: (error: Error) => {
      toast.error(`Transcription failed: ${error.message}`);
    },
  });

  // Generate content from transcript
  const generateContentMutation = useMutation({
    mutationFn: async ({ jobId, contentTypes = ['show_notes', 'tweets', 'linkedin_posts', 'instagram_hooks'] }: {
      jobId: string;
      contentTypes?: string[];
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          jobId,
          contentTypes,
          userId: user.id,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success('Content generation started!');
      queryClient.invalidateQueries({ queryKey: ['processing-jobs'] });
    },
    onError: (error: Error) => {
      toast.error(`Content generation failed: ${error.message}`);
    },
  });

  // Delete audio upload
  const deleteUploadMutation = useMutation({
    mutationFn: async (uploadId: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      const upload = audioUploads.find(u => u.id === uploadId);
      if (!upload) throw new Error('Upload not found');

      // Delete from storage
      const fileName = upload.filename;
      await supabase.storage
        .from('audio-files')
        .remove([fileName]);

      // Update status to deleted
      const { error } = await supabase
        .from('audio_uploads')
        .update({ status: 'deleted' })
        .eq('id', uploadId)
        .eq('user_id', user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Audio file deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['audio-uploads'] });
    },
    onError: (error: Error) => {
      toast.error(`Delete failed: ${error.message}`);
    },
  });

  // Get generated content for a job
  const getGeneratedContent = useCallback(async (jobId: string): Promise<GeneratedContent[]> => {
    const { data, error } = await supabase
      .from('generated_content')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as GeneratedContent[];
  }, []);

  // Real-time subscription to processing job updates
  const subscribeToJobUpdates = useCallback((uploadId: string, callback: (job: ProcessingJob) => void) => {
    const subscription = supabase
      .channel(`job-updates-${uploadId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'processing_jobs',
          filter: `upload_id=eq.${uploadId}`,
        },
        (payload) => {
          callback(payload.new as ProcessingJob);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    // Data
    audioUploads,
    processingJobs,
    
    // Loading states
    isLoadingUploads,
    isLoadingJobs,
    uploadProgress,
    
    // Errors
    uploadsError,
    
    // Mutations
    uploadAudio: uploadAudioMutation.mutate,
    isUploading: uploadAudioMutation.isPending,
    
    startTranscription: startTranscriptionMutation.mutate,
    isStartingTranscription: startTranscriptionMutation.isPending,
    
    generateContent: generateContentMutation.mutate,
    isGeneratingContent: generateContentMutation.isPending,
    
    deleteUpload: deleteUploadMutation.mutate,
    isDeleting: deleteUploadMutation.isPending,
    
    // Utilities
    getGeneratedContent,
    subscribeToJobUpdates,
    setUploadProgress,
  };
}; 