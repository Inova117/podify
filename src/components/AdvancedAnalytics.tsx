import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  Share,
  MessageCircle,
  DollarSign,
  Users,
  Clock,
  Target,
  Zap,
  Globe,
  Calendar,
  Download,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { format, subDays, subWeeks, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';

interface AnalyticsMetric {
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  icon: React.ReactNode;
  color: string;
  format: 'number' | 'percentage' | 'currency' | 'time';
}

interface ContentPerformance {
  id: string;
  title: string;
  platform: string;
  publishedAt: Date;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  engagementRate: number;
  viralScore: number;
  revenue: number;
}

interface PlatformMetrics {
  platform: string;
  followers: number;
  engagement: number;
  reach: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

interface AdvancedAnalyticsProps {
  className?: string;
}

export const AdvancedAnalytics: React.FC<AdvancedAnalyticsProps> = ({
  className
}) => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<string>('engagement');
  const [isLoading, setIsLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Mock analytics data
  const mockMetrics: AnalyticsMetric[] = [
    {
      name: 'Visualizaciones Totales',
      value: 2847293,
      change: 23.5,
      changeType: 'increase',
      icon: <Eye className="h-4 w-4" />,
      color: 'text-blue-600',
      format: 'number'
    },
    {
      name: 'Tasa de Engagement',
      value: 8.7,
      change: 12.3,
      changeType: 'increase',
      icon: <Heart className="h-4 w-4" />,
      color: 'text-red-600',
      format: 'percentage'
    },
    {
      name: 'Ingresos Generados',
      value: 15420,
      change: 34.2,
      changeType: 'increase',
      icon: <DollarSign className="h-4 w-4" />,
      color: 'text-green-600',
      format: 'currency'
    },
    {
      name: 'Nuevos Seguidores',
      value: 12847,
      change: -5.2,
      changeType: 'decrease',
      icon: <Users className="h-4 w-4" />,
      color: 'text-purple-600',
      format: 'number'
    },
    {
      name: 'Tiempo Promedio de Visualización',
      value: 45.3,
      change: 8.1,
      changeType: 'increase',
      icon: <Clock className="h-4 w-4" />,
      color: 'text-orange-600',
      format: 'time'
    },
    {
      name: 'Tasa de Conversión',
      value: 3.2,
      change: 0.0,
      changeType: 'neutral',
      icon: <Target className="h-4 w-4" />,
      color: 'text-indigo-600',
      format: 'percentage'
    }
  ];

  const mockEngagementData = [
    { date: '2024-01-01', views: 12000, likes: 850, shares: 120, comments: 45 },
    { date: '2024-01-02', views: 15000, likes: 1200, shares: 180, comments: 67 },
    { date: '2024-01-03', views: 18000, likes: 1450, shares: 220, comments: 89 },
    { date: '2024-01-04', views: 22000, likes: 1800, shares: 290, comments: 112 },
    { date: '2024-01-05', views: 28000, likes: 2200, shares: 350, comments: 145 },
    { date: '2024-01-06', views: 25000, likes: 1950, shares: 310, comments: 128 },
    { date: '2024-01-07', views: 30000, likes: 2400, shares: 380, comments: 167 }
  ];

  const mockPlatformData: PlatformMetrics[] = [
    {
      platform: 'Instagram',
      followers: 125000,
      engagement: 8.5,
      reach: 450000,
      impressions: 1200000,
      clicks: 15000,
      conversions: 480
    },
    {
      platform: 'TikTok',
      followers: 89000,
      engagement: 12.3,
      reach: 380000,
      impressions: 950000,
      clicks: 12000,
      conversions: 360
    },
    {
      platform: 'YouTube',
      followers: 67000,
      engagement: 6.8,
      reach: 280000,
      impressions: 720000,
      clicks: 8500,
      conversions: 290
    },
    {
      platform: 'LinkedIn',
      followers: 34000,
      engagement: 4.2,
      reach: 120000,
      impressions: 280000,
      clicks: 4200,
      conversions: 180
    }
  ];

  const mockTopContent: ContentPerformance[] = [
    {
      id: '1',
      title: '5 Secretos para Emprender con Éxito',
      platform: 'Instagram',
      publishedAt: subDays(new Date(), 2),
      views: 125000,
      likes: 8500,
      shares: 1200,
      comments: 450,
      engagementRate: 8.1,
      viralScore: 92,
      revenue: 2400
    },
    {
      id: '2',
      title: 'Cómo Generar Ingresos Pasivos en 2024',
      platform: 'TikTok',
      publishedAt: subDays(new Date(), 5),
      views: 89000,
      likes: 12000,
      shares: 890,
      comments: 320,
      engagementRate: 14.9,
      viralScore: 88,
      revenue: 1800
    },
    {
      id: '3',
      title: 'Mindset Millonario: Cambia tu Mentalidad',
      platform: 'YouTube',
      publishedAt: subDays(new Date(), 7),
      views: 67000,
      likes: 4200,
      shares: 650,
      comments: 280,
      engagementRate: 7.4,
      viralScore: 85,
      revenue: 3200
    }
  ];

  const mockRevenueData = [
    { month: 'Ene', revenue: 8500, costs: 2100, profit: 6400 },
    { month: 'Feb', revenue: 12000, costs: 2800, profit: 9200 },
    { month: 'Mar', revenue: 15400, costs: 3200, profit: 12200 },
    { month: 'Abr', revenue: 18900, costs: 3800, profit: 15100 },
    { month: 'May', revenue: 22300, costs: 4200, profit: 18100 },
    { month: 'Jun', revenue: 26800, costs: 4800, profit: 22000 }
  ];

  const audienceData = [
    { name: '18-24', value: 15, color: '#8884d8' },
    { name: '25-34', value: 35, color: '#82ca9d' },
    { name: '35-44', value: 28, color: '#ffc658' },
    { name: '45-54', value: 15, color: '#ff7300' },
    { name: '55+', value: 7, color: '#00ff88' }
  ];

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalyticsData({
        metrics: mockMetrics,
        engagement: mockEngagementData,
        platforms: mockPlatformData,
        topContent: mockTopContent,
        revenue: mockRevenueData,
        audience: audienceData
      });
    } catch (error) {
      toast.error('Error al cargar datos de analytics');
    } finally {
      setIsLoading(false);
    }
  };

  const formatValue = (value: number, format: string) => {
    switch (format) {
      case 'number':
        return value.toLocaleString();
      case 'percentage':
        return `${value}%`;
      case 'currency':
        return `$${value.toLocaleString()}`;
      case 'time':
        return `${value}s`;
      default:
        return value.toString();
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <ArrowUp className="h-3 w-3 text-green-600" />;
      case 'decrease':
        return <ArrowDown className="h-3 w-3 text-red-600" />;
      default:
        return <Minus className="h-3 w-3 text-gray-600" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const exportData = () => {
    toast.success('Exportando datos de analytics...');
    // In production, this would generate and download a report
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando analytics...</span>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-500" />
            Analytics Avanzado
          </h2>
          <p className="text-muted-foreground">
            Insights predictivos y métricas de rendimiento en tiempo real
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
              <SelectItem value="1y">Último año</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          
          <Button variant="outline" onClick={loadAnalyticsData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn('p-2 rounded-lg bg-muted', metric.color)}>
                    {metric.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {formatValue(metric.value, metric.format)}
                    </div>
                    <div className="text-sm text-muted-foreground">{metric.name}</div>
                  </div>
                </div>
                
                <div className={cn('flex items-center gap-1 text-sm', getChangeColor(metric.changeType))}>
                  {getChangeIcon(metric.changeType)}
                  {Math.abs(metric.change)}%
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Analytics */}
      <Tabs defaultValue="engagement" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="platforms">Plataformas</TabsTrigger>
          <TabsTrigger value="content">Contenido Top</TabsTrigger>
          <TabsTrigger value="revenue">Ingresos</TabsTrigger>
          <TabsTrigger value="audience">Audiencia</TabsTrigger>
        </TabsList>

        {/* Engagement Tab */}
        <TabsContent value="engagement" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencias de Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={mockEngagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="views" stroke="#8884d8" name="Visualizaciones" />
                  <Line type="monotone" dataKey="likes" stroke="#82ca9d" name="Likes" />
                  <Line type="monotone" dataKey="shares" stroke="#ffc658" name="Compartidas" />
                  <Line type="monotone" dataKey="comments" stroke="#ff7300" name="Comentarios" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Platforms Tab */}
        <TabsContent value="platforms" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockPlatformData.map((platform, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    {platform.platform}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-bold">{platform.followers.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Seguidores</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{platform.engagement}%</div>
                      <div className="text-sm text-muted-foreground">Engagement</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Alcance</span>
                      <span>{platform.reach.toLocaleString()}</span>
                    </div>
                    <Progress value={(platform.reach / 500000) * 100} />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Conversiones</span>
                      <span>{platform.conversions}</span>
                    </div>
                    <Progress value={(platform.conversions / 500) * 100} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Top Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contenido con Mejor Rendimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTopContent.map((content, index) => (
                  <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-muted-foreground">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{content.title}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Badge variant="outline">{content.platform}</Badge>
                          <span>{format(content.publishedAt, 'PPP', { locale: es })}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-bold">{content.views.toLocaleString()}</div>
                        <div className="text-muted-foreground">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">{content.engagementRate}%</div>
                        <div className="text-muted-foreground">Engagement</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold">${content.revenue}</div>
                        <div className="text-muted-foreground">Ingresos</div>
                      </div>
                      <Badge 
                        variant={content.viralScore >= 90 ? 'default' : 'secondary'}
                        className="ml-2"
                      >
                        {content.viralScore} viral
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Ingresos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={mockRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#8884d8" name="Ingresos" />
                  <Bar dataKey="costs" fill="#82ca9d" name="Costos" />
                  <Bar dataKey="profit" fill="#ffc658" name="Ganancia" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Edad</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={audienceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {audienceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Insights de Audiencia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Género Masculino</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Género Femenino</span>
                    <span>55%</span>
                  </div>
                  <Progress value={55} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Ubicación Principal</span>
                    <span>México (35%)</span>
                  </div>
                  <Progress value={35} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Horario Más Activo</span>
                    <span>19:00 - 21:00</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Día Más Activo</span>
                    <span>Miércoles</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedAnalytics;
