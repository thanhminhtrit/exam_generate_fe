import { api } from './api'
import type { Envelope } from './examMatrices'

export interface GenerateExamPayload {
  matrixId: string
  title: string
  header: { duration: number; grade: number }
  questionLimit: number
}

export interface Exam {
  id: string
  matrix: string
  title: string
  header: { duration: number; grade: number }
  exportedMeta: { questionCount: number }
  createdAt: string
  questions: any[]
}

export const ExamsApi = {
  list: async (): Promise<Exam[]> => {
    const res = await api.get<Envelope<Exam[]>>('/api/v1/exams')
    return res.data.data ?? []
  },
  generate: async (body: GenerateExamPayload): Promise<Exam> => {
    const res = await api.post<Envelope<Exam>>('/api/v1/exams/generate', body)
    return res.data.data
  },
}
