import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Share2, 
  Trophy, 
  Users, 
  Gift, 
  Copy, 
  Check,
  TrendingUp,
  Sparkles,
  Crown,
  Medal,
  Star,
  ExternalLink,
  Zap,
  Heart,
  MessageCircle,
  Play,
  Eye
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ViralContent {
  id: string
  title: string
  creator: string
  avatar: string
  views: number
  likes: number
  comments: number
  shares: number
  platform: string
  createdAt: string
  thumbnailUrl: string
  madeWithPodify: boolean
}

interface Referral {
  id: string
  email: string
  status: 'pending' | 'signed_up' | 'converted'
  signupDate?: string
  reward: string
}

interface LeaderboardEntry {
  rank: number
  username: string
  avatar: string
  totalViews: number
  totalClips: number
  growth: number
  badge?: string
}

export const ViralGrowthEngine: React.FC = () => {
  const [activeTab, setActiveTab] = useState('sharing')
  const [referralCode, setReferralCode] = useState('PODIFY-CREATOR-123')
  const [copiedCode, setCopiedCode] = useState(false)
  const [viralContent, setViralContent] = useState<ViralContent[]>([])
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [userRank, setUserRank] = useState(47)
  const [totalReferralRewards, setTotalReferralRewards] = useState(240) // In dollars

  useEffect(() => {
    // Mock data for viral content
    setViralContent([
      {
        id: '1',
        title: 'How I Built a $100K Business',
        creator: '@entrepreneur_mike',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        views: 2450000,
        likes: 89200,
        comments: 3400,
        shares: 12800,
        platform: 'TikTok',
        createdAt: '2 days ago',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=200&h=300&fit=crop',
        madeWithPodify: true
      },
      {
        id: '2',
        title: 'Productivity Hacks That Changed My Life',
        creator: '@productivitypro',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b732?w=40&h=40&fit=crop&crop=face',
        views: 1890000,
        likes: 67800,
        comments: 2100,
        shares: 8900,
        platform: 'Instagram',
        createdAt: '4 days ago',
        thumbnailUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=200&h=300&fit=crop',
        madeWithPodify: true
      },
      {
        id: '3',
        title: 'The Truth About Passive Income',
        creator: '@finance_freedom',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        views: 3200000,
        likes: 125000,
        comments: 5600,
        shares: 18900,
        platform: 'YouTube',
        createdAt: '1 week ago',
        thumbnailUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=200&h=300&fit=crop',
        madeWithPodify: true
      }
    ])

    // Mock referrals
    setReferrals([
      { id: '1', email: 'sarah@creator.com', status: 'converted', signupDate: '2024-01-15', reward: '1 month free' },
      { id: '2', email: 'mike@business.com', status: 'signed_up', signupDate: '2024-01-18', reward: '1 month free' },
      { id: '3', email: 'lisa@influencer.com', status: 'pending', reward: '1 month free' },
      { id: '4', email: 'john@podcast.com', status: 'converted', signupDate: '2024-01-20', reward: '1 month free' }
    ])

    // Mock leaderboard
    setLeaderboard([
      { rank: 1, username: '@viral_queen', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b732?w=40&h=40&fit=crop&crop=face', totalViews: 12500000, totalClips: 156, growth: 340, badge: 'Crown' },
      { rank: 2, username: '@content_king', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face', totalViews: 9800000, totalClips: 134, growth: 280, badge: 'Gold' },
      { rank: 3, username: '@creator_pro', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face', totalViews: 7200000, totalClips: 98, growth: 190, badge: 'Silver' },
      { rank: 4, username: '@podify_master', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face', totalViews: 5100000, totalClips: 87, growth: 150 },
      { rank: 5, username: '@viral_creator', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face', totalViews: 4200000, totalClips: 76, growth: 120 }
    ])
  }, [])

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode)
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
      toast.success('Referral code copied!')
    } catch (error) {
      toast.error('Failed to copy code')
    }
  }

  const shareOnSocial = (platform: string) => {
    const shareText = `Just created amazing viral content with @Podify! 🚀 
    
Transform any audio into viral clips in multiple languages with AI hooks that actually work. 

Use my code ${referralCode} for a free month! 

#PodifyCreator #ViralContent #AIContent`

    const encodedText = encodeURIComponent(shareText)
    let shareUrl = ''

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=https://podify.com`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=https://podify.com&summary=${encodedText}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=https://podify.com&quote=${encodedText}`
        break
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
      toast.success(`Sharing on ${platform}!`)
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getBadgeIcon = (badge?: string) => {
    switch (badge) {
      case 'Crown': return <Crown className="w-4 h-4 text-yellow-500" />
      case 'Gold': return <Medal className="w-4 h-4 text-yellow-600" />
      case 'Silver': return <Medal className="w-4 h-4 text-gray-400" />
      default: return <Star className="w-4 h-4 text-gray-300" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'converted': return 'bg-green-100 text-green-800'
      case 'signed_up': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const convertedReferrals = referrals.filter(r => r.status === 'converted').length
  const pendingReferrals = referrals.filter(r => r.status === 'pending').length
  const conversionRate = referrals.length > 0 ? (convertedReferrals / referrals.length) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Referrals</p>
                <p className="text-2xl font-bold">{referrals.length}</p>
                <p className="text-xs text-green-600">+{convertedReferrals} converted</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rewards Earned</p>
                <p className="text-2xl font-bold">${totalReferralRewards}</p>
                <p className="text-xs text-green-600">Free months & credits</p>
              </div>
              <Gift className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Your Rank</p>
                <p className="text-2xl font-bold">#{userRank}</p>
                <p className="text-xs text-blue-600">Top 15% creator</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">{conversionRate.toFixed(0)}%</p>
                <p className="text-xs text-green-600">Above average</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Viral Growth Engine
            <Badge className="ml-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              10x Growth
            </Badge>
          </CardTitle>
          <p className="text-muted-foreground">
            Built-in viral features that help your content and Podify grow together organically.
          </p>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sharing">Social Sharing</TabsTrigger>
              <TabsTrigger value="referrals">Referral Program</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="viral">Viral Gallery</TabsTrigger>
            </TabsList>

            <TabsContent value="sharing" className="space-y-6">
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Share Your Podify Journey</h3>
                  <p className="text-muted-foreground mb-4">
                    Get 1 month free for every successful referral! Share your code and watch your network grow.
                  </p>
                  
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Input 
                      value={referralCode} 
                      readOnly 
                      className="text-center font-mono font-bold"
                    />
                    <Button onClick={copyReferralCode}>
                      {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <Button
                      onClick={() => shareOnSocial('twitter')}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Twitter
                    </Button>
                    <Button
                      onClick={() => shareOnSocial('linkedin')}
                      className="bg-blue-700 hover:bg-blue-800"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                    <Button
                      onClick={() => shareOnSocial('facebook')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Facebook
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4">
                    <div className="text-center">
                      <Gift className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                      <h4 className="font-medium">Free Month</h4>
                      <p className="text-sm text-muted-foreground">For every conversion</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                      <h4 className="font-medium">Leaderboard</h4>
                      <p className="text-sm text-muted-foreground">Compete with creators</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <Crown className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                      <h4 className="font-medium">VIP Status</h4>
                      <p className="text-sm text-muted-foreground">Top 10 get perks</p>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="referrals" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Your Referrals</h3>
                  <Badge variant="outline">{referrals.length} total</Badge>
                </div>

                <div className="space-y-3">
                  {referrals.map((referral) => (
                    <Card key={referral.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {referral.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{referral.email}</div>
                            <div className="text-sm text-muted-foreground">
                              {referral.signupDate ? `Signed up ${referral.signupDate}` : 'Invitation pending'}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={cn("text-xs", getStatusColor(referral.status))}>
                            {referral.status.replace('_', ' ')}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {referral.reward}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <Card className="p-4 bg-gradient-to-r from-green-50 to-blue-50">
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">Referral Program Benefits</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium">1 Month Free</div>
                        <div className="text-muted-foreground">Per successful referral</div>
                      </div>
                      <div>
                        <div className="font-medium">No Limit</div>
                        <div className="text-muted-foreground">Refer as many as you want</div>
                      </div>
                      <div>
                        <div className="font-medium">Instant Credit</div>
                        <div className="text-muted-foreground">Applied automatically</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Podify Viral Hall of Fame</h3>
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    Weekly Contest
                  </Badge>
                </div>

                <div className="space-y-3">
                  {leaderboard.map((entry) => (
                    <Card key={entry.rank} className={cn(
                      "p-4",
                      entry.rank <= 3 ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200" : ""
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                            entry.rank === 1 ? "bg-yellow-500 text-white" :
                            entry.rank === 2 ? "bg-gray-400 text-white" :
                            entry.rank === 3 ? "bg-orange-600 text-white" :
                            "bg-muted text-muted-foreground"
                          )}>
                            {entry.rank}
                          </div>
                          
                          <img 
                            src={entry.avatar} 
                            alt={entry.username}
                            className="w-10 h-10 rounded-full"
                          />
                          
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{entry.username}</span>
                              {entry.badge && getBadgeIcon(entry.badge)}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {entry.totalClips} clips • {formatNumber(entry.totalViews)} total views
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-medium text-green-600">
                            +{entry.growth}% growth
                          </div>
                          <div className="text-sm text-muted-foreground">
                            This week
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50">
                  <div className="text-center">
                    <h4 className="font-semibold mb-2">Your Stats</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Rank #{userRank}</div>
                        <div className="text-muted-foreground">Current position</div>
                      </div>
                      <div>
                        <div className="font-medium">15 clips</div>
                        <div className="text-muted-foreground">This week</div>
                      </div>
                      <div>
                        <div className="font-medium">+127%</div>
                        <div className="text-muted-foreground">Growth rate</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="viral" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Made with Podify - Viral Content</h3>
                  <Badge variant="outline">{viralContent.length} featured</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {viralContent.map((content) => (
                    <Card key={content.id} className="overflow-hidden">
                      <div className="relative">
                        <img 
                          src={content.thumbnailUrl} 
                          alt={content.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-black/70 text-white text-xs">
                            {content.platform}
                          </Badge>
                        </div>
                        {content.madeWithPodify && (
                          <div className="absolute bottom-2 left-2">
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Made with Podify
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="font-medium line-clamp-2">{content.title}</h4>
                          
                          <div className="flex items-center gap-2">
                            <img 
                              src={content.avatar} 
                              alt={content.creator}
                              className="w-6 h-6 rounded-full"
                            />
                            <span className="text-sm text-muted-foreground">
                              {content.creator}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {formatNumber(content.views)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="w-3 h-3" />
                                {formatNumber(content.likes)}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                {formatNumber(content.comments)}
                              </div>
                            </div>
                            <div className="text-xs">
                              {content.createdAt}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="p-6 text-center bg-gradient-to-r from-blue-50 to-purple-50">
                  <h4 className="font-semibold mb-2">Get Featured in Our Gallery</h4>
                  <p className="text-muted-foreground mb-4">
                    Create viral content with Podify and tag us to be featured in our hall of fame!
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <Badge variant="outline">Tag @PodifyAI</Badge>
                    <Badge variant="outline">#MadeWithPodify</Badge>
                    <Badge variant="outline">#PodifyCreator</Badge>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 