'use client'

import { useState } from 'react'
import { Save, Check, X, Mic, Volume2, Brain, Database } from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ThemeToggle } from '@/components/ui/theme-toggle'

interface ProviderConfig {
  id: string
  name: string
  type: 'asr' | 'tts' | 'llm' | 'vector'
  status: 'connected' | 'disconnected' | 'error'
  description: string
  settings: Record<string, any>
}

// Mock provider configurations - TODO: Replace with real data from API
const mockProviders: ProviderConfig[] = [
  {
    id: '1',
    name: 'OpenAI Whisper',
    type: 'asr',
    status: 'disconnected',
    description: 'Speech-to-text transcription service',
    settings: {
      model: 'whisper-1',
      language: 'auto',
      temperature: 0.0,
    },
  },
  {
    id: '2',
    name: 'ElevenLabs',
    type: 'tts',
    status: 'disconnected',
    description: 'High-quality text-to-speech synthesis',
    settings: {
      voice_id: 'default',
      stability: 0.75,
      clarity: 0.75,
    },
  },
  {
    id: '3',
    name: 'OpenAI GPT-4',
    type: 'llm',
    status: 'disconnected',
    description: 'AI coaching and feedback generation',
    settings: {
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 1000,
    },
  },
  {
    id: '4',
    name: 'Pinecone',
    type: 'vector',
    status: 'disconnected',
    description: 'Vector database for knowledge base search',
    settings: {
      index_name: 'cvj-knowledge',
      dimension: 1536,
      metric: 'cosine',
    },
  },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('providers')
  const [providers, setProviders] = useState(mockProviders)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'asr':
        return <Mic className="h-4 w-4" />
      case 'tts':
        return <Volume2 className="h-4 w-4" />
      case 'llm':
        return <Brain className="h-4 w-4" />
      case 'vector':
        return <Database className="h-4 w-4" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Check className="h-3 w-3 mr-1" />
            Connected
          </Badge>
        )
      case 'error':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <X className="h-3 w-3 mr-1" />
            Error
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <X className="h-3 w-3 mr-1" />
            Disconnected
          </Badge>
        )
    }
  }

  const toggleProvider = (providerId: string) => {
    setProviders(prev => 
      prev.map(provider => 
        provider.id === providerId
          ? { 
              ...provider, 
              status: provider.status === 'connected' ? 'disconnected' : 'connected' 
            }
          : provider
      )
    )
    setHasUnsavedChanges(true)
  }

  const saveSettings = async () => {
    // TODO: Implement real API call to save settings
    console.log('Saving settings...', providers)
    setHasUnsavedChanges(false)
  }

  const providersByType = {
    asr: providers.filter(p => p.type === 'asr'),
    tts: providers.filter(p => p.type === 'tts'),
    llm: providers.filter(p => p.type === 'llm'),
    vector: providers.filter(p => p.type === 'vector'),
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Configure providers and application preferences
            </p>
          </div>
          
          {hasUnsavedChanges && (
            <Button onClick={saveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="providers">AI Providers</TabsTrigger>
            <TabsTrigger value="audio">Audio Settings</TabsTrigger>
            <TabsTrigger value="privacy">Privacy & Security</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="providers" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Provider Configuration</CardTitle>
                  <CardDescription>
                    Configure AI service providers for transcription, synthesis, and analysis.
                    Currently using mock services for development.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ASR Providers */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center">
                        <Mic className="h-4 w-4 mr-2" />
                        Speech Recognition (ASR)
                      </h4>
                      {providersByType.asr.map((provider) => (
                        <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getProviderIcon(provider.type)}
                            <div>
                              <div className="font-medium text-sm">{provider.name}</div>
                              <div className="text-xs text-muted-foreground">{provider.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(provider.status)}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleProvider(provider.id)}
                            >
                              {provider.status === 'connected' ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* TTS Providers */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center">
                        <Volume2 className="h-4 w-4 mr-2" />
                        Text-to-Speech (TTS)
                      </h4>
                      {providersByType.tts.map((provider) => (
                        <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getProviderIcon(provider.type)}
                            <div>
                              <div className="font-medium text-sm">{provider.name}</div>
                              <div className="text-xs text-muted-foreground">{provider.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(provider.status)}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleProvider(provider.id)}
                            >
                              {provider.status === 'connected' ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* LLM Providers */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center">
                        <Brain className="h-4 w-4 mr-2" />
                        Large Language Models (LLM)
                      </h4>
                      {providersByType.llm.map((provider) => (
                        <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getProviderIcon(provider.type)}
                            <div>
                              <div className="font-medium text-sm">{provider.name}</div>
                              <div className="text-xs text-muted-foreground">{provider.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(provider.status)}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleProvider(provider.id)}
                            >
                              {provider.status === 'connected' ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Vector Database */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center">
                        <Database className="h-4 w-4 mr-2" />
                        Vector Database
                      </h4>
                      {providersByType.vector.map((provider) => (
                        <div key={provider.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center space-x-3">
                            {getProviderIcon(provider.type)}
                            <div>
                              <div className="font-medium text-sm">{provider.name}</div>
                              <div className="text-xs text-muted-foreground">{provider.description}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(provider.status)}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleProvider(provider.id)}
                            >
                              {provider.status === 'connected' ? 'Disconnect' : 'Connect'}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Development Mode</CardTitle>
                  <CardDescription>
                    Current configuration is using mock services for demonstration purposes.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Use Mock Data</span>
                      <Badge variant="outline">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Enable Real ASR</span>
                      <Badge variant="outline">Disabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Enable TTS</span>
                      <Badge variant="outline">Disabled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="audio" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Audio Settings</CardTitle>
                <CardDescription>
                  Configure audio recording and playback preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Audio Quality</label>
                    <p className="text-xs text-muted-foreground">
                      Higher quality uses more storage
                    </p>
                  </div>
                  <select className="rounded-md border border-input bg-background px-3 py-1 text-sm">
                    <option value="16000">16kHz (Recommended)</option>
                    <option value="44100">44.1kHz (High)</option>
                    <option value="48000">48kHz (Professional)</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Automatic Gain Control</label>
                    <p className="text-xs text-muted-foreground">
                      Automatically adjust microphone sensitivity
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Noise Suppression</label>
                    <p className="text-xs text-muted-foreground">
                      Reduce background noise during recording
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
                <CardDescription>
                  Control data retention and privacy settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Recording Retention</label>
                    <p className="text-xs text-muted-foreground">
                      How long to keep audio recordings
                    </p>
                  </div>
                  <select className="rounded-md border border-input bg-background px-3 py-1 text-sm">
                    <option value="30">30 days</option>
                    <option value="90" selected>90 days</option>
                    <option value="365">1 year</option>
                  </select>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Allow Downloads</label>
                    <p className="text-xs text-muted-foreground">
                      Let users download their recordings
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Analytics Collection</label>
                    <p className="text-xs text-muted-foreground">
                      Collect usage data to improve the platform
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the look and feel of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Theme</label>
                    <p className="text-xs text-muted-foreground">
                      Choose your preferred color scheme
                    </p>
                  </div>
                  <ThemeToggle />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Compact Mode</label>
                    <p className="text-xs text-muted-foreground">
                      Show more content in less space
                    </p>
                  </div>
                  <input type="checkbox" className="rounded" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Show Keyboard Shortcuts</label>
                    <p className="text-xs text-muted-foreground">
                      Display keyboard shortcut hints
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}