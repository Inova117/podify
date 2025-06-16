import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import {
  Search, Star, TrendingUp, Users, DollarSign, Briefcase, Award, Target, Zap, Building2, Heart, Eye
} from 'lucide-react';
import {
  creatorMarketplace,
  type BrandMatch,
  type CreatorProfile,
  type SponsorshipDashboard
} from '@/lib/creatorMarketplace';

const BrandMarketplace: React.FC = () => {
  const [activeTab, setActiveTab] = useState('marketplace');
  const [brandMatches, setBrandMatches] = useState<BrandMatch[]>([]);
  const [sponsorshipData, setSponsorshipData] = useState<SponsorshipDashboard | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const mockCreatorProfile: CreatorProfile = {
    id: 'creator-1',
    name: 'Ana Rodriguez',
    email: 'ana@example.com',
    bio: 'Content creator especializada en lifestyle y wellness',
    niche: ['lifestyle', 'wellness', 'technology'],
    follower_count: { instagram: 75000, tiktok: 95000, youtube: 42000 },
    engagement_rate: 6.5,
    location: 'Mexico',
    languages: ['Spanish', 'English'],
    content_categories: ['lifestyle', 'wellness'],
    collaboration_rate: 750,
    preferred_brands: ['wellness', 'tech'],
    past_collaborations: 18,
    rating: 4.7,
    verified: true,
    created_at: new Date()
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [matches, dashboard] = await Promise.all([
        creatorMarketplace.matchBrands(mockCreatorProfile),
        creatorMarketplace.manageSponsorships(mockCreatorProfile.id)
      ]);
      setBrandMatches(matches);
      setSponsorshipData(dashboard);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (brandName: string) => {
    toast.success(`Aplicación enviada a ${brandName}`);
  };

  const filteredMatches = brandMatches.filter(match => 
    match.brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Brand Marketplace</h1>
            <p className="text-muted-foreground">Conecta con marcas y monetiza tu contenido</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Star className="h-4 w-4" />
              <span>{mockCreatorProfile.rating}</span>
            </Badge>
            <Badge variant="outline">Verificado</Badge>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                  <p className="text-2xl font-bold">${sponsorshipData?.total_earnings.toLocaleString() || '0'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Colaboraciones</p>
                  <p className="text-2xl font-bold">{mockCreatorProfile.past_collaborations}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Engagement</p>
                  <p className="text-2xl font-bold">{mockCreatorProfile.engagement_rate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Audiencia</p>
                  <p className="text-2xl font-bold">
                    {Object.values(mockCreatorProfile.follower_count)
                      .reduce((sum, count) => sum + (count || 0), 0)
                      .toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="marketplace" className="space-y-6">
          {/* Search */}
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar marcas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {/* Brand Matches */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMatches.map((match) => (
              <Card key={match.brand.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={match.brand.logo_url} />
                        <AvatarFallback>{match.brand.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{match.brand.name}</CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <Building2 className="w-4 h-4" />
                          <span>{match.brand.industry}</span>
                          {match.brand.verified && <Badge variant="secondary">Verificada</Badge>}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={match.urgency === 'high' ? 'destructive' : 'secondary'}>
                      {match.urgency === 'high' ? 'Alta Prioridad' : 'Normal'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {match.brand.description}
                  </p>

                  {/* Compatibility */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Compatibilidad</span>
                      <span className="text-sm font-bold text-green-600">{match.compatibility_score}%</span>
                    </div>
                    <Progress value={match.compatibility_score} className="h-2" />
                  </div>

                  {/* Match Reasons */}
                  <div className="flex flex-wrap gap-1">
                    {match.match_reasons.slice(0, 2).map((reason, index) => (
                      <Badge key={index} variant="outline" className="text-xs">{reason}</Badge>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">
                        ${match.estimated_payment.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Pago Estimado</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">{match.audience_overlap}%</p>
                      <p className="text-xs text-muted-foreground">Audiencia Común</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button 
                      onClick={() => handleApply(match.brand.name)}
                      className="flex-1"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Aplicar
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campañas Activas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sponsorshipData?.active_campaigns.map((campaign) => (
                    <div key={campaign.id} className="flex justify-between items-center p-3 border rounded">
                      <div>
                        <p className="font-medium">{campaign.title}</p>
                        <p className="text-sm text-muted-foreground">${campaign.budget.toLocaleString()}</p>
                      </div>
                      <Badge>{campaign.status}</Badge>
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
                  <div className="flex justify-between">
                    <span>Engagement Promedio</span>
                    <span className="font-bold">{sponsorshipData?.performance_metrics.avg_engagement}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Satisfacción de Marcas</span>
                    <span className="font-bold">{sponsorshipData?.performance_metrics.brand_satisfaction}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tasa de Finalización</span>
                    <span className="font-bold">{sponsorshipData?.performance_metrics.completion_rate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Ingresos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">
                    ${sponsorshipData?.monthly_earnings.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Ingresos Mensuales</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">
                    ${sponsorshipData?.total_earnings.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {sponsorshipData?.upcoming_payments.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pagos Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandMarketplace;
