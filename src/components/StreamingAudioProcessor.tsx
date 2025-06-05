import React, { useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Upload, 
  Mic, 
  Play, 
  Square, 
  Download, 
  Share, 
  Settings,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  FileAudio,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStreamingTranscription } from '@/hooks/useStreamingTranscription'
import { toast } from 'sonner'

interface StreamingAudioProcessorProps {
  onComplete?: (result: any) => void
  className?: string
}

export const StreamingAudioProcessor: React.FC<StreamingAudioProcessorProps> = ({
  onComplete,
  className
}) => {
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [processingOptions, setProcessingOptions] = useState({
    generateSummary: true,
    generateKeyPoints: true,
    generateActionItems: true,
    extractTimestamps: true
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  
  const { state, startTranscription, cancelTranscription, resetState } = useStreamingTranscription()

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const validTypes = ['audio/mp3', 'audio/wav', 'audio/m4a', 'audio/mpeg', 'audio/webm']
      if (!validTypes.includes(file.type)) {
        toast.error('Please select a valid audio file (MP3, WAV, M4A)')
        return
      }
      
      if (file.size > 100 * 1024 * 1024) {
        toast.error('File size must be less than 100MB')
        return
      }
      
      setAudioFile(file)
      resetState()
    }
  }, [resetState])

  const handleStartProcessing = useCallback(async () => {
    if (!audioFile) return
    await startTranscription(audioFile, processingOptions)
  }, [audioFile, processingOptions, startTranscription])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStageLabel = (stage: string) => {
    switch (stage) {
      case 'uploading': return 'Uploading Audio'
      case 'transcribing': return 'Transcribing Speech'
      case 'generating': return 'Generating Content'
      case 'complete': return 'Processing Complete'
      case 'error': return 'Processing Failed'
      default: return 'Ready'
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileAudio className="w-5 h-5" />
            Audio Input
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Audio File</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="w-full"
              disabled={state.isProcessing}
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </Button>
          </div>

          {audioFile && (
            <Alert>
              <FileAudio className="w-4 h-4" />
              <AlertDescription>
                Selected: {audioFile.name} ({(audioFile.size / 1024 / 1024).toFixed(2)} MB)
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Processing Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Processing Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'generateSummary', label: 'Generate Summary' },
              { key: 'generateKeyPoints', label: 'Extract Key Points' },
              { key: 'generateActionItems', label: 'Identify Action Items' },
              { key: 'extractTimestamps', label: 'Add Timestamps' }
            ].map(option => (
              <label key={option.key} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={processingOptions[option.key as keyof typeof processingOptions]}
                  onChange={(e) => setProcessingOptions(prev => ({
                    ...prev,
                    [option.key]: e.target.checked
                  }))}
                  disabled={state.isProcessing}
                  className="rounded"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Processing Status */}
      {(state.isProcessing || state.stage === 'complete' || state.stage === 'error') && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {state.isProcessing && <Loader2 className="w-4 h-4 animate-spin" />}
                Processing Status
              </div>
              <Badge variant={state.stage === 'complete' ? 'default' : state.stage === 'error' ? 'destructive' : 'secondary'}>
                {getStageLabel(state.stage)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{state.progress}%</span>
              </div>
              <Progress value={state.progress} className="w-full" />
            </div>

            {state.error && (
              <Alert variant="destructive">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}

            {state.isProcessing && (
              <Button
                variant="outline"
                onClick={cancelTranscription}
                className="w-full"
              >
                Cancel Processing
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {(state.transcript || Object.keys(state.generatedContent).length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="transcript" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="keypoints">Key Points</TabsTrigger>
                <TabsTrigger value="actions">Actions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="transcript" className="mt-4">
                <Textarea
                  value={state.transcript}
                  readOnly
                  placeholder="Transcript will appear here as it's processed..."
                  className="min-h-[300px] resize-none"
                />
              </TabsContent>
              
              <TabsContent value="summary" className="mt-4">
                <Textarea
                  value={state.generatedContent.summary || ''}
                  readOnly
                  placeholder="Summary will be generated based on your settings..."
                  className="min-h-[300px] resize-none"
                />
              </TabsContent>
              
              <TabsContent value="keypoints" className="mt-4">
                <div className="space-y-2">
                  {state.generatedContent.keyPoints?.map((point, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <span className="text-sm">{point}</span>
                    </div>
                  )) || <p className="text-muted-foreground text-sm">Key points will be extracted based on your settings...</p>}
                </div>
              </TabsContent>
              
              <TabsContent value="actions" className="mt-4">
                <div className="space-y-2">
                  {state.generatedContent.actionItems?.map((action, index) => (
                    <div key={index} className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                      <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <span className="text-sm">{action}</span>
                    </div>
                  )) || <p className="text-muted-foreground text-sm">Action items will be identified based on your settings...</p>}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleStartProcessing}
          disabled={!audioFile || state.isProcessing}
          size="lg"
          className="px-8"
        >
          {state.isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Processing
            </>
          )}
        </Button>
        
        {(audioFile || state.transcript) && (
          <Button
            variant="outline"
            onClick={() => {
              setAudioFile(null)
              resetState()
              if (fileInputRef.current) fileInputRef.current.value = ''
            }}
            size="lg"
          >
            Clear & Reset
          </Button>
        )}
      </div>
    </div>
  )
} 