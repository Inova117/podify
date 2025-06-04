-- =====================================================
-- Podify Content Genius - Complete Database Schema
-- Migration: 001_initial_schema.sql
-- Created: 2024-01-20
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- PROFILES & AUTHENTICATION
-- =====================================================

-- Enhanced profiles table with subscription info
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    company TEXT,
    website TEXT,
    bio TEXT,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'hobby', 'pro', 'agency')),
    usage_quota INTEGER DEFAULT 2, -- Free tier starts with 2 uploads
    current_usage INTEGER DEFAULT 0,
    quota_reset_date TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 month'),
    onboarding_completed BOOLEAN DEFAULT FALSE,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SUBSCRIPTION & BILLING
-- =====================================================

-- Subscription plans configuration
CREATE TABLE subscription_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    monthly_price INTEGER NOT NULL, -- in cents
    yearly_price INTEGER NOT NULL, -- in cents
    features JSONB NOT NULL DEFAULT '{}',
    limits JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES subscription_plans(id) NOT NULL,
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'canceled', 'past_due', 'unpaid')),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at TIMESTAMP WITH TIME ZONE,
    trial_start TIMESTAMP WITH TIME ZONE,
    trial_end TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Usage tracking for billing and analytics
CREATE TABLE usage_tracking (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('audio_upload', 'transcription', 'content_generation', 'export', 'api_call')),
    resource_id UUID, -- Reference to the specific resource used
    usage_count INTEGER DEFAULT 1,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CONTENT MANAGEMENT
-- =====================================================

-- Audio uploads tracking
CREATE TABLE audio_uploads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size BIGINT NOT NULL, -- in bytes
    duration INTEGER, -- in seconds
    mime_type TEXT NOT NULL,
    status TEXT DEFAULT 'uploaded' CHECK (status IN ('uploading', 'uploaded', 'processing', 'completed', 'failed', 'deleted')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Processing jobs for async AI operations
CREATE TABLE processing_jobs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    upload_id UUID REFERENCES audio_uploads(id) ON DELETE CASCADE NOT NULL,
    job_type TEXT NOT NULL CHECK (job_type IN ('transcription', 'content_generation', 'full_pipeline')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    result JSONB,
    error_log TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    priority INTEGER DEFAULT 5, -- 1 (highest) to 10 (lowest)
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated content storage
CREATE TABLE generated_content (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_id UUID REFERENCES processing_jobs(id) ON DELETE CASCADE NOT NULL,
    content_type TEXT NOT NULL CHECK (content_type IN ('transcript', 'show_notes', 'tweets', 'linkedin_posts', 'instagram_hooks')),
    content_data JSONB NOT NULL,
    quality_score DECIMAL(3,2), -- 0.00 to 1.00
    word_count INTEGER,
    character_count INTEGER,
    language TEXT DEFAULT 'en',
    version INTEGER DEFAULT 1,
    is_primary BOOLEAN DEFAULT TRUE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content projects for organization
CREATE TABLE content_projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#6366f1',
    is_archived BOOLEAN DEFAULT FALSE,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT projects_user_name_unique UNIQUE(user_id, name)
);

-- Link uploads to projects
CREATE TABLE project_uploads (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID REFERENCES content_projects(id) ON DELETE CASCADE NOT NULL,
    upload_id UUID REFERENCES audio_uploads(id) ON DELETE CASCADE NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(project_id, upload_id)
);

-- =====================================================
-- SHARING & COLLABORATION
-- =====================================================

-- Shared content results (enhanced version of existing table)
CREATE TABLE shared_results (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    upload_id UUID REFERENCES audio_uploads(id) ON DELETE CASCADE,
    share_id TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(16), 'base64url'),
    title TEXT,
    description TEXT,
    filename TEXT NOT NULL,
    show_notes TEXT,
    tweets JSONB,
    linkedin_posts JSONB,
    instagram_hooks JSONB,
    access_level TEXT DEFAULT 'view' CHECK (access_level IN ('view', 'copy', 'edit')),
    password_hash TEXT, -- for password-protected shares
    view_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_public BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TEAM COLLABORATION
-- =====================================================

-- Teams/organizations
CREATE TABLE teams (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    avatar_url TEXT,
    settings JSONB DEFAULT '{}',
    billing_email TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team memberships
CREATE TABLE team_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
    permissions JSONB DEFAULT '{}',
    invited_by UUID REFERENCES profiles(id),
    invited_at TIMESTAMP WITH TIME ZONE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    
    UNIQUE(team_id, user_id)
);

-- Team invitations
CREATE TABLE team_invitations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE NOT NULL,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'editor', 'viewer')),
    invited_by UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'base64url'),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
    accepted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(team_id, email)
);

