'use client'

import Link from 'next/link'
import { ArrowUpDown, Play, MoreHorizontal, Eye } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate, getNepqStageColor } from '@/lib/utils'

interface RoleplayScenario {
  id: string
  name: string
  category: 'phone' | 'zoom' | 'in_home'
  nepqTags: string[]
  updatedAt: Date
  recordingCount: number
  averageScore?: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

interface RoleplaysTableProps {
  scenarios: RoleplayScenario[]
  sortBy: string
  sortOrder: 'asc' | 'desc'
  onSort: (column: string) => void
}

// Mock data - TODO: Replace with real data from API
const mockScenarios: RoleplayScenario[] = [
  {
    id: '1',
    name: 'Globe Phone Script',
    category: 'phone',
    nepqTags: ['Connection', 'Situation'],
    updatedAt: new Date('2024-01-15'),
    recordingCount: 24,
    averageScore: 89,
    difficulty: 'beginner',
  },
  {
    id: '2',
    name: 'Beneficiary Referral',
    category: 'in_home',
    nepqTags: ['Problem Awareness', 'Solution Awareness', 'Consequence'],
    updatedAt: new Date('2024-01-14'),
    recordingCount: 18,
    averageScore: 92,
    difficulty: 'intermediate',
  },
  {
    id: '3',
    name: 'Video Consultation',
    category: 'zoom',
    nepqTags: ['Transition', 'Presentation', 'Commitment'],
    updatedAt: new Date('2024-01-12'),
    recordingCount: 12,
    averageScore: 76,
    difficulty: 'advanced',
  },
  {
    id: '4',
    name: 'Referral Follow-up',
    category: 'phone',
    nepqTags: ['Connection', 'Commitment'],
    updatedAt: new Date('2024-01-10'),
    recordingCount: 8,
    averageScore: 84,
    difficulty: 'intermediate',
  },
]

export function RoleplaysTable({
  scenarios = mockScenarios,
  sortBy,
  sortOrder,
  onSort,
}: RoleplaysTableProps) {
  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'phone':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'zoom':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'in_home':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 dark:text-green-400'
      case 'intermediate':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'advanced':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getSortIcon = (column: string) => {
    return (
      <ArrowUpDown
        className={`ml-2 h-4 w-4 ${
          sortBy === column ? 'text-primary' : 'text-muted-foreground'
        }`}
      />
    )
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">
              <Button
                variant="ghost"
                className="h-auto p-0 font-medium"
                onClick={() => onSort('name')}
              >
                Name
                {getSortIcon('name')}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="h-auto p-0 font-medium"
                onClick={() => onSort('category')}
              >
                Category
                {getSortIcon('category')}
              </Button>
            </TableHead>
            <TableHead>NEPQ Tags</TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="h-auto p-0 font-medium"
                onClick={() => onSort('difficulty')}
              >
                Difficulty
                {getSortIcon('difficulty')}
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                className="h-auto p-0 font-medium"
                onClick={() => onSort('updatedAt')}
              >
                Updated
                {getSortIcon('updatedAt')}
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button
                variant="ghost"
                className="h-auto p-0 font-medium"
                onClick={() => onSort('recordingCount')}
              >
                Recordings
                {getSortIcon('recordingCount')}
              </Button>
            </TableHead>
            <TableHead className="text-right">Score</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scenarios.map((scenario) => (
            <TableRow key={scenario.id}>
              <TableCell className="font-medium">
                <Link
                  href={`/roleplays/${scenario.id}`}
                  className="hover:text-primary transition-colors"
                >
                  {scenario.name}
                </Link>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={getCategoryBadgeColor(scenario.category)}
                >
                  {scenario.category}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {scenario.nepqTags.slice(0, 2).map((tag, index) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className={`text-xs ${getNepqStageColor(index + 1)}`}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {scenario.nepqTags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{scenario.nepqTags.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <span className={`text-sm font-medium capitalize ${getDifficultyColor(scenario.difficulty)}`}>
                  {scenario.difficulty}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {formatDate(scenario.updatedAt)}
              </TableCell>
              <TableCell className="text-right">
                {scenario.recordingCount}
              </TableCell>
              <TableCell className="text-right">
                {scenario.averageScore && (
                  <Badge variant="outline">
                    {scenario.averageScore}%
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-1">
                  <Link href={`/roleplays/${scenario.id}/start`}>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Play className="h-3 w-3" />
                      <span className="sr-only">Start roleplay</span>
                    </Button>
                  </Link>
                  <Link href={`/roleplays/${scenario.id}`}>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <Eye className="h-3 w-3" />
                      <span className="sr-only">View details</span>
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <MoreHorizontal className="h-3 w-3" />
                    <span className="sr-only">More options</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}