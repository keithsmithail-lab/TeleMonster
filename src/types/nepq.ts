// NEPQ Sales Methodology Types
export enum NEPQStage {
  CONNECTION = 1,
  SITUATION = 2,
  PROBLEM_AWARENESS = 3,
  SOLUTION_AWARENESS = 4,
  CONSEQUENCE = 5,
  TRANSITION = 6,
  PRESENTATION = 7,
  COMMITMENT = 8,
}

export const NEPQ_STAGE_NAMES = {
  [NEPQStage.CONNECTION]: 'Connection',
  [NEPQStage.SITUATION]: 'Situation',
  [NEPQStage.PROBLEM_AWARENESS]: 'Problem Awareness',
  [NEPQStage.SOLUTION_AWARENESS]: 'Solution Awareness',
  [NEPQStage.CONSEQUENCE]: 'Consequence',
  [NEPQStage.TRANSITION]: 'Transition',
  [NEPQStage.PRESENTATION]: 'Presentation',
  [NEPQStage.COMMITMENT]: 'Commitment',
} as const

export const NEPQ_STAGE_DESCRIPTIONS = {
  [NEPQStage.CONNECTION]: 'Build rapport and find common ground',
  [NEPQStage.SITUATION]: 'Understand current circumstances',
  [NEPQStage.PROBLEM_AWARENESS]: 'Uncover pain points naturally',
  [NEPQStage.SOLUTION_AWARENESS]: 'Explore what they\'ve tried',
  [NEPQStage.CONSEQUENCE]: 'Discuss impact of inaction',
  [NEPQStage.TRANSITION]: 'Bridge to presentation (critical: no early presenting)',
  [NEPQStage.PRESENTATION]: 'Share solution when earned',
  [NEPQStage.COMMITMENT]: 'Secure next steps',
} as const

export interface NEPQScore {
  // Core NEPQ Discipline (50% weight)
  stageProgression: number      // 1-5, did they follow order?
  transitionDiscipline: number  // 1-5, no early presenting?
  discoveryDepth: number        // 1-5, found real problems?
  
  // Communication Skills (30% weight)
  objectionHandling: number     // 1-5, addressed concerns?
  tonality: number              // 1-5, curious not pushy?
  activeListening: number       // 1-5, responded to cues?
  
  // Technical Metrics (20% weight)
  talkRatio: number            // Agent should talk <50%
  fillerWords: number          // <5% is good
  questionRatio: number        // >30% questions is good
}

export interface NEPQAnalysis {
  currentStage: NEPQStage
  stageTransitions: Array<{
    from: NEPQStage
    to: NEPQStage
    timestamp: number
    confidence: number
  }>
  violations: Array<{
    type: 'early_presentation' | 'poor_transition' | 'missed_discovery'
    timestamp: number
    description: string
    severity: 'low' | 'medium' | 'high'
  }>
  score: NEPQScore
  overallScore: number
}

export interface TranscriptTurn {
  id: string
  speaker: 'agent' | 'prospect'
  content: string
  timestamp: number
  duration: number
  nepqStage?: NEPQStage
  confidence?: number
  analysis?: {
    sentiment: 'positive' | 'neutral' | 'negative'
    intent: string
    keywords: string[]
    objections?: string[]
  }
}