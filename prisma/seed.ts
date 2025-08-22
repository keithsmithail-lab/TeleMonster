import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create organization
  const org = await prisma.organization.upsert({
    where: { id: 'org1' },
    update: {},
    create: {
      id: 'org1',
      name: 'Cohen-Velasquez-Johnson Insurance',
      plan: 'professional',
      seats: 25,
      usedSeats: 5,
      settings: {
        retentionDays: 90,
        allowRecordingDownload: true,
        enableRealTimeCoaching: false,
      },
    },
  })

  console.log('✅ Created organization:', org.name)

  // Create teams
  const alphaTeam = await prisma.team.upsert({
    where: { id: 'team1' },
    update: {},
    create: {
      id: 'team1',
      name: 'Alpha Team',
      orgId: org.id,
    },
  })

  const betaTeam = await prisma.team.upsert({
    where: { id: 'team2' },
    update: {},
    create: {
      id: 'team2',
      name: 'Beta Team',
      orgId: org.id,
    },
  })

  console.log('✅ Created teams')

  // Create users
  const adminPassword = await bcrypt.hash('TrainBetter2024!', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cvj.com' },
    update: {},
    create: {
      email: 'admin@cvj.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'User',
      orgId: org.id,
    },
  })

  const coach = await prisma.user.upsert({
    where: { email: 'coach@cvj.com' },
    update: {},
    create: {
      email: 'coach@cvj.com',
      passwordHash: adminPassword,
      role: 'COACH',
      firstName: 'John',
      lastName: 'Coach',
      orgId: org.id,
      teamId: alphaTeam.id,
    },
  })

  // Update team with coach
  await prisma.team.update({
    where: { id: alphaTeam.id },
    data: { coachId: coach.id },
  })

  const agent1 = await prisma.user.upsert({
    where: { email: 'agent@cvj.com' },
    update: {},
    create: {
      email: 'agent@cvj.com',
      passwordHash: adminPassword,
      role: 'AGENT',
      firstName: 'Sarah',
      lastName: 'Johnson',
      orgId: org.id,
      teamId: alphaTeam.id,
    },
  })

  const agent2 = await prisma.user.upsert({
    where: { email: 'mike.chen@cvj.com' },
    update: {},
    create: {
      email: 'mike.chen@cvj.com',
      passwordHash: adminPassword,
      role: 'AGENT',
      firstName: 'Mike',
      lastName: 'Chen',
      orgId: org.id,
      teamId: betaTeam.id,
    },
  })

  const agent3 = await prisma.user.upsert({
    where: { email: 'emily.davis@cvj.com' },
    update: {},
    create: {
      email: 'emily.davis@cvj.com',
      passwordHash: adminPassword,
      role: 'AGENT',
      firstName: 'Emily',
      lastName: 'Davis',
      orgId: org.id,
      teamId: alphaTeam.id,
    },
  })

  console.log('✅ Created users')

  // Create personas
  const persona1 = await prisma.persona.upsert({
    where: { id: 'persona1' },
    update: {},
    create: {
      id: 'persona1',
      name: 'Beneficiary Referral',
      description: 'Protective parent with young children who needs step-by-step clarity about life insurance benefits and processes.',
      traits: {
        personality: ['cautious', 'analytical', 'protective', 'detail-oriented'],
        objections: ['too expensive', 'already have coverage', 'need to think about it', 'want to discuss with spouse'],
        triggers: ['children\'s future', 'family security', 'peace of mind', 'easy process'],
        responsePatterns: {
          'price_concern': 'I\'m worried about the cost. We have a tight budget with the kids.',
          'time_pressure': 'I need to discuss this with my spouse first.',
          'trust_building': 'Can you explain this again? I want to make sure I understand.',
        },
        decisionMakingStyle: 'analytical',
        communicationPreference: 'detailed explanations',
      },
      orgId: org.id,
    },
  })

  const persona2 = await prisma.persona.upsert({
    where: { id: 'persona2' },
    update: {},
    create: {
      id: 'persona2',
      name: 'Globe Phone Script',
      description: 'Time-conscious professional who prefers direct communication and quick decisions. Often busy but appreciates efficiency.',
      traits: {
        personality: ['direct', 'busy', 'results-oriented', 'impatient'],
        objections: ['don\'t have time', 'happy with current provider', 'too complicated', 'call back later'],
        triggers: ['time savings', 'better value', 'simplified process', 'immediate benefits'],
        responsePatterns: {
          'time_concern': 'I only have a few minutes. Can you get to the point?',
          'efficiency': 'What\'s the bottom line here?',
          'impatience': 'Is this going to take long? I have another call.',
        },
        decisionMakingStyle: 'quick',
        communicationPreference: 'brief and direct',
      },
      orgId: org.id,
    },
  })

  const persona3 = await prisma.persona.upsert({
    where: { id: 'persona3' },
    update: {},
    create: {
      id: 'persona3',
      name: 'Referral Lead',
      description: 'Warm lead who was referred by a friend but remains skeptical about insurance sales processes and needs trust building.',
      traits: {
        personality: ['skeptical', 'social', 'relationship-focused', 'price-sensitive'],
        objections: ['heard bad things about insurance', 'friend had bad experience', 'too pushy', 'overpriced'],
        triggers: ['friend\'s recommendation', 'personal stories', 'transparency', 'honest approach'],
        responsePatterns: {
          'skepticism': 'I\'ve heard insurance agents can be pushy. Are you going to try to sell me something?',
          'referral_mention': 'My friend John said you helped him, but I\'m still not sure.',
          'price_sensitivity': 'How much is this going to cost me?',
        },
        decisionMakingStyle: 'relationship-based',
        communicationPreference: 'conversational',
      },
      orgId: org.id,
    },
  })

  console.log('✅ Created personas')

  // Create scenarios
  const scenario1 = await prisma.scenario.upsert({
    where: { id: 'scenario1' },
    update: {},
    create: {
      id: 'scenario1',
      name: 'Globe Phone Script',
      category: 'phone',
      personaId: persona2.id,
      nepqStages: [1, 2], // Connection, Situation
      timeLimit: 600,
      difficulty: 'beginner',
      objectives: ['Build rapport quickly', 'Understand current insurance situation', 'Schedule follow-up'],
      context: 'You are calling a lead who responded to a globe phone script. They are busy but have shown initial interest.',
      orgId: org.id,
    },
  })

  const scenario2 = await prisma.scenario.upsert({
    where: { id: 'scenario2' },
    update: {},
    create: {
      id: 'scenario2',
      name: 'Beneficiary Referral',
      category: 'in_home',
      personaId: persona1.id,
      nepqStages: [3, 4, 5], // Problem Awareness, Solution Awareness, Consequence
      timeLimit: 900,
      difficulty: 'intermediate',
      objectives: ['Uncover protection concerns', 'Explore coverage gaps', 'Build consequences', 'Transition to presentation'],
      context: 'Meeting with parents of young children who were referred by a friend. They are cautious but motivated.',
      orgId: org.id,
    },
  })

  console.log('✅ Created scenarios')

  // Create sample recordings
  const recording1 = await prisma.recording.upsert({
    where: { id: 'recording1' },
    update: {},
    create: {
      id: 'recording1',
      userId: agent1.id,
      scenarioId: scenario1.id,
      duration: 420,
      transcript: {
        turns: [
          {
            id: '1',
            speaker: 'agent',
            content: 'Hi there! Thank you for taking my call today. My name is Sarah from Cohen-Velasquez-Johnson Insurance.',
            timestamp: 2.5,
            duration: 6.2,
            nepqStage: 1,
            confidence: 0.95,
          },
          {
            id: '2',
            speaker: 'prospect',
            content: 'I\'m doing well, thank you. Though I have to say, I wasn\'t expecting a call today.',
            timestamp: 8.7,
            duration: 4.1,
            confidence: 0.88,
          },
        ],
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
        },
      },
      analytics: {
        talkRatio: 45,
        fillerWords: 12,
        pace: 165,
        interruptionCount: 2,
        questionCount: 8,
        statementCount: 15,
      },
      tags: ['Connection', 'Situation'],
    },
  })

  console.log('✅ Created sample recordings')

  // Create knowledge base items
  const kbItem1 = await prisma.kBItem.upsert({
    where: { id: 'kb1' },
    update: {},
    create: {
      id: 'kb1',
      title: 'NEPQ Black Book',
      source: 'nepq_black_book.pdf',
      content: 'The NEPQ methodology is a proven sales process for insurance professionals...',
      chunks: [
        {
          id: 'chunk1',
          content: 'Connection stage is about building rapport and establishing trust with the prospect.',
          nepqStages: [1],
          topics: ['rapport', 'trust', 'connection'],
        },
        {
          id: 'chunk2',
          content: 'Situation discovery involves understanding the prospect\'s current circumstances and insurance situation.',
          nepqStages: [2],
          topics: ['discovery', 'situation', 'current state'],
        },
      ],
      metadata: {
        fileType: 'pdf',
        wordCount: 4500,
        lastProcessed: new Date().toISOString(),
      },
      orgId: org.id,
    },
  })

  const kbItem2 = await prisma.kBItem.upsert({
    where: { id: 'kb2' },
    update: {},
    create: {
      id: 'kb2',
      title: 'Objection Responses',
      source: 'objection_responses.pdf',
      content: 'Common objections and proven responses for insurance sales...',
      chunks: [
        {
          id: 'chunk3',
          content: 'When prospects say "I need to think about it," probe deeper to understand their real concerns.',
          nepqStages: [3, 4],
          topics: ['objections', 'think about it', 'concerns'],
        },
      ],
      metadata: {
        fileType: 'pdf',
        wordCount: 2100,
        lastProcessed: new Date().toISOString(),
      },
      orgId: org.id,
    },
  })

  console.log('✅ Created knowledge base items')

  // Create provider configurations
  await prisma.providerConfig.createMany({
    data: [
      {
        orgId: org.id,
        provider: 'whisper',
        type: 'asr',
        config: {
          model: 'whisper-1',
          language: 'auto',
          temperature: 0.0,
        },
        isActive: false,
      },
      {
        orgId: org.id,
        provider: 'elevenlabs',
        type: 'tts',
        config: {
          voice_id: 'default',
          stability: 0.75,
          clarity: 0.75,
        },
        isActive: false,
      },
      {
        orgId: org.id,
        provider: 'openai',
        type: 'llm',
        config: {
          model: 'gpt-4',
          temperature: 0.7,
          max_tokens: 1000,
        },
        isActive: false,
      },
      {
        orgId: org.id,
        provider: 'pinecone',
        type: 'vector',
        config: {
          index_name: 'cvj-knowledge',
          dimension: 1536,
          metric: 'cosine',
        },
        isActive: false,
      },
    ],
  })

  console.log('✅ Created provider configurations')

  console.log('🎉 Seed completed successfully!')
  console.log('')
  console.log('📋 Login credentials:')
  console.log('   Email: admin@cvj.com')
  console.log('   Email: coach@cvj.com') 
  console.log('   Email: agent@cvj.com')
  console.log('   Password: TrainBetter2024!')
  console.log('')
  console.log('🚀 Start the development server with: npm run dev')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })