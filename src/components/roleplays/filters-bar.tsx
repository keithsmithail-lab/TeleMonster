'use client'

import { useState } from 'react'
import { Search, Filter, X, Calendar, User, Tag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface FiltersBarProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedCategory?: string
  onCategoryChange: (category: string | undefined) => void
  selectedAgent?: string
  onAgentChange: (agent: string | undefined) => void
  selectedDateRange?: string
  onDateRangeChange: (range: string | undefined) => void
}

const categories = ['All', 'Phone', 'Zoom', 'In-home']
const agents = ['All', 'Sarah Johnson', 'Mike Chen', 'Emily Davis']
const dateRanges = ['All time', 'Last 7 days', 'Last 30 days', 'Last 90 days']

export function FiltersBar({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedAgent,
  onAgentChange,
  selectedDateRange,
  onDateRangeChange,
}: FiltersBarProps) {
  const [showFilters, setShowFilters] = useState(false)

  const activeFilters = [
    selectedCategory && selectedCategory !== 'All' && { 
      type: 'category', 
      label: selectedCategory,
      onRemove: () => onCategoryChange(undefined)
    },
    selectedAgent && selectedAgent !== 'All' && { 
      type: 'agent', 
      label: selectedAgent,
      onRemove: () => onAgentChange(undefined)
    },
    selectedDateRange && selectedDateRange !== 'All time' && { 
      type: 'date', 
      label: selectedDateRange,
      onRemove: () => onDateRangeChange(undefined)
    },
  ].filter(Boolean)

  const clearAllFilters = () => {
    onCategoryChange(undefined)
    onAgentChange(undefined)
    onDateRangeChange(undefined)
    onSearchChange('')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search scenarios..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>

        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Active filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {filter.type === 'category' && <Tag className="h-3 w-3" />}
              {filter.type === 'agent' && <User className="h-3 w-3" />}
              {filter.type === 'date' && <Calendar className="h-3 w-3" />}
              {filter.label}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 ml-1"
                onClick={filter.onRemove}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}

      {/* Filter dropdowns */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-muted/50">
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <select
              value={selectedCategory || 'All'}
              onChange={(e) => onCategoryChange(e.target.value === 'All' ? undefined : e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Agent</label>
            <select
              value={selectedAgent || 'All'}
              onChange={(e) => onAgentChange(e.target.value === 'All' ? undefined : e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {agents.map((agent) => (
                <option key={agent} value={agent}>
                  {agent}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Date Range</label>
            <select
              value={selectedDateRange || 'All time'}
              onChange={(e) => onDateRangeChange(e.target.value === 'All time' ? undefined : e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {dateRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}