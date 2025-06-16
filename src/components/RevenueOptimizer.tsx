import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  TrendingUp, DollarSign, Target, Zap, ArrowUp, ArrowDown, 
  BarChart3, PieChart, Calendar, Clock, Users, Star,
  Lightbulb, CheckCircle, AlertTriangle, Info
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart as RechartsPieChart, Cell, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  creatorMarketplace,
  type MonetizationStrategy
} from '@/lib/creatorMarketplace';

const RevenueOptimizer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [monetizationStrategies, setMonetizationStrategies] = useState<MonetizationStrategy[]>([]);
  const [selectedContent, setSelectedContent] = useState('all');
  const [loading, setLoading] = useState(false);

  // Mock content data
  const mockContent = [
    { id: '1', title: 'Rutina de Wellness Matutina', type: 'video', platform: 'youtube', views: 45000, engagement: 7.2 },
    { id: '2', title: 'Review Tech Gadgets 2024', type: 'post', platform: 'instagram', views: 32000, engagement: 8.5 },
    { id: '3', title: 'Recetas Saludables Rápidas', type: 'reel', platform: 'tiktok', views: 89000, engagement: 12.3 },
    { id: '4', title: 'Tips de Productividad', type: 'story', platform: 'instagram', views: 15000, engagement: 6.8 }
  ];

  // Revenue trend data
  const revenueData = [
    { month: 'Ene', actual: 2400, projected: 2800, optimized: 3200 },
    { month: 'Feb', actual: 2800, projected: 3200, optimized: 3800 },
    { month: 'Mar', actual: 3200, projected: 3600, optimized: 4200 },
    { month: 'Abr', actual: 3600, projected: 4000, optimized: 4800 },
    { month: 'May', actual: 4000, projected: 4400, optimized: 5200 },
    { month: 'Jun', actual: 4400, projected: 4800, optimized: 5600 }
  ];

  // Platform revenue distribution
  const platformData = [
    { name: 'Instagram', value: 45, color: '#E1306C' },
    { name: 'TikTok', value: 30, color: '#000000' },
    { name: 'YouTube', value: 20, color: '#FF0000' },
    { name: 'LinkedIn', value: 5, color: '#0077B5' }
  ];

  useEffect(() => {
    loadMonetizationData();
  }, []);

  const loadMonetizationData = async () => {
    setLoading(true);
    try {
      const strategies = await creatorMarketplace.optimizeMonetization(mockContent);
      setMonetizationStrategies(strategies);
    } catch (error) {
      toast.error('Error al cargar estrategias de monetización');
    } finally {
      setLoading(false);
    }
  };

  const totalRevenuePotential = monetizationStrategies.reduce(
    (sum, strategy) => sum + strategy.revenue_potential, 0
  );

  const averageImpact = monetizationStrategies.reduce(
    (sum, strategy) => sum + strategy.optimization_suggestions.reduce(
      (suggSum, sugg) => suggSum + sugg.impact, 0
    ), 0
  ) / Math.max(monetizationStrategies.length, 1);

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEffortIcon = (effort: string) => {
    switch (effort) {
      case 'low': return <CheckCircle className="w-4 h-4" />;
      case 'medium': return <AlertTriangle className="w-4 h-4" />;
      case 'high': return <Info className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Revenue Optimizer</h1>
            <p className="text-muted-foreground">
              Maximiza tus ingresos con estrategias de monetización inteligentes
            </p>
          </div>
          <Button onClick={loadMonetizationData} disabled={loading}>
            <Zap className="w-4 h-4 mr-2" />
            {loading ? 'Analizando...' : 'Optimizar Ahora'}
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Potencial de Ingresos</p>
                  <p className="text-2xl font-bold">${totalRevenuePotential.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Mejora Promedio</p>
                  <p className="text-2xl font-bold">+{Math.round(averageImpact)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Contenidos Analizados</p>
                  <p className="text-2xl font-bold">{mockContent.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Optimizaciones</p>
                  <p className="text-2xl font-bold">
                    {monetizationStrategies.reduce((sum, s) => sum + s.optimization_suggestions.length, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="strategies">Estrategias</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Projection */}
            <Card>
              <CardHeader>
                <CardTitle>Proyección de Ingresos</CardTitle>
                <CardDescription>Comparación entre ingresos actuales, proyectados y optimizados</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, '']} />
                    <Legend />
                    <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual" />
                    <Line type="monotone" dataKey="projected" stroke="#82ca9d" name="Proyectado" />
                    <Line type="monotone" dataKey="optimized" stroke="#ffc658" name="Optimizado" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Platform Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Plataforma</CardTitle>
                <CardDescription>Porcentaje de ingresos por plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Quick Wins */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <span>Quick Wins - Implementación Inmediata</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {monetizationStrategies.slice(0, 2).map((strategy) => (
                  strategy.optimization_suggestions
                    .filter(sugg => sugg.effort === 'low')
                    .slice(0, 2)
                    .map((suggestion, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{suggestion.type}</h4>
                          <Badge className="bg-green-100 text-green-800">
                            +{suggestion.impact}%
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {suggestion.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge className={getEffortColor(suggestion.effort)}>
                            {getEffortIcon(suggestion.effort)}
                            <span className="ml-1 capitalize">{suggestion.effort}</span>
                          </Badge>
                          <Button size="sm">Implementar</Button>
                        </div>
                      </div>
                    ))
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Strategies Tab */}
        <TabsContent value="strategies" className="space-y-6">
          <div className="flex items-center space-x-4 mb-6">
            <Select value={selectedContent} onValueChange={setSelectedContent}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar contenido" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo el contenido</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="post">Posts</SelectItem>
                <SelectItem value="reel">Reels</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-6">
            {monetizationStrategies.map((strategy, index) => (
              <Card key={strategy.content_id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Contenido #{index + 1}</CardTitle>
                      <CardDescription>
                        Potencial de ingresos: ${strategy.revenue_potential.toLocaleString()}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                      ${strategy.revenue_potential.toLocaleString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Optimization Suggestions */}
                  <div>
                    <h4 className="font-medium mb-3">Sugerencias de Optimización</h4>
                    <div className="space-y-3">
                      {strategy.optimization_suggestions.map((suggestion, suggIndex) => (
                        <div key={suggIndex} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{suggestion.type}</span>
                            <div className="flex items-center space-x-2">
                              <Badge className="bg-blue-100 text-blue-800">
                                +{suggestion.impact}%
                              </Badge>
                              <Badge className={getEffortColor(suggestion.effort)}>
                                {suggestion.effort}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {suggestion.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommended Platforms */}
                  <div>
                    <h4 className="font-medium mb-3">Plataformas Recomendadas</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {strategy.recommended_platforms.map((platform, platIndex) => (
                        <div key={platIndex} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium capitalize">{platform.platform}</span>
                            <span className="text-green-600 font-bold">
                              ${platform.revenue_potential.toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {platform.reasoning}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Audiencia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monetizationStrategies.slice(0, 1).map((strategy) => (
                    <div key={strategy.content_id} className="space-y-3">
                      <div className="flex justify-between">
                        <span>CPM Promedio</span>
                        <span className="font-bold">${strategy.audience_value.cpm}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valor de Engagement</span>
                        <span className="font-bold">{strategy.audience_value.engagement_value}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Potencial de Conversión</span>
                        <span className="font-bold">{strategy.audience_value.conversion_potential}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Rendimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Contenido Optimizado</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={75} className="w-20" />
                      <span className="font-bold">75%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ROI Promedio</span>
                    <div className="flex items-center space-x-2">
                      <ArrowUp className="w-4 h-4 text-green-600" />
                      <span className="font-bold text-green-600">+245%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Tiempo de Implementación</span>
                    <span className="font-bold">2-5 días</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {monetizationStrategies.slice(0, 2).map((strategy, index) => (
              <Card key={strategy.content_id}>
                <CardHeader>
                  <CardTitle>Recomendaciones de Precio - Contenido #{index + 1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Post Patrocinado</span>
                      <span className="font-bold">${strategy.pricing_recommendations.sponsored_post}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mención en Story</span>
                      <span className="font-bold">${strategy.pricing_recommendations.story_mention}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Integración en Video</span>
                      <span className="font-bold">${strategy.pricing_recommendations.video_integration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Partnership a Largo Plazo</span>
                      <span className="font-bold">${strategy.pricing_recommendations.long_term_partnership}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RevenueOptimizer;
