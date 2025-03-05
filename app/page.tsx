'use client'

import TutorInterface from '@/src/components/TutorInterface'
import SubjectSelector from '@/src/components/SubjectSelector'
import ProgressDashboard from '@/src/components/ProgressDashboard'

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-2">
      <h1 className="text-3xl font-bold text-center mb-2">
        Welcome to Your Personal AI Tutor
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-9 lg:order-1">
          <TutorInterface />
        </div>
        
        <div className="lg:col-span-3 lg:order-2 space-y-4">
          <SubjectSelector />
          <ProgressDashboard />
        </div>
      </div>
    </main>
  )
}
