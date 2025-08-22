import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Role } from '@/types/database'

interface AuthUser {
  id: string
  email: string
  role: Role
  firstName?: string
  lastName?: string
  avatar?: string
  teamId?: string
  orgId: string
}

interface AuthState {
  user: AuthUser | null
  isLoading: boolean
  setUser: (user: AuthUser | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user, isLoading: false }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null, isLoading: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
)