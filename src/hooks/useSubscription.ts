import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { getStripe, SUBSCRIPTION_PLANS, type SubscriptionPlanId } from '@/lib/stripe'
import { toast } from 'sonner'

interface SubscriptionData {
  id: string
  planId: SubscriptionPlanId
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete'
  currentPeriodStart: string
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
  stripeCustomerId?: string
  stripeSubscriptionId?: string
}

interface UsageData {
  currentUsage: number
  quota: number
  resetDate: string
  percentage: number
}

export const useSubscription = () => {
  const { user } = useAuth()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  // Load subscription data
  const loadSubscription = useCallback(async () => {
    if (!user) {
      setIsLoading(false)
      return
    }

    try {
      // Get user profile with subscription info
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('subscription_tier, current_usage, usage_quota, quota_reset_date')
        .eq('id', user.id)
        .single()

      if (profileError) throw profileError

      // Get subscription details
      const { data: subscriptionData, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (subError) throw subError

      // Set subscription data
      if (subscriptionData) {
                 setSubscription({
           id: subscriptionData.id,
           planId: subscriptionData.plan_id as SubscriptionPlanId,
           status: subscriptionData.status as 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete',
           currentPeriodStart: subscriptionData.current_period_start || '',
           currentPeriodEnd: subscriptionData.current_period_end || '',
           cancelAtPeriodEnd: subscriptionData.cancel_at !== null,
           stripeCustomerId: subscriptionData.stripe_customer_id || undefined,
           stripeSubscriptionId: subscriptionData.stripe_subscription_id || undefined
         })
      } else {
        // No active subscription, user is on free plan
        setSubscription({
          id: 'free',
          planId: 'free',
          status: 'active',
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false
        })
      }

      // Set usage data
      const plan = SUBSCRIPTION_PLANS[profile?.subscription_tier as SubscriptionPlanId] || SUBSCRIPTION_PLANS.free
      setUsage({
        currentUsage: profile?.current_usage || 0,
        quota: plan.limits.uploadsPerMonth,
        resetDate: profile?.quota_reset_date || new Date().toISOString(),
        percentage: plan.limits.uploadsPerMonth > 0 
          ? Math.round(((profile?.current_usage || 0) / plan.limits.uploadsPerMonth) * 100)
          : 0
      })

    } catch (error) {
      console.error('Error loading subscription:', error)
      toast.error('Failed to load subscription data')
    } finally {
      setIsLoading(false)
    }
  }, [user])

  // Create Stripe checkout session
  const createCheckoutSession = useCallback(async (
    planId: SubscriptionPlanId,
    billing: 'monthly' | 'yearly' = 'monthly'
  ) => {
    if (!user || planId === 'free') return

    setIsProcessing(true)

    try {
      const plan = SUBSCRIPTION_PLANS[planId]
      if (!plan.stripePriceId) {
        throw new Error('Invalid plan selected')
      }

      const priceId = typeof plan.stripePriceId === 'object' 
        ? plan.stripePriceId[billing]
        : plan.stripePriceId

      // Call our edge function to create checkout session
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          priceId,
          planId,
          userId: user.id,
          billing
        }
      })

      if (error) throw error

      // Redirect to Stripe Checkout
      const stripe = await getStripe()
      if (!stripe) throw new Error('Stripe not loaded')

      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      })

      if (stripeError) throw stripeError

    } catch (error: any) {
      console.error('Error creating checkout session:', error)
      toast.error(error.message || 'Failed to start checkout process')
    } finally {
      setIsProcessing(false)
    }
  }, [user])

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    if (!subscription?.stripeSubscriptionId) return

    setIsProcessing(true)

    try {
      const { error } = await supabase.functions.invoke('manage-subscription', {
        body: {
          action: 'cancel',
          subscriptionId: subscription.stripeSubscriptionId
        }
      })

      if (error) throw error

      toast.success('Subscription will be canceled at the end of the current period')
      await loadSubscription() // Reload data

    } catch (error: any) {
      console.error('Error canceling subscription:', error)
      toast.error(error.message || 'Failed to cancel subscription')
    } finally {
      setIsProcessing(false)
    }
  }, [subscription, loadSubscription])

  // Reactivate subscription
  const reactivateSubscription = useCallback(async () => {
    if (!subscription?.stripeSubscriptionId) return

    setIsProcessing(true)

    try {
      const { error } = await supabase.functions.invoke('manage-subscription', {
        body: {
          action: 'reactivate',
          subscriptionId: subscription.stripeSubscriptionId
        }
      })

      if (error) throw error

      toast.success('Subscription reactivated successfully')
      await loadSubscription() // Reload data

    } catch (error: any) {
      console.error('Error reactivating subscription:', error)
      toast.error(error.message || 'Failed to reactivate subscription')
    } finally {
      setIsProcessing(false)
    }
  }, [subscription, loadSubscription])

  // Update payment method
  const updatePaymentMethod = useCallback(async () => {
    if (!subscription?.stripeCustomerId) return

    setIsProcessing(true)

    try {
      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: {
          customerId: subscription.stripeCustomerId,
          returnUrl: window.location.href
        }
      })

      if (error) throw error

      // Redirect to Stripe Customer Portal
      window.location.href = data.url

    } catch (error: any) {
      console.error('Error creating portal session:', error)
      toast.error(error.message || 'Failed to open billing portal')
    } finally {
      setIsProcessing(false)
    }
  }, [subscription])

  // Check if user can use a feature
  const canUseFeature = useCallback((feature: string) => {
    if (!subscription) return false

    const plan = SUBSCRIPTION_PLANS[subscription.planId]
    
    switch (feature) {
      case 'ai_features':
        return plan.limits.aiFeatures
      case 'api_access':
        return plan.limits.apiAccess
      case 'priority_support':
        return plan.limits.prioritySupport
      case 'team_collaboration':
        return plan.limits.teamMembers > 1
      default:
        return true
    }
  }, [subscription])

  // Check if user is within usage limits
  const isWithinLimits = useCallback(() => {
    if (!subscription || !usage) return false

    const plan = SUBSCRIPTION_PLANS[subscription.planId]
    
    // Unlimited plans
    if (plan.limits.uploadsPerMonth === -1) return true
    
    // Check monthly usage limit
    return usage.currentUsage < plan.limits.uploadsPerMonth
  }, [subscription, usage])

  // Get current plan details
  const getCurrentPlan = useCallback(() => {
    if (!subscription) return SUBSCRIPTION_PLANS.free
    return SUBSCRIPTION_PLANS[subscription.planId]
  }, [subscription])

  useEffect(() => {
    loadSubscription()
  }, [loadSubscription])

  // Listen for subscription changes via real-time
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('subscription-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'subscriptions',
        filter: `user_id=eq.${user.id}`
      }, () => {
        loadSubscription()
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${user.id}`
      }, () => {
        loadSubscription()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, loadSubscription])

  return {
    subscription,
    usage,
    isLoading,
    isProcessing,
    createCheckoutSession,
    cancelSubscription,
    reactivateSubscription,
    updatePaymentMethod,
    canUseFeature,
    isWithinLimits,
    getCurrentPlan,
    reload: loadSubscription
  }
} 