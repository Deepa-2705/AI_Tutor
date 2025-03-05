'use client'

import { create } from 'zustand'

interface Subject {
  id: string
  name: string
  icon: string
}

interface Difficulty {
  id: string
  name: string
}

interface Progress {
  questionsAnswered: number
  successRate: number
  studyStreak: number
  weeklyProgress: number[]
  achievements: Achievement[]
}

interface Achievement {
  id: string
  title: string
  icon: string
  date: Date
}

interface TutorState {
  selectedSubject: Subject | null
  selectedDifficulty: Difficulty | null
  progress: Progress
  setSelectedSubject: (subject: Subject) => void
  setSelectedDifficulty: (difficulty: Difficulty) => void
  updateProgress: (progress: Partial<Progress>) => void
  addAchievement: (achievement: Achievement) => void
}

export const useTutorStore = create<TutorState>((set) => ({
  selectedSubject: null,
  selectedDifficulty: null,
  progress: {
    questionsAnswered: 0,
    successRate: 0,
    studyStreak: 0,
    weeklyProgress: [],
    achievements: [],
  },
  
  setSelectedSubject: (subject) =>
    set(() => ({ selectedSubject: subject })),
    
  setSelectedDifficulty: (difficulty) =>
    set(() => ({ selectedDifficulty: difficulty })),
    
  updateProgress: (progress) =>
    set((state) => ({
      progress: { ...state.progress, ...progress },
    })),
    
  addAchievement: (achievement) =>
    set((state) => ({
      progress: {
        ...state.progress,
        achievements: [...state.progress.achievements, achievement],
      },
    })),
})) 