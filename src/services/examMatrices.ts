import { api } from './api'

// ===== Types =====
export interface Envelope<T> {
  message: string
  status: number
  data: T
}

export interface ExamMatrix {
  id: string
  teacher: string
  title: string
  subjectCode: string
  totalQuestions: number
  blueprint: Record<string, number>
  gradingRule: { correct: number; wrong: number }
  notes?: string | null
  generatedExams?: any[]
}

export interface CreateMatrixPayload {
  title: string
  subjectCode: string
  totalQuestions: number
  blueprint: Record<string, number>
  gradingRule: { correct: number; wrong: number }
  notes?: string | null
}

// ===== API =====
export const ExamMatricesApi = {
  list: async (): Promise<ExamMatrix[]> => {
    const res = await api.get<Envelope<ExamMatrix[]>>('/api/v1/exam-matrices')
    return res.data?.data ?? []
  },

  create: async (body: {
    title: string
    subjectCode: string
    totalQuestions: number
    blueprint: Record<string, number>
    gradingRule: { correct: number; wrong: number }
    notes?: string | null
  }): Promise<ExamMatrix> => {
    const res = await api.post<Envelope<ExamMatrix>>(
      '/api/v1/exam-matrices',
      body
    )
    return res.data.data
  },
}