-- =====================================================
-- NOTIFICATIONS & ACTIVITY
-- =====================================================

-- User notifications
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity log for audit trail
CREATE TABLE activity_log (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Profiles indexes
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_profiles_subscription_tier ON profiles(subscription_tier);
CREATE INDEX idx_profiles_quota_reset_date ON profiles(quota_reset_date);

-- Subscription indexes
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Usage tracking indexes
CREATE INDEX idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX idx_usage_tracking_billing_period ON usage_tracking(billing_period_start, billing_period_end);
CREATE INDEX idx_usage_tracking_action_type ON usage_tracking(action_type);

-- Content management indexes
CREATE INDEX idx_audio_uploads_user_id ON audio_uploads(user_id);
CREATE INDEX idx_audio_uploads_status ON audio_uploads(status);
CREATE INDEX idx_audio_uploads_created_at ON audio_uploads(created_at DESC);

CREATE INDEX idx_processing_jobs_upload_id ON processing_jobs(upload_id);
CREATE INDEX idx_processing_jobs_status ON processing_jobs(status);
CREATE INDEX idx_processing_jobs_priority ON processing_jobs(priority, created_at);

CREATE INDEX idx_generated_content_job_id ON generated_content(job_id);
CREATE INDEX idx_generated_content_type ON generated_content(content_type);

-- Team indexes
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_invitations_team_id ON team_invitations(team_id);
CREATE INDEX idx_team_invitations_email ON team_invitations(email);

-- Notification indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- Activity log indexes
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_team_id ON activity_log(team_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at DESC);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE audio_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Audio uploads policies
CREATE POLICY "Users can manage own uploads" ON audio_uploads FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Team members can view team uploads" ON audio_uploads FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM team_members tm 
        JOIN project_uploads pu ON pu.upload_id = audio_uploads.id
        JOIN content_projects cp ON cp.id = pu.project_id
        WHERE tm.user_id = auth.uid() AND cp.user_id = audio_uploads.user_id
    )
);

-- Processing jobs policies
CREATE POLICY "Users can view own processing jobs" ON processing_jobs FOR SELECT USING (
    EXISTS (SELECT 1 FROM audio_uploads WHERE id = processing_jobs.upload_id AND user_id = auth.uid())
);

-- Generated content policies
CREATE POLICY "Users can view own generated content" ON generated_content FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM processing_jobs pj 
        JOIN audio_uploads au ON au.id = pj.upload_id
        WHERE pj.id = generated_content.job_id AND au.user_id = auth.uid()
    )
);

-- Content projects policies
CREATE POLICY "Users can manage own projects" ON content_projects FOR ALL USING (auth.uid() = user_id);

-- Team policies
CREATE POLICY "Team members can view team" ON teams FOR SELECT USING (
    EXISTS (SELECT 1 FROM team_members WHERE team_id = teams.id AND user_id = auth.uid() AND is_active = true)
);

CREATE POLICY "Team owners can manage team" ON teams FOR ALL USING (auth.uid() = owner_id);

-- Shared results policies (public access for valid share_id)
CREATE POLICY "Public can view shared results" ON shared_results FOR SELECT USING (
    (is_public = true) OR 
    (auth.uid() = user_id) OR
    (expires_at IS NULL OR expires_at > NOW())
);

