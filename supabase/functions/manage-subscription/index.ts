import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.25.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ManageSubscriptionRequest {
  action: 'cancel' | 'reactivate' | 'update'
  subscriptionId: string
  planId?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization')!
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Parse request body
    const body: ManageSubscriptionRequest = await req.json()
    const { action, subscriptionId, planId } = body

    // Validate input
    if (!action || !subscriptionId) {
      throw new Error('Missing required parameters')
    }

    // Initialize Stripe
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
      apiVersion: '2024-11-20.acacia',
    })

    // Verify user owns this subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('user_id, stripe_subscription_id')
      .eq('stripe_subscription_id', subscriptionId)
      .eq('user_id', user.id)
      .single()

    if (subError || !subscription) {
      throw new Error('Subscription not found or access denied')
    }

    let result

    switch (action) {
      case 'cancel':
        result = await cancelSubscription(stripe, subscriptionId)
        break
      
      case 'reactivate':
        result = await reactivateSubscription(stripe, subscriptionId)
        break
      
      case 'update':
        if (!planId) {
          throw new Error('Plan ID required for update action')
        }
        result = await updateSubscription(stripe, subscriptionId, planId)
        break
      
      default:
        throw new Error('Invalid action')
    }

    // Log the action
    await supabase
      .from('billing_events')
      .insert({
        user_id: user.id,
        event_type: `subscription_${action}`,
        stripe_subscription_id: subscriptionId,
        plan_id: planId,
        metadata: {
          action,
          timestamp: new Date().toISOString(),
        },
      })

    return new Response(
      JSON.stringify({ success: true, data: result }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Subscription management error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function cancelSubscription(stripe: Stripe, subscriptionId: string) {
  // Cancel subscription at period end (don't revoke access immediately)
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })

  return {
    id: subscription.id,
    status: subscription.status,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    currentPeriodEnd: subscription.current_period_end,
  }
}

async function reactivateSubscription(stripe: Stripe, subscriptionId: string) {
  // Remove the cancellation
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  })

  return {
    id: subscription.id,
    status: subscription.status,
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
    currentPeriodEnd: subscription.current_period_end,
  }
}

async function updateSubscription(stripe: Stripe, subscriptionId: string, planId: string) {
  // Get current subscription
  const currentSubscription = await stripe.subscriptions.retrieve(subscriptionId)
  
  // For simplicity, we'll create a new checkout session for plan changes
  // In production, you might want to use subscription.items.update for immediate changes
  throw new Error('Plan updates should be handled through checkout sessions')
} 