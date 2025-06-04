import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface SubscriptionPlan {
  id: string;
  name: string;
  display_name: string;
  description?: string;
  monthly_price: number;
  yearly_price: number;
  features: Record<string, any>;
  limits: {
    monthly_uploads: number;
    team_members: number;
    storage_gb: number;
    api_calls: number;
  };
  is_active: boolean;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'inactive' | 'canceled' | 'past_due' | 'unpaid';
  current_period_start?: string;
  current_period_end?: string;
  cancel_at?: string;
  trial_start?: string;
  trial_end?: string;
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface UsageData {
  current_usage: number;
  usage_quota: number;
  subscription_tier: string;
  quota_reset_date?: string;
  monthly_breakdown: {
    audio_upload: number;
    transcription: number;
    content_generation: number;
    export: number;
    api_call: number;
  };
}

export const useSubscription = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch available subscription plans
  const {
    data: plans = [],
    isLoading: isLoadingPlans,
    error: plansError
  } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('monthly_price', { ascending: true });

      if (error) throw error;
      // Transform the data to match our interface
      return data.map(plan => ({
        ...plan,
        features: plan.features as Record<string, any>,
        limits: plan.limits as {
          monthly_uploads: number;
          team_members: number;
          storage_gb: number;
          api_calls: number;
        },
      })) as SubscriptionPlan[];
    },
  });

  // Fetch user's current subscription
  const {
    data: currentSubscription,
    isLoading: isLoadingSubscription,
    error: subscriptionError
  } = useQuery({
    queryKey: ['user-subscription', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          subscription_plans(*)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows found
      
      if (!data) return null;
      
      // Transform the data to match our interface
      return {
        ...data,
        subscription_plans: {
          ...data.subscription_plans,
          features: data.subscription_plans.features as Record<string, any>,
          limits: data.subscription_plans.limits as {
            monthly_uploads: number;
            team_members: number;
            storage_gb: number;
            api_calls: number;
          },
        },
      } as UserSubscription & { subscription_plans: SubscriptionPlan };
    },
    enabled: !!user?.id,
  });

  // Fetch user's usage data
  const {
    data: usageData,
    isLoading: isLoadingUsage,
    error: usageError
  } = useQuery({
    queryKey: ['user-usage', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      // Get user profile with current usage
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('current_usage, usage_quota, subscription_tier, quota_reset_date')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Get current month's usage breakdown
      const currentMonth = new Date();
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const { data: usageTracking, error: usageError } = await supabase
        .from('usage_tracking')
        .select('action_type, usage_count')
        .eq('user_id', user.id)
        .gte('billing_period_start', firstDay.toISOString().split('T')[0])
        .lte('billing_period_end', lastDay.toISOString().split('T')[0]);

      if (usageError) throw usageError;

      // Aggregate usage by action type
      const monthlyBreakdown = usageTracking.reduce(
        (acc, item) => ({
          ...acc,
          [item.action_type]: (acc[item.action_type] || 0) + (item.usage_count || 0),
        }),
        {
          audio_upload: 0,
          transcription: 0,
          content_generation: 0,
          export: 0,
          api_call: 0,
        }
      );

      return {
        current_usage: profile.current_usage || 0,
        usage_quota: profile.usage_quota || 2,
        subscription_tier: profile.subscription_tier || 'free',
        quota_reset_date: profile.quota_reset_date,
        monthly_breakdown: monthlyBreakdown,
      } as UsageData;
    },
    enabled: !!user?.id,
  });

  // Create Stripe checkout session
  const createCheckoutMutation = useMutation({
    mutationFn: async ({
      planId,
      billingInterval = 'monthly',
      successUrl,
      cancelUrl
    }: {
      planId: string;
      billingInterval?: 'monthly' | 'yearly';
      successUrl?: string;
      cancelUrl?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const plan = plans.find(p => p.id === planId);
      if (!plan) throw new Error('Plan not found');

      // For development, return mock data
      if (process.env.NODE_ENV === 'development') {
        return {
          url: '/dashboard?upgrade=success',
          sessionId: 'mock_session_id',
        };
      }

      // TODO: Implement Stripe checkout session creation
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          planId,
          billingInterval,
          successUrl: successUrl || `${window.location.origin}/dashboard?upgrade=success`,
          cancelUrl: cancelUrl || `${window.location.origin}/pricing`,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      toast.error(`Checkout failed: ${error.message}`);
    },
  });

  // Create Stripe customer portal session
  const createPortalMutation = useMutation({
    mutationFn: async (returnUrl?: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      if (!currentSubscription?.stripe_customer_id) {
        throw new Error('No active subscription found');
      }

      // For development, redirect to settings
      if (process.env.NODE_ENV === 'development') {
        return {
          url: '/dashboard/settings?tab=billing',
        };
      }

      // TODO: Implement Stripe customer portal session creation
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: {
          customerId: currentSubscription.stripe_customer_id,
          returnUrl: returnUrl || `${window.location.origin}/dashboard/settings`,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      toast.error(`Portal access failed: ${error.message}`);
    },
  });

  // Check if user can perform an action based on their plan
  const canPerformAction = (action: string, resourceType?: string): boolean => {
    if (!usageData) return false;

    switch (action) {
      case 'upload_audio':
        return usageData.current_usage < usageData.usage_quota || 
               usageData.usage_quota === -1; // -1 means unlimited
      
      case 'create_team':
        return ['pro', 'agency'].includes(usageData.subscription_tier);
      
      case 'api_access':
        return usageData.subscription_tier === 'agency';
      
      case 'priority_support':
        return ['pro', 'agency'].includes(usageData.subscription_tier);
      
      case 'custom_branding':
        return usageData.subscription_tier === 'agency';
      
      default:
        return true;
    }
  };

  // Get feature availability for current plan
  const getFeatureAccess = () => {
    const currentPlan = plans.find(p => p.name === usageData?.subscription_tier);
    return currentPlan?.features || {};
  };

  // Calculate usage percentage
  const getUsagePercentage = (): number => {
    if (!usageData) return 0;
    if (usageData.usage_quota === -1) return 0; // Unlimited
    return Math.min((usageData.current_usage / usageData.usage_quota) * 100, 100);
  };

  // Get days until quota reset
  const getDaysUntilReset = (): number => {
    if (!usageData?.quota_reset_date) return 0;
    const resetDate = new Date(usageData.quota_reset_date);
    const today = new Date();
    const diffTime = resetDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Check if user is on trial
  const isOnTrial = (): boolean => {
    if (!currentSubscription?.trial_end) return false;
    return new Date(currentSubscription.trial_end) > new Date();
  };

  // Get trial days remaining
  const getTrialDaysRemaining = (): number => {
    if (!currentSubscription?.trial_end) return 0;
    const trialEnd = new Date(currentSubscription.trial_end);
    const today = new Date();
    const diffTime = trialEnd.getTime() - today.getTime();
    return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
  };

  return {
    // Data
    plans,
    currentSubscription,
    usageData,
    
    // Loading states
    isLoadingPlans,
    isLoadingSubscription,
    isLoadingUsage,
    
    // Errors
    plansError,
    subscriptionError,
    usageError,
    
    // Mutations
    createCheckout: createCheckoutMutation.mutate,
    isCreatingCheckout: createCheckoutMutation.isPending,
    
    createPortal: createPortalMutation.mutate,
    isCreatingPortal: createPortalMutation.isPending,
    
    // Utilities
    canPerformAction,
    getFeatureAccess,
    getUsagePercentage,
    getDaysUntilReset,
    isOnTrial,
    getTrialDaysRemaining,
  };
}; 