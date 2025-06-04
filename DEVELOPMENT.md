# 🚀 Podify Content Genius - Development Setup Guide

**Complete guide to set up your local development environment for the AI-powered podcast content platform.**

---

## 📋 **Prerequisites**

Before you begin, ensure you have the following installed on your system:

- **Node.js 18+** and **npm 8+** (or **bun** for faster package management)
- **Git** for version control
- **Supabase CLI** for database management
- **Docker** (optional, for containerized development)
- **VS Code** with recommended extensions (see below)

### **Required API Keys**

You'll need accounts and API keys for the following services:

1. **Supabase** (Database, Auth, Storage)
2. **OpenAI** (Whisper + GPT-4 for AI processing)
3. **Stripe** (Payment processing - optional for development)
4. **Notion** (Content delivery - optional)

---

## 🛠️ **Local Environment Setup**

### **Step 1: Clone Repository**

```bash
# Clone the repository
git clone https://github.com/your-org/podify-content-genius.git
cd podify-content-genius

# Install dependencies (choose one)
npm install
# OR
bun install
```

### **Step 2: Environment Configuration**

```bash
# Copy environment template
cp env.example .env.local

# Edit environment variables
code .env.local
```

**Essential environment variables:**

```env
# Supabase (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (Required for AI features)
OPENAI_API_KEY=sk-your_openai_key

# Application
APP_ENV=development
APP_URL=http://localhost:5173
```

### **Step 3: Supabase Setup**

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Initialize Supabase project
supabase init

# Link to your remote project
supabase link --project-ref your-project-id

# Start local Supabase instance
supabase start

# Apply database migrations
supabase db reset

# Generate TypeScript types
npm run generate-types
```

### **Step 4: Start Development Server**

```bash
# Start the frontend development server
npm run dev

# In another terminal, ensure Supabase is running
npm run dev:db
```

Your application should now be running at `http://localhost:5173`

---

## 📁 **Project Structure Overview**

```
podify-content-genius/
├── src/
│   ├── components/              # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── dashboard/          # Dashboard components
│   │   └── auth/               # Authentication components
│   ├── pages/                  # Route components
│   ├── hooks/                  # Custom React hooks
│   ├── contexts/               # React contexts (Auth, Theme)
│   ├── integrations/           # External service integrations
│   │   └── supabase/          # Supabase client & types
│   ├── lib/                    # Utility functions
│   └── utils/                  # Helper utilities
├── supabase/
│   ├── functions/              # Edge functions
│   │   ├── enhanced-transcribe/ # AI transcription
│   │   ├── generate-content/   # Content generation
│   │   └── notion-delivery/    # Notion integration
│   ├── migrations/             # Database schema
│   └── config.toml            # Supabase configuration
├── docs/                       # Documentation
└── tests/                      # Test suites
```

---

## 🧪 **Development Workflow**

### **Daily Development Commands**

```bash
# Start development environment
npm run dev          # Frontend development server
npm run dev:db       # Supabase local instance

# Code quality
npm run lint         # Check code quality
npm run lint:fix     # Auto-fix linting issues
npm run type-check   # TypeScript validation
npm run format       # Format code with Prettier

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run end-to-end tests

# Database management
npm run db:reset     # Reset database to latest migration
npm run db:seed      # Seed database with test data
npm run generate-types # Update TypeScript types from schema
```

### **Feature Development Process**

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Follow the existing code patterns
   - Write TypeScript interfaces for all data structures
   - Add proper error handling
   - Include loading states for async operations

3. **Test Your Changes**
   ```bash
   npm run type-check
   npm run lint
   npm run test
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

---

## 🔐 **Security Best Practices**

### **Environment Variables**
- **Never commit** `.env.local` or any file containing secrets
- Use **different API keys** for development and production
- Rotate API keys regularly
- Store production secrets in secure vault services

### **Code Security**
- **Validate all inputs** using Zod schemas
- **Sanitize user data** before database operations
- **Use Row Level Security (RLS)** for all database tables
- **Rate limit API endpoints** to prevent abuse

### **Authentication**
- Always check user authentication before sensitive operations
- Use **JWT tokens** for API requests
- Implement **proper session management**
- Add **audit logging** for important actions

---

## 🏗️ **Architecture Patterns**

### **Component Structure**
```typescript
// Example component structure
interface ComponentProps {
  // Define props with TypeScript
  userId: string;
  onSuccess?: () => void;
}

export const Component: React.FC<ComponentProps> = ({
  userId,
  onSuccess
}) => {
  // Custom hooks for data fetching
  const { data, loading, error } = useComponentData(userId);
  
  // Error boundary and loading states
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {/* Component content */}
    </div>
  );
};
```

### **State Management**
- **TanStack Query** for server state
- **Zustand** for client state
- **React Context** for theme and auth
- **React Hook Form** for form state

### **Error Handling**
```typescript
// Use consistent error handling patterns
try {
  const result = await apiCall();
  // Handle success
} catch (error) {
  console.error('Operation failed:', error);
  toast.error('Something went wrong. Please try again.');
  // Log error for monitoring
}
```

---

## 🧪 **Testing Guidelines**

### **Unit Testing**
```typescript
// Test component behavior
import { render, screen } from '@testing-library/react';
import { Component } from './Component';

test('renders component correctly', () => {
  render(<Component userId="123" />);
  expect(screen.getByText('Expected Text')).toBeInTheDocument();
});
```

### **Integration Testing**
```typescript
// Test API integrations
import { supabase } from '@/integrations/supabase/client';

test('creates user profile on signup', async () => {
  const { data, error } = await supabase
    .from('profiles')
    .insert({ email: 'test@example.com' });
  
  expect(error).toBeNull();
  expect(data).toBeDefined();
});
```

### **E2E Testing**
```typescript
// Test complete user workflows
import { test, expect } from '@playwright/test';

test('user can upload audio and generate content', async ({ page }) => {
  await page.goto('/');
  // Test complete workflow
});
```

---

## 🚀 **Deployment Preparation**

### **Build & Deploy Commands**
```bash
# Production build
npm run build

# Deploy edge functions
npm run deploy:functions

# Full deployment (build + functions)
npm run deploy
```

### **Environment Setup**
- **Staging**: Mirror production with test data
- **Production**: Real API keys and production database
- **Security**: Enable all security headers and policies

---

## 🛟 **Common Issues & Solutions**

### **Supabase Connection Issues**
```bash
# Reset Supabase local instance
supabase stop
supabase start

# Check if ports are available (default: 54321)
lsof -i :54321
```

### **TypeScript Errors**
```bash
# Regenerate types from Supabase
npm run generate-types

# Clear TypeScript cache
rm -rf node_modules/.cache
npm run type-check
```

### **Environment Variable Issues**
```bash
# Check if variables are loaded
echo $VITE_SUPABASE_URL

# Restart development server after .env changes
npm run dev
```

---

## 📚 **Recommended VS Code Extensions**

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "supabase.supabase-vscode",
    "ms-playwright.playwright"
  ]
}
```

---

## 🤝 **Getting Help**

- **Documentation**: Check the `/docs` directory
- **Issues**: Create GitHub issue with reproduction steps
- **Team Chat**: Use designated development channels
- **Code Review**: Tag relevant team members on PRs

---

**Happy coding! 🎉 Let's build something amazing together.** 