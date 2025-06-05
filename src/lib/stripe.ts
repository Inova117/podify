import { loadStripe, Stripe } from '@stripe/stripe-js'

// Initialize Stripe client-side
let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  if (!stripePromise) {
    const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    if (!publishableKey) {
      throw new Error('Missing Stripe publishable key')
    }
    stripePromise = loadStripe(publishableKey)
  }
  return stripePromise
}

// Subscription plan configurations
export const SUBSCRIPTION_PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    monthlyPrice: 0,
    yearlyPrice: 0,
    stripePriceId: null,
    features: [
      '2 audio uploads per month',
      'Basic transcription',
      'Standard support',
      'Export to text'
    ],
    limits: {
      uploadsPerMonth: 2,
      maxFileSize: 50, // MB
      maxDuration: 60 * 30, // 30 minutes in seconds
      aiFeatures: false,
      teamMembers: 1,
      apiAccess: false,
      prioritySupport: false
    }
  },
  hobby: {
    id: 'hobby',
    name: 'Hobby',
    description: 'For individual creators',
    monthlyPrice: 29,
    yearlyPrice: 290, // 2 months free
    stripePriceId: {
      monthly: 'price_hobby_monthly',
      yearly: 'price_hobby_yearly'
    },
    features: [
      '10 audio uploads per month',
      'AI-powered transcription',
      'Summary generation',
      'Key points extraction',
      'Email support',
      'Export to multiple formats'
    ],
    limits: {
      uploadsPerMonth: 10,
      maxFileSize: 100, // MB
      maxDuration: 60 * 60 * 2, // 2 hours in seconds
      aiFeatures: true,
      teamMembers: 1,
      apiAccess: false,
      prioritySupport: false
    }
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    description: 'For growing businesses',
    monthlyPrice: 79,
    yearlyPrice: 790, // 2 months free
    stripePriceId: {
      monthly: 'price_pro_monthly',
      yearly: 'price_pro_yearly'
    },
    features: [
      '50 audio uploads per month',
      'Advanced AI features',
      'Team collaboration (5 members)',
      'Custom templates',
      'Priority support',
      'API access',
      'Advanced analytics'
    ],
    limits: {
      uploadsPerMonth: 50,
      maxFileSize: 500, // MB
      maxDuration: 60 * 60 * 4, // 4 hours in seconds
      aiFeatures: true,
      teamMembers: 5,
      apiAccess: true,
      prioritySupport: true
    }
  },
  agency: {
    id: 'agency',
    name: 'Agency',
    description: 'For large teams and agencies',
    monthlyPrice: 199,
    yearlyPrice: 1990, // 2 months free
    stripePriceId: {
      monthly: 'price_agency_monthly',
      yearly: 'price_agency_yearly'
    },
    features: [
      'Unlimited audio uploads',
      'All AI features',
      'Unlimited team members',
      'White-label options',
      'Dedicated support',
      'Full API access',
      'Advanced integrations',
      'Custom onboarding'
    ],
    limits: {
      uploadsPerMonth: -1, // Unlimited
      maxFileSize: 1000, // MB
      maxDuration: -1, // Unlimited
      aiFeatures: true,
      teamMembers: -1, // Unlimited
      apiAccess: true,
      prioritySupport: true
    }
  }
} as const

export type SubscriptionPlanId = keyof typeof SUBSCRIPTION_PLANS
export type SubscriptionPlan = typeof SUBSCRIPTION_PLANS[SubscriptionPlanId]

// Helper functions
export const getPlanById = (planId: string): SubscriptionPlan | null => {
  return SUBSCRIPTION_PLANS[planId as SubscriptionPlanId] || null
}

export const getPlanByStripePriceId = (priceId: string): SubscriptionPlan | null => {
  for (const plan of Object.values(SUBSCRIPTION_PLANS)) {
    if (plan.stripePriceId) {
      if (typeof plan.stripePriceId === 'object') {
        if (plan.stripePriceId.monthly === priceId || plan.stripePriceId.yearly === priceId) {
          return plan
        }
      } else if (plan.stripePriceId === priceId) {
        return plan
      }
    }
  }
  return null
}

export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
}

export const calculateYearlySavings = (monthlyPrice: number, yearlyPrice: number) => {
  const monthlyTotal = monthlyPrice * 12
  const savings = monthlyTotal - yearlyPrice
  const percentage = Math.round((savings / monthlyTotal) * 100)
  return { savings, percentage }
} 