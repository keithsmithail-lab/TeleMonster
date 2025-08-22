'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Play, Pause, Square, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRecordingStore } from '@/stores/recording'
import { formatDuration } from '@/lib/utils'

interface AudioRecorderProps {
  onRecordingComplete?: (audioBlob: Blob) => void
  onTranscriptUpdate?: (text: string) => void
}

export function AudioRecorder({ onRecordingComplete, onTranscriptUpdate }: AudioRecorderProps) {
  const {
    isRecording,
    isPaused,
    duration,
    audioLevel,
    deviceId,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    setDuration,
    setAudioLevel,
    setDevice,
  } = useRecordingStore()

  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)

  // Mock transcription WebSocket - TODO: Replace with real Whisper API
  const mockTranscription = useRef<NodeJS.Timeout | null>(null)
  const mockTranscriptTexts = [
    "Hi there! Thank you for taking my call today.",
    "My name is Sarah from Cohen-Velasquez-Johnson Insurance.",
    "How are you doing today?",
    "I completely understand, and I appreciate you taking the time.",
    "Can you tell me a bit about your current insurance situation?",
  ]
  const [transcriptIndex, setTranscriptIndex] = useState(0)

  useEffect(() => {
    checkPermissions()
    getDevices()
    
    return () => {
      cleanup()
    }
  }, [])

  const checkPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setHasPermission(true)
      stream.getTracks().forEach(track => track.stop())
    } catch (err) {
      setHasPermission(false)
      console.error('Microphone permission denied:', err)
    }
  }

  const getDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices()
      const audioInputs = deviceList.filter(device => device.kind === 'audioinput')
      setDevices(audioInputs)
      
      if (audioInputs.length > 0 && !deviceId) {
        setDevice(audioInputs[0].deviceId)
      }
    } catch (err) {
      console.error('Error getting devices:', err)
    }
  }

  const setupAudioAnalysis = (stream: MediaStream) => {
    audioContextRef.current = new AudioContext()
    analyserRef.current = audioContextRef.current.createAnalyser()
    const source = audioContextRef.current.createMediaStreamSource(stream)
    
    source.connect(analyserRef.current)
    analyserRef.current.fftSize = 256
    
    const bufferLength = analyserRef.current.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    const updateAudioLevel = () => {
      if (analyserRef.current && isRecording && !isPaused) {
        analyserRef.current.getByteFrequencyData(dataArray)
        const average = dataArray.reduce((a, b) => a + b) / bufferLength
        setAudioLevel(average / 255) // Normalize to 0-1
        requestAnimationFrame(updateAudioLevel)
      }
    }
    
    updateAudioLevel()
  }

  const startMockTranscription = () => {
    if (mockTranscription.current) {
      clearInterval(mockTranscription.current)
    }
    
    setTranscriptIndex(0)
    mockTranscription.current = setInterval(() => {
      if (transcriptIndex < mockTranscriptTexts.length) {
        onTranscriptUpdate?.(mockTranscriptTexts[transcriptIndex])
        setTranscriptIndex(prev => prev + 1)
      } else {
        clearInterval(mockTranscription.current!)
      }
    }, 3000) // Add new transcript every 3 seconds
  }

  const stopMockTranscription = () => {
    if (mockTranscription.current) {
      clearInterval(mockTranscription.current)
      mockTranscription.current = null
    }
  }

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000, // Optimal for Whisper
        }
      })

      streamRef.current = stream
      setupAudioAnalysis(stream)

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      const chunks: BlobPart[] = []
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' })
        onRecordingComplete?.(audioBlob)
      }

      mediaRecorderRef.current.start(250) // 250ms chunks for streaming
      startRecording()
      startMockTranscription()

      // Start duration timer
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)

    } catch (err) {
      console.error('Error starting recording:', err)
    }
  }

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    
    cleanup()
    stopRecording()
    stopMockTranscription()
  }

  const handlePauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause()
      pauseRecording()
      stopMockTranscription()
    }
  }

  const handleResumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume()
      resumeRecording()
      startMockTranscription()
    }
  }

  const cleanup = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    
    setAudioLevel(0)
  }

  if (hasPermission === null) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Checking microphone permissions...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (hasPermission === false) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center space-y-2">
            <MicOff className="h-8 w-8 text-muted-foreground mx-auto" />
            <p className="text-sm font-medium">Microphone access required</p>
            <p className="text-xs text-muted-foreground">
              Please allow microphone access to start recording
            </p>
            <Button onClick={checkPermissions} size="sm">
              Grant Permission
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Audio Recorder</span>
          <Badge variant={isRecording ? 'destructive' : 'secondary'}>
            {isRecording ? (isPaused ? 'Paused' : 'Recording') : 'Ready'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Device Selection */}
        <div className="flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <select
            value={deviceId || ''}
            onChange={(e) => setDevice(e.target.value)}
            disabled={isRecording}
            className="flex-1 rounded-md border border-input bg-background px-3 py-1 text-sm"
          >
            {devices.map(device => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || 'Microphone'}
              </option>
            ))}
          </select>
        </div>

        {/* Audio Level Meter */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Audio Level</span>
            <span>{Math.round(audioLevel * 100)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-100 ${
                audioLevel > 0.8 ? 'bg-red-500' :
                audioLevel > 0.5 ? 'bg-yellow-500' :
                audioLevel > 0.2 ? 'bg-green-500' :
                'bg-muted-foreground'
              }`}
              style={{ width: `${audioLevel * 100}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {!isRecording ? (
              <Button onClick={handleStartRecording} className="bg-red-600 hover:bg-red-700">
                <Mic className="h-4 w-4 mr-2" />
                Start Recording
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                {isPaused ? (
                  <Button onClick={handleResumeRecording} variant="outline">
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </Button>
                ) : (
                  <Button onClick={handlePauseRecording} variant="outline">
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </Button>
                )}
                <Button onClick={handleStopRecording} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground font-mono">
            {formatDuration(duration)}
          </div>
        </div>

        {/* Recording Indicator */}
        {isRecording && !isPaused && (
          <div className="flex items-center justify-center space-x-2 p-2 rounded-lg bg-red-50 dark:bg-red-950">
            <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm text-red-700 dark:text-red-300">Recording in progress...</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}