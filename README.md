
# AI Podcast Content Repurposer

**Turn your podcast audio into viral-ready content in minutes.**
Upload your MP3 → get show notes, social posts, IG reel hooks, all delivered to Notion.

![AI Podcast Repurposer](https://via.placeholder.com/800x400/6366f1/ffffff?text=AI+Podcast+Repurposer)

## 🚀 What It Does

Transform your podcast episodes into a complete content suite:
- **Professional show notes** with timestamps and key insights
- **5 viral-ready tweets** optimized for engagement
- **3 LinkedIn posts** for professional networking
- **10 Instagram reel hooks** to capture attention
- **Direct Notion delivery** - all content organized in your workspace

## 🛠 Tech Stack

### Frontend
- **React** with TypeScript for robust UI development
- **Tailwind CSS** for modern, responsive styling
- **shadcn/ui** for beautiful, accessible components
- **Vite** for lightning-fast development

### Backend (Planned)
- **Supabase** for authentication, database, and storage
- **OpenAI Whisper** for high-accuracy transcription
- **GPT-4o** for intelligent content generation
- **Notion API** for seamless content delivery

### Infrastructure (MVP)
- **Vercel** for frontend deployment
- **Cloudflare R2** for scalable file storage
- **Stripe** for payment processing

## 🎯 Current Status: Landing Page Demo

This repository contains the landing page and upload interface. The current demo includes:

✅ **Responsive landing page** with compelling value proposition  
✅ **Drag-and-drop audio upload** with progress indicators  
✅ **Simulated transcription flow** showing user experience  
✅ **Modern UI/UX** optimized for conversion  

## 🚧 Development Roadmap

### Phase 1 - SIDG (Sales-Grade Interactive Demo)
**Goal**: Simulate the complete user journey for validation and sales.

**Timeline**: 48 hours

**Deliverables**:
- [x] Landing page with headline, benefits, and CTA
- [x] Audio upload interface with progress tracking
- [ ] Mock Whisper API integration
- [ ] GPT-4o content generation (preset prompts)
- [ ] Notion-style output page
- [ ] "Send to Notion" confirmation modal
- [ ] Demo pricing flows
- [ ] Shareable demo links

### Phase 2 - MVP v1 (Production Ready)
**Goal**: Live backend, payments, and real AI processing.

**Timeline**: 2-3 weeks

**Deliverables**:
- [ ] Supabase authentication and user dashboard
- [ ] Cloudflare R2 storage with async uploads
- [ ] Real Whisper transcription API
- [ ] Production GPT-4o content generation
- [ ] Notion OAuth integration
- [ ] Stripe payment system (Hobby/Pro/Agency plans)
- [ ] Usage quotas and overage warnings
- [ ] Team collaboration features
- [ ] Usage analytics dashboard

### Phase 3 - Scale & Automate
**Goal**: Advanced features for market expansion.

**Features**:
- [ ] Affiliate partner dashboard
- [ ] Email onboarding sequences
- [ ] Chrome extension for viral content
- [ ] Agency team management
- [ ] Descript API for filler word removal
- [ ] Automated social media posting
- [ ] Advanced analytics and insights

## 🏗 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── Hero.tsx         # Landing page hero section
│   ├── Benefits.tsx     # Value proposition showcase
│   └── AudioUpload.tsx  # File upload with progress
├── pages/
│   ├── Index.tsx        # Main landing page
│   └── NotFound.tsx     # 404 error page
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions
└── App.tsx              # Main app component
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-podcast-repurposer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🎨 Design Philosophy

### Color Palette
- **Primary**: Purple to Pink gradient (`from-purple-600 to-pink-600`)
- **Secondary**: Blue to Cyan gradient (`from-blue-400 to-cyan-400`)
- **Background**: Deep purple to indigo gradient
- **Accents**: White with various opacity levels

### UI Principles
- **Conversion-focused**: Every element guides users toward upload
- **Modern & Professional**: Glass morphism and smooth gradients
- **Responsive**: Mobile-first design that scales beautifully
- **Accessible**: High contrast and keyboard navigation support

## 📊 Performance Targets

- **Lighthouse Score**: 95+ across all metrics
- **First Contentful Paint**: < 1.5s
- **Upload Processing**: < 2 minutes for 30-minute episodes
- **Content Generation**: < 30 seconds for complete suite

## 🔮 Future Enhancements

- **Multi-language support** for global podcasters
- **Batch processing** for multiple episodes
- **Custom templates** for different content styles
- **AI-powered thumbnails** and video snippets
- **Integration marketplace** (Buffer, Hootsuite, etc.)
- **Advanced analytics** and performance tracking

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🤝 Contributing

This is a private project. For internal development guidelines, see our team documentation.

---

**Ready to transform your podcast into viral content?** [Upload your first episode now!](https://your-domain.com)
