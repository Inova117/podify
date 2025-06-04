import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Upload, 
  FileAudio, 
  PlayCircle, 
  PauseCircle, 
  Trash2, 
  Download, 
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Share2
} from 'lucide-react';
import { useAudioProcessing } from '@/hooks/useAudioProcessing';
import { useSubscription } from '@/hooks/useSubscription';
import { toast } from 'sonner';
import { formatBytes, formatDuration } from '@/lib/utils';

interface EnhancedAudioUploadProps {
  projectId?: string;
  autoStartTranscription?: boolean;
  showJobProgress?: boolean;
  maxFiles?: number;
  className?: string;
}

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'processing':
    case 'running':
      return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
    case 'failed':
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    default:
      return <FileAudio className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'processing':
    case 'running':
      return 'bg-blue-100 text-blue-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const EnhancedAudioUpload: React.FC<EnhancedAudioUploadProps> = ({
  projectId,
  autoStartTranscription = true,
  showJobProgress = true,
  maxFiles = 5,
  className,
}) => {
  const {
    audioUploads,
    processingJobs,
    isLoadingUploads,
    uploadAudio,
    isUploading,
    startTranscription,
    isStartingTranscription,
    deleteUpload,
    isDeleting,
    subscribeToJobUpdates,
    uploadProgress,
  } = useAudioProcessing();

  const {
    usageData,
    canPerformAction,
    getUsagePercentage,
    getDaysUntilReset,
  } = useSubscription();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [jobSubscriptions, setJobSubscriptions] = useState<Map<string, () => void>>(new Map());

  // Handle file drop
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const totalFiles = selectedFiles.length + acceptedFiles.length;
    
    if (totalFiles > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    if (!canPerformAction('upload_audio')) {
      toast.error('Upload quota exceeded. Please upgrade your plan or wait for quota reset.');
      return;
    }

    setSelectedFiles(prev => [...prev, ...acceptedFiles]);
  }, [selectedFiles, maxFiles, canPerformAction]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.mp4'],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    disabled: isUploading,
  });

  // Upload files
  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    for (const file of selectedFiles) {
      try {
        const uploadedFile = await new Promise((resolve, reject) => {
          uploadAudio(
            { file, projectId },
            {
              onSuccess: (data) => {
                resolve(data);
                if (autoStartTranscription) {
                  startTranscription({ uploadId: data.id });
                }
              },
              onError: reject,
            }
          );
        });
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }

    setSelectedFiles([]);
  };

  // Subscribe to job updates for real-time progress
  useEffect(() => {
    const activeJobs = processingJobs.filter(job => 
      ['pending', 'running'].includes(job.status)
    );

    // Clean up old subscriptions
    jobSubscriptions.forEach(unsub => unsub());
    
    // Create new subscriptions
    const newSubscriptions = new Map<string, () => void>();
    activeJobs.forEach(job => {
      const unsubscribe = subscribeToJobUpdates(job.upload_id, (updatedJob) => {
        // Job updated, queries will be invalidated automatically
        if (updatedJob.status === 'completed') {
          toast.success(`Processing completed for ${job.upload_id}`);
        } else if (updatedJob.status === 'failed') {
          toast.error(`Processing failed for ${job.upload_id}`);
        }
      });
      newSubscriptions.set(job.id, unsubscribe);
    });

    setJobSubscriptions(newSubscriptions);

    return () => {
      newSubscriptions.forEach(unsub => unsub());
    };
  }, [processingJobs, subscribeToJobUpdates]);

  // Get job for upload
  const getJobForUpload = (uploadId: string) => {
    return processingJobs.find(job => job.upload_id === uploadId);
  };

  // Remove selected file
  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const usagePercentage = getUsagePercentage();
  const daysUntilReset = getDaysUntilReset();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Usage Status */}
      {usageData && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
                <CardDescription>
                  {usageData.current_usage} of {usageData.usage_quota === -1 ? '∞' : usageData.usage_quota} uploads
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                {usageData.subscription_tier.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Progress value={usagePercentage} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {daysUntilReset > 0 ? `Resets in ${daysUntilReset} days` : 'Quota resets soon'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Audio Files
          </CardTitle>
          <CardDescription>
            Drag and drop your podcast files or click to browse. Supports MP3, WAV, and M4A files up to 100MB.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'}
              ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <Upload className={`h-8 w-8 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
              <div>
                <p className="text-sm font-medium">
                  {isDragActive ? 'Drop files here' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-muted-foreground">
                  MP3, WAV, M4A files up to 100MB
                </p>
              </div>
            </div>
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <h4 className="text-sm font-medium">Selected Files ({selectedFiles.length})</h4>
              <ScrollArea className="h-32">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md mb-2">
                    <div className="flex items-center gap-2">
                      <FileAudio className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium truncate max-w-48">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatBytes(file.size)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSelectedFile(index)}
                      disabled={isUploading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </ScrollArea>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleUpload}
                  disabled={isUploading || selectedFiles.length === 0}
                  className="flex-1"
                >
                  {isUploading ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Uploading... {uploadProgress > 0 && `${uploadProgress}%`}
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedFiles([])}
                  disabled={isUploading}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}

          {uploadProgress > 0 && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Uploaded Files & Processing Status */}
      {audioUploads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileAudio className="h-5 w-5" />
              Recent Uploads
            </CardTitle>
            <CardDescription>
              Track your uploaded files and processing status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-3">
                {audioUploads.slice(0, 10).map((upload) => {
                  const job = getJobForUpload(upload.id);
                  const canDelete = !job || ['completed', 'failed'].includes(job.status);
                  
                  return (
                    <div key={upload.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3 flex-1">
                        <StatusIcon status={job?.status || upload.status} />
                        <div className="flex-1">
                          <p className="text-sm font-medium truncate max-w-48">
                            {upload.original_filename}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{formatBytes(upload.file_size)}</span>
                            {upload.duration && <span>{formatDuration(upload.duration)}</span>}
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getStatusColor(job?.status || upload.status)}`}
                            >
                              {job?.status || upload.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar for Active Jobs */}
                      {job && ['pending', 'running'].includes(job.status) && showJobProgress && (
                        <div className="flex-1 mx-4">
                          <Progress value={job.progress || 0} className="h-2" />
                          <p className="text-xs text-muted-foreground mt-1">
                            {job.progress || 0}% complete
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {!job && upload.status === 'uploaded' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => startTranscription({ uploadId: upload.id })}
                            disabled={isStartingTranscription}
                          >
                            <Zap className="h-4 w-4 mr-1" />
                            Process
                          </Button>
                        )}
                        
                        {job?.status === 'completed' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {/* TODO: Navigate to results */}}
                          >
                            <Share2 className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteUpload(upload.id)}
                          disabled={isDeleting || !canDelete}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Quota Warning */}
      {usageData && usagePercentage > 80 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You've used {Math.round(usagePercentage)}% of your monthly quota. 
            {usagePercentage >= 100 ? (
              <span className="font-medium"> Upgrade your plan to continue uploading.</span>
            ) : (
              <span> Consider upgrading your plan for higher limits.</span>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}; 