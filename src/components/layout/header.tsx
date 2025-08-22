'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  BookOpen, 
  Settings, 
  Users, 
  Play,
  LogOut,
  User,
  Home
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useAuthStore } from '@/stores/auth'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Role-plays', href: '/roleplays', icon: Play },
  { name: 'Knowledge Base', href: '/kb', icon: BookOpen },
  { name: 'Personas', href: '/personas', icon: Users },
  { name: 'Admin', href: '/admin', icon: BarChart3, adminOnly: true },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Header() {
  const pathname = usePathname()
  const { user, logout } = useAuthStore()

  const filteredNavigation = navigation.filter(item => 
    !item.adminOnly || user?.role === 'ADMIN'
  )

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-sm font-bold">CVJ</span>
            </div>
            <span className="hidden font-semibold sm:inline-block">
              Cohen-Velasquez-Johnson
            </span>
          </Link>
          
          <nav className="flex items-center space-x-1">
            {filteredNavigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname.startsWith(item.href)
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                    isActive 
                      ? 'bg-accent text-accent-foreground' 
                      : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          
          {user && (
            <div className="flex items-center space-x-2">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user.role.toLowerCase()}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="h-8 w-8"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Logout</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}