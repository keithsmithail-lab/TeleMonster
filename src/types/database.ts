// Database entity types
export enum Role {
  ADMIN = 'ADMIN',
  COACH = 'COACH',
  AGENT = 'AGENT',
}

export enum ScenarioCategory {
  PHONE = 'phone',
  ZOOM = 'zoom',
  IN_HOME = 'in_home',
}

export interface User {
  id: string
  email: string
  passwordHash: string
  role: Role
  teamId?: string
  orgId: string
  firstName?: string
  lastName?: string
  avatar?: string
  lastActive: Date
  createdAt: Date
  updatedAt: Date
}

export interface Team {
  id: string
  name: string
  orgId: string
  coachId?: string
  createdAt: Date
  updatedAt: Date
}

export interface Organization {
  id: string
  name: string
  plan: 'starter' | 'professional' | 'enterprise'
  seats: number
  usedSeats: number
  settings: {
    retentionDays: number
    allowRecordingDownload: boolean
    enableRealTimeCoaching: boolean
  }
  createdAt: Date
  updatedAt: Date
}

export interface Persona {
  id: string
  name: string
  description: string
  traits: {
    personality: string[]
    objections: string[]
    triggers: string[]
    responsePatterns: Record<string, string>
    decisionMakingStyle: string
    communicationPreference: string
  }
  orgId: string
  createdAt: Date
  updatedAt: Date
}

export interface Scenario {
  id: string
  name: string
  category: ScenarioCategory
  personaId: string
  nepqStages: number[]  // Focus stages
  timeLimit: number     // seconds
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  objectives: string[]
  context: string
  orgId: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Recording {
  id: string
  userId: string
  scenarioId: string
  duration: number
  audioUrl?: string     // S3 presigned URL
  transcript: any       // Turn-by-turn with NEPQ stages
  score: any           // Detailed rubric scores
  analytics: {
    talkRatio: number
    fillerWords: number
    pace: number
    interruptionCount: number
    questionCount: number
    statementCount: number
  }
  metadata: {
    deviceInfo?: string
    browserInfo?: string
    recordingQuality: number
  }
  tags: string[]
  isBookmarked: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  recordingId: string
  userId: string
  parentId?: string
  content: string
  timestamp?: number  // Position in recording
  type: 'coaching' | 'question' | 'praise' | 'improvement'
  reactions: Record<string, string[]>  // emoji -> user IDs
  createdAt: Date
  updatedAt: Date
}

export interface KBItem {
  id: string
  title: string
  source: string       // Original filename
  content: string
  chunks: Array<{
    id: string
    content: string
    nepqStages: number[]
    topics: string[]
    embeddings?: number[]  // Vector embeddings for search
  }>
  metadata: {
    fileType: string
    wordCount: number
    lastProcessed: Date
  }
  orgId: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProviderConfig {
  id: string
  orgId: string
  provider: 'whisper' | 'deepgram' | 'elevenlabs' | 'aws-polly' | 'openai' | 'anthropic' | 'pinecone' | 'weaviate'
  type: 'asr' | 'tts' | 'llm' | 'vector'
  config: Record<string, any>
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}