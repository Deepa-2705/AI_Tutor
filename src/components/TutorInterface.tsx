'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { generateResponse, evaluateAnswer, AIResponse } from '@/src/services/aiService'
import { useTutorStore } from '@/src/store/tutorStore'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  type?: 'text' | 'question' | 'explanation' | 'error'
  metadata?: {
    isCorrect?: boolean
    hints?: string[]
  }
}

export default function TutorInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { selectedSubject, selectedDifficulty, updateProgress } = useTutorStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !selectedSubject || !selectedDifficulty) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      let aiResponse: AIResponse
      
      // If the last message was a question, evaluate the answer
      const lastMessage = messages[messages.length - 1]
      if (lastMessage?.type === 'question') {
        const evaluation = await evaluateAnswer(
          lastMessage.content,
          input,
          selectedSubject.name
        )
        
        // Update progress based on the answer
        if (evaluation.isCorrect) {
          updateProgress({
            questionsAnswered: 1,
            successRate: 1,
          })
        }
        
        aiResponse = {
          content: evaluation.explanation,
          type: 'explanation',
          metadata: {
            hints: evaluation.hints,
          },
        }
      } else {
        // Generate a new response
        aiResponse = await generateResponse(
          input,
          selectedSubject.name,
          selectedDifficulty.name
        )
      }
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        type: aiResponse.type,
        metadata: aiResponse.metadata,
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error in conversation:', error)
      const errorMessage: Message = {
        role: 'assistant',
        content: error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.',
        timestamp: new Date(),
        type: 'error',
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg h-[500px] flex flex-col">
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-4">
            <p className="text-lg">Welcome to your AI Tutor! 👋</p>
            <p className="text-sm mt-2">
              Select a subject and difficulty level to get started.
              Ask any question or request a practice problem.
            </p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.type === 'error'
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              
              {message.metadata?.hints && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-xs font-medium">Hints:</p>
                  <ul className="list-disc list-inside text-xs mt-1">
                    {message.metadata.hints.map((hint, i) => (
                      <li key={i}>{hint}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t">
        <div className="flex space-x-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              !selectedSubject || !selectedDifficulty
                ? 'Please select a subject and difficulty level first'
                : 'Ask a question or type your answer...'
            }
            className="flex-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            disabled={isLoading || !selectedSubject || !selectedDifficulty}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim() || !selectedSubject || !selectedDifficulty}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  )
} 