'use client'

import { RadioGroup } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/solid'
import { useTutorStore } from '@/src/store/tutorStore'

const subjects = [
  { id: 'math', name: 'Mathematics', icon: '📐' },
  { id: 'science', name: 'Science', icon: '🔬' },
  { id: 'history', name: 'History', icon: '📚' },
  { id: 'language', name: 'Language Arts', icon: '✍️' },
  { id: 'programming', name: 'Programming', icon: '💻' },
]

const difficulties = [
  { id: 'beginner', name: 'Beginner' },
  { id: 'intermediate', name: 'Intermediate' },
  { id: 'advanced', name: 'Advanced' },
]

export default function SubjectSelector() {
  const {
    selectedSubject,
    selectedDifficulty,
    setSelectedSubject,
    setSelectedDifficulty,
  } = useTutorStore()

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Choose Your Subject</h2>
      
      <RadioGroup
        value={selectedSubject}
        onChange={setSelectedSubject}
      >
        <RadioGroup.Label className="sr-only">Subject</RadioGroup.Label>
        <div className="space-y-2">
          {subjects.map((subject) => (
            <RadioGroup.Option
              key={subject.id}
              value={subject}
              className={({ checked }) =>
                `${
                  checked ? 'bg-blue-50 border-blue-500' : 'border-gray-200'
                } relative border rounded-lg px-4 py-3 cursor-pointer flex items-center space-x-3 focus:outline-none`
              }
            >
              {({ checked }) => (
                <>
                  <span className="text-xl">{subject.icon}</span>
                  <span className="flex-1">{subject.name}</span>
                  {checked && (
                    <CheckCircleIcon className="h-5 w-5 text-blue-500" />
                  )}
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>

      <h3 className="text-lg font-semibold mt-6 mb-4">Difficulty Level</h3>
      <RadioGroup
        value={selectedDifficulty}
        onChange={setSelectedDifficulty}
      >
        <RadioGroup.Label className="sr-only">Difficulty</RadioGroup.Label>
        <div className="grid grid-cols-3 gap-2">
          {difficulties.map((difficulty) => (
            <RadioGroup.Option
              key={difficulty.id}
              value={difficulty}
              className={({ checked }) =>
                `${
                  checked
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-900 hover:bg-gray-50'
                } border rounded-lg py-2 px-3 cursor-pointer text-center text-sm font-medium focus:outline-none`
              }
            >
              {difficulty.name}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    </div>
  )
} 