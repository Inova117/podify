import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Sparkles, 
  Zap, 
  Crown, 
  Rocket,
  TrendingUp,
  Globe,
  Users,
  Download,
  Share2,
  Target,
  Wand2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { StreamingAudioProcessor } from './StreamingAudioProcessor'
import { AIHookGenerator } from './AIHookGenerator'
import { MultiPlatformPublisher } from './MultiPlatformPublisher'
import { BatchProcessor } from './BatchProcessor'
import { type LanguageCode, type ContentFormat } from '@/lib/languages'
import { toast } from 'sonner'

interface UltraProcessorProps {
  className?: string
}

interface ProcessingResults {
  transcript?: string
  clips?: any[]
  hooks?: string[]
  language?: LanguageCode
  format?: ContentFormat
}

export const UltraProcessor: React.FC<UltraProcessorProps> = ({ className }) => {
  const [activeMode, setActiveMode] = useState<'single' | 'batch'>('single')
  const [activeStep, setActiveStep] = useState(1)
  const [processingResults, setProcessingResults] = useState<ProcessingResults>({})
  const [selectedHook, setSelectedHook] = useState<string>('')
  const [generatedVideo, setGeneratedVideo] = useState<File | null>(null)
  const [overallProgress, setOverallProgress] = useState(0)

  const steps = [
    { 
      id: 1, 
      title: 'Upload & Process', 
      description: 'AI transcription & analysis',
      icon: <Zap className="w-4 h-4" />
    },
    { 
      id: 2, 
      title: 'Generate Hooks', 
      description: 'Viral hook creation',
      icon: <Sparkles className="w-4 h-4" />
    },
    { 
      id: 3, 
      title: 'Create Content', 
      description: 'Multi-format clips',
      icon: <Wand2 className="w-4 h-4" />
    },
    { 
      id: 4, 
      title: 'Publish', 
      description: 'Multi-platform posting',
      icon: <Share2 className="w-4 h-4" />
    }
  ]

  // Handle processing completion from StreamingAudioProcessor
  const handleProcessingComplete = (results: any) => {
    setProcessingResults({
      transcript: results.transcript,
      clips: results.clips,
      language: results.detectedLanguage,
      format: results.selectedFormat
    })
    setActiveStep(2)
    setOverallProgress(25)
    toast.success('Step 1 complete! Ready to generate viral hooks.')
  }

  // Handle hook generation
  const handleHookGenerated = (hook: string, language: LanguageCode, format: ContentFormat) => {
    setSelectedHook(hook)
    setProcessingResults(prev => ({
      ...prev,
      hooks: [...(prev.hooks || []), hook],
      language,
      format
    }))
    setActiveStep(3)
    setOverallProgress(50)
    toast.success('Step 2 complete! Creating optimized content...')
    
    // Simulate content creation
    setTimeout(() => {
      setActiveStep(4)
      setOverallProgress(75)
      toast.success('Step 3 complete! Ready to publish across platforms!')
    }, 2000)
  }

  // Handle publish completion
  const handlePublishComplete = (results: any) => {
    setOverallProgress(100)
    toast.success('🎉 All steps complete! Your content is live across multiple platforms!')
  }

  const getStepStatus = (stepId: number) => {
    if (stepId < activeStep) return 'completed'
    if (stepId === activeStep) return 'active'
    return 'pending'
  }

  const getStepColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white'
      case 'active': return 'bg-primary text-white'
      case 'pending': return 'bg-muted text-muted-foreground'
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Hero Header */}
      <Card className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-white">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Crown className="w-8 h-8 text-yellow-300" />
              <h1 className="text-3xl font-bold">Podify UltraProcessor</h1>
              <Crown className="w-8 h-8 text-yellow-300" />
            </div>
            
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              The world's most advanced AI content repurposing system. 
              Transform any audio into viral multi-language clips and publish instantly across all platforms.
            </p>
            
            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm opacity-75">Languages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm opacity-75">Platforms</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">∞</div>
                <div className="text-sm opacity-75">Viral Hooks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">1</div>
                <div className="text-sm opacity-75">Click</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-6">
              <Badge className="bg-white/20 text-white border-white/30">
                <Globe className="w-3 h-3 mr-1" />
                Multi-Language AI
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <TrendingUp className="w-3 h-3 mr-1" />
                Viral Hook Generator
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <Rocket className="w-3 h-3 mr-1" />
                Direct Publishing
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mode Selection */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={activeMode === 'single' ? 'default' : 'outline'}
              onClick={() => setActiveMode('single')}
              className="flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              Single File Processor
            </Button>
            <Button
              variant={activeMode === 'batch' ? 'default' : 'outline'}
              onClick={() => setActiveMode('batch')}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Batch Processor (Agency Mode)
            </Button>
          </div>
        </CardContent>
      </Card>

      {activeMode === 'batch' ? (
        /* Batch Processing Mode */
        <BatchProcessor onBatchComplete={handlePublishComplete} />
      ) : (
        /* Single File Processing Mode */
        <div className="space-y-6">
          {/* Progress Steps */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Processing Pipeline</h3>
                  <div className="text-sm text-muted-foreground">
                    Step {activeStep} of {steps.length}
                  </div>
                </div>
                
                <Progress value={overallProgress} className="h-2" />
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {steps.map((step) => {
                    const status = getStepStatus(step.id)
                    return (
                      <div
                        key={step.id}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-all",
                          status === 'active' ? 'border-primary bg-primary/5' :
                          status === 'completed' ? 'border-green-500 bg-green-50' :
                          'border-muted bg-muted/30'
                        )}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                            getStepColor(status)
                          )}>
                            {status === 'completed' ? '✓' : step.id}
                          </div>
                          <h4 className="font-medium">{step.title}</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Processing Tabs */}
          <Tabs value={`step-${activeStep}`} className="w-full">
            <TabsList className="hidden">
              <TabsTrigger value="step-1">Upload</TabsTrigger>
              <TabsTrigger value="step-2">Hooks</TabsTrigger>
              <TabsTrigger value="step-3">Content</TabsTrigger>
              <TabsTrigger value="step-4">Publish</TabsTrigger>
            </TabsList>

            <TabsContent value="step-1" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-500" />
                    Step 1: AI Audio Processing
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Upload your audio and let our AI analyze, transcribe, and identify the best moments for viral content.
                  </p>
                </CardHeader>
                <CardContent>
                  <StreamingAudioProcessor 
                    onComplete={handleProcessingComplete}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="step-2" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" />
                    Step 2: Viral Hook Generation
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Generate culturally-aware viral hooks in multiple languages for maximum engagement.
                  </p>
                </CardHeader>
                <CardContent>
                  <AIHookGenerator
                    transcript={processingResults.transcript}
                    selectedLanguage={processingResults.language}
                    selectedFormat={processingResults.format}
                    onHookGenerated={handleHookGenerated}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="step-3" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5 text-green-500" />
                    Step 3: Multi-Format Content Creation
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Creating optimized clips with your selected viral hook for each platform.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedHook && (
                      <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                        <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                          <Wand2 className="w-4 h-4 text-green-500" />
                          Selected Viral Hook
                        </h4>
                        <p className="text-sm font-medium">"{selectedHook}"</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="p-4">
                        <div className="aspect-[9/16] bg-gradient-to-b from-pink-500 to-red-500 rounded-lg mb-3 flex items-center justify-center text-white">
                          <div className="text-center">
                            <div className="text-2xl mb-2">📱</div>
                            <div className="text-sm">TikTok/Reels</div>
                            <div className="text-xs opacity-75">9:16</div>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="font-medium">Viral Clip 1</div>
                          <div className="text-muted-foreground">30s • Engagement: 9.2/10</div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="aspect-square bg-gradient-to-b from-blue-500 to-purple-500 rounded-lg mb-3 flex items-center justify-center text-white">
                          <div className="text-center">
                            <div className="text-2xl mb-2">💼</div>
                            <div className="text-sm">LinkedIn</div>
                            <div className="text-xs opacity-75">1:1</div>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="font-medium">Professional Cut</div>
                          <div className="text-muted-foreground">45s • Engagement: 8.7/10</div>
                        </div>
                      </Card>

                      <Card className="p-4">
                        <div className="aspect-video bg-gradient-to-b from-red-500 to-orange-500 rounded-lg mb-3 flex items-center justify-center text-white">
                          <div className="text-center">
                            <div className="text-2xl mb-2">📺</div>
                            <div className="text-sm">YouTube</div>
                            <div className="text-xs opacity-75">16:9</div>
                          </div>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="font-medium">Long Form</div>
                          <div className="text-muted-foreground">60s • Engagement: 8.9/10</div>
                        </div>
                      </Card>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        Creating optimized clips with viral hook integration...
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="step-4" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-orange-500" />
                    Step 4: Multi-Platform Publishing
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Publish your optimized content directly to all major social media platforms with one click.
                  </p>
                </CardHeader>
                <CardContent>
                  <MultiPlatformPublisher
                    videoFile={generatedVideo}
                    generatedCaption={`${selectedHook}\n\n#viral #content #ai #podify`}
                    selectedFormat={processingResults.format}
                    onPublishComplete={handlePublishComplete}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          {overallProgress === 100 && (
            <Card className="bg-gradient-to-r from-green-50 to-blue-50">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <div className="text-2xl">🎉</div>
                  <h3 className="text-xl font-bold">Content Successfully Published!</h3>
                  <p className="text-muted-foreground">
                    Your viral content is now live across multiple platforms. Track your engagement and repeat the process!
                  </p>
                  
                  <div className="flex items-center justify-center gap-4">
                    <Button variant="outline">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button>
                      <Rocket className="w-4 h-4 mr-2" />
                      Process Another
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* 10x Features Showcase */}
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold">Why Podify is 10x Better</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Multi-Language Dominance</h3>
                <p className="text-sm opacity-75">
                  First platform optimized for Spanish, Portuguese, and LatAm creators
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">AI Viral Hook Generator</h3>
                <p className="text-sm opacity-75">
                  Auto-generates culturally-aware hooks that actually go viral
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="font-semibold">Direct Platform Publishing</h3>
                <p className="text-sm opacity-75">
                  No downloads needed - publish directly to TikTok, Instagram, YouTube, LinkedIn, X
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/20">
              <p className="text-sm opacity-75">
                Join thousands of creators who've 10x'd their reach with Podify's revolutionary AI platform
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 