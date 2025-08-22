'use client'

import { useState } from 'react'
import { Plus, Grid, List } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { FiltersBar } from '@/components/roleplays/filters-bar'
import { RoleplaysTable } from '@/components/roleplays/roleplays-table'

export default function RoleplaysPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>()
  const [selectedAgent, setSelectedAgent] = useState<string | undefined>()
  const [selectedDateRange, setSelectedDateRange] = useState<string | undefined>()
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [sortBy, setSortBy] = useState('updatedAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Role-plays</h1>
            <p className="text-muted-foreground">
              Practice NEPQ scenarios and improve your sales skills
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className="rounded-r-none"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-l-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
            
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Scenario
            </Button>
          </div>
        </div>

        <FiltersBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedAgent={selectedAgent}
          onAgentChange={setSelectedAgent}
          selectedDateRange={selectedDateRange}
          onDateRangeChange={setSelectedDateRange}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing 4 of 4 scenarios
            </p>
          </div>

          {viewMode === 'table' ? (
            <RoleplaysTable
              scenarios={[]} // Will use mock data from component
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              Grid view coming soon...
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}