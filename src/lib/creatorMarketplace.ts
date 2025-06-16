import { supabase } from '@/integrations/supabase/client';

// Types and Interfaces
export interface CreatorProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio: string;
  niche: string[];
  follower_count: {
    instagram?: number;
    tiktok?: number;
    youtube?: number;
    linkedin?: number;
    twitter?: number;
  };
  engagement_rate: number;
  location: string;
  languages: string[];
  content_categories: string[];
  collaboration_rate: number; // USD per post
  preferred_brands: string[];
  past_collaborations: number;
  rating: number; // 1-5 stars
  verified: boolean;
  created_at: Date;
}

export interface BrandProfile {
  id: string;
  name: string;
  logo_url?: string;
  description: string;
  industry: string;
  website: string;
  target_audience: {
    age_range: string;
    gender: string;
    interests: string[];
    location: string[];
  };
  budget_range: {
    min: number;
    max: number;
  };
  campaign_types: string[]; // ['sponsored_post', 'product_review', 'brand_ambassador', 'event_coverage']
  preferred_platforms: string[];
  brand_values: string[];
  collaboration_history: number;
  rating: number;
  verified: boolean;
  created_at: Date;
}

export interface BrandMatch {
  brand: BrandProfile;
  compatibility_score: number; // 0-100
  match_reasons: string[];
  estimated_payment: number;
  campaign_fit: string;
  audience_overlap: number; // percentage
  engagement_potential: number;
  collaboration_type: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface Campaign {
  id: string;
  brand_id: string;
  title: string;
  description: string;
  requirements: {
    follower_min: number;
    engagement_min: number;
    content_type: string[];
    platforms: string[];
    demographics: any;
  };
  budget: number;
  deadline: Date;
  deliverables: string[];
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  applications: number;
  selected_creators: string[];
  created_at: Date;
}

export interface MonetizationStrategy {
  content_id: string;
  revenue_potential: number;
  optimization_suggestions: {
    type: string;
    description: string;
    impact: number; // percentage increase
    effort: 'low' | 'medium' | 'high';
  }[];
  recommended_platforms: {
    platform: string;
    revenue_potential: number;
    reasoning: string;
  }[];
  pricing_recommendations: {
    sponsored_post: number;
    story_mention: number;
    video_integration: number;
    long_term_partnership: number;
  };
  audience_value: {
    cpm: number; // cost per mille
    engagement_value: number;
    conversion_potential: number;
  };
}

export interface SponsorshipDashboard {
  active_campaigns: Campaign[];
  pending_applications: any[];
  completed_collaborations: any[];
  total_earnings: number;
  monthly_earnings: number;
  performance_metrics: {
    avg_engagement: number;
    brand_satisfaction: number;
    completion_rate: number;
  };
  upcoming_payments: {
    amount: number;
    brand: string;
    due_date: Date;
  }[];
}

export interface Creator {
  id: string;
  profile: CreatorProfile;
  compatibility_score?: number;
  collaboration_potential?: string;
}

// Creator Marketplace Class
export class CreatorMarketplace {
  private static instance: CreatorMarketplace;

  public static getInstance(): CreatorMarketplace {
    if (!CreatorMarketplace.instance) {
      CreatorMarketplace.instance = new CreatorMarketplace();
    }
    return CreatorMarketplace.instance;
  }

  // Brand Matching Algorithm
  async matchBrands(creatorProfile: CreatorProfile): Promise<BrandMatch[]> {
    try {
      // In production, this would query a real brands database
      const mockBrands = await this.getMockBrands();
      
      const matches: BrandMatch[] = [];
      
      for (const brand of mockBrands) {
        const compatibility = this.calculateCompatibility(creatorProfile, brand);
        
        if (compatibility.score >= 60) { // Only show good matches
          matches.push({
            brand,
            compatibility_score: compatibility.score,
            match_reasons: compatibility.reasons,
            estimated_payment: this.estimatePayment(creatorProfile, brand),
            campaign_fit: this.determineCampaignFit(creatorProfile, brand),
            audience_overlap: this.calculateAudienceOverlap(creatorProfile, brand),
            engagement_potential: this.calculateEngagementPotential(creatorProfile, brand),
            collaboration_type: this.suggestCollaborationType(creatorProfile, brand),
            urgency: this.determineUrgency(brand)
          });
        }
      }
      
      // Sort by compatibility score
      return matches.sort((a, b) => b.compatibility_score - a.compatibility_score);
    } catch (error) {
      console.error('Error matching brands:', error);
      throw new Error('Failed to match brands');
    }
  }

