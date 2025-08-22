'use client'

import { useState } from 'react'
import { User, Bot, Clock } from 'lucide-react'
import { TranscriptTurn, NEPQStage, NEPQ_STAGE_NAMES } from '@/types/nepq'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDuration, getNepqStageColor } from '@/lib/utils'

interface TranscriptListProps {
  turns: TranscriptTurn[]
  currentTime?: number
  onSeek?: (timestamp: number) => void
}

// Mock transcript data - TODO: Replace with real data from API
const mockTranscript: TranscriptTurn[] = [
  {
    id: '1',
    speaker: 'agent',
    content: 'Hi there! Thank you for taking my call today. My name is Sarah from Cohen-Velasquez-Johnson Insurance. How are you doing today?',
    timestamp: 2.5,
    duration: 6.2,
    nepqStage: NEPQStage.CONNECTION,
    confidence: 0.95,
    analysis: {
      sentiment: 'positive',
      intent: 'greeting',
      keywords: ['thank you', 'name', 'how are you'],
    },
  },
  {
    id: '2',
    speaker: 'prospect',
    content: "I'm doing well, thank you. Though I have to say, I wasn't expecting a call today.",
    timestamp: 8.7,
    duration: 4.1,
    confidence: 0.88,
    analysis: {
      sentiment: 'neutral',
      intent: 'response',
      keywords: ['doing well', 'wasn\'t expecting'],
    },
  },
  {
    id: '3',
    speaker: 'agent',
    content: 'I completely understand, and I appreciate you taking the time to speak with me. I know how valuable your time is. Can you tell me a bit about your current insurance situation?',
    timestamp: 12.8,
    duration: 8.5,
    nepqStage: NEPQStage.SITUATION,
    confidence: 0.92,
    analysis: {
      sentiment: 'positive',
      intent: 'discovery_question',
      keywords: ['understand', 'time valuable', 'current insurance'],
    },
  },
  {
    id: '4',
    speaker: 'prospect',
    content: 'Well, I have some coverage through work, but I\'ve been thinking it might not be enough. My wife just had a baby and I want to make sure they\'re protected.',
    timestamp: 21.3,
    duration: 7.8,
    confidence: 0.91,
    analysis: {
      sentiment: 'neutral',
      intent: 'information_sharing',
      keywords: ['coverage through work', 'not enough', 'wife', 'baby', 'protected'],
    },
  },
  {
    id: '5',
    speaker: 'agent',
    content: 'Congratulations on the new addition to your family! That\'s wonderful news. It sounds like you\'re being really thoughtful about protecting them. Can you tell me what concerns you most about your current coverage?',
    timestamp: 29.1,
    duration: 10.2,
    nepqStage: NEPQStage.PROBLEM_AWARENESS,
    confidence: 0.89,
    analysis: {
      sentiment: 'positive',
      intent: 'empathy_and_discovery',
      keywords: ['congratulations', 'thoughtful', 'concerns', 'current coverage'],
    },
  },
]

export function TranscriptList({
  turns = mockTranscript,
  currentTime = 0,
  onSeek,
}: TranscriptListProps) {
  const [selectedTurn, setSelectedTurn] = useState<string | null>(null)

  const handleTurnClick = (turn: TranscriptTurn) => {
    setSelectedTurn(selectedTurn === turn.id ? null : turn.id)
    if (onSeek) {
      onSeek(turn.timestamp)
    }
  }

  const isCurrentTurn = (turn: TranscriptTurn) => {
    return currentTime >= turn.timestamp && currentTime < turn.timestamp + turn.duration
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Transcript</h3>
        <div className="text-sm text-muted-foreground">
          {turns.length} turns • {formatDuration(Math.max(...turns.map(t => t.timestamp + t.duration)))}
        </div>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {turns.map((turn) => (
          <div
            key={turn.id}
            className={`group relative p-4 rounded-lg border transition-all cursor-pointer ${
              isCurrentTurn(turn)
                ? 'bg-primary/5 border-primary'
                : selectedTurn === turn.id
                ? 'bg-accent border-accent-foreground/20'
                : 'hover:bg-accent'
            }`}
            onClick={() => handleTurnClick(turn)}
          >
            <div className="flex items-start space-x-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                turn.speaker === 'agent' 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                  : 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
              }`}>
                {turn.speaker === 'agent' ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium capitalize">
                      {turn.speaker === 'agent' ? 'Agent' : 'Prospect'}
                    </span>
                    {turn.nepqStage && (
                      <Badge
                        variant="outline"
                        className={`text-xs ${getNepqStageColor(turn.nepqStage)}`}
                      >
                        {NEPQ_STAGE_NAMES[turn.nepqStage]}
                      </Badge>
                    )}
                    {turn.confidence && (
                      <span className="text-xs text-muted-foreground">
                        {Math.round(turn.confidence * 100)}%
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatDuration(Math.floor(turn.timestamp))}</span>
                  </div>
                </div>

                <p className="text-sm leading-relaxed">{turn.content}</p>

                {selectedTurn === turn.id && turn.analysis && (
                  <div className="mt-3 pt-3 border-t space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-medium">Sentiment:</span>
                        <span className={`ml-2 capitalize ${
                          turn.analysis.sentiment === 'positive' ? 'text-green-600' :
                          turn.analysis.sentiment === 'negative' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {turn.analysis.sentiment}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Intent:</span>
                        <span className="ml-2 text-muted-foreground">
                          {turn.analysis.intent.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    
                    {turn.analysis.keywords && turn.analysis.keywords.length > 0 && (
                      <div>
                        <span className="text-xs font-medium">Keywords:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {turn.analysis.keywords.map((keyword, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {turn.analysis.objections && turn.analysis.objections.length > 0 && (
                      <div>
                        <span className="text-xs font-medium text-orange-600">Objections:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {turn.analysis.objections.map((objection, index) => (
                            <Badge key={index} variant="destructive" className="text-xs">
                              {objection}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}