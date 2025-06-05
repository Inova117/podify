import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Upload, 
  Calendar, 
  Clock, 
  Share2, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  Settings,
  Zap,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Repeat2,
  PlayCircle,
  Image,
  Video,
  Smartphone
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { 
  PLATFORM_CONFIGS, 
  CONTENT_FORMATS,
  type PlatformConfig,
  type ContentFormat 
} from '@/lib/languages'
import { toast } from 'sonner'

interface PlatformConnection {
  platform: keyof typeof PLATFORM_CONFIGS
  connected: boolean
  username?: string
  avatar?: string
  followers?: number
  lastPost?: string
}

interface PublishJob {
  id: string
  platform: keyof typeof PLATFORM_CONFIGS
  status: 'pending' | 'uploading' | 'processing' | 'published' | 'failed'
  progress: number
  videoUrl?: string
  caption?: string
  scheduledTime?: string
  publishedUrl?: string
  error?: string
  metrics?: {
    views?: number
    likes?: number
    comments?: number
    shares?: number
  }
}

interface MultiPlatformPublisherProps {
  videoFile?: File
  videoUrl?: string
  generatedCaption?: string
  selectedFormat?: ContentFormat
  onPublishComplete?: (results: PublishJob[]) => void
  className?: string
}

export const MultiPlatformPublisher: React.FC<MultiPlatformPublisherProps> = ({
  videoFile,
  videoUrl,
  generatedCaption = '',
  selectedFormat = 'tiktok',
  onPublishComplete,
  className
}) => {
  const [connections, setConnections] = useState<PlatformConnection[]>([
    {
      platform: 'tiktok',
      connected: false, // Would be true in production with OAuth
      username: '@yourhandle',
      followers: 125400,
      lastPost: '2 hours ago'
    },
    {
      platform: 'instagram',
      connected: false,
      username: '@yourhandle',
      followers: 89200,
      lastPost: '4 hours ago'
    },
    {
      platform: 'youtube',
      connected: false,
      username: 'Your Channel',
      followers: 45600,
      lastPost: '1 day ago'
    },
    {
      platform: 'linkedin',
      connected: false,
      username: 'Your Name',
      followers: 12800,
      lastPost: '3 days ago'
    },
    {
      platform: 'twitter',
      connected: false,
      username: '@yourhandle',
      followers: 34500,
      lastPost: '6 hours ago'
    }
  ])

  const [selectedPlatforms, setSelectedPlatforms] = useState<(keyof typeof PLATFORM_CONFIGS)[]>(['tiktok'])
  const [caption, setCaption] = useState(generatedCaption)
  const [scheduleEnabled, setScheduleEnabled] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [publishJobs, setPublishJobs] = useState<PublishJob[]>([])
  const [isPublishing, setIsPublishing] = useState(false)
  const [activeTab, setActiveTab] = useState('platforms')

  useEffect(() => {
    setCaption(generatedCaption)
  }, [generatedCaption])

  // Mock OAuth connection
  const connectPlatform = async (platform: keyof typeof PLATFORM_CONFIGS) => {
    toast.info(`Connecting to ${platform}...`)
    
    // Simulate OAuth flow
    setTimeout(() => {
      setConnections(prev => prev.map(conn => 
        conn.platform === platform 
          ? { ...conn, connected: true }
          : conn
      ))
      toast.success(`Connected to ${platform}!`)
    }, 1500)
  }

  // Disconnect platform
  const disconnectPlatform = (platform: keyof typeof PLATFORM_CONFIGS) => {
    setConnections(prev => prev.map(conn => 
      conn.platform === platform 
        ? { ...conn, connected: false }
        : conn
    ))
    setSelectedPlatforms(prev => prev.filter(p => p !== platform))
    toast.success(`Disconnected from ${platform}`)
  }

  // Toggle platform selection
  const togglePlatform = (platform: keyof typeof PLATFORM_CONFIGS) => {
    const connection = connections.find(c => c.platform === platform)
    if (!connection?.connected) {
      toast.error('Please connect to this platform first')
      return
    }

    setSelectedPlatforms(prev => 
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    )
  }

  // Publish to selected platforms
  const publishToAll = async () => {
    if (!videoFile && !videoUrl) {
      toast.error('No video to publish')
      return
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform')
      return
    }

    setIsPublishing(true)
    setActiveTab('progress')

    // Create jobs for each platform
    const jobs: PublishJob[] = selectedPlatforms.map(platform => ({
      id: `job-${platform}-${Date.now()}`,
      platform,
      status: 'pending',
      progress: 0,
      videoUrl: videoUrl || URL.createObjectURL(videoFile!),
      caption,
      scheduledTime: scheduleEnabled ? `${scheduleDate} ${scheduleTime}` : undefined
    }))

    setPublishJobs(jobs)

    // Simulate publishing process
    for (const job of jobs) {
      await simulatePublishing(job)
    }

    setIsPublishing(false)
    onPublishComplete?.(publishJobs)
    toast.success(`Published to ${selectedPlatforms.length} platforms!`)
  }

  // Simulate the publishing process
  const simulatePublishing = async (job: PublishJob) => {
    const updateJob = (updates: Partial<PublishJob>) => {
      setPublishJobs(prev => prev.map(j => 
        j.id === job.id ? { ...j, ...updates } : j
      ))
    }

    // Upload phase
    updateJob({ status: 'uploading' })
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200))
      updateJob({ progress: i * 0.3 }) // 0-30%
    }

    // Processing phase
    updateJob({ status: 'processing' })
    for (let i = 30; i <= 70; i += 5) {
      await new Promise(resolve => setTimeout(resolve, 300))
      updateJob({ progress: i })
    }

    // Publishing phase
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 95% success rate simulation
    const success = Math.random() > 0.05
    
    if (success) {
      updateJob({ 
        status: 'published',
        progress: 100,
        publishedUrl: `https://${job.platform}.com/your-video-id`,
        metrics: {
          views: Math.floor(Math.random() * 1000),
          likes: Math.floor(Math.random() * 100),
          comments: Math.floor(Math.random() * 20),
          shares: Math.floor(Math.random() * 10)
        }
      })
    } else {
      updateJob({ 
        status: 'failed',
        progress: 70,
        error: 'Upload timeout. Please try again.'
      })
    }
  }

  const getPlatformIcon = (platform: keyof typeof PLATFORM_CONFIGS) => {
    switch (platform) {
      case 'tiktok': return '🎵'
      case 'instagram': return '📷'
      case 'youtube': return '📺'
      case 'linkedin': return '💼'
      case 'twitter': return '🐦'
      default: return '📱'
    }
  }

  const getPlatformColor = (platform: keyof typeof PLATFORM_CONFIGS) => {
    switch (platform) {
      case 'tiktok': return 'from-pink-500 to-red-500'
      case 'instagram': return 'from-purple-500 to-pink-500'
      case 'youtube': return 'from-red-500 to-red-600'
      case 'linkedin': return 'from-blue-600 to-blue-700'
      case 'twitter': return 'from-blue-400 to-blue-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusIcon = (status: PublishJob['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'uploading': return <Upload className="w-4 h-4 text-blue-500 animate-pulse" />
      case 'processing': return <Zap className="w-4 h-4 text-purple-500 animate-spin" />
      case 'published': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-blue-500" />
          Multi-Platform Publisher
          <Badge className="ml-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            One-Click Magic
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Publish directly to TikTok, Instagram, YouTube, LinkedIn, and X. No downloads needed!
        </p>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="platforms">Platforms</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="platforms" className="space-y-4">
            <div className="grid gap-3">
              {connections.map((connection) => (
                <Card 
                  key={connection.platform}
                  className={cn(
                    "p-4 cursor-pointer transition-all",
                    connection.connected && selectedPlatforms.includes(connection.platform)
                      ? "ring-2 ring-primary bg-primary/5"
                      : ""
                  )}
                  onClick={() => connection.connected && togglePlatform(connection.platform)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center text-white bg-gradient-to-r",
                        getPlatformColor(connection.platform)
                      )}>
                        <span className="text-lg">{getPlatformIcon(connection.platform)}</span>
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium capitalize">{connection.platform}</h3>
                          {connection.connected && (
                            <Badge className="bg-green-100 text-green-800 text-xs">Connected</Badge>
                          )}
                        </div>
                        {connection.connected ? (
                          <div className="text-sm text-muted-foreground">
                            {connection.username} • {connection.followers?.toLocaleString()} followers
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            Not connected
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {connection.connected && (
                        <div className="flex items-center gap-1">
                          {selectedPlatforms.includes(connection.platform) && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      )}
                      
                      {connection.connected ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            disconnectPlatform(connection.platform)
                          }}
                        >
                          Disconnect
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            connectPlatform(connection.platform)
                          }}
                        >
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Selected: {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-muted-foreground">
                Connect your accounts to start publishing. Your content will be optimized for each platform automatically.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Caption</label>
              <Textarea
                placeholder="Write your caption here..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Caption will be automatically adapted for each platform's requirements.
              </p>
            </div>

            {(videoFile || videoUrl) && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Video Preview</label>
                <div className="border rounded-lg p-4 text-center">
                  <Video className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {videoFile ? videoFile.name : 'Generated video clip'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ready for {selectedFormat} format
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-3">
                <div className="text-center">
                  <Smartphone className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <div className="text-sm font-medium">Auto-Format</div>
                  <div className="text-xs text-muted-foreground">
                    9:16 for TikTok/Reels, 1:1 for LinkedIn
                  </div>
                </div>
              </Card>
              
              <Card className="p-3">
                <div className="text-center">
                  <Settings className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <div className="text-sm font-medium">Auto-Optimize</div>
                  <div className="text-xs text-muted-foreground">
                    Quality, bitrate, and specs per platform
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Schedule for Later</h3>
                <p className="text-sm text-muted-foreground">
                  Post at the optimal time for your audience
                </p>
              </div>
              <Switch
                checked={scheduleEnabled}
                onCheckedChange={setScheduleEnabled}
              />
            </div>

            {scheduleEnabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Date</label>
                  <Input
                    type="date"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Time</label>
                  <Input
                    type="time"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                  />
                </div>
              </div>
            )}

            <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
              <h4 className="font-medium text-sm mb-2">🕒 Best Times to Post</h4>
              <div className="text-xs space-y-1">
                <div><strong>TikTok:</strong> 6-10 AM, 7-9 PM EST</div>
                <div><strong>Instagram:</strong> 11 AM-1 PM, 7-9 PM EST</div>
                <div><strong>YouTube:</strong> 2-4 PM, 8-11 PM EST</div>
                <div><strong>LinkedIn:</strong> 8-10 AM, 12-2 PM EST</div>
                <div><strong>Twitter:</strong> 9 AM-12 PM, 7-9 PM EST</div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            {publishJobs.length === 0 ? (
              <div className="text-center py-8">
                <Share2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Ready to Publish</h3>
                <p className="text-muted-foreground">
                  Configure your platforms and content, then hit publish!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {publishJobs.map((job) => (
                  <Card key={job.id} className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center text-white bg-gradient-to-r text-sm",
                          getPlatformColor(job.platform)
                        )}>
                          {getPlatformIcon(job.platform)}
                        </div>
                        <div>
                          <div className="font-medium capitalize">{job.platform}</div>
                          <div className="text-sm text-muted-foreground">
                            {job.status === 'published' ? 'Published successfully' : 
                             job.status === 'failed' ? 'Upload failed' :
                             'Publishing...'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusIcon(job.status)}
                        {job.status === 'published' && job.publishedUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={job.publishedUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>

                    <Progress value={job.progress} className="mb-2" />
                    
                    {job.error && (
                      <div className="text-sm text-red-600 mb-2">{job.error}</div>
                    )}

                    {job.metrics && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {job.metrics.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {job.metrics.likes}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          {job.metrics.comments}
                        </div>
                        <div className="flex items-center gap-1">
                          <Repeat2 className="w-3 h-3" />
                          {job.metrics.shares}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {activeTab !== 'progress' && (
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              Ready to publish to {selectedPlatforms.length} platform{selectedPlatforms.length !== 1 ? 's' : ''}
            </div>
            <Button
              onClick={publishToAll}
              disabled={isPublishing || selectedPlatforms.length === 0}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              {isPublishing ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-pulse" />
                  Publishing...
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  {scheduleEnabled ? 'Schedule Posts' : 'Publish Now'}
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 