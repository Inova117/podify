import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileAudio, Settings, History, Plus, Share2, Calendar, Clock } from "lucide-react";
import { ContentLibrary } from "@/components/dashboard/ContentLibrary";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ConfigurationPanel } from "@/components/dashboard/ConfigurationPanel";
import { LoadingStates } from "@/components/LoadingStates";
import { ErrorStates } from "@/components/ErrorStates";
import { useToast } from "@/hooks/use-toast";

interface DashboardData {
  totalUploads: number;
  totalContent: number;
  recentUploads: Array<{
    id: string;
    filename: string;
    created_at: string;
    share_id?: string;
  }>;
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch recent uploads and stats
      const { data: uploads, error: uploadsError } = await supabase
        .from('shared_results')
        .select('id, filename, created_at, share_id')
        .order('created_at', { ascending: false })
        .limit(10);

      if (uploadsError) throw uploadsError;

      const { count: totalCount, error: countError } = await supabase
        .from('shared_results')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      setDashboardData({
        totalUploads: totalCount || 0,
        totalContent: (totalCount || 0) * 4, // Approximate content pieces per upload
        recentUploads: uploads || []
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    loadDashboardData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <LoadingStates state="transcribing" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <ErrorStates 
          type="api" 
          message={error}
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Content Dashboard</h1>
            <p className="text-white/70 text-lg">Manage your podcast content and track your progress</p>
          </div>
          <Button 
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white mt-4 lg:mt-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Content
          </Button>
        </div>

        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white/10 backdrop-blur-sm border-white/20">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
              <FileAudio className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="library" className="text-white data-[state=active]:bg-white/20">
              <History className="w-4 h-4 mr-2" />
              Content Library
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-white data-[state=active]:bg-white/20">
              <Settings className="w-4 h-4 mr-2" />
              Configuration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {dashboardData && (
              <>
                <DashboardStats 
                  totalUploads={dashboardData.totalUploads}
                  totalContent={dashboardData.totalContent}
                />
                <div className="grid lg:grid-cols-2 gap-6">
                  <QuickActions />
                  
                  {/* Recent Activity */}
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dashboardData.recentUploads.length > 0 ? (
                        <div className="space-y-3">
                          {dashboardData.recentUploads.slice(0, 5).map((upload) => (
                            <div key={upload.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileAudio className="w-4 h-4 text-purple-400" />
                                <div>
                                  <p className="text-white font-medium">{upload.filename}</p>
                                  <p className="text-white/60 text-sm">
                                    {new Date(upload.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              {upload.share_id && (
                                <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                                  <Share2 className="w-3 h-3 mr-1" />
                                  Shared
                                </Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-white/60 text-center py-4">No recent activity</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="library" className="space-y-6">
            <ContentLibrary onRetry={handleRetry} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <ConfigurationPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