-- Notifications policies
CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_audio_uploads_updated_at BEFORE UPDATE ON audio_uploads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_processing_jobs_updated_at BEFORE UPDATE ON processing_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_generated_content_updated_at BEFORE UPDATE ON generated_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_projects_updated_at BEFORE UPDATE ON content_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shared_results_updated_at BEFORE UPDATE ON shared_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to track usage
CREATE OR REPLACE FUNCTION track_usage(
    p_user_id UUID,
    p_action_type TEXT,
    p_resource_id UUID DEFAULT NULL,
    p_usage_count INTEGER DEFAULT 1
)
RETURNS VOID AS $$
DECLARE
    current_period_start DATE;
    current_period_end DATE;
BEGIN
    -- Calculate current billing period (monthly)
    current_period_start := DATE_TRUNC('month', CURRENT_DATE);
    current_period_end := (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
    
    -- Insert or update usage tracking
    INSERT INTO usage_tracking (
        user_id, 
        action_type, 
        resource_id, 
        usage_count, 
        billing_period_start, 
        billing_period_end
    )
    VALUES (
        p_user_id, 
        p_action_type, 
        p_resource_id, 
        p_usage_count, 
        current_period_start, 
        current_period_end
    )
    ON CONFLICT (user_id, action_type, billing_period_start, billing_period_end)
    DO UPDATE SET 
        usage_count = usage_tracking.usage_count + p_usage_count,
        created_at = NOW();
        
    -- Update user current usage
    UPDATE profiles 
    SET current_usage = current_usage + p_usage_count
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- INITIAL DATA
-- =====================================================

-- Insert default subscription plans
INSERT INTO subscription_plans (name, display_name, description, monthly_price, yearly_price, features, limits) VALUES
(
    'free',
    'Free',
    'Perfect for trying out Podify',
    0,
    0,
    '{"basic_transcription": true, "standard_content": true, "community_support": true}',
    '{"monthly_uploads": 2, "team_members": 1, "storage_gb": 1, "api_calls": 0}'
),
(
    'hobby',
    'Hobby',
    'For individual podcasters',
    2900,
    29000,
    '{"advanced_transcription": true, "premium_content": true, "email_support": true, "notion_integration": true}',
    '{"monthly_uploads": 10, "team_members": 1, "storage_gb": 10, "api_calls": 100}'
),
(
    'pro',
    'Pro',
    'For growing podcast businesses',
    7900,
    79000,
    '{"priority_processing": true, "custom_templates": true, "priority_support": true, "team_collaboration": true, "analytics": true}',
    '{"monthly_uploads": 50, "team_members": 3, "storage_gb": 50, "api_calls": 1000}'
),
(
    'agency',
    'Agency',
    'For agencies and large teams',
    19900,
    199000,
    '{"white_label": true, "api_access": true, "dedicated_support": true, "custom_integrations": true, "advanced_analytics": true}',
    '{"monthly_uploads": -1, "team_members": 10, "storage_gb": 200, "api_calls": 10000}'
);

-- Grant necessary permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant select access to subscription plans for all authenticated users
GRANT SELECT ON subscription_plans TO authenticated;

-- Create a function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permission(
    p_user_id UUID,
    p_action TEXT,
    p_resource_type TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    user_plan TEXT;
    plan_limits JSONB;
    current_usage INTEGER;
BEGIN
    -- Get user's current plan and usage
    SELECT p.subscription_tier, sp.limits, p.current_usage
    INTO user_plan, plan_limits, current_usage
    FROM profiles p
    LEFT JOIN subscription_plans sp ON sp.name = p.subscription_tier
    WHERE p.id = p_user_id;
    
    -- Check specific permissions based on action and plan
    CASE p_action
        WHEN 'upload_audio' THEN
            RETURN (plan_limits->>'monthly_uploads')::INTEGER = -1 OR 
                   current_usage < (plan_limits->>'monthly_uploads')::INTEGER;
        WHEN 'create_team' THEN
            RETURN user_plan IN ('pro', 'agency');
        WHEN 'api_access' THEN
            RETURN user_plan = 'agency';
        ELSE
            RETURN TRUE;
    END CASE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 