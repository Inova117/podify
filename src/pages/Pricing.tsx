import React from 'react'
import { PricingPlans } from '@/components/PricingPlans'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ArrowLeft, 
  Shield, 
  Headphones, 
  Zap, 
  Users,
  Star,
  CheckCircle,
  MessageCircle
} from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <Link to="/auth" className="text-primary hover:underline">
            Sign In
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4">Simple, Transparent Pricing</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Choose the Perfect Plan
            <br />
            <span className="text-primary">for Your Needs</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start free and scale as you grow. All plans include our core AI features,
            with advanced capabilities and higher limits as you upgrade.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-8 mb-16 opacity-60">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="text-sm">SOC 2 Compliant</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">99.9% Uptime SLA</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            <span className="text-sm">4.9/5 Customer Rating</span>
          </div>
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5" />
            <span className="text-sm">24/7 Support</span>
          </div>
        </div>

        {/* Pricing Plans */}
        <PricingPlans showHeader={false} />

        {/* Enterprise Section */}
        <div className="mt-20 mb-16">
          <Card className="border-2 border-dashed border-muted-foreground/20">
            <CardContent className="p-8 text-center">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">Need Something Custom?</h3>
                <p className="text-muted-foreground mb-6">
                  Looking for custom integrations, on-premise deployment, or volume discounts? 
                  Our enterprise team can help you build the perfect solution.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button size="lg">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Contact Sales
                  </Button>
                  <Button variant="outline" size="lg">
                    Schedule Demo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Spotlight */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Process your audio files in real-time with our optimized AI pipeline. 
                Most files are ready in under 2 minutes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Team Collaboration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Work together seamlessly with role-based permissions, shared workspaces, 
                and real-time collaboration features.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Enterprise Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your data is protected with enterprise-grade security, encryption at rest, 
                and compliance with industry standards.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center py-16">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of content creators who are already transforming their audio 
            into engaging content with our AI-powered platform.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/auth?mode=signup">Start Free Trial</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/demo">Watch Demo</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            No credit card required • 7-day free trial • Cancel anytime
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/support" className="text-sm text-muted-foreground hover:text-foreground">
                Support
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Podify Content Genius. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
