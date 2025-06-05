import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Check,
  Crown,
  Zap,
  Users,
  Headphones,
  Clock,
  Shield,
  Code,
  Sparkles
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useSubscription } from '@/hooks/useSubscription'
import { SUBSCRIPTION_PLANS, formatPrice, calculateYearlySavings } from '@/lib/stripe'
import { cn } from '@/lib/utils'

interface PricingPlansProps {
  className?: string
  showHeader?: boolean
}

const planIcons = {
  free: <Headphones className="w-6 h-6" />,
  hobby: <Zap className="w-6 h-6" />,
  pro: <Crown className="w-6 h-6" />,
  agency: <Sparkles className="w-6 h-6" />
}

const planColors = {
  free: "text-gray-600",
  hobby: "text-blue-600",
  pro: "text-purple-600",
  agency: "text-gradient-to-r from-purple-600 to-pink-600"
}

export const PricingPlans: React.FC<PricingPlansProps> = ({ 
  className, 
  showHeader = true 
}) => {
  const { user } = useAuth()
  const { subscription, createCheckoutSession, isProcessing } = useSubscription()
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly')

  const handleSelectPlan = async (planId: string) => {
    if (!user) {
      // Redirect to sign up
      window.location.href = '/auth?mode=signup'
      return
    }

    if (planId === 'free') {
      return // Free plan doesn't need checkout
    }

    await createCheckoutSession(planId as any, billingCycle)
  }

  const isCurrentPlan = (planId: string) => {
    return subscription?.planId === planId
  }

  const getButtonText = (planId: string) => {
    if (!user) return 'Get Started'
    if (isCurrentPlan(planId)) return 'Current Plan'
    if (planId === 'free') return 'Downgrade'
    return 'Upgrade'
  }

  const getButtonVariant = (planId: string) => {
    if (isCurrentPlan(planId)) return 'outline'
    if (planId === 'pro') return 'default'
    return 'outline'
  }

  return (
    <div className={cn("py-12", className)}>
      {showHeader && (
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your Perfect Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your audio content with AI-powered transcription and content generation. 
            Start free and scale as you grow.
          </p>
        </div>
      )}

      {/* Billing Toggle */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all",
              billingCycle === 'monthly' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2",
              billingCycle === 'yearly' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Yearly
            <Badge className="bg-green-100 text-green-800 text-xs">Save 17%</Badge>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {Object.values(SUBSCRIPTION_PLANS).map((plan) => {
          const isPopular = plan.id === 'pro'
          const isCurrent = isCurrentPlan(plan.id)
          const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
          const monthlyPrice = billingCycle === 'yearly' ? plan.yearlyPrice / 12 : plan.monthlyPrice
          const savings = billingCycle === 'yearly' && plan.monthlyPrice > 0 
            ? calculateYearlySavings(plan.monthlyPrice, plan.yearlyPrice) 
            : null

          return (
            <Card 
              key={plan.id} 
              className={cn(
                "relative transition-all duration-200 hover:shadow-lg",
                isPopular && "border-primary shadow-lg scale-105",
                isCurrent && "ring-2 ring-primary"
              )}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-primary text-primary-foreground px-3 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={cn("mx-auto mb-3", planColors[plan.id as keyof typeof planColors])}>
                  {planIcons[plan.id as keyof typeof planIcons]}
                </div>
                
                <CardTitle className="text-xl mb-2">{plan.name}</CardTitle>
                
                <div className="space-y-1">
                  <div className="text-3xl font-bold">
                    {plan.monthlyPrice === 0 ? 'Free' : formatPrice(monthlyPrice)}
                  </div>
                  {plan.monthlyPrice > 0 && (
                    <div className="text-sm text-muted-foreground">
                      per month{billingCycle === 'yearly' && ', billed yearly'}
                    </div>
                  )}
                  {savings && (
                    <div className="text-sm text-green-600 font-medium">
                      Save {formatPrice(savings.savings)} ({savings.percentage}%)
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Features List */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Plan Limits */}
                <div className="pt-4 border-t space-y-2">
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Monthly uploads:</span>
                      <span className="font-medium">
                        {plan.limits.uploadsPerMonth === -1 ? 'Unlimited' : plan.limits.uploadsPerMonth}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max file size:</span>
                      <span className="font-medium">{plan.limits.maxFileSize}MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Team members:</span>
                      <span className="font-medium">
                        {plan.limits.teamMembers === -1 ? 'Unlimited' : plan.limits.teamMembers}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className={cn(
                    "w-full mt-6",
                    isPopular && "bg-primary hover:bg-primary/90"
                  )}
                  variant={getButtonVariant(plan.id)}
                  disabled={isCurrent || isProcessing}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    getButtonText(plan.id)
                  )}
                </Button>

                {!user && plan.id !== 'free' && (
                  <div className="text-xs text-center text-muted-foreground">
                    Start with 7-day free trial
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="mt-16">
        <h3 className="text-2xl font-bold text-center mb-8">Feature Comparison</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full max-w-4xl mx-auto">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4">Features</th>
                {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
                  <th key={plan.id} className="text-center py-3 px-4 font-medium">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b">
                <td className="py-3 px-4 font-medium">Monthly uploads</td>
                {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
                  <td key={plan.id} className="text-center py-3 px-4">
                    {plan.limits.uploadsPerMonth === -1 ? '∞' : plan.limits.uploadsPerMonth}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-medium">AI features</td>
                {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
                  <td key={plan.id} className="text-center py-3 px-4">
                    {plan.limits.aiFeatures ? (
                      <Check className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-medium">Team collaboration</td>
                {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
                  <td key={plan.id} className="text-center py-3 px-4">
                    {plan.limits.teamMembers === -1 ? '∞' : plan.limits.teamMembers}
                  </td>
                ))}
              </tr>
              <tr className="border-b">
                <td className="py-3 px-4 font-medium">API access</td>
                {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
                  <td key={plan.id} className="text-center py-3 px-4">
                    {plan.limits.apiAccess ? (
                      <Check className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Priority support</td>
                {Object.values(SUBSCRIPTION_PLANS).map((plan) => (
                  <td key={plan.id} className="text-center py-3 px-4">
                    {plan.limits.prioritySupport ? (
                      <Check className="w-4 h-4 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 text-center">
        <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
          <div>
            <h4 className="font-medium mb-2">Can I change plans anytime?</h4>
            <p className="text-sm text-muted-foreground">
              Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Is there a free trial?</h4>
            <p className="text-sm text-muted-foreground">
              All paid plans include a 7-day free trial. No credit card required to start.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">What payment methods do you accept?</h4>
            <p className="text-sm text-muted-foreground">
              We accept all major credit cards, PayPal, and bank transfers for annual plans.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Can I cancel anytime?</h4>
            <p className="text-sm text-muted-foreground">
              Yes, you can cancel your subscription at any time. You'll retain access until the end of your billing period.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 