'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { useTutorStore } from '@/src/store/tutorStore'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      max: 100,
    },
  },
}

export default function ProgressDashboard() {
  const { progress, selectedSubject } = useTutorStore()
  
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  const data = {
    labels,
    datasets: [
      {
        label: 'Progress Score',
        data: progress.weeklyProgress.length > 0
          ? progress.weeklyProgress
          : [65, 72, 78, 85], // Default data if no progress yet
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
    ],
  }

  const stats = [
    {
      label: 'Questions Answered',
      value: progress.questionsAnswered.toString() || '0',
    },
    {
      label: 'Success Rate',
      value: `${Math.round(progress.successRate * 100)}%` || '0%',
    },
    {
      label: 'Study Streak',
      value: `${progress.studyStreak} days` || '0 days',
    },
  ]

  if (!selectedSubject) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-center text-gray-500">
          Select a subject to view your progress
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
      
      <div className="h-48 mb-6">
        <Line options={options} data={data} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="text-center p-3 bg-gray-50 rounded-lg"
          >
            <div className="text-2xl font-bold text-blue-500">
              {stat.value}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">
          Recent Achievements
        </h3>
        {progress.achievements && progress.achievements.length > 0 ? (
          <div className="space-y-2">
            {progress.achievements.slice(0, 3).map((achievement, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <span className="text-yellow-500">{achievement.icon}</span>
                <span>{achievement.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            Complete lessons to earn achievements!
          </p>
        )}
      </div>
    </div>
  )
} 