  // Revenue Optimization
  async optimizeMonetization(content: any[]): Promise<MonetizationStrategy[]> {
    try {
      const strategies: MonetizationStrategy[] = [];
      
      for (const item of content) {
        const strategy = await this.analyzeContentMonetization(item);
        strategies.push(strategy);
      }
      
      return strategies;
    } catch (error) {
      console.error('Error optimizing monetization:', error);
      throw new Error('Failed to optimize monetization');
    }
  }

  // Find Collaborators
  async findCollaborators(niche: string, minAudience: number): Promise<Creator[]> {
    try {
      // In production, this would query the creators database
      const mockCreators = await this.getMockCreators();
      
      return mockCreators
        .filter(creator => {
          const totalFollowers = Object.values(creator.profile.follower_count)
            .reduce((sum, count) => sum + (count || 0), 0);
          
          return creator.profile.niche.includes(niche) && 
                 totalFollowers >= minAudience &&
                 creator.profile.verified;
        })
        .map(creator => ({
          ...creator,
          compatibility_score: Math.floor(Math.random() * 30) + 70, // 70-100
          collaboration_potential: this.assessCollaborationPotential(creator.profile)
        }))
        .sort((a, b) => (b.compatibility_score || 0) - (a.compatibility_score || 0));
    } catch (error) {
      console.error('Error finding collaborators:', error);
      throw new Error('Failed to find collaborators');
    }
  }

  // Sponsorship Management
  async manageSponsorships(creatorId: string): Promise<SponsorshipDashboard> {
    try {
      // In production, this would query real data from database
      const mockDashboard: SponsorshipDashboard = {
        active_campaigns: await this.getActiveCampaigns(creatorId),
        pending_applications: await this.getPendingApplications(creatorId),
        completed_collaborations: await this.getCompletedCollaborations(creatorId),
        total_earnings: 45750,
        monthly_earnings: 8500,
        performance_metrics: {
          avg_engagement: 7.8,
          brand_satisfaction: 4.6,
          completion_rate: 94
        },
        upcoming_payments: [
          { amount: 2500, brand: 'TechCorp', due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
          { amount: 1800, brand: 'FashionBrand', due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) }
        ]
      };
      
      return mockDashboard;
    } catch (error) {
      console.error('Error managing sponsorships:', error);
      throw new Error('Failed to manage sponsorships');
    }
  }

  // Private helper methods
  private calculateCompatibility(creator: CreatorProfile, brand: BrandProfile): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];
    
    // Niche alignment (30 points)
    const nicheMatch = creator.niche.some(n => 
      brand.target_audience.interests.some(i => 
        i.toLowerCase().includes(n.toLowerCase()) || n.toLowerCase().includes(i.toLowerCase())
      )
    );
    if (nicheMatch) {
      score += 30;
      reasons.push('Nicho alineado con intereses de la marca');
    }
    
    // Audience size (25 points)
    const totalFollowers = Object.values(creator.follower_count).reduce((sum, count) => sum + (count || 0), 0);
    if (totalFollowers >= 10000) {
      score += 25;
      reasons.push('Audiencia suficiente para impacto de marca');
    } else if (totalFollowers >= 1000) {
      score += 15;
      reasons.push('Audiencia en crecimiento');
    }
    
    // Engagement rate (20 points)
    if (creator.engagement_rate >= 5) {
      score += 20;
      reasons.push('Alta tasa de engagement');
    } else if (creator.engagement_rate >= 3) {
      score += 10;
      reasons.push('Buena tasa de engagement');
    }
    
    // Platform alignment (15 points)
    const platformMatch = brand.preferred_platforms.some(p => 
      Object.keys(creator.follower_count).includes(p)
    );
    if (platformMatch) {
      score += 15;
      reasons.push('Plataformas preferidas coinciden');
    }
    
    // Location match (10 points)
    if (brand.target_audience.location.includes(creator.location)) {
      score += 10;
      reasons.push('Ubicación geográfica alineada');
    }
    
