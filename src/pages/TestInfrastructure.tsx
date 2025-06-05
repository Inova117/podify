import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { EnhancedAudioUpload } from '@/components/EnhancedAudioUpload';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { useAudioProcessing } from '@/hooks/useAudioProcessing';
import { CheckCircle, AlertCircle, Clock, Users, Database, Zap } from 'lucide-react';
import { toast } from 'sonner';

const TestInfrastructure: React.FC = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const { 
    subscription, 
    usage, 
    isLoading
  } = useSubscription();

  // Mock plans data for testing
  const plans = [
    { id: 'free', display_name: 'Free', monthly_price: 0, limits: { monthly_uploads: 2, team_members: 1, storage_gb: 1 } },
    { id: 'hobby', display_name: 'Hobby', monthly_price: 2900, limits: { monthly_uploads: 10, team_members: 1, storage_gb: 5 } },
    { id: 'pro', display_name: 'Pro', monthly_price: 7900, limits: { monthly_uploads: 50, team_members: 5, storage_gb: 25 } },
    { id: 'agency', display_name: 'Agency', monthly_price: 19900, limits: { monthly_uploads: -1, team_members: 25, storage_gb: 100 } }
  ];

  const getUsagePercentage = () => 45; // Mock percentage for testing

  const canPerformAction = (action: string) => {
    // Mock permissions for testing
    return action === 'upload_audio';
  };
  const { 
    audioUploads, 
    processingJobs, 
    isLoadingUploads,
    isLoadingJobs 
  } = useAudioProcessing();

  const infrastructureStatus = [
    {
      name: 'Authentication',
      status: user ? 'connected' : 'disconnected',
      description: user ? `Logged in as ${user.email}` : 'Not authenticated',
      icon: user ? CheckCircle : AlertCircle,
      color: user ? 'text-green-500' : 'text-red-500',
    },
    {
      name: 'User Profile',
      status: profile ? 'loaded' : 'loading',
      description: profile ? `Tier: ${profile.subscription_tier}` : 'Loading profile...',
      icon: profile ? CheckCircle : Clock,
      color: profile ? 'text-green-500' : 'text-yellow-500',
    },
    {
      name: 'Subscription Plans',
      status: plans.length > 0 ? 'loaded' : 'loading',
      description: `${plans.length} plans available`,
      icon: plans.length > 0 ? CheckCircle : Clock,
      color: plans.length > 0 ? 'text-green-500' : 'text-yellow-500',
    },
    {
      name: 'Usage Tracking',
      status: usage ? 'active' : 'loading',
      description: usage ? `Mock usage data available` : 'Loading usage...',
      icon: usage ? CheckCircle : Clock,
      color: usage ? 'text-green-500' : 'text-yellow-500',
    },
    {
      name: 'Audio Uploads',
      status: 'ready',
      description: `${audioUploads.length} uploads found`,
      icon: CheckCircle,
      color: 'text-green-500',
    },
    {
      name: 'Processing Jobs',
      status: 'ready',
      description: `${processingJobs.length} jobs tracked`,
      icon: CheckCircle,
      color: 'text-green-500',
    },
  ];

  const testActions = [
    {
      name: 'Upload Audio',
      enabled: canPerformAction('upload_audio'),
      description: 'Test audio upload functionality',
    },
    {
      name: 'Create Team',
      enabled: canPerformAction('create_team'),
      description: 'Test team creation (Pro+ required)',
    },
    {
      name: 'API Access',
      enabled: canPerformAction('api_access'),
      description: 'Test API access (Agency required)',
    },
  ];

  const handleTestToast = () => {
    toast.success('Infrastructure test successful!', {
      description: 'All systems are working properly.',
    });
  };

  if (authLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <Clock className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2">Loading infrastructure...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Infrastructure Test Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Verify that all enhanced infrastructure components are working properly
        </p>
      </div>

      {/* Infrastructure Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Infrastructure Status
          </CardTitle>
          <CardDescription>
            Current status of all infrastructure components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {infrastructureStatus.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.name} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Icon className={`h-5 w-5 ${item.color}`} />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {item.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* User Information */}
      {profile && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Profile Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Account Information</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Email:</strong> {profile.email}</p>
                  <p><strong>Name:</strong> {profile.full_name || 'Not set'}</p>
                  <p><strong>Tier:</strong> {profile.subscription_tier}</p>
                  <p><strong>Onboarded:</strong> {profile.onboarding_completed ? 'Yes' : 'No'}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Usage Information</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Current Usage:</strong> {profile.current_usage}</p>
                  <p><strong>Quota:</strong> {profile.usage_quota === -1 ? 'Unlimited' : profile.usage_quota}</p>
                  <p><strong>Usage %:</strong> {Math.round(getUsagePercentage())}%</p>
                  <p><strong>Reset Date:</strong> {profile.quota_reset_date ? new Date(profile.quota_reset_date).toLocaleDateString() : 'Not set'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Tests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Action Permissions Test
          </CardTitle>
          <CardDescription>
            Test what actions are available for your current subscription tier
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testActions.map((action) => (
              <div key={action.name} className="p-3 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {action.enabled ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <p className="font-medium">{action.name}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {action.description}
                </p>
                <Badge variant={action.enabled ? "default" : "secondary"}>
                  {action.enabled ? 'Available' : 'Restricted'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Plans */}
      {plans.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Available Subscription Plans</CardTitle>
            <CardDescription>
              All available subscription tiers and their features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {plans.map((plan) => (
                <div key={plan.id} className="p-4 border rounded-lg">
                  <h4 className="font-medium">{plan.display_name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    ${(plan.monthly_price / 100).toFixed(2)}/month
                  </p>
                  <div className="text-xs space-y-1">
                    <p><strong>Uploads:</strong> {plan.limits.monthly_uploads === -1 ? 'Unlimited' : plan.limits.monthly_uploads}</p>
                    <p><strong>Team:</strong> {plan.limits.team_members} members</p>
                    <p><strong>Storage:</strong> {plan.limits.storage_gb}GB</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Audio Upload Component Test */}
      <Card>
        <CardHeader>
          <CardTitle>Enhanced Audio Upload Test</CardTitle>
          <CardDescription>
            Test the new audio upload component with real-time progress tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnhancedAudioUpload 
            autoStartTranscription={false}
            showJobProgress={true}
            maxFiles={3}
          />
        </CardContent>
      </Card>

      {/* Test Actions */}
      <Card>
        <CardHeader>
          <CardTitle>System Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={handleTestToast}>
              Test Toast Notifications
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh Infrastructure
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading States */}
      {(isLoading || isLoadingUploads || isLoadingJobs) && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            Some components are still loading: {[
              isLoading && 'subscription data',
              isLoadingUploads && 'audio uploads',
              isLoadingJobs && 'processing jobs'
            ].filter(Boolean).join(', ')}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TestInfrastructure; 