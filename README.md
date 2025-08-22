# Cohen-Velasquez-Johnson NEPQ Training Platform

A comprehensive Next.js 14 TypeScript SaaS application for voice role-play training using the NEPQ insurance sales methodology.

## 🎯 Overview

This MVP platform provides insurance sales agents with an advanced training environment that enforces the 8-stage NEPQ methodology:

1. **CONNECTION** - Build rapport and find common ground
2. **SITUATION** - Understand current circumstances  
3. **PROBLEM AWARENESS** - Uncover pain points naturally
4. **SOLUTION AWARENESS** - Explore what they've tried
5. **CONSEQUENCE** - Discuss impact of inaction
6. **TRANSITION** - Bridge to presentation (critical: no early presenting)
7. **PRESENTATION** - Share solution when earned
8. **COMMITMENT** - Secure next steps

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone and setup**
```bash
cd SalesMonster
npm install
```

2. **Environment setup**
```bash
# Copy .env.local and update DATABASE_URL if needed
# Default DATABASE_URL: postgresql://user:pass@localhost:5432/cvj
```

3. **Database setup**
```bash
# Generate Prisma client
npm run db:generate

# Create and migrate database
npm run db:push

# Seed with demo data
npm run db:seed
```

4. **Start development server**
```bash
npm run dev
```

5. **Access the application**
Open [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Credentials

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@cvj.com | TrainBetter2024! |
| Coach | coach@cvj.com | TrainBetter2024! |
| Agent | agent@cvj.com | TrainBetter2024! |

## 🏗️ Tech Stack

### Core Framework
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** component library

### State & Data
- **Zustand** for client state management
- **TanStack Query** for server state
- **Prisma** with PostgreSQL
- **Zod** for validation

### AI Integration Points (Currently Stubbed)
- **OpenAI Whisper** for speech-to-text
- **ElevenLabs** for text-to-speech  
- **OpenAI GPT-4** for coaching feedback
- **Pinecone** for knowledge base search

## 📱 Key Features

### 🎤 Audio Recording & Analysis
- Real-time audio recording with Web Audio API
- Voice activity detection and audio level monitoring
- Mock ASR integration with realistic transcription delays
- NEPQ stage detection and progress tracking

### 📊 NEPQ Methodology Enforcement
- Visual stage tracker with keyboard shortcuts (1-8)
- Real-time violation detection (early presentation, poor transitions)
- Weighted scoring system emphasizing stage progression
- Comprehensive performance analytics

### 👥 Role-play Management
- Clean table view with advanced filtering
- Multiple personas with unique objection patterns
- Scenario-based training with difficulty levels
- Recording storage and playback

### 💬 Collaborative Features
- Threaded comments with timestamp linking
- Coaching feedback with reaction system
- Team leaderboards and performance tracking
- Real-time collaboration tools

### 🎛️ Admin & Settings
- Multi-tenant organization management
- Team and user administration
- AI provider configuration interface
- Customizable retention and privacy settings

## 🗂️ Project Structure

```
src/
├── app/                 # Next.js 14 App Router pages
│   ├── dashboard/       # Main dashboard
│   ├── roleplays/       # Scenario management
│   ├── recordings/      # Recording details
│   ├── kb/             # Knowledge base
│   ├── personas/       # Persona management
│   ├── admin/          # Admin panel
│   ├── settings/       # User settings
│   └── api/            # API routes (mock)
├── components/         # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── audio/          # Audio recording components
│   ├── nepq/           # NEPQ-specific components
│   └── layout/         # Layout components
├── stores/             # Zustand stores
├── types/              # TypeScript definitions
├── lib/                # Utility functions
└── hooks/              # Custom React hooks
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with demo data
```

### Key Components

- **AudioRecorder** (`src/components/audio/audio-recorder.tsx`) - Complete audio recording with mock ASR
- **StageRail** (`src/components/nepq/stage-rail.tsx`) - NEPQ stage tracking with keyboard shortcuts
- **TranscriptList** (`src/components/recordings/transcript-list.tsx`) - Interactive transcript with analysis
- **RoleplaysTable** (`src/components/roleplays/roleplays-table.tsx`) - Advanced scenario table view

## 🎨 Design System

### Color Palette
- **Primary**: Indigo-600 (Brand color)
- **Background**: Gray-50 (Light) / Gray-900 (Dark)
- **Text**: Gray-900 (Light) / Gray-50 (Dark)
- **NEPQ Stages**: Color-coded badges for visual recognition

### Typography
- **Font Family**: Inter (UI), Fira Code (code/transcripts)
- **Base Unit**: 4px spacing scale
- **Border Radius**: 6px default
- **Shadows**: Subtle elevation system

## 🔌 AI Integration

### Current Status: Mock Implementation
All AI services are currently stubbed with realistic mock responses:

- **ASR**: Mock transcription with 100-300ms delays
- **TTS**: Placeholder audio synthesis
- **LLM**: Canned coaching responses
- **Vector DB**: Static knowledge base search

### Integration Points
Each service has clear integration interfaces in:
- `src/app/api/asr/stream/route.ts` - WebSocket ASR streaming
- `src/app/api/tts/generate/route.ts` - Text-to-speech synthesis
- `src/app/api/llm/coach/route.ts` - Coaching feedback generation
- `src/app/api/kb/embed/route.ts` - Knowledge base embedding

### Production Setup
To enable real AI services:
1. Update environment variables with API keys
2. Set `ENABLE_REAL_ASR=true`, `ENABLE_TTS=true`
3. Configure provider settings in the admin panel
4. Replace mock implementations with actual API calls

## 📊 NEPQ Scoring System

### Scoring Weights
- **NEPQ Discipline (50%)**: Stage progression, transition discipline, discovery depth
- **Communication Skills (30%)**: Objection handling, tonality, active listening  
- **Technical Metrics (20%)**: Talk ratio, filler words, question ratio

### Performance Thresholds
- **Excellent**: 90%+ (Green)
- **Good**: 80-89% (Yellow)  
- **Needs Work**: <80% (Red)

## 🔒 Security & Privacy

### Data Protection
- 90-day default retention for recordings
- Configurable privacy settings per organization
- PII redaction in exports
- Secure file upload with virus scanning

### Authentication
- Role-based access control (Admin, Coach, Agent)
- Session management with secure cookies
- Team-based data isolation
- Audit logging for compliance

## 🚀 Deployment

### Environment Variables
```bash
# Database
DATABASE_URL="postgresql://user:pass@host:5432/db"

# Authentication  
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"

# Storage
AWS_S3_BUCKET="your-recordings-bucket"
AWS_REGION="us-east-1"

# AI Services (when ready)
OPENAI_API_KEY="sk-your-key"
ELEVENLABS_API_KEY="your-key"
PINECONE_API_KEY="your-key"
```

### Production Checklist
- [ ] Set up PostgreSQL database
- [ ] Configure AWS S3 for recordings
- [ ] Set environment variables
- [ ] Run database migrations
- [ ] Configure AI service providers
- [ ] Set up monitoring and logging
- [ ] Enable SSL/TLS
- [ ] Configure backup strategy

## 🤝 Contributing

This is a demonstration project showcasing Next.js 14 and modern React patterns for a NEPQ training platform.

### Code Style
- TypeScript for all new code
- ESLint + Prettier for formatting
- Conventional commit messages
- Component-driven development

## 📄 License

Private - Cohen-Velasquez-Johnson Insurance Training Platform

---

**Built with ❤️ using Next.js 14, TypeScript, and the power of the NEPQ methodology.**