    return { score: Math.min(score, 100), reasons };
  }

  private estimatePayment(creator: CreatorProfile, brand: BrandProfile): number {
    const baseRate = creator.collaboration_rate || 100;
    const totalFollowers = Object.values(creator.follower_count).reduce((sum, count) => sum + (count || 0), 0);
    const followerMultiplier = Math.log10(totalFollowers / 1000) || 1;
    const engagementMultiplier = creator.engagement_rate / 5;
    
    return Math.round(baseRate * followerMultiplier * engagementMultiplier);
  }

  private determineCampaignFit(creator: CreatorProfile, brand: BrandProfile): string {
    const fits = ['Sponsored Post', 'Product Review', 'Brand Ambassador', 'Event Coverage'];
    return fits[Math.floor(Math.random() * fits.length)];
  }

  private calculateAudienceOverlap(creator: CreatorProfile, brand: BrandProfile): number {
    // Simplified calculation - in production would use real audience data
    return Math.floor(Math.random() * 40) + 30; // 30-70%
  }

  private calculateEngagementPotential(creator: CreatorProfile, brand: BrandProfile): number {
    return Math.floor(creator.engagement_rate * 10) + Math.floor(Math.random() * 20);
  }

  private suggestCollaborationType(creator: CreatorProfile, brand: BrandProfile): string {
    const types = ['Sponsored Content', 'Product Integration', 'Brand Partnership', 'Affiliate Marketing'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private determineUrgency(brand: BrandProfile): 'low' | 'medium' | 'high' {
    const urgencies: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
    return urgencies[Math.floor(Math.random() * urgencies.length)];
  }

  private async analyzeContentMonetization(content: any): Promise<MonetizationStrategy> {
    // Mock monetization analysis
    return {
      content_id: content.id || 'mock-id',
      revenue_potential: Math.floor(Math.random() * 5000) + 1000,
      optimization_suggestions: [
        {
          type: 'Platform Optimization',
          description: 'Publicar en horarios de mayor engagement',
          impact: 25,
          effort: 'low'
        },
        {
          type: 'Content Enhancement',
          description: 'Agregar call-to-action más efectivo',
          impact: 35,
          effort: 'medium'
        }
      ],
      recommended_platforms: [
        {
          platform: 'Instagram',
          revenue_potential: 2500,
          reasoning: 'Alta tasa de conversión en tu audiencia'
        },
        {
          platform: 'TikTok',
          revenue_potential: 1800,
          reasoning: 'Contenido viral con potencial de alcance'
        }
      ],
      pricing_recommendations: {
        sponsored_post: 500,
        story_mention: 150,
        video_integration: 800,
        long_term_partnership: 2000
      },
      audience_value: {
        cpm: 12.5,
        engagement_value: 8.7,
        conversion_potential: 3.2
      }
    };
  }

  private assessCollaborationPotential(profile: CreatorProfile): string {
    if (profile.rating >= 4.5) return 'Excelente';
    if (profile.rating >= 4.0) return 'Muy Bueno';
    if (profile.rating >= 3.5) return 'Bueno';
    return 'Regular';
  }

  // Mock data methods
  private async getMockBrands(): Promise<BrandProfile[]> {
    return [
      {
        id: '1',
        name: 'TechCorp Innovation',
        logo_url: 'https://via.placeholder.com/100x100?text=TC',
        description: 'Empresa líder en tecnología e innovación digital',
        industry: 'Technology',
        website: 'https://techcorp.com',
        target_audience: {
          age_range: '25-45',
          gender: 'mixed',
          interests: ['technology', 'innovation', 'business', 'productivity'],
          location: ['Mexico', 'Colombia', 'Argentina']
        },
        budget_range: { min: 1000, max: 5000 },
        campaign_types: ['sponsored_post', 'product_review', 'brand_ambassador'],
        preferred_platforms: ['instagram', 'linkedin', 'youtube'],
        brand_values: ['innovation', 'quality', 'sustainability'],
        collaboration_history: 45,
        rating: 4.7,
        verified: true,
        created_at: new Date()
      },
      {
        id: '2',
        name: 'EcoLife Wellness',
        logo_url: 'https://via.placeholder.com/100x100?text=EL',
        description: 'Productos naturales para un estilo de vida saludable',
        industry: 'Health & Wellness',
        website: 'https://ecolife.com',
        target_audience: {
          age_range: '20-40',
          gender: 'female',
          interests: ['health', 'wellness', 'fitness', 'natural_products'],
          location: ['Mexico', 'Spain', 'USA']
        },
        budget_range: { min: 500, max: 3000 },
        campaign_types: ['product_review', 'lifestyle_integration', 'brand_ambassador'],
        preferred_platforms: ['instagram', 'tiktok', 'youtube'],
        brand_values: ['natural', 'sustainable', 'wellness'],
        collaboration_history: 32,
        rating: 4.5,
        verified: true,
        created_at: new Date()
      },
      {
        id: '3',
        name: 'FashionForward',
        logo_url: 'https://via.placeholder.com/100x100?text=FF',
        description: 'Moda contemporánea para la mujer moderna',
        industry: 'Fashion',
        website: 'https://fashionforward.com',
        target_audience: {
          age_range: '18-35',
          gender: 'female',
          interests: ['fashion', 'style', 'trends', 'lifestyle'],
          location: ['Mexico', 'Colombia', 'Peru']
        },
        budget_range: { min: 800, max: 4000 },
        campaign_types: ['sponsored_post', 'outfit_styling', 'event_coverage'],
        preferred_platforms: ['instagram', 'tiktok', 'pinterest'],
        brand_values: ['style', 'empowerment', 'diversity'],
        collaboration_history: 67,
        rating: 4.3,
        verified: true,
        created_at: new Date()
      }
    ];
  }

  private async getMockCreators(): Promise<Creator[]> {
    return [
      {
        id: '1',
        profile: {
          id: '1',
          name: 'Sofia Martinez',
          email: 'sofia@example.com',
          bio: 'Content creator especializada en lifestyle y wellness',
          niche: ['lifestyle', 'wellness', 'fitness'],
          follower_count: {
            instagram: 85000,
            tiktok: 120000,
            youtube: 45000
          },
          engagement_rate: 6.8,
          location: 'Mexico',
          languages: ['Spanish', 'English'],
          content_categories: ['lifestyle', 'wellness', 'travel'],
          collaboration_rate: 800,
          preferred_brands: ['wellness', 'fashion', 'travel'],
          past_collaborations: 23,
          rating: 4.6,
          verified: true,
          created_at: new Date()
        }
      },
      {
        id: '2',
        profile: {
          id: '2',
          name: 'Carlos Tech',
          email: 'carlos@example.com',
          bio: 'Experto en tecnología y emprendimiento digital',
          niche: ['technology', 'business', 'entrepreneurship'],
          follower_count: {
            instagram: 65000,
            linkedin: 95000,
            youtube: 78000
          },
          engagement_rate: 7.2,
          location: 'Colombia',
          languages: ['Spanish', 'English'],
          content_categories: ['technology', 'business', 'education'],
          collaboration_rate: 1200,
          preferred_brands: ['technology', 'business', 'education'],
          past_collaborations: 31,
          rating: 4.8,
          verified: true,
          created_at: new Date()
        }
      }
    ];
  }

  private async getActiveCampaigns(creatorId: string): Promise<Campaign[]> {
    return [
      {
        id: '1',
        brand_id: '1',
        title: 'TechCorp Product Launch',
        description: 'Promocionar el nuevo smartphone con enfoque en productividad',
        requirements: {
          follower_min: 50000,
          engagement_min: 5,
          content_type: ['post', 'story', 'reel'],
          platforms: ['instagram', 'tiktok'],
          demographics: { age: '25-45' }
        },
        budget: 2500,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        deliverables: ['2 posts', '4 stories', '1 reel'],
        status: 'in_progress',
        applications: 12,
        selected_creators: [creatorId],
        created_at: new Date()
      }
    ];
  }

  private async getPendingApplications(creatorId: string): Promise<any[]> {
    return [
      {
        campaign_id: '2',
        brand_name: 'EcoLife Wellness',
        campaign_title: 'Natural Skincare Review',
        applied_at: new Date(),
        status: 'pending'
      }
    ];
  }

  private async getCompletedCollaborations(creatorId: string): Promise<any[]> {
    return [
      {
        brand_name: 'FashionForward',
        campaign_title: 'Summer Collection 2024',
        completed_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        earnings: 1800,
        rating: 4.5
      }
    ];
  }
}

// Export singleton instance
export const creatorMarketplace = CreatorMarketplace.getInstance();
