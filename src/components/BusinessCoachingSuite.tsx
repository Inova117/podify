import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  Target, Users, TrendingUp, BookOpen, CheckCircle, Clock, 
  DollarSign, Zap, Download, Mail, Phone, FileText,
  BarChart3, Award, Lightbulb, ArrowRight, Star, User
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import {
  businessCoachingSuite,
  type LeadMagnet,
  type SalesFunnel,
  type ClientProfile,
  type OnboardingSequence,
  type ClientROIMetrics,
  type CoachingContent
} from '@/lib/businessCoaching';

const BusinessCoachingSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [leadMagnets, setLeadMagnets] = useState<LeadMagnet[]>([]);
  const [salesFunnel, setSalesFunnel] = useState<SalesFunnel | null>(null);
  const [clientProfiles, setClientProfiles] = useState<ClientProfile[]>([]);
  const [roiMetrics, setRoiMetrics] = useState<ClientROIMetrics[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedExpertise, setSelectedExpertise] = useState('leadership');

  // Mock coaching content
  const mockCoachingContent: CoachingContent[] = [
    {
      original_content: 'Leadership principles and team management strategies for growing businesses...',
      content_type: 'podcast',
      expertise_areas: ['leadership', 'management', 'team building'],
      target_audience: 'Business owners and executives',
      business_applications: ['Team management', 'Strategic planning', 'Performance optimization']
    },
    {
      original_content: 'Sales techniques and customer relationship building for service businesses...',
      content_type: 'video',
      expertise_areas: ['sales', 'customer relations', 'business development'],
      target_audience: 'Sales professionals and entrepreneurs',
      business_applications: ['Revenue growth', 'Client acquisition', 'Relationship building']
    }
  ];

  // Sample data for charts
  const revenueGrowthData = [
    { month: 'Jan', before: 5000, after: 8000 },
    { month: 'Feb', before: 5200, after: 9500 },
    { month: 'Mar', before: 4800, after: 11000 },
    { month: 'Apr', before: 5500, after: 13500 },
    { month: 'May', before: 5800, after: 15000 },
    { month: 'Jun', before: 6000, after: 18000 }
  ];

  const funnelPerformanceData = [
    { stage: 'Awareness', visitors: 1000, conversions: 150 },
    { stage: 'Interest', visitors: 150, conversions: 45 },
    { stage: 'Consideration', visitors: 45, conversions: 18 },
    { stage: 'Decision', visitors: 18, conversions: 8 },
    { stage: 'Retention', visitors: 8, conversions: 7 }
  ];

  const expertiseAreas = [
    'leadership', 'sales', 'marketing', 'productivity', 'strategy', 
    'finance', 'operations', 'team building', 'communication'
  ];

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load lead magnets
      const magnets = await businessCoachingSuite.generateLeadMagnets(selectedExpertise, mockCoachingContent);
      setLeadMagnets(magnets);

      // Load sales funnel
      const funnel = await businessCoachingSuite.createSalesFunnels(mockCoachingContent);
      setSalesFunnel(funnel);

      // Generate mock client profiles
      const profiles = generateMockClientProfiles();
      setClientProfiles(profiles);

      // Load ROI metrics
      const metrics = await Promise.all(
        profiles.slice(0, 3).map(profile => 
          businessCoachingSuite.trackClientResults('coach_123', profile.id)
        )
      );
      setRoiMetrics(metrics);

    } catch (error) {
      toast.error('Error loading coaching suite data');
    } finally {
      setLoading(false);
    }
  };

  const generateMockClientProfiles = (): ClientProfile[] => {
    return [
      {
        id: 'client_1',
        name: 'Sarah Johnson',
        business_type: 'Consulting',
        industry: 'Business Strategy',
        experience_level: 'intermediate',
        goals: ['Increase revenue by 50%', 'Build stronger team', 'Improve processes'],
        challenges: ['Time management', 'Delegation', 'Client acquisition'],
        budget_range: [5000, 15000],
        preferred_communication: ['email', 'video calls']
      },
      {
        id: 'client_2',
        name: 'Mike Rodriguez',
        business_type: 'E-commerce',
        industry: 'Retail',
        experience_level: 'beginner',
        goals: ['Scale operations', 'Improve marketing', 'Build systems'],
        challenges: ['Inventory management', 'Customer service', 'Marketing ROI'],
        budget_range: [3000, 8000],
        preferred_communication: ['phone', 'email']
      },
      {
        id: 'client_3',
        name: 'Jennifer Chen',
        business_type: 'Professional Services',
        industry: 'Legal',
        experience_level: 'advanced',
        goals: ['Expand practice', 'Improve efficiency', 'Develop team'],
        challenges: ['Business development', 'Technology adoption', 'Work-life balance'],
        budget_range: [10000, 25000],
        preferred_communication: ['video calls', 'in-person']
      }
    ];
  };

  const handleExpertiseChange = async (expertise: string) => {
    setSelectedExpertise(expertise);
    setLoading(true);
    try {
      const magnets = await businessCoachingSuite.generateLeadMagnets(expertise, mockCoachingContent);
      setLeadMagnets(magnets);
      toast.success(`Updated lead magnets for ${expertise}`);
    } catch (error) {
      toast.error('Error updating lead magnets');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateOnboarding = async (clientId: string) => {
    const client = clientProfiles.find(c => c.id === clientId);
    if (!client) return;

    try {
      const onboarding = await businessCoachingSuite.automateOnboarding(client);
      toast.success(`Onboarding sequence generated for ${client.name}`);
      // Here you would typically save or display the onboarding sequence
    } catch (error) {
      toast.error('Error generating onboarding sequence');
    }
  };

  const totalLeadPotential = leadMagnets.reduce((sum, magnet) => sum + magnet.estimated_leads, 0);
  const averageConversionRate = leadMagnets.reduce((sum, magnet) => sum + magnet.conversion_rate, 0) / leadMagnets.length;
  const totalROIValue = roiMetrics.reduce((sum, metric) => sum + metric.metrics.revenue_increase, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Business Coaching Suite</h1>
            <p className="text-muted-foreground">
              Especialización vertical para coaches de negocio con herramientas de IA
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={selectedExpertise} onValueChange={handleExpertiseChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Área de expertise" />
              </SelectTrigger>
              <SelectContent>
                {expertiseAreas.map(area => (
                  <SelectItem key={area} value={area}>
                    {area.charAt(0).toUpperCase() + area.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={loadInitialData} disabled={loading}>
              <Zap className="w-4 h-4 mr-2" />
              {loading ? 'Generando...' : 'Regenerar'}
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Potencial de Leads</p>
                  <p className="text-2xl font-bold">{totalLeadPotential.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Conversión Promedio</p>
                  <p className="text-2xl font-bold">{averageConversionRate.toFixed(1)}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">ROI Total Clientes</p>
                  <p className="text-2xl font-bold">${totalROIValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Clientes Activos</p>
                  <p className="text-2xl font-bold">{clientProfiles.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="lead-magnets">Lead Magnets</TabsTrigger>
          <TabsTrigger value="sales-funnel">Sales Funnel</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="roi-tracking">ROI Tracking</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Growth Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Crecimiento de Ingresos de Clientes</CardTitle>
                <CardDescription>Antes vs Después del Coaching</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueGrowthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, '']} />
                    <Legend />
                    <Line type="monotone" dataKey="before" stroke="#8884d8" name="Antes" />
                    <Line type="monotone" dataKey="after" stroke="#82ca9d" name="Después" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Funnel Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento del Funnel</CardTitle>
                <CardDescription>Conversiones por etapa</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={funnelPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="visitors" fill="#8884d8" name="Visitantes" />
                    <Bar dataKey="conversions" fill="#82ca9d" name="Conversiones" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <span>Acciones Rápidas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 flex-col space-y-2">
                  <Download className="w-6 h-6" />
                  <span>Generar Lead Magnet</span>
                </Button>
                <Button className="h-20 flex-col space-y-2" variant="outline">
                  <Mail className="w-6 h-6" />
                  <span>Crear Email Sequence</span>
                </Button>
                <Button className="h-20 flex-col space-y-2" variant="outline">
                  <Users className="w-6 h-6" />
                  <span>Configurar Onboarding</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Lead Magnets Tab */}
        <TabsContent value="lead-magnets" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {leadMagnets.map((magnet) => (
              <Card key={magnet.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="capitalize">
                      {magnet.type}
                    </Badge>
                    <Badge className="bg-green-100 text-green-800">
                      {magnet.conversion_rate}% conversión
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{magnet.title}</CardTitle>
                  <CardDescription>{magnet.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Leads estimados:</span>
                      <p className="font-bold">{magnet.estimated_leads}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Área:</span>
                      <p className="font-bold capitalize">{magnet.expertise_area}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Generar
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Sequence
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Sales Funnel Tab */}
        <TabsContent value="sales-funnel" className="space-y-6">
          {salesFunnel && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{salesFunnel.name}</CardTitle>
                  <CardDescription>
                    Ingresos estimados: ${salesFunnel.estimated_revenue.toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salesFunnel.stages.map((stage, index) => (
                      <div key={stage.stage_name} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold flex items-center space-x-2">
                            <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm">
                              {index + 1}
                            </span>
                            <span>{stage.stage_name}</span>
                          </h3>
                          <Badge variant="outline">
                            {salesFunnel.conversion_rates[stage.stage_name]}% conversión
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Contenido:</span>
                            <p>{stage.content_pieces.join(', ')}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Puntos de contacto:</span>
                            <p>{stage.touchpoints.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Reglas de Automatización</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {salesFunnel.automation_rules.map((rule, index) => (
                      <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                        <div className="flex-1">
                          <span className="font-medium">Cuando:</span> {rule.trigger}
                          <br />
                          <span className="font-medium">Si:</span> {rule.condition}
                          <br />
                          <span className="font-medium">Entonces:</span> {rule.action}
                          {rule.delay_hours && (
                            <>
                              <br />
                              <span className="font-medium">Esperar:</span> {rule.delay_hours} horas
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Clients Tab */}
        <TabsContent value="clients" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {clientProfiles.map((client) => (
              <Card key={client.id}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>{client.name}</span>
                  </CardTitle>
                  <CardDescription>
                    {client.business_type} - {client.industry}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Nivel de experiencia:</span>
                    <Badge variant="outline" className="ml-2 capitalize">
                      {client.experience_level}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Objetivos principales:</span>
                    <ul className="mt-1 text-sm">
                      {client.goals.slice(0, 2).map((goal, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Presupuesto:</span>
                    <p className="font-bold">
                      ${client.budget_range[0].toLocaleString()} - ${client.budget_range[1].toLocaleString()}
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleGenerateOnboarding(client.id)}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Generar Onboarding
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ROI Tracking Tab */}
        <TabsContent value="roi-tracking" className="space-y-6">
          <div className="space-y-6">
            {roiMetrics.map((metric) => {
              const client = clientProfiles.find(c => c.id === metric.client_id);
              return (
                <Card key={metric.client_id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{client?.name || 'Cliente'}</span>
                      <Badge className="bg-green-100 text-green-800">
                        <Star className="w-3 h-3 mr-1" />
                        {metric.metrics.satisfaction_score}/10
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      Coaching iniciado: {new Date(metric.coaching_start_date).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Metrics */}
                      <div className="space-y-4">
                        <h4 className="font-semibold">Métricas de Impacto</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Aumento de ingresos:</span>
                            <span className="font-bold text-green-600">
                              +${metric.metrics.revenue_increase.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Reducción de costos:</span>
                            <span className="font-bold text-blue-600">
                              -${metric.metrics.cost_reduction.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Ganancia de productividad:</span>
                            <span className="font-bold text-purple-600">
                              +{metric.metrics.productivity_gain}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Tiempo ahorrado:</span>
                            <span className="font-bold">
                              {metric.metrics.time_saved_hours}h
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="space-y-4">
                        <h4 className="font-semibold">Progreso</h4>
                        <div className="space-y-3">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Completación de objetivos</span>
                              <span>{metric.metrics.goal_completion_rate}%</span>
                            </div>
                            <Progress value={metric.metrics.goal_completion_rate} />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Satisfacción</span>
                              <span>{metric.metrics.satisfaction_score * 10}%</span>
                            </div>
                            <Progress value={metric.metrics.satisfaction_score * 10} />
                          </div>
                        </div>
                      </div>

                      {/* Milestones */}
                      <div className="space-y-4">
                        <h4 className="font-semibold">Hitos Recientes</h4>
                        <div className="space-y-2">
                          {metric.milestones.slice(0, 3).map((milestone, index) => (
                            <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                              <div className="font-medium">{milestone.achievement}</div>
                              <div className="text-muted-foreground">
                                {new Date(milestone.date).toLocaleDateString()}
                              </div>
                              <div className="text-green-600 font-bold">
                                +${milestone.impact_value.toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessCoachingSuite;
