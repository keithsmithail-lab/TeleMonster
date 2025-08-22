'use client'

import { useState } from 'react'
import { Plus, Users, Crown, Shield, UserCheck, Calendar, TrendingUp } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatDate } from '@/lib/utils'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'COACH' | 'AGENT'
  teamName?: string
  lastActive: Date
  recordingCount: number
  averageScore?: number
  isActive: boolean
}

interface Team {
  id: string
  name: string
  coachName: string
  memberCount: number
  averageScore: number
  totalRecordings: number
  createdAt: Date
}

// Mock data - TODO: Replace with real data from API
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@cvj.com',
    firstName: 'Admin',
    lastName: 'User',
    role: 'ADMIN',
    lastActive: new Date('2024-01-15T14:30:00'),
    recordingCount: 0,
    isActive: true,
  },
  {
    id: '2',
    email: 'coach@cvj.com',
    firstName: 'John',
    lastName: 'Coach',
    role: 'COACH',
    teamName: 'Alpha Team',
    lastActive: new Date('2024-01-15T12:15:00'),
    recordingCount: 0,
    isActive: true,
  },
  {
    id: '3',
    email: 'sarah.johnson@cvj.com',
    firstName: 'Sarah',
    lastName: 'Johnson',
    role: 'AGENT',
    teamName: 'Alpha Team',
    lastActive: new Date('2024-01-15T09:45:00'),
    recordingCount: 24,
    averageScore: 89,
    isActive: true,
  },
  {
    id: '4',
    email: 'mike.chen@cvj.com',
    firstName: 'Mike',
    lastName: 'Chen',
    role: 'AGENT',
    teamName: 'Beta Team',
    lastActive: new Date('2024-01-14T16:20:00'),
    recordingCount: 18,
    averageScore: 85,
    isActive: true,
  },
  {
    id: '5',
    email: 'emily.davis@cvj.com',
    firstName: 'Emily',
    lastName: 'Davis',
    role: 'AGENT',
    teamName: 'Alpha Team',
    lastActive: new Date('2024-01-12T11:30:00'),
    recordingCount: 31,
    averageScore: 92,
    isActive: false,
  },
]

const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Alpha Team',
    coachName: 'John Coach',
    memberCount: 2,
    averageScore: 90,
    totalRecordings: 55,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Beta Team',
    coachName: 'Jane Coach',
    memberCount: 1,
    averageScore: 85,
    totalRecordings: 18,
    createdAt: new Date('2024-01-05'),
  },
]

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('users')

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Crown className="h-4 w-4 text-yellow-600" />
      case 'COACH':
        return <Shield className="h-4 w-4 text-blue-600" />
      case 'AGENT':
        return <UserCheck className="h-4 w-4 text-green-600" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'COACH':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'AGENT':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400'
    if (score >= 80) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const totalUsers = mockUsers.length
  const activeUsers = mockUsers.filter(u => u.isActive).length
  const totalRecordings = mockUsers.reduce((sum, u) => sum + u.recordingCount, 0)
  const overallAverage = Math.round(
    mockUsers
      .filter(u => u.averageScore)
      .reduce((sum, u) => sum + (u.averageScore || 0), 0) /
    mockUsers.filter(u => u.averageScore).length
  )

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage users, teams, and organization settings
            </p>
          </div>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Invite User
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {activeUsers} active users
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Teams</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockTeams.length}</div>
              <p className="text-xs text-muted-foreground">
                Active teams
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Recordings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRecordings}</div>
              <p className="text-xs text-muted-foreground">
                All time
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overallAverage}%</div>
              <p className="text-xs text-muted-foreground">
                Organization wide
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="teams">Teams</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage user accounts, roles, and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Recordings</TableHead>
                        <TableHead>Avg Score</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {user.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getRoleIcon(user.role)}
                              <Badge
                                variant="outline"
                                className={getRoleBadgeColor(user.role)}
                              >
                                {user.role}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.teamName || (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(user.lastActive)}
                          </TableCell>
                          <TableCell>{user.recordingCount}</TableCell>
                          <TableCell>
                            {user.averageScore ? (
                              <span className={getScoreColor(user.averageScore)}>
                                {user.averageScore}%
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={user.isActive ? 'default' : 'secondary'}
                            >
                              {user.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teams" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>
                  Organize users into teams and manage coaching assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Team Name</TableHead>
                        <TableHead>Coach</TableHead>
                        <TableHead>Members</TableHead>
                        <TableHead>Avg Score</TableHead>
                        <TableHead>Recordings</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockTeams.map((team) => (
                        <TableRow key={team.id}>
                          <TableCell className="font-medium">
                            {team.name}
                          </TableCell>
                          <TableCell>{team.coachName}</TableCell>
                          <TableCell>{team.memberCount}</TableCell>
                          <TableCell>
                            <span className={getScoreColor(team.averageScore)}>
                              {team.averageScore}%
                            </span>
                          </TableCell>
                          <TableCell>{team.totalRecordings}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(team.createdAt)}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              Manage
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Settings</CardTitle>
                  <CardDescription>
                    Configure organization-wide preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Recording Retention</label>
                      <p className="text-xs text-muted-foreground">
                        How long to keep recordings
                      </p>
                    </div>
                    <select className="rounded-md border border-input bg-background px-3 py-1 text-sm">
                      <option value="30">30 days</option>
                      <option value="90" selected>90 days</option>
                      <option value="365">1 year</option>
                      <option value="forever">Forever</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Download Recordings</label>
                      <p className="text-xs text-muted-foreground">
                        Allow users to download audio files
                      </p>
                    </div>
                    <input type="checkbox" defaultChecked className="rounded" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium">Real-time Coaching</label>
                      <p className="text-xs text-muted-foreground">
                        Enable live coaching during calls
                      </p>
                    </div>
                    <input type="checkbox" className="rounded" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Seat Management</CardTitle>
                  <CardDescription>
                    Manage user seats and billing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Used Seats</span>
                    <span className="text-sm">{activeUsers} / 25</span>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(activeUsers / 25) * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Plan</span>
                    <Badge variant="outline">Professional</Badge>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Upgrade Plan
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}