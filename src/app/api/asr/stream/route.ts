import { NextRequest } from 'next/server'

// Mock ASR streaming endpoint - TODO: Replace with real Whisper API integration
export async function GET(request: NextRequest) {
  // WebSocket endpoint for streaming ASR
  // In a real implementation, this would:
  // 1. Establish WebSocket connection
  // 2. Receive audio chunks from client
  // 3. Send to Whisper API for real-time transcription
  // 4. Return transcribed text with timestamps and confidence scores
  // 5. Detect NEPQ stage transitions
  
  const mockTranscriptChunks = [
    {
      text: "Hi there! Thank you for taking my call today.",
      timestamp: 2.5,
      confidence: 0.95,
      speaker: 'agent',
      nepqStage: 1, // Connection
    },
    {
      text: "My name is Sarah from Cohen-Velasquez-Johnson Insurance.",
      timestamp: 6.8,
      confidence: 0.92,
      speaker: 'agent',
      nepqStage: 1,
    },
    {
      text: "How are you doing today?",
      timestamp: 10.2,
      confidence: 0.97,
      speaker: 'agent',
      nepqStage: 1,
    },
    {
      text: "I'm doing well, thank you.",
      timestamp: 12.5,
      confidence: 0.89,
      speaker: 'prospect',
      nepqStage: 1,
    },
  ]

  // Return mock streaming response
  const stream = new ReadableStream({
    start(controller) {
      let index = 0
      const sendChunk = () => {
        if (index < mockTranscriptChunks.length) {
          const chunk = mockTranscriptChunks[index]
          controller.enqueue(`data: ${JSON.stringify(chunk)}\n\n`)
          index++
          setTimeout(sendChunk, 3000) // Send every 3 seconds
        } else {
          controller.close()
        }
      }
      sendChunk()
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}