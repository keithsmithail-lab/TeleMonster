import { NextRequest, NextResponse } from 'next/server'

// Mock recordings data - TODO: Replace with real database queries
const mockRecordings = [
  {
    id: '1',
    userId: 'user1',
    scenarioId: 'scenario1',
    duration: 420,
    audioUrl: null, // Mock - no real audio storage yet
    transcript: {
      turns: [
        {
          id: '1',
          speaker: 'agent',
          content: 'Hi there! Thank you for taking my call today.',
          timestamp: 2.5,
          duration: 3.2,
          nepqStage: 1,
          confidence: 0.95,
        }
      ]
    },
    score: {
      overall: 89,
      breakdown: {
        stageProgression: 4.5,
        transitionDiscipline: 4.2,
        discoveryDepth: 4.0,
        objectionHandling: 4.3,
        tonality: 4.6,
        activeListening: 4.4,
        talkRatio: 0.45,
        fillerWords: 12,
        questionRatio: 0.32,
      }
    },
    analytics: {
      talkRatio: 45,
      fillerWords: 12,
      pace: 165,
      interruptionCount: 2,
      questionCount: 8,
      statementCount: 15,
    },
    metadata: {
      deviceInfo: 'Chrome/Windows',
      browserInfo: 'Chrome 120.0',
      recordingQuality: 0.92,
    },
    tags: ['Connection', 'Situation'],
    isBookmarked: false,
    createdAt: new Date('2024-01-15T10:00:00').toISOString(),
    updatedAt: new Date('2024-01-15T10:07:00').toISOString(),
  }
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const userId = searchParams.get('userId')
  const scenarioId = searchParams.get('scenarioId')
  const limit = parseInt(searchParams.get('limit') || '10')
  const offset = parseInt(searchParams.get('offset') || '0')

  // TODO: Add authentication and user filtering
  
  let filteredRecordings = mockRecordings
  
  if (userId) {
    filteredRecordings = filteredRecordings.filter(r => r.userId === userId)
  }
  
  if (scenarioId) {
    filteredRecordings = filteredRecordings.filter(r => r.scenarioId === scenarioId)
  }

  const paginatedRecordings = filteredRecordings.slice(offset, offset + limit)

  return NextResponse.json({
    data: paginatedRecordings,
    pagination: {
      total: filteredRecordings.length,
      limit,
      offset,
      hasMore: offset + limit < filteredRecordings.length,
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // TODO: Implement real recording creation
    // - Validate user authentication
    // - Store audio file to S3
    // - Process with ASR service
    // - Calculate NEPQ scores
    // - Save to database
    
    const newRecording = {
      id: Math.random().toString(36).substr(2, 9),
      userId: body.userId,
      scenarioId: body.scenarioId,
      duration: body.duration || 0,
      audioUrl: null, // TODO: Generate S3 presigned URL
      transcript: body.transcript || { turns: [] },
      score: body.score || { overall: 0, breakdown: {} },
      analytics: body.analytics || {},
      metadata: body.metadata || {},
      tags: body.tags || [],
      isBookmarked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Mock delay for realistic API response
    await new Promise(resolve => setTimeout(resolve, 100))

    return NextResponse.json(newRecording, { status: 201 })
  } catch (error) {
    console.error('Error creating recording:', error)
    return NextResponse.json(
      { error: 'Failed to create recording' },
      { status: 500 }
    )
  }
}