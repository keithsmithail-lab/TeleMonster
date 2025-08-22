'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { calculateScoreColor } from '@/lib/utils'

interface LeaderboardEntry {
  id: string
  name: string
  avatar?: string
  score: number
  trend: 'up' | 'down' | 'same'
  trendValue: number
  recordingCount: number
}

// Mock data - TODO: Replace with real data from API
const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    score: 94,
    trend: 'up',
    trendValue: 5,
    recordingCount: 12,
  },
  {
    id: '2',
    name: 'Mike Chen',
    score: 89,
    trend: 'up',
    trendValue: 2,
    recordingCount: 8,
  },
  {
    id: '3',
    name: 'Emily Davis',
    score: 87,
    trend: 'down',
    trendValue: -3,
    recordingCount: 15,
  },
  {
    id: '4',
    name: 'Alex Rodriguez',
    score: 84,
    trend: 'same',
    trendValue: 0,
    recordingCount: 6,
  },
  {
    id: '5',
    name: 'Jordan Smith',
    score: 81,
    trend: 'up',
    trendValue: 7,
    recordingCount: 9,
  },
]

export function Leaderboard() {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />
      default:
        return <Minus className="h-3 w-3 text-gray-500" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400'
      case 'down':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Leaderboard</CardTitle>
        <CardDescription>
          Top performers this month (NEPQ scores)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockLeaderboard.map((entry, index) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.recordingCount} recordings
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  {getTrendIcon(entry.trend)}
                  <span className={`text-xs ${getTrendColor(entry.trend)}`}>
                    {entry.trend !== 'same' && (entry.trendValue > 0 ? '+' : '')}
                    {entry.trend !== 'same' ? entry.trendValue : ''}
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className={calculateScoreColor(entry.score)}
                >
                  {entry.score}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}