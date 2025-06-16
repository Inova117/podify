import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  TrendingUp, 
  Target, 
  BarChart3,
  Lightbulb,
  RefreshCw,
  Copy,
  Check,
  Sparkles,
  Eye,
  Heart,
  Share,
  MessageCircle,
  Clock,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  AIContentOptimizer, 
  contentOptimizer,
  type Platform,
  type Audience,
  type ViralScore,
  type OptimizedContent,
  type PerformanceMetrics,
  PLATFORMS
} from '@/lib/contentOptimizer';
import { toast } from 'sonner';

interface ContentOptimizerProps {
  initialContent?: string;
  onOptimized?: (optimizedContent: OptimizedContent) => void;
  className?: string;
}

export const ContentOptimizer: React.FC<ContentOptimizerProps> = ({
  initialContent = '',
  onOptimized,
  className
}) => {
  const [content, setContent] = useState(initialContent);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('instagram');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [viralScore, setViralScore] = useState<ViralScore | null>(null);
  const [optimizedResult, setOptimizedResult] = useState<OptimizedContent | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

  // Mock audience data (in production, this would come from user profile/analytics)
  const mockAudience: Audience = {
    demographics: {
      ageRange: '25-34',
      gender: 'mixed',
      location: 'global',
      interests: ['business', 'productivity', 'success', 'entrepreneurship']
    },
    behavior: {
      activeHours: ['9-11', '15-17', '19-21'],
      engagementPatterns: ['likes', 'shares', 'saves'],
      contentPreferences: ['educational', 'motivational', 'practical']
    },
    language: 'en',
    size: 10000
  };

  const handlePredictViralScore = async () => {
    if (!content.trim()) {
      toast.error('Por favor ingresa contenido para analizar');
      return;
    }

    setIsPredicting(true);
    try {
      const platform = PLATFORMS[selectedPlatform];
      const score = await contentOptimizer.predictViralScore(content, platform);
      setViralScore(score);
      
      // Also get performance metrics
      const metrics = await contentOptimizer.forecastPerformance([content], '7d');
      setPerformanceMetrics(metrics[0]);
      
      toast.success('¡Análisis de potencial viral completado!');
    } catch (error) {
      console.error('Error predicting viral score:', error);
      toast.error('Error al analizar el contenido');
    } finally {
      setIsPredicting(false);
    }
  };

  const handleOptimizeContent = async () => {
    if (!content.trim()) {
      toast.error('Por favor ingresa contenido para optimizar');
      return;
    }

    setIsOptimizing(true);
    try {
      const result = await contentOptimizer.optimizeForEngagement(content, mockAudience);
      setOptimizedResult(result);
      onOptimized?.(result);
      toast.success('¡Contenido optimizado exitosamente!');
    } catch (error) {
      console.error('Error optimizing content:', error);
      toast.error('Error al optimizar el contenido');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      toast.success('Copiado al portapapeles');
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      toast.error('Error al copiar');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Motor de Optimización Predictiva
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Contenido a Analizar</label>
            <Textarea
              placeholder="Pega aquí tu contenido para analizar y optimizar..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="resize-none"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium">Plataforma Objetivo</label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PLATFORMS).map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        {platform.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handlePredictViralScore}
              disabled={isPredicting || !content.trim()}
              className="flex-1"
            >
              {isPredicting ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <BarChart3 className="h-4 w-4 mr-2" />
              )}
              Analizar Potencial Viral
            </Button>
            
            <Button 
              onClick={handleOptimizeContent}
              disabled={isOptimizing || !content.trim()}
              variant="outline"
              className="flex-1"
            >
              {isOptimizing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              Optimizar Contenido
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {(viralScore || optimizedResult) && (
        <Tabs defaultValue="analysis" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">Análisis Viral</TabsTrigger>
            <TabsTrigger value="optimization">Optimización</TabsTrigger>
            <TabsTrigger value="metrics">Métricas</TabsTrigger>
          </TabsList>

          {/* Viral Analysis Tab */}
          <TabsContent value="analysis" className="space-y-4">
            {viralScore && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Puntuación de Potencial Viral
                    </span>
                    <Badge variant={getScoreBadgeVariant(viralScore.overall)} className="text-lg px-3 py-1">
                      {viralScore.overall}/100
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className={cn('text-4xl font-bold', getScoreColor(viralScore.overall))}>
                      {viralScore.overall}%
                    </div>
                    <p className="text-muted-foreground">Potencial de Viralización</p>
                    <Progress value={viralScore.overall} className="mt-2" />
                  </div>

                  {/* Factor Breakdown */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Fuerza del Hook</span>
                        <span className={cn('font-medium', getScoreColor(viralScore.factors.hook_strength))}>
                          {viralScore.factors.hook_strength}%
                        </span>
                      </div>
                      <Progress value={viralScore.factors.hook_strength} />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Impacto Emocional</span>
                        <span className={cn('font-medium', getScoreColor(viralScore.factors.emotional_impact))}>
                          {viralScore.factors.emotional_impact}%
                        </span>
                      </div>
                      <Progress value={viralScore.factors.emotional_impact} />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Compartibilidad</span>
                        <span className={cn('font-medium', getScoreColor(viralScore.factors.shareability))}>
                          {viralScore.factors.shareability}%
                        </span>
                      </div>
                      <Progress value={viralScore.factors.shareability} />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Alineación con Tendencias</span>
                        <span className={cn('font-medium', getScoreColor(viralScore.factors.trend_alignment))}>
                          {viralScore.factors.trend_alignment}%
                        </span>
                      </div>
                      <Progress value={viralScore.factors.trend_alignment} />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Timing</span>
                        <span className={cn('font-medium', getScoreColor(viralScore.factors.timing_score))}>
                          {viralScore.factors.timing_score}%
                        </span>
                      </div>
                      <Progress value={viralScore.factors.timing_score} />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Ajuste a Plataforma</span>
                        <span className={cn('font-medium', getScoreColor(viralScore.factors.platform_fit))}>
                          {viralScore.factors.platform_fit}%
                        </span>
                      </div>
                      <Progress value={viralScore.factors.platform_fit} />
                    </div>
                  </div>

                  {/* Recommendations */}
                  {viralScore.recommendations.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Recomendaciones de Mejora
                      </h4>
                      <ul className="space-y-1">
                        {viralScore.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-blue-500 mt-1">•</span>
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization" className="space-y-4">
            {optimizedResult && (
              <div className="space-y-4">
                {/* Improvements Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      Mejoras Aplicadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {optimizedResult.improvements.map((improvement, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="flex-shrink-0">
                            <Badge variant="outline">+{improvement.impact}%</Badge>
                          </div>
                          <div>
                            <div className="font-medium capitalize">{improvement.type}</div>
                            <div className="text-sm text-muted-foreground">{improvement.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Before/After Comparison */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Contenido Original</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <pre className="whitespace-pre-wrap text-sm bg-muted/30 p-4 rounded-lg">
                          {optimizedResult.original}
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() => handleCopy(optimizedResult.original, 'original')}
                        >
                          {copiedStates.original ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm flex items-center gap-2">
                        Contenido Optimizado
                        <Badge variant="default">
                          +{Math.round(((optimizedResult.viralScore.overall - (viralScore?.overall || 0)) / (viralScore?.overall || 1)) * 100)}%
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <pre className="whitespace-pre-wrap text-sm bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                          {optimizedResult.optimized}
                        </pre>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2"
                          onClick={() => handleCopy(optimizedResult.optimized, 'optimized')}
                        >
                          {copiedStates.optimized ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Metrics Tab */}
          <TabsContent value="metrics" className="space-y-4">
            {performanceMetrics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-blue-500" />
                      <div>
                        <div className="text-2xl font-bold">{performanceMetrics.predictedViews.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Visualizaciones Predichas</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-red-500" />
                      <div>
                        <div className="text-2xl font-bold">{performanceMetrics.predictedLikes.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Likes Predichos</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Share className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="text-2xl font-bold">{performanceMetrics.predictedShares.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Compartidas Predichas</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-purple-500" />
                      <div>
                        <div className="text-2xl font-bold">{performanceMetrics.predictedComments.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">Comentarios Predichos</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <BarChart3 className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">Tasa de Engagement</span>
                    </div>
                    <div className="text-2xl font-bold">{performanceMetrics.engagementRate.toFixed(2)}%</div>
                    <Progress value={performanceMetrics.engagementRate} className="mt-2" />
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-indigo-500" />
                      <span className="font-medium">Mejor Momento para Publicar</span>
                    </div>
                    <div className="text-lg font-medium">
                      {performanceMetrics.bestPostingTime.toLocaleString('es-ES', {
                        weekday: 'long',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ContentOptimizer;
