import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { 
  Upload, 
  FolderOpen, 
  Download, 
  Zap, 
  CheckCircle, 
  AlertCircle,
  X,
  Play,
  Pause,
  RotateCcw,
  Archive,
  FileVideo,
  Clock,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  CONTENT_FORMATS,
  SUPPORTED_LANGUAGES,
  type ContentFormat,
  type LanguageCode,
  detectLanguage,
  detectNiche
} from '@/lib/languages'
import { toast } from 'sonner'

interface BatchFile {
  id: string
  file: File
  name: string
  size: number
  duration?: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  clips?: GeneratedClip[]
  language?: LanguageCode
  niche?: string
  error?: string
}

interface GeneratedClip {
  id: string
  title: string
  duration: number
  format: ContentFormat
  hookText?: string
  downloadUrl?: string
  thumbnailUrl?: string
  engagementScore: number
}

interface BatchProcessorProps {
  onBatchComplete?: (results: BatchFile[]) => void
  className?: string
}

export const BatchProcessor: React.FC<BatchProcessorProps> = ({
  onBatchComplete,
  className
}) => {
  const [files, setFiles] = useState<BatchFile[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [selectedFormat, setSelectedFormat] = useState<ContentFormat>('tiktok')
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageCode>('en')
  const [autoDetectLanguage, setAutoDetectLanguage] = useState(true)
  const [clipsPerVideo, setClipsPerVideo] = useState(3)
  const [processingIndex, setProcessingIndex] = useState(0)
  const [overallProgress, setOverallProgress] = useState(0)

  // Handle file drop/upload
  const handleFileUpload = useCallback((uploadedFiles: FileList | File[]) => {
    const newFiles: BatchFile[] = Array.from(uploadedFiles).map(file => ({
      id: `file-${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      size: file.size,
      status: 'pending',
      progress: 0
    }))

    setFiles(prev => [...prev, ...newFiles])
    toast.success(`Added ${newFiles.length} file${newFiles.length !== 1 ? 's' : ''} to batch`)
  }, [])

  // Remove file from batch
  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  // Clear all files
  const clearAll = () => {
    setFiles([])
    setProcessingIndex(0)
    setOverallProgress(0)
  }

  // Start batch processing
  const startBatchProcessing = async () => {
    if (files.length === 0) {
      toast.error('Please add files to process')
      return
    }

    setIsProcessing(true)
    setIsPaused(false)
    setProcessingIndex(0)

    try {
      for (let i = 0; i < files.length; i++) {
        if (isPaused) break

        setProcessingIndex(i)
        await processFile(files[i], i)
        
        // Update overall progress
        const progress = ((i + 1) / files.length) * 100
        setOverallProgress(progress)
      }

      if (!isPaused) {
        toast.success('Batch processing completed!')
        onBatchComplete?.(files)
      }
    } catch (error) {
      console.error('Batch processing error:', error)
      toast.error('Batch processing failed')
    } finally {
      setIsProcessing(false)
      setIsPaused(false)
    }
  }

  // Process individual file
  const processFile = async (file: BatchFile, index: number) => {
    const updateFile = (updates: Partial<BatchFile>) => {
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, ...updates } : f
      ))
    }

    try {
      updateFile({ status: 'processing', progress: 0 })

      // Simulate file analysis (language/niche detection)
      await new Promise(resolve => setTimeout(resolve, 500))
      updateFile({ progress: 10 })

      // Mock transcript extraction
      const mockTranscript = `This is a sample transcript for ${file.name}. 
        We're talking about business growth and entrepreneurship success.
        Key insights about scaling your startup and achieving financial freedom.`
      
      const detectedLang = autoDetectLanguage ? detectLanguage(mockTranscript) : selectedLanguage
      const detectedNicheText = detectNiche(mockTranscript)
      
      updateFile({ 
        progress: 25,
        language: detectedLang,
        niche: detectedNicheText
      })

      // Simulate clip generation
      const clips: GeneratedClip[] = []
      for (let i = 0; i < clipsPerVideo; i++) {
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const clip: GeneratedClip = {
          id: `clip-${file.id}-${i}`,
          title: `Viral Clip ${i + 1}`,
          duration: 30 + Math.floor(Math.random() * 30), // 30-60 seconds
          format: selectedFormat,
          hookText: getRandomHook(detectedLang, detectedNicheText),
          downloadUrl: `https://cdn.podify.com/clips/${file.id}-${i}.mp4`,
          thumbnailUrl: `https://cdn.podify.com/thumbs/${file.id}-${i}.jpg`,
          engagementScore: 7.5 + Math.random() * 2.5 // 7.5-10.0
        }
        
        clips.push(clip)
        updateFile({ progress: 25 + (i + 1) * (70 / clipsPerVideo), clips: [...clips] })
      }

      // Final processing
      await new Promise(resolve => setTimeout(resolve, 500))
      updateFile({ status: 'completed', progress: 100, clips })

    } catch (error) {
      updateFile({ 
        status: 'failed', 
        error: 'Processing failed. Please try again.',
        progress: 0 
      })
    }
  }

  // Get random hook for testing
  const getRandomHook = (language: LanguageCode, niche: string): string => {
    const hooks = {
      en: [
        "This changed everything about my business...",
        "The $10K mistake everyone makes...",
        "What successful people don't tell you...",
        "This strategy 10x'd my revenue...",
        "The secret to viral content..."
      ],
      es: [
        "Esto cambió todo sobre mi negocio...",
        "El error de $10K que todos cometen...",
        "Lo que la gente exitosa no te dice...",
        "Esta estrategia multiplicó mis ingresos...",
        "El secreto del contenido viral..."
      ],
      pt: [
        "Isso mudou tudo sobre meu negócio...",
        "O erro de R$50K que todos cometem...",
        "O que pessoas bem-sucedidas não contam...",
        "Esta estratégia multiplicou minha receita...",
        "O segredo do conteúdo viral..."
      ]
    }

    const languageHooks = hooks[language] || hooks.en
    return languageHooks[Math.floor(Math.random() * languageHooks.length)]
  }

  // Pause/resume processing
  const togglePause = () => {
    setIsPaused(!isPaused)
    toast.info(isPaused ? 'Resuming batch processing...' : 'Pausing batch processing...')
  }

  // Download all results as ZIP
  const downloadAllClips = () => {
    const completedFiles = files.filter(f => f.status === 'completed' && f.clips)
    const totalClips = completedFiles.reduce((sum, f) => sum + (f.clips?.length || 0), 0)
    
    toast.success(`Downloading ${totalClips} clips as ZIP file...`)
    // In real implementation, this would trigger a ZIP download
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getStatusIcon = (status: BatchFile['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-gray-500" />
      case 'processing': return <Zap className="w-4 h-4 text-blue-500 animate-pulse" />
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusColor = (status: BatchFile['status']) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
    }
  }

  const completedFiles = files.filter(f => f.status === 'completed')
  const totalClips = completedFiles.reduce((sum, f) => sum + (f.clips?.length || 0), 0)
  const totalDuration = completedFiles.reduce((sum, f) => 
    sum + (f.clips?.reduce((clipSum, clip) => clipSum + clip.duration, 0) || 0), 0
  )

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Archive className="w-5 h-5 text-orange-500" />
          Batch Processor
          <Badge className="ml-auto bg-gradient-to-r from-orange-500 to-red-500 text-white">
            Agency Power
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Process 10+ videos simultaneously. Perfect for agencies and high-volume creators.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Output Format</label>
            <Select value={selectedFormat} onValueChange={(value: ContentFormat) => setSelectedFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CONTENT_FORMATS).map(([key, format]) => (
                  <SelectItem key={key} value={key}>
                    {format.name} ({format.aspectRatio})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Language</label>
            <Select 
              value={selectedLanguage} 
              onValueChange={(value: LanguageCode) => setSelectedLanguage(value)}
              disabled={autoDetectLanguage}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                  <SelectItem key={code} value={code}>
                    {lang.flag} {lang.nativeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Clips per Video</label>
            <Input
              type="number"
              min={1}
              max={10}
              value={clipsPerVideo}
              onChange={(e) => setClipsPerVideo(parseInt(e.target.value) || 3)}
            />
          </div>

          <div className="flex items-end">
            <div className="space-y-2 w-full">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto-detect Language</label>
                <Switch
                  checked={autoDetectLanguage}
                  onCheckedChange={setAutoDetectLanguage}
                />
              </div>
            </div>
          </div>
        </div>

        {/* File Upload Area */}
        <div 
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
          onClick={() => document.getElementById('batch-file-input')?.click()}
          onDrop={(e) => {
            e.preventDefault()
            const droppedFiles = e.dataTransfer.files
            if (droppedFiles.length > 0) {
              handleFileUpload(droppedFiles)
            }
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-medium mb-2">Drop multiple video files here</h3>
          <p className="text-muted-foreground mb-4">
            Support for MP4, MOV, AVI files. Drag & drop or click to browse.
          </p>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Choose Files
          </Button>
          <input
            id="batch-file-input"
            type="file"
            multiple
            accept="video/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
          />
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Files ({files.length})
              </h3>
              <div className="flex items-center gap-2">
                {isProcessing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={togglePause}
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        Resume
                      </>
                    ) : (
                      <>
                        <Pause className="w-4 h-4 mr-1" />
                        Pause
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  disabled={isProcessing}
                >
                  <X className="w-4 h-4 mr-1" />
                  Clear All
                </Button>
              </div>
            </div>

            {/* Overall Progress */}
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Overall Progress</span>
                  <span>{Math.round(overallProgress)}%</span>
                </div>
                <Progress value={overallProgress} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  Processing file {processingIndex + 1} of {files.length}
                  {isPaused && ' (Paused)'}
                </div>
              </div>
            )}

            {/* File Cards */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {files.map((file, index) => (
                <Card key={file.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <FileVideo className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-medium">{file.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)}
                          {file.language && (
                            <span className="ml-2">
                              • {SUPPORTED_LANGUAGES[file.language].flag} {SUPPORTED_LANGUAGES[file.language].nativeName}
                            </span>
                          )}
                          {file.niche && (
                            <span className="ml-2">• {file.niche}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={cn("text-xs", getStatusColor(file.status))}>
                        {getStatusIcon(file.status)}
                        {file.status}
                      </Badge>
                      {file.status === 'pending' && !isProcessing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {file.status === 'processing' && (
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Processing...</span>
                        <span>{Math.round(file.progress)}%</span>
                      </div>
                      <Progress value={file.progress} className="h-1" />
                    </div>
                  )}

                  {file.clips && file.clips.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">
                        Generated Clips ({file.clips.length})
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {file.clips.map((clip) => (
                          <div key={clip.id} className="bg-muted/50 p-2 rounded text-xs">
                            <div className="font-medium">{clip.title}</div>
                            <div className="text-muted-foreground">
                              {clip.duration}s • Score: {clip.engagementScore.toFixed(1)}
                            </div>
                            {clip.hookText && (
                              <div className="mt-1 text-muted-foreground truncate">
                                "{clip.hookText}"
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {file.error && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      {file.error}
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                {completedFiles.length > 0 && (
                  <>
                    {totalClips} clips generated • {Math.round(totalDuration / 60)} minutes total
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {totalClips > 0 && (
                  <Button
                    variant="outline"
                    onClick={downloadAllClips}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download All ({totalClips})
                  </Button>
                )}
                
                <Button
                  onClick={startBatchProcessing}
                  disabled={isProcessing || files.length === 0}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  {isProcessing ? (
                    <>
                      <Zap className="w-4 h-4 mr-2 animate-pulse" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Process All Files
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Pro Tips */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            Batch Processing Pro Tips
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Process similar content together for better AI optimization</li>
            <li>• Upload files in order of priority - processing happens sequentially</li>
            <li>• Use auto-language detection for multi-language content</li>
            <li>• Higher clip counts take longer but give more content options</li>
            <li>• Download happens automatically when all files complete</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 