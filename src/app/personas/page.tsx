'use client'

import { useState } from 'react'
import { Plus, Users, Brain, MessageSquare, TrendingUp } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface PersonaProfile {
  id: string
  name: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  traits: {
    personality: string[]
    objections: string[]
    triggers: string[]
    decisionMakingStyle: string
    communicationPreference: string
  }
  scenarioCount: number
  averageScore?: number
  lastUsed?: Date
}

// Mock persona data - TODO: Replace with real data from API
const mockPersonas: PersonaProfile[] = [
  {
    id: '1',
    name: 'Beneficiary Referral',
    description: 'Protective parent with young children who needs step-by-step clarity about life insurance benefits and processes.',
    difficulty: 'beginner',
    traits: {
      personality: ['cautious', 'analytical', 'protective', 'detail-oriented'],
      objections: ['too expensive', 'already have coverage', 'need to think about it', 'want to discuss with spouse'],
      triggers: ['children\'s future', 'family security', 'peace of mind', 'easy process'],
      decisionMakingStyle: 'analytical',
      communicationPreference: 'detailed explanations',
    },
    scenarioCount: 3,
    averageScore: 84,
    lastUsed: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Globe Phone Script',
    description: 'Time-conscious professional who prefers direct communication and quick decisions. Often busy but appreciates efficiency.',
    difficulty: 'intermediate',
    traits: {
      personality: ['direct', 'busy', 'results-oriented', 'impatient'],
      objections: ['don\'t have time', 'happy with current provider', 'too complicated', 'call back later'],
      triggers: ['time savings', 'better value', 'simplified process', 'immediate benefits'],
      decisionMakingStyle: 'quick',
      communicationPreference: 'brief and direct',
    },
    scenarioCount: 2,
    averageScore: 78,
    lastUsed: new Date('2024-01-14'),
  },
  {
    id: '3',
    name: 'Referral Lead',
    description: 'Warm lead who was referred by a friend but remains skeptical about insurance sales processes and needs trust building.',
    difficulty: 'advanced',
    traits: {
      personality: ['skeptical', 'social', 'relationship-focused', 'price-sensitive'],
      objections: ['heard bad things about insurance', 'friend had bad experience', 'too pushy', 'overpriced'],
      triggers: ['friend\'s recommendation', 'personal stories', 'transparency', 'honest approach'],
      decisionMakingStyle: 'relationship-based',
      communicationPreference: 'conversational',
    },
    scenarioCount: 4,
    averageScore: 71,
    lastUsed: new Date('2024-01-12'),
  },
]

export default function PersonasPage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')

  const filteredPersonas = mockPersonas.filter(persona => 
    selectedDifficulty === 'all' || persona.difficulty === selectedDifficulty
  )

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 dark:text-green-400'
    if (score >= 75) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Personas</h1>
            <p className="text-muted-foreground">
              Practice with different client personalities and communication styles
            </p>
          </div>
          
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Persona
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Personas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockPersonas.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(mockPersonas.reduce((sum, p) => sum + (p.averageScore || 0), 0) / mockPersonas.length)}%
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scenarios</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockPersonas.reduce((sum, p) => sum + p.scenarioCount, 0)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Challenging</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Referral Lead</div>
              <p className="text-xs text-muted-foreground">71% avg score</p>
            </CardContent>
          </Card>
        </div>

        {/* Difficulty Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Filter by difficulty:</span>
          <div className="flex space-x-1">
            {['all', 'beginner', 'intermediate', 'advanced'].map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
                className="capitalize"
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>

        {/* Personas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPersonas.map((persona) => (
            <Card key={persona.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{persona.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={getDifficultyColor(persona.difficulty)}
                      >
                        {persona.difficulty}
                      </Badge>
                      {persona.averageScore && (
                        <Badge
                          variant="outline"
                          className={getScoreColor(persona.averageScore)}
                        >
                          {persona.averageScore}% avg
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-muted-foreground">
                    <div>{persona.scenarioCount} scenarios</div>
                    {persona.lastUsed && (
                      <div>Used {persona.lastUsed.toLocaleDateString()}</div>
                    )}
                  </div>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  {persona.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Personality Traits */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Personality</h4>
                  <div className="flex flex-wrap gap-1">
                    {persona.traits.personality.slice(0, 4).map((trait) => (
                      <Badge key={trait} variant="secondary" className="text-xs">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Common Objections */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Common Objections</h4>
                  <div className="space-y-1">
                    {persona.traits.objections.slice(0, 2).map((objection, index) => (
                      <div key={index} className="text-xs text-muted-foreground border-l-2 border-orange-200 pl-2">
                        "{objection}"
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Triggers */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Key Triggers</h4>
                  <div className="flex flex-wrap gap-1">
                    {persona.traits.triggers.slice(0, 3).map((trigger) => (
                      <Badge key={trigger} variant="outline" className="text-xs text-green-700 dark:text-green-300">
                        {trigger}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Communication Style */}
                <div className="pt-2 border-t">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Decision Style:</span>
                    <span className="font-medium capitalize">{persona.traits.decisionMakingStyle}</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-muted-foreground">Communication:</span>
                    <span className="font-medium capitalize">{persona.traits.communicationPreference}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1">
                    Start Practice
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPersonas.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No personas found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your difficulty filter or create a new persona
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Persona
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}