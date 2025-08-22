import { create } from 'zustand'
import type { TranscriptTurn, NEPQStage } from '@/types/nepq'

interface RecordingState {
  isRecording: boolean
  isPaused: boolean
  duration: number
  currentStage: NEPQStage
  transcript: TranscriptTurn[]
  audioLevel: number
  deviceId?: string
  
  // Actions
  startRecording: () => void
  stopRecording: () => void
  pauseRecording: () => void
  resumeRecording: () => void
  setDuration: (duration: number) => void
  setCurrentStage: (stage: NEPQStage) => void
  addTranscriptTurn: (turn: TranscriptTurn) => void
  updateTranscriptTurn: (id: string, updates: Partial<TranscriptTurn>) => void
  setAudioLevel: (level: number) => void
  setDevice: (deviceId: string) => void
  reset: () => void
}

export const useRecordingStore = create<RecordingState>((set, get) => ({
  isRecording: false,
  isPaused: false,
  duration: 0,
  currentStage: NEPQStage.CONNECTION,
  transcript: [],
  audioLevel: 0,
  deviceId: undefined,

  startRecording: () => set({ isRecording: true, isPaused: false }),
  
  stopRecording: () => set({ isRecording: false, isPaused: false }),
  
  pauseRecording: () => set({ isPaused: true }),
  
  resumeRecording: () => set({ isPaused: false }),
  
  setDuration: (duration) => set({ duration }),
  
  setCurrentStage: (currentStage) => set({ currentStage }),
  
  addTranscriptTurn: (turn) => 
    set((state) => ({ transcript: [...state.transcript, turn] })),
  
  updateTranscriptTurn: (id, updates) =>
    set((state) => ({
      transcript: state.transcript.map((turn) =>
        turn.id === id ? { ...turn, ...updates } : turn
      ),
    })),
  
  setAudioLevel: (audioLevel) => set({ audioLevel }),
  
  setDevice: (deviceId) => set({ deviceId }),
  
  reset: () => set({
    isRecording: false,
    isPaused: false,
    duration: 0,
    currentStage: NEPQStage.CONNECTION,
    transcript: [],
    audioLevel: 0,
  }),
}))