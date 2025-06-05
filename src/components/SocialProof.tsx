import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Star, 
  Quote, 
  TrendingUp, 
  Users, 
  Zap,
  Crown,
  Shield,
  Award,
  CheckCircle,
  ExternalLink,
  Play,
  BarChart3,
  Globe,
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Testimonial {
  id: string
  name: string
  username: string
  avatar: string
  role: string
  company?: string
  content: string
  rating: number
  metrics?: {
    beforeViews: number
    afterViews: number
    growthPercentage: number
    timeFrame: string
  }
  platform: string
  verified: boolean
}

interface CaseStudy {
  id: string
  title: string
  creator: string
  avatar: string
  industry: string
  challenge: string
  solution: string
  results: {
    metric: string
    before: string
    after: string
    improvement: string
  }[]
  testimonial: string
  timeFrame: string
  featured: boolean
}

interface TrustIndicator {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  verified: boolean
}

export const SocialProof: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [activeTestimonial, setActiveTestimonial] = useState(0)

  useEffect(() => {
    // Mock testimonials data
    setTestimonials([
      {
        id: '1',
        name: 'Maria Rodriguez',
        username: '@maria_creates',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b732?w=60&h=60&fit=crop&crop=face',
        role: 'Content Creator',
        company: 'Spanish Lifestyle Channel',
        content: 'Podify cambió completamente mi juego de contenido. Pasé de 10K a 2.5M de visualizaciones en solo 3 meses. La función de ganchos virales en español es increíble - entiende nuestra cultura perfectamente.',
        rating: 5,
        metrics: {
          beforeViews: 10000,
          afterViews: 2500000,
          growthPercentage: 2400,
          timeFrame: '3 months'
        },
        platform: 'TikTok',
        verified: true
      },
      {
        id: '2',
        name: 'João Silva',
        username: '@joao_business',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
        role: 'Business Coach',
        company: 'Brazilian Entrepreneurs',
        content: 'O Podify me salvou 8 horas por semana. Agora posso focar em criar conteúdo ao invés de editar. Os clips gerados automaticamente conseguem 500K+ visualizações consistentemente.',
        rating: 5,
        metrics: {
          beforeViews: 25000,
          afterViews: 1200000,
          growthPercentage: 4700,
          timeFrame: '2 months'
        },
        platform: 'Instagram',
        verified: true
      },
      {
        id: '3',
        name: 'Sarah Chen',
        username: '@sarahbuilds',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face',
        role: 'SaaS Founder',
        company: 'TechStartup Inc',
        content: 'As an agency owner, Podify\'s batch processing is a game-changer. We process 50+ client videos per week and the direct publishing feature saves us hours of manual work.',
        rating: 5,
        metrics: {
          beforeViews: 50000,
          afterViews: 800000,
          growthPercentage: 1500,
          timeFrame: '6 weeks'
        },
        platform: 'LinkedIn',
        verified: true
      },
      {
        id: '4',
        name: 'Mike Thompson',
        username: '@mike_millions',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face',
        role: 'Podcast Host',
        company: 'Million Dollar Mindset',
        content: 'Podify turned my 2-hour podcast into 15 viral clips that got 10M+ views combined. The AI hook generator creates hooks that actually work - my engagement is up 400%.',
        rating: 5,
        metrics: {
          beforeViews: 100000,
          afterViews: 10000000,
          growthPercentage: 9900,
          timeFrame: '4 months'
        },
        platform: 'YouTube',
        verified: true
      }
    ])

    // Mock case studies
    setCaseStudies([
      {
        id: '1',
        title: 'Spanish Creator Hits 100M Views',
        creator: 'Maria Rodriguez',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b732?w=60&h=60&fit=crop&crop=face',
        industry: 'Lifestyle & Wellness',
        challenge: 'Struggling to create viral content in Spanish market with limited tools',
        solution: 'Used Podify\'s Spanish AI hooks and multi-platform publishing',
        results: [
          { metric: 'Monthly Views', before: '500K', after: '25M', improvement: '+4,900%' },
          { metric: 'Followers', before: '15K', after: '1.2M', improvement: '+7,900%' },
          { metric: 'Engagement Rate', before: '2.1%', after: '12.8%', improvement: '+509%' },
          { metric: 'Content Creation Time', before: '6 hours', after: '45 minutes', improvement: '-87%' }
        ],
        testimonial: 'Podify me permitió competir con creadores de habla inglesa en igualdad de condiciones.',
        timeFrame: '6 months',
        featured: true
      },
      {
        id: '2',
        title: 'Agency Scales to $500K ARR',
        creator: 'Digital Marketing Pro',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face',
        industry: 'Digital Marketing Agency',
        challenge: 'Manual video editing was bottleneck for scaling client services',
        solution: 'Implemented Podify\'s batch processing for 20+ clients',
        results: [
          { metric: 'Client Capacity', before: '5 clients', after: '25 clients', improvement: '+400%' },
          { metric: 'Monthly Revenue', before: '$50K', after: '$500K', improvement: '+900%' },
          { metric: 'Team Size', before: '3 people', after: '2 people', improvement: '-33%' },
          { metric: 'Client Satisfaction', before: '7.2/10', after: '9.8/10', improvement: '+36%' }
        ],
        testimonial: 'Podify allowed us to offer premium services at scale without hiring more editors.',
        timeFrame: '8 months',
        featured: true
      }
    ])
  }, [])

  const trustIndicators: TrustIndicator[] = [
    {
      title: 'SOC 2 Compliant',
      value: 'Type II',
      description: 'Enterprise-grade security and compliance',
      icon: <Shield className="w-6 h-6 text-green-600" />,
      verified: true
    },
    {
      title: 'Uptime SLA',
      value: '99.9%',
      description: 'Guaranteed service availability',
      icon: <CheckCircle className="w-6 h-6 text-blue-600" />,
      verified: true
    },
    {
      title: 'G2 Rating',
      value: '4.9/5',
      description: 'Based on 500+ verified reviews',
      icon: <Star className="w-6 h-6 text-yellow-500" />,
      verified: true
    },
    {
      title: 'Enterprise Customers',
      value: '50+',
      description: 'Fortune 500 companies trust us',
      icon: <Crown className="w-6 h-6 text-purple-600" />,
      verified: true
    }
  ]

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K'
    return num.toString()
  }

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="space-y-8">
      {/* Trust Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {trustIndicators.map((indicator, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-3">
              {indicator.icon}
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-bold">{indicator.value}</span>
                  {indicator.verified && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </div>
                <div className="text-sm font-medium">{indicator.title}</div>
                <div className="text-xs text-muted-foreground">
                  {indicator.description}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Featured Testimonial Carousel */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-2">
              <Quote className="w-8 h-8 text-blue-500" />
              <h2 className="text-2xl font-bold">What Creators Are Saying</h2>
            </div>

            {testimonials.length > 0 && (
              <div className="max-w-4xl mx-auto">
                <div className="space-y-6">
                  <div className="flex items-center justify-center gap-4">
                    <img 
                      src={testimonials[activeTestimonial].avatar}
                      alt={testimonials[activeTestimonial].name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">
                          {testimonials[activeTestimonial].name}
                        </span>
                        {testimonials[activeTestimonial].verified && (
                          <CheckCircle className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                      <div className="text-muted-foreground">
                        {testimonials[activeTestimonial].role} at {testimonials[activeTestimonial].company}
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: testimonials[activeTestimonial].rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <blockquote className="text-lg italic leading-relaxed">
                    "{testimonials[activeTestimonial].content}"
                  </blockquote>

                  {testimonials[activeTestimonial].metrics && (
                    <div className="bg-white/60 p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {formatNumber(testimonials[activeTestimonial].metrics!.afterViews)}
                          </div>
                          <div className="text-sm text-muted-foreground">Total Views Now</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-600">
                            +{testimonials[activeTestimonial].metrics!.growthPercentage}%
                          </div>
                          <div className="text-sm text-muted-foreground">Growth Rate</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {testimonials[activeTestimonial].metrics!.timeFrame}
                          </div>
                          <div className="text-sm text-muted-foreground">Time Frame</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-center gap-4 mt-6">
                  <Button variant="outline" onClick={prevTestimonial}>
                    ←
                  </Button>
                  <div className="flex gap-2">
                    {testimonials.map((_, index) => (
                      <div
                        key={index}
                        className={cn(
                          "w-2 h-2 rounded-full cursor-pointer",
                          index === activeTestimonial ? "bg-blue-500" : "bg-gray-300"
                        )}
                        onClick={() => setActiveTestimonial(index)}
                      />
                    ))}
                  </div>
                  <Button variant="outline" onClick={nextTestimonial}>
                    →
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Case Studies */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Success Stories</h2>
          <p className="text-muted-foreground">
            Real results from creators who transformed their content strategy with Podify
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {caseStudies.map((study) => (
            <Card key={study.id} className="overflow-hidden">
              {study.featured && (
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-center py-2 text-sm font-medium">
                  <Award className="w-4 h-4 inline mr-2" />
                  Featured Success Story
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-center gap-3">
                  <img 
                    src={study.avatar} 
                    alt={study.creator}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <CardTitle className="text-lg">{study.title}</CardTitle>
                    <p className="text-muted-foreground">{study.creator} • {study.industry}</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium text-red-600 mb-1">Challenge</h4>
                  <p className="text-sm text-muted-foreground">{study.challenge}</p>
                </div>

                <div>
                  <h4 className="font-medium text-blue-600 mb-1">Solution</h4>
                  <p className="text-sm text-muted-foreground">{study.solution}</p>
                </div>

                <div>
                  <h4 className="font-medium text-green-600 mb-2">Results ({study.timeFrame})</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {study.results.map((result, index) => (
                      <div key={index} className="bg-muted/50 p-3 rounded">
                        <div className="text-xs text-muted-foreground">{result.metric}</div>
                        <div className="font-medium">{result.before} → {result.after}</div>
                        <div className="text-xs text-green-600 font-medium">{result.improvement}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <blockquote className="italic text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-500">
                  "{study.testimonial}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Join Thousands of Satisfied Creators</h2>
          <p className="text-muted-foreground">
            See what our global community is saying about their Podify experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img 
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm">{testimonial.name}</span>
                      {testimonial.verified && (
                        <CheckCircle className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {testimonial.username} • {testimonial.platform}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {testimonial.role}
                  </Badge>
                </div>

                <div className="flex items-center gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                <p className="text-sm leading-relaxed">
                  {testimonial.content}
                </p>

                {testimonial.metrics && (
                  <div className="bg-muted/50 p-2 rounded text-xs">
                    <div className="font-medium text-green-600">
                      +{testimonial.metrics.growthPercentage}% growth in {testimonial.metrics.timeFrame}
                    </div>
                    <div className="text-muted-foreground">
                      {formatNumber(testimonial.metrics.beforeViews)} → {formatNumber(testimonial.metrics.afterViews)} views
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Social Proof Stats */}
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <h2 className="text-2xl font-bold">Trusted by Creators Worldwide</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold">10K+</div>
                <div className="text-sm opacity-75">Active Creators</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">2.5B+</div>
                <div className="text-sm opacity-75">Views Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">500K+</div>
                <div className="text-sm opacity-75">Clips Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">95%</div>
                <div className="text-sm opacity-75">Satisfaction Rate</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4">
              <Badge className="bg-white/20 text-white border-white/30">
                <Globe className="w-3 h-3 mr-1" />
                8 Languages Supported
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <TrendingUp className="w-3 h-3 mr-1" />
                Average 400% Growth
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30">
                <Zap className="w-3 h-3 mr-1" />
                90% Time Saved
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 