'use client'

import Link from 'next/link'
import { Play, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, formatDuration, calculateScoreColor } from '@/lib/utils'

interface RecentReport {
  id: string
  scenarioName: string
  score: number
  duration: number
  createdAt: Date
  nepqStages: string[]
}

// Mock data - TODO: Replace with real data from API
const mockReports: RecentReport[] = [
  {
    id: '1',
    scenarioName: 'Globe Phone Script',
    score: 89,
    duration: 420,
    createdAt: new Date('2024-01-15'),
    nepqStages: ['Connection', 'Situation'],
  },
  {
    id: '2',
    scenarioName: 'Beneficiary Referral',
    score: 94,
    duration: 680,
    createdAt: new Date('2024-01-14'),
    nepqStages: ['Problem Awareness', 'Solution Awareness'],
  },
  {
    id: '3',
    scenarioName: 'Referral Follow-up',
    score: 76,
    duration: 340,
    createdAt: new Date('2024-01-12'),
    nepqStages: ['Transition', 'Presentation'],
  },
]

export function RecentReports() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>
            Your latest NEPQ training sessions
          </CardDescription>
        </div>
        <Link href="/roleplays">
          <Button variant="outline" size="sm">
            View All
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockReports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Play className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {report.scenarioName}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span>{formatDate(report.createdAt)}</span>
                    <span>•</span>
                    <span>{formatDuration(report.duration)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex flex-wrap gap-1">
                  {report.nepqStages.slice(0, 2).map((stage) => (
                    <Badge
                      key={stage}
                      variant="outline"
                      className="text-xs"
                    >
                      {stage}
                    </Badge>
                  ))}
                  {report.nepqStages.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{report.nepqStages.length - 2}
                    </Badge>
                  )}
                </div>
                <Badge
                  variant="outline"
                  className={calculateScoreColor(report.score)}
                >
                  {report.score}%
                </Badge>
                <Link href={`/recordings/${report.id}`}>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-3 w-3" />
                    <span className="sr-only">View details</span>
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}