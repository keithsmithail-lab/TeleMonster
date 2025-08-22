'use client'

import { useState } from 'react'
import { Play, Pause, Download, Bookmark, Share2 } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TranscriptList } from '@/components/recordings/transcript-list'
import { CommentsPanel } from '@/components/recordings/comments-panel'
import { formatDuration, formatDateTime, calculateScoreColor } from '@/lib/utils'

// Mock recording data - TODO: Replace with real data from API
const mockRecording = {
  id: '1',
  scenarioName: 'Globe Phone Script',
  agentName: 'Sarah Johnson',
  duration: 420,
  score: 89,
  createdAt: new Date('2024-01-15T10:00:00'),
  audioUrl: null, // Mock - no real audio
  tags: ['Connection', 'Situation', 'Problem Discovery'],
  isBookmarked: false,
  metadata: {
    category: 'phone',
    difficulty: 'beginner',
    personaName: 'Beneficiary Referral',
  },
  analytics: {
    talkRatio: 45,
    fillerWords: 12,
    pace: 165,
    interruptionCount: 2,
    questionCount: 8,
    statementCount: 15,
  },
}

export default function RecordingDetailPage({ params }: { params: { id: string } }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [activeTab, setActiveTab] = useState('transcript')

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    // TODO: Implement real audio playback
  }

  const handleSeek = (timestamp: number) => {
    setCurrentTime(timestamp)
    // TODO: Implement real audio seeking
  }

  const handleBookmark = () => {
    // TODO: Implement bookmark functionality
  }

  const handleShare = () => {
    // TODO: Implement share functionality
  }

  const handleDownload = () => {
    // TODO: Implement download functionality
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">{mockRecording.scenarioName}</h1>
              <Badge
                variant="outline"
                className={calculateScoreColor(mockRecording.score)}
              >
                {mockRecording.score}%
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{mockRecording.agentName}</span>
              <span>•</span>
              <span>{formatDateTime(mockRecording.createdAt)}</span>
              <span>•</span>
              <span>{formatDuration(mockRecording.duration)}</span>
              <span>•</span>
              <span className="capitalize">{mockRecording.metadata.category}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {mockRecording.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleBookmark}>
              <Bookmark className={`h-4 w-4 mr-2 ${mockRecording.isBookmarked ? 'fill-current' : ''}`} />
              {mockRecording.isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        {/* Audio Player */}
        <div className="p-4 border rounded-lg bg-muted/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handlePlayPause}
                size="lg"
                className="h-12 w-12 rounded-full"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </Button>
              
              <div>
                <div className="text-sm font-medium">
                  {formatDuration(Math.floor(currentTime))} / {formatDuration(mockRecording.duration)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {isPlaying ? 'Playing' : 'Paused'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold">{mockRecording.analytics.talkRatio}%</div>
                <div className="text-xs text-muted-foreground">Talk Ratio</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{mockRecording.analytics.questionCount}</div>
                <div className="text-xs text-muted-foreground">Questions</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{mockRecording.analytics.fillerWords}</div>
                <div className="text-xs text-muted-foreground">Filler Words</div>
              </div>
              <div>
                <div className="text-lg font-semibold">{mockRecording.analytics.pace} wpm</div>
                <div className="text-xs text-muted-foreground">Pace</div>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-200"
              style={{ width: `${(currentTime / mockRecording.duration) * 100}%` }}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="transcript" className="mt-6">
            <TranscriptList
              turns={[]} // Uses mock data from component
              currentTime={currentTime}
              onSeek={handleSeek}
            />
          </TabsContent>

          <TabsContent value="comments" className="mt-6">
            <CommentsPanel
              recordingId={params.id}
              comments={[]} // Uses mock data from component
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}