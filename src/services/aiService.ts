'use client'

interface AIError {
  status?: number
  message?: string
  error?: string
}

interface HuggingFaceRequest {
  inputs: string
  parameters?: {
    max_length?: number
    temperature?: number
    top_p?: number
    do_sample?: boolean
  }
}

interface HuggingFaceResponse {
  generated_text: string
}

// You can get a free API token from https://huggingface.co/settings/tokens
const HF_API_TOKEN = process.env.NEXT_PUBLIC_HF_API_TOKEN

if (!HF_API_TOKEN) {
  console.error('Hugging Face API token is not set in environment variables')
}

// Using a smaller, free model from Hugging Face
const MODEL_URL = "https://api-inference.huggingface.co/models/google/flan-t5-large"

async function query(payload: HuggingFaceRequest): Promise<HuggingFaceResponse[]> {
  const response = await fetch(MODEL_URL, {
    headers: { 
      Authorization: `Bearer ${HF_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    method: "POST",
    body: JSON.stringify(payload),
  })
  const result = await response.json()
  if (response.status !== 200) {
    const error = result as AIError
    throw new Error(error.error || 'Failed to get response from model')
  }
  return result as HuggingFaceResponse[]
}

export interface AIResponse {
  content: string
  type: 'text' | 'question' | 'explanation'
  metadata?: {
    difficulty?: number
    topic?: string
    correctAnswer?: string
    hints?: string[]
  }
}

export async function generateResponse(
  prompt: string,
  subject: string,
  difficulty: string
): Promise<AIResponse> {
  try {
    if (!HF_API_TOKEN) {
      throw new Error('Hugging Face API token is not set. Please check your environment variables.')
    }

    const systemPrompt = `You are an expert tutor in ${subject} at the ${difficulty} level. 
                         Provide clear, engaging explanations and ask thought-provoking questions. 
                         Include examples and break down complex concepts into manageable parts.`
    
    const response = await query({
      inputs: `${systemPrompt}\n\nUser: ${prompt}\nAssistant:`,
    })

    const content = response[0]?.generated_text
    if (!content) {
      throw new Error('No response received from the model')
    }
    
    // Parse the response to determine its type and extract metadata
    const type = content.includes('?') ? 'question' : 'explanation'
    
    return {
      content,
      type,
      metadata: {
        difficulty: getDifficultyScore(difficulty),
        topic: subject,
      },
    }
  } catch (error: unknown) {
    console.error('Error generating AI response:', error)
    
    const apiError = error as AIError
    
    if (apiError.status === 401) {
      throw new Error('Authentication failed. Please check your Hugging Face API token.')
    }
    if (apiError.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.')
    }
    if (apiError.status === 400) {
      throw new Error(`Model error: ${apiError.message || 'Bad request'}`)
    }
    
    // Handle other errors
    if (error instanceof Error) {
      throw new Error(`Failed to generate response: ${error.message}`)
    }
    throw new Error('Failed to generate response')
  }
}

function getDifficultyScore(difficulty: string): number {
  switch (difficulty.toLowerCase()) {
    case 'beginner':
      return 1
    case 'intermediate':
      return 2
    case 'advanced':
      return 3
    default:
      return 1
  }
}

export async function evaluateAnswer(
  question: string,
  userAnswer: string,
  subject: string
): Promise<{
  isCorrect: boolean
  explanation: string
  hints?: string[]
}> {
  try {
    if (!HF_API_TOKEN) {
      throw new Error('Hugging Face API token is not set. Please check your environment variables.')
    }

    const systemPrompt = `You are an expert evaluator in ${subject}. 
                         Analyze the student's answer and provide detailed feedback.`
    
    const response = await query({
      inputs: `${systemPrompt}\n\nQuestion: ${question}\nStudent's Answer: ${userAnswer}\nEvaluation:`,
    })

    const content = response[0]?.generated_text
    if (!content) {
      throw new Error('No response received from the model')
    }
    
    // Simple heuristic to determine if the answer is correct
    const isCorrect = content.toLowerCase().includes('correct')
    
    return {
      isCorrect,
      explanation: content,
      hints: extractHints(content),
    }
  } catch (error: unknown) {
    console.error('Error evaluating answer:', error)
    
    const apiError = error as AIError
    
    if (apiError.status === 401) {
      throw new Error('Authentication failed. Please check your Hugging Face API token.')
    }
    if (apiError.status === 429) {
      throw new Error('Rate limit exceeded. Please try again later.')
    }
    if (apiError.status === 400) {
      throw new Error(`Model error: ${apiError.message || 'Bad request'}`)
    }
    
    // Handle other errors
    if (error instanceof Error) {
      throw new Error(`Failed to evaluate answer: ${error.message}`)
    }
    throw new Error('Failed to evaluate answer')
  }
}

function extractHints(content: string): string[] {
  // Extract hints from the AI response
  const hints = content
    .split('\n')
    .filter((line) => line.toLowerCase().includes('hint'))
    .map((hint) => hint.replace(/^hint:?\s*/i, '').trim())
  
  return hints.length > 0 ? hints : []
} 