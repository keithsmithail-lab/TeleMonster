import { MainLayout } from '@/components/layout/main-layout'
import { QuickStart } from '@/components/dashboard/quick-start'
import { Leaderboard } from '@/components/dashboard/leaderboard'
import { RecentReports } from '@/components/dashboard/recent-reports'

export default function DashboardPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Continue your NEPQ training journey.
          </p>
        </div>

        <QuickStart />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentReports />
          <Leaderboard />
        </div>
      </div>
    </MainLayout>
  )
}