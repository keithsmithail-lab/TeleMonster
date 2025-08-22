'use client'

import { useEffect } from 'react'
import { NEPQStage, NEPQ_STAGE_NAMES, NEPQ_STAGE_DESCRIPTIONS } from '@/types/nepq'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRecordingStore } from '@/stores/recording'
import { getNepqStageColor, cn } from '@/lib/utils'

interface StageRailProps {
  currentStage: NEPQStage
  onStageChange?: (stage: NEPQStage) => void
  completedStages?: NEPQStage[]
  violations?: Array<{
    stage: NEPQStage
    type: 'early_presentation' | 'poor_transition' | 'missed_discovery'
    severity: 'low' | 'medium' | 'high'
  }>
}

export function StageRail({
  currentStage,
  onStageChange,
  completedStages = [],
  violations = [],
}: StageRailProps) {
  const { setCurrentStage } = useRecordingStore()

  // Keyboard shortcuts for stage navigation (1-8)
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const stageNum = parseInt(event.key)
      if (stageNum >= 1 && stageNum <= 8) {
        const stage = stageNum as NEPQStage
        handleStageClick(stage)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const handleStageClick = (stage: NEPQStage) => {
    setCurrentStage(stage)
    onStageChange?.(stage)
  }

  const getStageStatus = (stage: NEPQStage) => {
    if (stage === currentStage) return 'current'
    if (completedStages.includes(stage)) return 'completed'
    if (stage < currentStage) return 'passed'
    return 'upcoming'
  }

  const getStageViolations = (stage: NEPQStage) => {
    return violations.filter(v => v.stage === stage)
  }

  const stages = Object.values(NEPQStage).filter(v => typeof v === 'number') as NEPQStage[]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">NEPQ Stage Tracker</CardTitle>
        <p className="text-sm text-muted-foreground">
          Click stages or use keyboard shortcuts (1-8) to navigate
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {stages.map((stage) => {
            const status = getStageStatus(stage)
            const stageViolations = getStageViolations(stage)
            const hasViolations = stageViolations.length > 0
            const severestViolation = stageViolations.reduce((prev, curr) => {
              if (curr.severity === 'high') return curr
              if (curr.severity === 'medium' && prev.severity !== 'high') return curr
              return prev
            }, stageViolations[0])

            return (
              <div
                key={stage}
                className={cn(
                  'group relative p-3 rounded-lg border transition-all cursor-pointer',
                  status === 'current' && 'ring-2 ring-primary bg-primary/5',
                  status === 'completed' && 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
                  status === 'passed' && 'bg-muted/50',
                  status === 'upcoming' && 'opacity-75',
                  hasViolations && 'border-red-200 dark:border-red-800',
                )}
                onClick={() => handleStageClick(stage)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                      status === 'current' && 'bg-primary text-primary-foreground',
                      status === 'completed' && 'bg-green-500 text-white',
                      status === 'passed' && 'bg-muted text-muted-foreground',
                      status === 'upcoming' && 'bg-muted text-muted-foreground',
                    )}>
                      {stage}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-sm">
                          {NEPQ_STAGE_NAMES[stage]}
                        </h4>
                        {status === 'current' && (
                          <Badge variant="default" className="text-xs">
                            Current
                          </Badge>
                        )}
                        {status === 'completed' && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            ✓
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {NEPQ_STAGE_DESCRIPTIONS[stage]}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                      {stage}
                    </kbd>
                    
                    {hasViolations && (
                      <Badge
                        variant="destructive"
                        className={cn(
                          'text-xs',
                          severestViolation?.severity === 'high' && 'bg-red-600',
                          severestViolation?.severity === 'medium' && 'bg-orange-500',
                          severestViolation?.severity === 'low' && 'bg-yellow-500',
                        )}
                      >
                        !
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Violations display */}
                {hasViolations && (
                  <div className="mt-3 pt-3 border-t space-y-1">
                    {stageViolations.map((violation, index) => (
                      <div
                        key={index}
                        className={cn(
                          'text-xs p-2 rounded',
                          violation.severity === 'high' && 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200',
                          violation.severity === 'medium' && 'bg-orange-50 text-orange-800 dark:bg-orange-950 dark:text-orange-200',
                          violation.severity === 'low' && 'bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200',
                        )}
                      >
                        <span className="font-medium capitalize">
                          {violation.type.replace('_', ' ')}:
                        </span>
                        <span className="ml-1">
                          {violation.type === 'early_presentation' && 'Presenting too early in the process'}
                          {violation.type === 'poor_transition' && 'Weak transition between stages'}
                          {violation.type === 'missed_discovery' && 'Insufficient discovery questions'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Stage Progress */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{completedStages.length} / {stages.length} stages</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedStages.length / stages.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Quick tips */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <h5 className="text-sm font-medium mb-2">💡 NEPQ Tips</h5>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Never present until you reach Transition (Stage 6)</li>
            <li>• Ask 3-5 discovery questions in Problem Awareness</li>
            <li>• Build consequences before offering solutions</li>
            <li>• Use keyboard shortcuts (1-8) for quick navigation</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}