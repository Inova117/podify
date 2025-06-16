import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar as CalendarIcon,
  Clock,
  Zap,
  TrendingUp,
  Globe,
  Users,
  BarChart3,
  Settings,
  Play,
  Pause,
  SkipForward,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addDays, addHours, isAfter, isBefore } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

interface ScheduledPost {
  id: string;
  content: string;
  platform: string;
  scheduledTime: Date;
  status: 'scheduled' | 'published' | 'failed' | 'cancelled';
  optimizationScore: number;
  estimatedReach: number;
  estimatedEngagement: number;
}

interface OptimalTime {
  hour: number;
  minute: number;
  day: string;
  score: number;
  reason: string;
}

interface PlatformSchedule {
  platform: string;
  optimalTimes: OptimalTime[];
  timezone: string;
  audienceActive: boolean;
}

interface SmartSchedulerProps {
  content?: string;
  onScheduled?: (schedule: ScheduledPost) => void;
  className?: string;
}

export const SmartScheduler: React.FC<SmartSchedulerProps> = ({
  content = '',
  onScheduled,
  className
}) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [schedulingMode, setSchedulingMode] = useState<'optimal' | 'custom'>('optimal');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('09:00');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [optimalTimes, setOptimalTimes] = useState<PlatformSchedule[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [autoOptimize, setAutoOptimize] = useState(true);
  const [crossPlatformSync, setCrossPlatformSync] = useState(false);

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-pink-500' },
    { id: 'tiktok', name: 'TikTok', icon: '🎵', color: 'bg-black' },
    { id: 'twitter', name: 'Twitter/X', icon: '🐦', color: 'bg-blue-500' },
    { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'bg-blue-700' },
    { id: 'youtube', name: 'YouTube', icon: '📺', color: 'bg-red-500' },
    { id: 'facebook', name: 'Facebook', icon: '👥', color: 'bg-blue-600' }
  ];

  // Mock optimal times data (in production, this would come from analytics)
  const mockOptimalTimes: PlatformSchedule[] = [
    {
      platform: 'instagram',
      timezone: 'America/Mexico_City',
      audienceActive: true,
      optimalTimes: [
        { hour: 9, minute: 0, day: 'weekday', score: 95, reason: 'Pico de engagement matutino' },
        { hour: 15, minute: 30, day: 'weekday', score: 88, reason: 'Pausa de tarde activa' },
        { hour: 19, minute: 0, day: 'weekday', score: 92, reason: 'Horario post-trabajo' },
        { hour: 11, minute: 0, day: 'weekend', score: 85, reason: 'Navegación casual de fin de semana' }
      ]
    },
    {
      platform: 'tiktok',
      timezone: 'America/Mexico_City',
      audienceActive: true,
      optimalTimes: [
        { hour: 6, minute: 0, day: 'weekday', score: 90, reason: 'Consumo matutino temprano' },
        { hour: 12, minute: 0, day: 'weekday', score: 85, reason: 'Pausa de almuerzo' },
        { hour: 20, minute: 0, day: 'weekday', score: 95, reason: 'Prime time nocturno' },
        { hour: 14, minute: 0, day: 'weekend', score: 88, reason: 'Tarde de fin de semana' }
      ]
    },
    {
      platform: 'linkedin',
      timezone: 'America/Mexico_City',
      audienceActive: true,
      optimalTimes: [
        { hour: 8, minute: 0, day: 'weekday', score: 92, reason: 'Inicio de jornada laboral' },
        { hour: 12, minute: 30, day: 'weekday', score: 88, reason: 'Pausa de almuerzo profesional' },
        { hour: 17, minute: 0, day: 'weekday', score: 85, reason: 'Final de jornada laboral' }
      ]
    }
  ];

  useEffect(() => {
    if (selectedPlatforms.length > 0) {
      analyzeOptimalTimes();
    }
  }, [selectedPlatforms]);

  const analyzeOptimalTimes = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const filteredTimes = mockOptimalTimes.filter(schedule => 
        selectedPlatforms.includes(schedule.platform)
      );
      
      setOptimalTimes(filteredTimes);
      toast.success('Análisis de horarios óptimos completado');
    } catch (error) {
      toast.error('Error al analizar horarios óptimos');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSchedulePost = async () => {
    if (!content.trim()) {
      toast.error('Por favor ingresa contenido para programar');
      return;
    }

    setIsScheduling(true);
    try {
      const scheduledTime = schedulingMode === 'optimal' 
        ? getNextOptimalTime()
        : new Date(`${format(selectedDate, 'yyyy-MM-dd')} ${selectedTime}`);

      const newScheduledPosts = selectedPlatforms.map(platform => ({
        id: `${platform}-${Date.now()}`,
        content,
        platform,
        scheduledTime: crossPlatformSync 
          ? scheduledTime 
          : addHours(scheduledTime, Math.random() * 2), // Slight variation if not synced
        status: 'scheduled' as const,
        optimizationScore: Math.floor(Math.random() * 30) + 70, // 70-100
        estimatedReach: Math.floor(Math.random() * 5000) + 1000,
        estimatedEngagement: Math.floor(Math.random() * 500) + 100
      }));

      setScheduledPosts(prev => [...prev, ...newScheduledPosts]);
      
      newScheduledPosts.forEach(post => onScheduled?.(post));
      
      toast.success(`Contenido programado para ${selectedPlatforms.length} plataforma(s)`);
    } catch (error) {
      toast.error('Error al programar el contenido');
    } finally {
      setIsScheduling(false);
    }
  };

  const getNextOptimalTime = (): Date => {
    const now = new Date();
    const today = now.getDay();
    const isWeekend = today === 0 || today === 6;
    
    // Get optimal times for the first selected platform
    const platformSchedule = optimalTimes.find(schedule => 
      schedule.platform === selectedPlatforms[0]
    );
    
    if (!platformSchedule) return addHours(now, 1);
    
    const relevantTimes = platformSchedule.optimalTimes.filter(time => 
      time.day === (isWeekend ? 'weekend' : 'weekday')
    );
    
    // Find next optimal time
    for (const time of relevantTimes) {
      const optimalDateTime = new Date();
      optimalDateTime.setHours(time.hour, time.minute, 0, 0);
      
      if (isAfter(optimalDateTime, now)) {
        return optimalDateTime;
      }
    }
    
    // If no optimal time today, use tomorrow's first optimal time
    const tomorrowOptimal = new Date();
    tomorrowOptimal.setDate(tomorrowOptimal.getDate() + 1);
    tomorrowOptimal.setHours(relevantTimes[0]?.hour || 9, relevantTimes[0]?.minute || 0, 0, 0);
    
    return tomorrowOptimal;
  };

  const handleCancelScheduled = (postId: string) => {
    setScheduledPosts(prev => 
      prev.map(post => 
        post.id === postId 
          ? { ...post, status: 'cancelled' as const }
          : post
      )
    );
    toast.success('Publicación cancelada');
  };

  const getStatusIcon = (status: ScheduledPost['status']) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'cancelled':
        return <Pause className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: ScheduledPost['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Configuration Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-500" />
            Programación Inteligente de Contenido
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Platform Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Plataformas de Destino</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {platforms.map((platform) => (
                <div
                  key={platform.id}
                  className={cn(
                    'flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors',
                    selectedPlatforms.includes(platform.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-muted/50'
                  )}
                  onClick={() => {
                    setSelectedPlatforms(prev =>
                      prev.includes(platform.id)
                        ? prev.filter(p => p !== platform.id)
                        : [...prev, platform.id]
                    );
                  }}
                >
                  <span className="text-lg">{platform.icon}</span>
                  <span className="text-sm font-medium">{platform.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduling Mode */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Modo de Programación</label>
            <div className="flex gap-4">
              <div
                className={cn(
                  'flex-1 p-4 rounded-lg border cursor-pointer transition-colors',
                  schedulingMode === 'optimal'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/50'
                )}
                onClick={() => setSchedulingMode('optimal')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">Horario Óptimo (IA)</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  La IA selecciona el mejor momento basado en el engagement de tu audiencia
                </p>
              </div>

              <div
                className={cn(
                  'flex-1 p-4 rounded-lg border cursor-pointer transition-colors',
                  schedulingMode === 'custom'
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-muted/50'
                )}
                onClick={() => setSchedulingMode('custom')}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span className="font-medium">Horario Personalizado</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Selecciona manualmente la fecha y hora de publicación
                </p>
              </div>
            </div>
          </div>

          {/* Custom Scheduling */}
          {schedulingMode === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(selectedDate, 'PPP', { locale: es })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      disabled={(date) => isBefore(date, new Date())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Hora</label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return (
                        <SelectItem key={hour} value={`${hour}:00`}>
                          {hour}:00
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Advanced Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Optimización Automática</div>
                <div className="text-sm text-muted-foreground">
                  Optimizar contenido automáticamente antes de publicar
                </div>
              </div>
              <Switch checked={autoOptimize} onCheckedChange={setAutoOptimize} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Sincronización Cross-Platform</div>
                <div className="text-sm text-muted-foreground">
                  Publicar en todas las plataformas al mismo tiempo
                </div>
              </div>
              <Switch checked={crossPlatformSync} onCheckedChange={setCrossPlatformSync} />
            </div>
          </div>

          {/* Schedule Button */}
          <Button 
            onClick={handleSchedulePost}
            disabled={isScheduling || !content.trim() || selectedPlatforms.length === 0}
            className="w-full"
            size="lg"
          >
            {isScheduling ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            Programar Publicación
          </Button>
        </CardContent>
      </Card>

      {/* Optimal Times Analysis */}
      {optimalTimes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              Análisis de Horarios Óptimos
              {isAnalyzing && <RefreshCw className="h-4 w-4 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={optimalTimes[0]?.platform} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {optimalTimes.slice(0, 3).map((schedule) => (
                  <TabsTrigger key={schedule.platform} value={schedule.platform}>
                    {platforms.find(p => p.id === schedule.platform)?.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {optimalTimes.map((schedule) => (
                <TabsContent key={schedule.platform} value={schedule.platform} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {schedule.optimalTimes.map((time, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">
                              {time.hour.toString().padStart(2, '0')}:{time.minute.toString().padStart(2, '0')}
                            </span>
                          </div>
                          <Badge variant={time.score >= 90 ? 'default' : 'secondary'}>
                            {time.score}% óptimo
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {time.day === 'weekday' ? 'Días laborales' : 'Fines de semana'}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {time.reason}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Scheduled Posts */}
      {scheduledPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-purple-500" />
              Publicaciones Programadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scheduledPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(post.status)}
                    <div>
                      <div className="font-medium">
                        {platforms.find(p => p.id === post.platform)?.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {format(post.scheduledTime, 'PPP p', { locale: es })}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right text-sm">
                      <div>Alcance: {post.estimatedReach.toLocaleString()}</div>
                      <div className="text-muted-foreground">
                        Engagement: {post.estimatedEngagement.toLocaleString()}
                      </div>
                    </div>
                    
                    <Badge className={getStatusColor(post.status)}>
                      {post.status}
                    </Badge>

                    {post.status === 'scheduled' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCancelScheduled(post.id)}
                      >
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartScheduler;
