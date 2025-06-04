# 🎙️ Podify Content Genius

**AI-Powered Podcast Content Repurposing Platform**

Transform your podcast episodes into viral-ready content in minutes. Upload audio → get professional show notes, social media posts, Instagram hooks, and organized content delivered directly to your workflow.

![License](https://img.shields.io/badge/license-Proprietary-red)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)

## 🚀 **Product Overview**

### **Core Value Proposition**
- **10x faster content creation**: Turn 60-minute podcasts into complete content suites in under 5 minutes
- **Professional quality**: AI-generated content maintains your brand voice and style
- **Multi-platform ready**: Content optimized for Twitter, LinkedIn, Instagram, and notion workspaces
- **Zero manual work**: Fully automated pipeline from audio upload to organized content delivery

### **Target Content Output**
- 📝 **Professional show notes** with timestamps and key insights
- 🐦 **5 viral Twitter posts** optimized for engagement
- 💼 **3 LinkedIn articles** for professional networking
- 📱 **10 Instagram reel hooks** to capture attention
- 📋 **Notion workspace delivery** with organized templates

## 🏗️ **Architecture Overview**

### **Frontend Stack**
```
React 18 + TypeScript + Vite
├── UI Framework: shadcn/ui + Radix primitives
├── Styling: Tailwind CSS + CSS Variables
├── State Management: TanStack Query + Zustand
├── Routing: React Router DOM v6
├── Forms: React Hook Form + Zod validation
└── Build Tool: Vite with SWC
```

### **Backend Infrastructure**
```
Supabase Ecosystem
├── Authentication: Row Level Security (RLS)
├── Database: PostgreSQL with typed schemas
├── Storage: Audio file handling with CDN
├── Edge Functions: AI processing pipeline
├── Real-time: Progress tracking subscriptions
└── API: Auto-generated TypeScript client
```

### **AI Processing Pipeline**
```
Audio → Whisper → GPT-4o → Content Generation
├── Transcription: OpenAI Whisper API
├── Content Generation: GPT-4o with custom prompts
├── Quality Assurance: Automated content validation
└── Delivery: Notion API integration
```

## 📁 **Project Structure**

```
podify-content-genius/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # shadcn/ui design system
│   │   ├── dashboard/       # Dashboard-specific components
│   │   ├── auth/            # Authentication components
│   │   └── content/         # Content display components
│   ├── pages/               # Route components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── contexts/            # React contexts
│   ├── integrations/        # External service integrations
│   └── utils/               # Helper utilities
├── supabase/
│   ├── functions/           # Edge functions
│   │   ├── transcribe/      # Audio transcription
│   │   ├── generate-content/# Content generation
│   │   └── notion-delivery/ # Notion integration
│   ├── migrations/          # Database migrations
│   └── config.toml          # Supabase configuration
├── docs/                    # Project documentation
└── tests/                   # Test suites
```

## ⚡ **Quick Start**

### **Prerequisites**
- Node.js 18+ and npm/bun
- Supabase CLI
- OpenAI API key
- Notion API integration (optional)

### **Development Setup**

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd podify-content-genius
   bun install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   # Add your API keys (see Environment Variables section)
   ```

3. **Supabase Setup**
   ```bash
   npx supabase start
   npx supabase db reset
   ```

4. **Start Development**
   ```bash
   bun run dev
   ```

### **Environment Variables**
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Services
OPENAI_API_KEY=your_openai_api_key

# Notion Integration (Optional)
NOTION_API_KEY=your_notion_api_key

# Stripe (Production)
STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
```

## 🔧 **Available Scripts**

```bash
# Development
bun run dev              # Start development server
bun run dev:db           # Start Supabase local development
bun run generate-types   # Generate TypeScript types from Supabase

# Build & Deploy
bun run build           # Production build
bun run preview         # Preview production build
bun run deploy          # Deploy to production

# Code Quality
bun run lint            # ESLint code checking
bun run lint:fix        # Auto-fix ESLint issues
bun run type-check      # TypeScript type checking
bun run test            # Run test suite
bun run test:e2e        # End-to-end tests

# Database
bun run db:reset        # Reset local database
bun run db:seed         # Seed database with test data
bun run db:migration    # Create new migration
```

## 🎯 **Development Workflow**

### **Feature Development Process**
1. **Branch Strategy**: `feature/feature-name` from `main`
2. **Code Standards**: ESLint + Prettier + TypeScript strict mode
3. **Testing**: Unit tests (Jest) + E2E tests (Playwright)
4. **Security**: SAST scanning + dependency auditing
5. **Review**: PR with required approvals before merge

### **Commit Convention**
```
feat: add new audio upload component
fix: resolve authentication token refresh
docs: update API documentation
test: add unit tests for content generation
refactor: reorganize dashboard components
```

## 🛡️ **Security & Compliance**

### **Security Measures**
- ✅ **Authentication**: Supabase Auth with RLS policies
- ✅ **API Security**: Rate limiting + request validation
- ✅ **Data Protection**: Encrypted storage + secure key management
- ✅ **Input Validation**: Zod schemas + sanitization
- ✅ **CORS**: Strict origin policies
- ✅ **CSP**: Content Security Policy headers

### **Privacy Compliance**
- 🔒 **Data Retention**: Configurable retention policies
- 🔒 **User Control**: Data export + deletion capabilities
- 🔒 **Audit Trails**: Complete action logging
- 🔒 **GDPR Ready**: Privacy controls + consent management

## 📊 **Performance Targets**

| Metric | Target | Current |
|--------|--------|---------|
| Lighthouse Score | 95+ | 🎯 In Progress |
| First Contentful Paint | < 1.5s | 🎯 In Progress |
| Time to Interactive | < 3s | 🎯 In Progress |
| Audio Processing | < 2min (30min episode) | ✅ Achieved |
| Content Generation | < 30s | ✅ Achieved |

## 🚦 **Project Status & Roadmap**

### **Current Phase: MVP Development**
- [x] **Phase 1**: Landing page + upload demo
- [x] **Phase 2**: Authentication + user management
- [x] **Phase 3**: AI processing pipeline
- [ ] **Phase 4**: Subscription system + billing
- [ ] **Phase 5**: Notion integration + delivery
- [ ] **Phase 6**: Team collaboration features

### **Next Release (v1.0)**
- [ ] Production-ready billing system
- [ ] Advanced content templates
- [ ] Bulk processing capabilities
- [ ] Team workspace management
- [ ] Analytics dashboard

## 🤝 **Contributing**

### **Development Guidelines**
1. Follow the established code patterns and conventions
2. Write tests for new features and bug fixes
3. Update documentation for API changes
4. Ensure security best practices are followed
5. Test across different browsers and devices

### **Code Review Checklist**
- [ ] TypeScript types are properly defined
- [ ] Components are properly tested
- [ ] Security vulnerabilities addressed
- [ ] Performance implications considered
- [ ] Documentation updated

## 📚 **Documentation**

- [API Documentation](./docs/api/README.md)
- [Component Storybook](./docs/components/README.md)
- [Database Schema](./docs/database/README.md)
- [Deployment Guide](./docs/deployment/README.md)
- [Contributing Guidelines](./CONTRIBUTING.md)

## 📄 **License**

This project is proprietary and confidential. All rights reserved.

## 🆘 **Support**

- **Documentation**: Check the `/docs` directory
- **Issues**: Create a GitHub issue with detailed reproduction steps
- **Security**: Email security@podify.ai for security-related issues

---

**Built with ❤️ by the Podify team. Transform your podcast into viral content that your audience will love.**
