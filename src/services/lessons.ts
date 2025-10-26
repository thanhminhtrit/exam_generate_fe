import { api } from './api'

export interface Lesson {
  id: string
  grade: string
  code: string
  name: string
  summary?: string 
  objectives?: any[]
}

interface Envelope<T> {
  message: string
  status: number
  data: T
}

export const LessonsApi = {
  list: async (): Promise<Lesson[]> => {
    const res = await api.get<Envelope<Lesson[]>>('/api/v1/lessons')
    return res.data?.data ?? []
  },
}
