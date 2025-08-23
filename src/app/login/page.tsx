'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const router = useRouter()
  const { setUser } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Mock authentication with predefined users
      const mockUsers = [
        {
          email: 'admin@cvj.com',
          password: 'TrainBetter2024!',
          user: {
            id: '1',
            email: 'admin@cvj.com',
            role: 'admin', // lowercased to satisfy Role type
            firstName: 'Admin',
            lastName: 'User',
            orgId: 'org1',
          },
        },
        {
          email: 'coach@cvj.com',
          password: 'TrainBetter2024!',
          user: {
            id: '2',
            email: 'coach@cvj.com',
            role: 'coach', // lowercased
            firstName: 'John',
            lastName: 'Coach',
            teamId: 'team1',
            orgId: 'org1',
          },
        },
        {
          email: 'agent@cvj.com',
          password: 'TrainBetter2024!',
          user: {
            id: '3',
            email: 'agent@cvj.com',
            role: 'agent', // lowercased
            firstName: 'Sarah',
            lastName: 'Johnson',
            teamId: 'team1',
            orgId: 'org1',
          },
        },
      ]

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const mockUser = mockUsers.find(u => u.email === email && u.password === password)

      if (mockUser) {
        setUser(mockUser.user) // now matches AuthUser Role type
        router.push('/dashboard')
      } else {
        setError('Invalid email or password')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const fillDemoCredentials = (userType: 'admin' | 'coach' | 'agent') => {
    const emails = {
      admin: 'admin@cvj.com',
      coach: 'coach@cvj.com',
      agent: 'agent@cvj.com',
    } as const

    setEmail(emails[userType])
    setPassword('TrainBetter2024!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Shield className="h-6 w-6" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Cohen-Velasquez-Johnson</h1>
          <p className="text-gray-400">NEPQ Training Platform</p>
        </div>

        {/* Login Form */}
        <Card className="border-gray-700 bg-gray-800/50 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-white">Sign in</CardTitle>
            <CardDescription className="text-center text-gray-400">
              Enter your credentials to access the training platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-200">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@cvj.com"
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-200">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded p-2">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-6 border-t border-gray-600">
              <p className="text-xs text-center text-gray-400 mb-3">Demo Credentials (click to fill)</p>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('admin')}
                  className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('coach')}
                  className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  coach
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials('agent')}
                  className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  agent
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>© 2024 Cohen-Velasquez-Johnson. All rights reserved.</p>
          <p className="mt-1">NEPQ Training Platform v1.0</p>
        </div>
      </div>
    </div>
  )
}
