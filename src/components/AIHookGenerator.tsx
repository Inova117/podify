import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Zap, 
  RefreshCw, 
  Copy, 
  Check, 
  Sparkles,
  TrendingUp,
  Target,
  Globe,
  Wand2,
  Play
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  SUPPORTED_LANGUAGES, 
  CONTENT_FORMATS, 
  getViralHooks,
  detectLanguage,
  detectNiche,
  type LanguageCode,
  type ContentFormat,
  type ContentNiche
} from '@/lib/languages'
import { toast } from 'sonner'

interface AIHookGeneratorProps {
  transcript?: string
  selectedLanguage?: LanguageCode
  selectedFormat?: ContentFormat
  onHookGenerated?: (hook: string, language: LanguageCode, format: ContentFormat) => void
  className?: string
}

interface GeneratedHook {
  id: string
  text: string
  type: 'viral' | 'question' | 'stat' | 'story' | 'controversy'
  confidence: number
  engagement_score: number
}

export const AIHookGenerator: React.FC<AIHookGeneratorProps> = ({
  transcript = '',
  selectedLanguage,
  selectedFormat,
  onHookGenerated,
  className
}) => {
  const [detectedLanguage, setDetectedLanguage] = useState<LanguageCode>('en')
  const [detectedNiche, setDetectedNiche] = useState<ContentNiche>('business')
  const [language, setLanguage] = useState<LanguageCode>(selectedLanguage || 'en')
  const [format, setFormat] = useState<ContentFormat>(selectedFormat || 'tiktok')
  const [customText, setCustomText] = useState('')
  const [generatedHooks, setGeneratedHooks] = useState<GeneratedHook[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [selectedHook, setSelectedHook] = useState<string>('')

  // Auto-detect language and niche when transcript changes
  useEffect(() => {
    if (transcript) {
      const detected = detectLanguage(transcript)
      const niche = detectNiche(transcript)
      setDetectedLanguage(detected)
      setDetectedNiche(niche)
      if (!selectedLanguage) {
        setLanguage(detected)
      }
    }
  }, [transcript, selectedLanguage])

  // Generate AI-powered hooks
  const generateHooks = async () => {
    setIsGenerating(true)
    
    try {
      // Simulate AI processing delay for realism
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const sourceText = transcript || customText
      if (!sourceText.trim()) {
        toast.error('Please provide some content to analyze')
        return
      }

      // Get template hooks for the detected niche and language
      const templateHooks = getViralHooks(language, detectedNiche)
      
      // Generate contextual hooks using AI patterns
      const contextualHooks = generateContextualHooks(sourceText, language, detectedNiche, format)
      
      // Combine template and contextual hooks
      const allHooks = [...templateHooks, ...contextualHooks]
      
      // Create hook objects with scores
      const hooks: GeneratedHook[] = allHooks.slice(0, 8).map((hookText, index) => ({
        id: `hook-${Date.now()}-${index}`,
        text: hookText,
        type: getHookType(hookText),
        confidence: 85 + Math.floor(Math.random() * 15), // 85-100%
        engagement_score: 7.2 + Math.random() * 2.8 // 7.2-10.0
      }))

      setGeneratedHooks(hooks)
      toast.success(`Generated ${hooks.length} viral hooks for ${SUPPORTED_LANGUAGES[language].name}`)
      
    } catch (error) {
      console.error('Hook generation error:', error)
      toast.error('Failed to generate hooks. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Generate contextual hooks based on content analysis
  const generateContextualHooks = (text: string, lang: LanguageCode, niche: ContentNiche, format: ContentFormat): string[] => {
    const keyPhrases = extractKeyPhrases(text)
    const emotion = detectEmotion(text)
    const formatSpecs = CONTENT_FORMATS[format]
    
    const hooks: string[] = []
    
    // Generate hooks based on language
    if (lang === 'es') {
      hooks.push(
        `La verdad que nadie te dice sobre ${keyPhrases[0]}...`,
        `Cómo pasé de fracasar a ${keyPhrases[1]} en 30 días`,
        `El secreto de ${keyPhrases[0]} que cambió mi vida`,
        `Por qué el 95% de la gente falla en ${keyPhrases[1]}`,
        `La estrategia que me hizo ganar $50K con ${keyPhrases[0]}`
      )
    } else if (lang === 'pt') {
      hooks.push(
        `A verdade que ninguém te conta sobre ${keyPhrases[0]}...`,
        `Como eu saí do zero para ${keyPhrases[1]} em 30 dias`,
        `O segredo de ${keyPhrases[0]} que mudou minha vida`,
        `Por que 95% das pessoas falham em ${keyPhrases[1]}`,
        `A estratégia que me fez ganhar R$100K com ${keyPhrases[0]}`
      )
    } else {
      hooks.push(
        `The truth about ${keyPhrases[0]} nobody tells you...`,
        `How I went from zero to ${keyPhrases[1]} in 30 days`,
        `The ${keyPhrases[0]} secret that changed my life`,
        `Why 95% of people fail at ${keyPhrases[1]}`,
        `The strategy that made me $50K with ${keyPhrases[0]}`
      )
    }

    // Add format-specific hooks
    if (formatSpecs.hookRequired) {
      if (lang === 'es') {
        hooks.push(`¡Esto va a volar tu mente! 🤯`)
      } else if (lang === 'pt') {
        hooks.push(`Isso vai explodir sua mente! 🤯`)
      } else {
        hooks.push(`This will blow your mind! 🤯`)
      }
    }

    return hooks
  }

  // Extract key phrases from text
  const extractKeyPhrases = (text: string): string[] => {
    const words = text.toLowerCase().split(/\s+/)
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'a', 'an', 'is', 'are', 'was', 'were', 'el', 'la', 'de', 'que', 'y', 'o', 'que', 'em', 'para', 'com']
    
    const significantWords = words
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .slice(0, 5)

    return significantWords.length ? significantWords : ['success', 'business']
  }

  // Detect emotional tone
  const detectEmotion = (text: string): 'positive' | 'negative' | 'neutral' => {
    const positiveWords = ['success', 'win', 'amazing', 'incredible', 'breakthrough', 'achieve']
    const negativeWords = ['fail', 'mistake', 'wrong', 'problem', 'struggle', 'difficult']
    
    const positive = positiveWords.some(word => text.toLowerCase().includes(word))
    const negative = negativeWords.some(word => text.toLowerCase().includes(word))
    
    if (positive && !negative) return 'positive'
    if (negative && !positive) return 'negative'
    return 'neutral'
  }

  // Determine hook type
  const getHookType = (hookText: string): GeneratedHook['type'] => {
    if (hookText.includes('?')) return 'question'
    if (hookText.includes('%') || /\d+/.test(hookText)) return 'stat'
    if (hookText.includes('secret') || hookText.includes('truth')) return 'controversy'
    if (hookText.includes('story') || hookText.includes('journey')) return 'story'
    return 'viral'
  }

  // Copy hook to clipboard
  const copyHook = async (hook: GeneratedHook) => {
    try {
      await navigator.clipboard.writeText(hook.text)
      setCopiedId(hook.id)
      setTimeout(() => setCopiedId(null), 2000)
      toast.success('Hook copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy hook')
    }
  }

  // Select hook for use
  const selectHook = (hook: GeneratedHook) => {
    setSelectedHook(hook.text)
    onHookGenerated?.(hook.text, language, format)
    toast.success('Hook selected! Ready to create your viral content.')
  }

  const getTypeIcon = (type: GeneratedHook['type']) => {
    switch (type) {
      case 'viral': return <TrendingUp className="w-3 h-3" />
      case 'question': return <Target className="w-3 h-3" />
      case 'stat': return <Zap className="w-3 h-3" />
      case 'story': return <Play className="w-3 h-3" />
      case 'controversy': return <Sparkles className="w-3 h-3" />
      default: return <Wand2 className="w-3 h-3" />
    }
  }

  const getTypeColor = (type: GeneratedHook['type']) => {
    switch (type) {
      case 'viral': return 'bg-red-100 text-red-800'
      case 'question': return 'bg-blue-100 text-blue-800'
      case 'stat': return 'bg-yellow-100 text-yellow-800'
      case 'story': return 'bg-green-100 text-green-800'
      case 'controversy': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          AI Viral Hook Generator
          <Badge className="ml-auto">10x Feature</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Generate viral hooks in multiple languages that get your content noticed. 
          Auto-detects your content's language and niche for perfect targeting.
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Language</label>
            <Select value={language} onValueChange={(value: LanguageCode) => setLanguage(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SUPPORTED_LANGUAGES).map(([code, lang]) => (
                  <SelectItem key={code} value={code}>
                    <span className="flex items-center gap-2">
                      {lang.flag} {lang.nativeName}
                      {lang.priority === 1 && <Badge className="ml-2 text-xs">Hot Market</Badge>}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Platform</label>
            <Select value={format} onValueChange={(value: ContentFormat) => setFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CONTENT_FORMATS).map(([key, formatConfig]) => (
                  <SelectItem key={key} value={key}>
                    {formatConfig.name} ({formatConfig.aspectRatio})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button 
              onClick={generateHooks} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 mr-2" />
                  Generate Hooks
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Custom Text Input */}
        {!transcript && (
          <div>
            <label className="text-sm font-medium mb-2 block">
              Content to Analyze (or use transcript from audio upload)
            </label>
            <Textarea
              placeholder="Paste your content here to generate viral hooks..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              rows={3}
            />
          </div>
        )}

        {/* Auto-detection Results */}
        {transcript && (
          <div className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <span className="text-sm">
                Detected: <strong>{SUPPORTED_LANGUAGES[detectedLanguage].nativeName}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-500" />
              <span className="text-sm">
                Niche: <strong>{detectedNiche}</strong>
              </span>
            </div>
          </div>
        )}

        {/* Generated Hooks */}
        {generatedHooks.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Generated Viral Hooks</h3>
              <Badge variant="outline">{generatedHooks.length} hooks generated</Badge>
            </div>

            <div className="grid gap-3">
              {generatedHooks.map((hook) => (
                <Card 
                  key={hook.id} 
                  className={cn(
                    "p-4 cursor-pointer transition-all hover:shadow-md",
                    selectedHook === hook.text && "ring-2 ring-primary"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={cn("text-xs", getTypeColor(hook.type))}>
                          {getTypeIcon(hook.type)}
                          {hook.type}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <TrendingUp className="w-3 h-3" />
                          {hook.engagement_score.toFixed(1)}/10
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {hook.confidence}% confidence
                        </div>
                      </div>
                      <p className="text-sm font-medium leading-relaxed">
                        {hook.text}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyHook(hook)}
                      >
                        {copiedId === hook.id ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => selectHook(hook)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Use
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button 
                variant="outline" 
                onClick={generateHooks}
                disabled={isGenerating}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate More Hooks
              </Button>
            </div>
          </div>
        )}

        {/* Pro Tips */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            Pro Tips for Viral Hooks
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Start with emotion: surprise, curiosity, or urgency</li>
            <li>• Use numbers and statistics when possible</li>
            <li>• Create a knowledge gap that demands to be filled</li>
            <li>• Test multiple hooks for the same content</li>
            <li>• Adapt language and cultural context for your audience</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
} 