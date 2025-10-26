import { api } from './api'

type Envelope<T> = { message: string; status: number; data: T }

export interface Subject {
  id: string
  code: string
  name: string
  description?: string
}
export interface Grade {
  id: string
  subject?: string
  name: string
  orderNo: number
}
export interface Lesson {
  id: string
  grade: string
  code: string
  name: string
  summary?: string
}
export interface Objective {
  id: string
  lesson: string
  code: string
  content: string
  active: boolean
}

export const OptionsApi = {
  subjects: async (): Promise<Subject[]> => {
    const r = await api.get<Envelope<Subject[]>>('/api/v1/subjects')
    return r.data.data ?? []
  },
  grades: async (params?: { subjectId?: string }) => {
    const r = await api.get<Envelope<Grade[]>>('/api/v1/grades', { params })
    return r.data.data ?? []
  },
  lessons: async (params?: { gradeId?: string }) => {
    const r = await api.get<Envelope<Lesson[]>>('/api/v1/lessons', { params })
    return r.data.data ?? []
  },
  objectives: async (params?: { lessonId?: string }) => {
    const r = await api.get<Envelope<Objective[]>>('/api/v1/objectives', {
      params,
    })
    return r.data.data ?? []
  },
}
