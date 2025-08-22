'use client'

import Link from 'next/link'
import { Play, BookOpen, Users, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const quickActions = [
  {
    title: 'Start Role-play',
    description: 'Begin a new NEPQ training session',
    icon: Play,
    href: '/roleplays/new',
    color: 'bg-blue-500 text-white',
  },
  {
    title: 'Study Materials',
    description: 'Review knowledge base documents',
    icon: BookOpen,
    href: '/kb',
    color: 'bg-green-500 text-white',
  },
  {
    title: 'Practice Personas',
    description: 'Explore client personalities',
    icon: Users,
    href: '/personas',
    color: 'bg-purple-500 text-white',
  },
  {
    title: 'View Reports',
    description: 'Analyze your performance',
    icon: BarChart3,
    href: '/reports',
    color: 'bg-orange-500 text-white',
  },
]

export function QuickStart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Start</CardTitle>
        <CardDescription>
          Jump into your NEPQ training journey
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.title} href={action.href}>
                <div className="group cursor-pointer rounded-lg border p-4 transition-colors hover:bg-accent hover:text-accent-foreground">
                  <div className="flex items-center space-x-3">
                    <div className={`rounded-lg p-2 ${action.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{action.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}