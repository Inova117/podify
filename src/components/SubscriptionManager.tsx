import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Crown,
  CreditCard,
  Calendar,
  Users,
  Zap,
  Check,
  AlertCircle,
  TrendingUp,
  Download,
  Settings,
  ExternalLink
} from 'lucide-react'
import { useSubscription } from '@/hooks/useSubscription'
import { SUBSCRIPTION_PLANS, formatPrice, calculateYearlySavings } from '@/lib/stripe'
import { cn } from '@/lib/utils'

interface SubscriptionManagerProps {
  className?: string
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ className }) => {
  const {
    subscription,
    usage,
    isLoading,
    isProcessing,
    createCheckoutSession,
    cancelSubscription,
    reactivateSubscription,
    updatePaymentMethod,
    getCurrentPlan
  } = useSubscription()

  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedTab, setSelectedTab] = useState('overview')

  const currentPlan = getCurrentPlan()

  if (isLoading) {
    return (
      <div className={cn("space-y-6", className)}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'canceled':
        return <Badge variant="destructive">Canceled</Badge>
      case 'past_due':
        return <Badge variant="destructive">Past Due</Badge>
      case 'trialing':
        return <Badge className="bg-blue-100 text-blue-800">Trial</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Current Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  Current Plan
                </div>
                {subscription && getStatusBadge(subscription.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-2xl font-bold">{currentPlan.name}</h3>
                  <p className="text-muted-foreground">{currentPlan.description}</p>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">
                      {formatPrice(billingCycle === 'yearly' ? currentPlan.yearlyPrice / 12 : currentPlan.monthlyPrice)}
                    </span>
                    <span className="text-muted-foreground">
                      /{billingCycle === 'yearly' ? 'month (billed yearly)' : 'month'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {subscription && subscription.planId !== 'free' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span>Current period:</span>
                        <span>{formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}</span>
                      </div>
                      {subscription.cancelAtPeriodEnd && (
                        <Alert>
                          <AlertCircle className="w-4 h-4" />
                          <AlertDescription>
                            Your subscription will end on {formatDate(subscription.currentPeriodEnd)}
                          </AlertDescription>
                        </Alert>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                {subscription?.planId !== 'agency' && (
                  <Button 
                    onClick={() => setSelectedTab('plans')}
                    className="flex items-center gap-2"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Upgrade Plan
                  </Button>
                )}
                
                {subscription && subscription.planId !== 'free' && (
                  <Button variant="outline" onClick={updatePaymentMethod} disabled={isProcessing}>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Manage Billing
                  </Button>
                )}

                {subscription?.cancelAtPeriodEnd ? (
                  <Button variant="outline" onClick={reactivateSubscription} disabled={isProcessing}>
                    Reactivate Subscription
                  </Button>
                ) : subscription && subscription.planId !== 'free' && (
                  <Button variant="outline" onClick={cancelSubscription} disabled={isProcessing}>
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Usage Overview */}
          {usage && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Usage This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Audio Uploads</span>
                      <span>
                        {usage.currentUsage} / {usage.quota === -1 ? '∞' : usage.quota}
                      </span>
                    </div>
                    <Progress 
                      value={usage.quota === -1 ? 0 : usage.percentage} 
                      className="w-full" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{usage.currentUsage}</div>
                      <div className="text-sm text-muted-foreground">Uploads Used</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {usage.quota === -1 ? '∞' : usage.quota - usage.currentUsage}
                      </div>
                      <div className="text-sm text-muted-foreground">Remaining</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.max(0, new Date(usage.resetDate).getDate() - new Date().getDate())}
                      </div>
                      <div className="text-sm text-muted-foreground">Days to Reset</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          {/* Billing Toggle */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-4">
                <span className={cn("text-sm", billingCycle === 'monthly' ? "font-medium" : "text-muted-foreground")}>
                  Monthly
                </span>
                <Switch
                  checked={billingCycle === 'yearly'}
                  onCheckedChange={(checked) => setBillingCycle(checked ? 'yearly' : 'monthly')}
                />
                <span className={cn("text-sm", billingCycle === 'yearly' ? "font-medium" : "text-muted-foreground")}>
                  Yearly
                </span>
                {billingCycle === 'yearly' && (
                  <Badge className="bg-green-100 text-green-800">Save 17%</Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(SUBSCRIPTION_PLANS).map((plan) => {
              const isCurrentPlan = subscription?.planId === plan.id
              const price = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
              const monthlyPrice = billingCycle === 'yearly' ? plan.yearlyPrice / 12 : plan.monthlyPrice
              
              return (
                <Card key={plan.id} className={cn(
                  "relative",
                  isCurrentPlan && "ring-2 ring-primary",
                  plan.id === 'pro' && "border-primary"
                )}>
                  {plan.id === 'pro' && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {plan.name}
                      {isCurrentPlan && <Check className="w-5 h-5 text-green-500" />}
                    </CardTitle>
                    <div>
                      <span className="text-3xl font-bold">
                        {formatPrice(monthlyPrice)}
                      </span>
                      <span className="text-muted-foreground">
                        /{billingCycle === 'yearly' ? 'month' : 'month'}
                      </span>
                      {billingCycle === 'yearly' && plan.yearlyPrice > 0 && (
                        <div className="text-sm text-muted-foreground">
                          {formatPrice(plan.yearlyPrice)} billed yearly
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    
                    <Button
                      className="w-full"
                      variant={isCurrentPlan ? "outline" : plan.id === 'pro' ? "default" : "outline"}
                      disabled={isCurrentPlan || isProcessing}
                      onClick={() => plan.id !== 'free' && createCheckoutSession(plan.id, billingCycle)}
                    >
                      {isCurrentPlan ? 'Current Plan' : plan.id === 'free' ? 'Free Plan' : 'Upgrade'}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Billing Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subscription && subscription.planId !== 'free' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Current Plan</label>
                      <p className="text-sm text-muted-foreground">{currentPlan.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Next Billing Date</label>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(subscription.currentPeriodEnd)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={updatePaymentMethod} disabled={isProcessing}>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Manage Payment Method
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Invoices
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Billing Information</h3>
                  <p className="text-muted-foreground mb-4">
                    You're currently on the free plan. Upgrade to access premium features.
                  </p>
                  <Button onClick={() => setSelectedTab('plans')}>
                    View Plans
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Detailed Usage Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                <p>Detailed usage analytics and reporting coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 