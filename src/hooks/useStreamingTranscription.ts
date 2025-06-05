import { useState, useCallback, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export interface StreamingTranscriptionState {
  isProcessing: boolean
  progress: number
  stage: 'uploading' | 'transcribing' | 'generating' | 'complete' | 'error'
  transcript: string
  generatedContent: {
    summary?: string
    keyPoints?: string[]
    actionItems?: string[]
    timestamps?: Array<{ time: string; text: string }>
  }
  error: string | null
  jobId: string | null
}

export const useStreamingTranscription = () => {
  const { user } = useAuth()
  const [state, setState] = useState<StreamingTranscriptionState>({
    isProcessing: false,
    progress: 0,
    stage: 'uploading',
    transcript: '',
    generatedContent: {},
    error: null,
    jobId: null,
  })
  
  const abortControllerRef = useRef<AbortController | null>(null)

  const startTranscription = useCallback(async (audioFile: File, options: {
    generateSummary?: boolean
    generateKeyPoints?: boolean
    generateActionItems?: boolean
    extractTimestamps?: boolean
  } = {}) => {
    if (!user) {
      toast.error('Please log in to transcribe audio')
      return
    }

    // Reset state
    setState({
      isProcessing: true,
      progress: 0,
      stage: 'uploading',
      transcript: '',
      generatedContent: {},
      error: null,
      jobId: null,
    })

    try {
      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController()

      // Step 1: Upload audio file
      setState(prev => ({ ...prev, stage: 'uploading', progress: 10 }))
      
      const fileExt = audioFile.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('audio-uploads')
        .upload(fileName, audioFile)

      if (uploadError) throw uploadError

      setState(prev => ({ ...prev, progress: 30 }))

      // Step 2: First create audio upload record
      const { data: upload, error: uploadRecordError } = await supabase
        .from('audio_uploads')
        .insert({
          user_id: user.id,
          filename: fileName,
          original_filename: audioFile.name,
          file_url: fileName, // Will be updated after upload
          file_size: audioFile.size,
          mime_type: audioFile.type,
          status: 'uploaded'
        })
        .select()
        .single()

      if (uploadRecordError) throw uploadRecordError

      // Step 3: Create processing job linked to upload
      const { data: job, error: jobError } = await supabase
        .from('processing_jobs')
        .insert({
          upload_id: upload.id,
          status: 'processing',
          job_type: 'transcription',
          metadata: {
            original_filename: audioFile.name,
            file_size: audioFile.size,
            options
          }
        })
        .select()
        .single()

      if (jobError) throw jobError

      setState(prev => ({ ...prev, jobId: job.id, progress: 40 }))

      // Step 3: Start streaming transcription
      setState(prev => ({ ...prev, stage: 'transcribing', progress: 50 }))

      const response = await fetch('/api/enhanced-transcribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          audioPath: fileName,
          jobId: job.id,
          options: {
            stream: true,
            ...options
          }
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      // Process streaming response
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              
              if (data.type === 'progress') {
                setState(prev => ({ 
                  ...prev, 
                  progress: Math.min(50 + (data.progress * 0.3), 80) 
                }))
              } else if (data.type === 'transcript_chunk') {
                setState(prev => ({ 
                  ...prev, 
                  transcript: prev.transcript + data.text 
                }))
              } else if (data.type === 'stage_change') {
                setState(prev => ({ 
                  ...prev, 
                  stage: data.stage,
                  progress: data.stage === 'generating' ? 80 : prev.progress
                }))
              } else if (data.type === 'content_generated') {
                setState(prev => ({ 
                  ...prev, 
                  generatedContent: {
                    ...prev.generatedContent,
                    [data.contentType]: data.content
                  }
                }))
              } else if (data.type === 'complete') {
                setState(prev => ({ 
                  ...prev, 
                  stage: 'complete',
                  progress: 100,
                  isProcessing: false
                }))
                
                // Update job status
                await supabase
                  .from('processing_jobs')
                  .update({ 
                    status: 'completed',
                    completed_at: new Date().toISOString()
                  })
                  .eq('id', job.id)

                toast.success('Transcription completed successfully!')
                break
              } else if (data.type === 'error') {
                throw new Error(data.message)
              }
            } catch (parseError) {
              console.warn('Failed to parse SSE data:', line)
            }
          }
        }
      }

    } catch (error: any) {
      console.error('Streaming transcription error:', error)
      
      const errorMessage = error.name === 'AbortError' 
        ? 'Transcription cancelled'
        : error.message || 'Failed to process audio'

      setState(prev => ({ 
        ...prev, 
        stage: 'error',
        error: errorMessage,
        isProcessing: false
      }))

      // Update job status if we have a job ID
      if (state.jobId) {
        await supabase
          .from('processing_jobs')
          .update({ 
            status: 'failed',
            error_message: errorMessage,
            completed_at: new Date().toISOString()
          })
          .eq('id', state.jobId)
      }

      if (error.name !== 'AbortError') {
        toast.error(errorMessage)
      }
    }
  }, [user, state.jobId])

  const cancelTranscription = useCallback(() => {
    if (abortControllerRef.current && state.isProcessing) {
      abortControllerRef.current.abort()
      setState(prev => ({ 
        ...prev, 
        isProcessing: false,
        stage: 'error',
        error: 'Transcription cancelled by user'
      }))
      toast.info('Transcription cancelled')
    }
  }, [state.isProcessing])

  const resetState = useCallback(() => {
    setState({
      isProcessing: false,
      progress: 0,
      stage: 'uploading',
      transcript: '',
      generatedContent: {},
      error: null,
      jobId: null,
    })
  }, [])

  return {
    state,
    startTranscription,
    cancelTranscription,
    resetState,
  }
} 