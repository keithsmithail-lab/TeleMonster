import { NextRequest, NextResponse } from 'next/server'

// Mock scenarios data - TODO: Replace with real database queries  
const mockScenarios = [
  {
    id: '1',
    name: 'Globe Phone Script',
    category: 'phone',
    personaId: 'persona2',
    nepqStages: [1, 2], // Connection, Situation
    timeLimit: 600, // 10 minutes
    difficulty: 'beginner',
    objectives: [
      'Build rapport quickly',
      'Understand current insurance situation',
      'Schedule follow-up appointment'
    ],
    context: 'You are calling a lead who responded to a globe phone script. They are busy but have shown initial interest. Focus on building connection and gathering basic information.',
    orgId: 'org1',
    isActive: true,
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: '2',
    name: 'Beneficiary Referral',
    category: 'in_home',
    personaId: 'persona1',
    nepqStages: [3, 4, 5], // Problem Awareness, Solution Awareness, Consequence
    timeLimit: 900, // 15 minutes
    difficulty: 'intermediate',
    objectives: [
      'Uncover protection concerns',
      'Explore current coverage gaps',
      'Build consequences of inaction',
      'Transition to presentation'
    ],
    context: 'Meeting with parents of young children who were referred by a friend. They are cautious but motivated to protect their family. Take time to build trust and thoroughly explore their needs.',
    orgId: 'org1',
    isActive: true,
    createdAt: new Date('2024-01-02').toISOString(),
    updatedAt: new Date('2024-01-14').toISOString(),
  },
  {
    id: '3',
    name: 'Video Consultation',
    category: 'zoom',
    personaId: 'persona3',
    nepqStages: [6, 7, 8], // Transition, Presentation, Commitment
    timeLimit: 1200, // 20 minutes
    difficulty: 'advanced',
    objectives: [
      'Smoothly transition to presentation',
      'Present solution effectively',
      'Handle objections professionally',
      'Secure commitment to next steps'
    ],
    context: 'Video call with a warm referral who is skeptical about insurance. They have done research online and may have preconceived notions. Focus on building trust and addressing concerns head-on.',
    orgId: 'org1',
    isActive: true,
    createdAt: new Date('2024-01-03').toISOString(),
    updatedAt: new Date('2024-01-12').toISOString(),
  },
  {
    id: '4',
    name: 'Referral Follow-up',
    category: 'phone',
    personaId: 'persona3',
    nepqStages: [1, 8], // Connection, Commitment
    timeLimit: 480, // 8 minutes
    difficulty: 'intermediate',
    objectives: [
      'Rebuild connection from previous call',
      'Address any new concerns',
      'Secure next appointment or commitment'
    ],
    context: 'Following up with a prospect from a previous conversation. They showed interest but needed time to think. Focus on addressing any new concerns and moving forward.',
    orgId: 'org1',
    isActive: true,
    createdAt: new Date('2024-01-04').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
  },
]

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const category = searchParams.get('category')
  const difficulty = searchParams.get('difficulty')
  const personaId = searchParams.get('personaId')
  const isActive = searchParams.get('isActive')

  let filteredScenarios = mockScenarios

  if (category) {
    filteredScenarios = filteredScenarios.filter(s => s.category === category)
  }

  if (difficulty) {
    filteredScenarios = filteredScenarios.filter(s => s.difficulty === difficulty)
  }

  if (personaId) {
    filteredScenarios = filteredScenarios.filter(s => s.personaId === personaId)
  }

  if (isActive !== null) {
    const activeFilter = isActive === 'true'
    filteredScenarios = filteredScenarios.filter(s => s.isActive === activeFilter)
  }

  // Add mock statistics
  const scenariosWithStats = filteredScenarios.map(scenario => ({
    ...scenario,
    recordingCount: Math.floor(Math.random() * 30) + 5,
    averageScore: Math.floor(Math.random() * 30) + 70,
  }))

  return NextResponse.json({
    data: scenariosWithStats,
    total: scenariosWithStats.length,
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // TODO: Implement real scenario creation
    // - Validate user permissions
    // - Validate required fields
    // - Save to database
    
    const newScenario = {
      id: Math.random().toString(36).substr(2, 9),
      name: body.name,
      category: body.category,
      personaId: body.personaId,
      nepqStages: body.nepqStages || [],
      timeLimit: body.timeLimit || 600,
      difficulty: body.difficulty || 'intermediate',
      objectives: body.objectives || [],
      context: body.context || '',
      orgId: 'org1', // TODO: Get from authenticated user
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Mock delay
    await new Promise(resolve => setTimeout(resolve, 100))

    return NextResponse.json(newScenario, { status: 201 })
  } catch (error) {
    console.error('Error creating scenario:', error)
    return NextResponse.json(
      { error: 'Failed to create scenario' },
      { status: 500 }
    )
  }
}