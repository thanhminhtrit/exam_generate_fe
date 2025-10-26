import { api } from './api'

export interface Subject {
  id: string
  code: string
  name: string
  description?: string
}

interface Envelope<T> {
  message: string
  status: number
  data: T
}

export const SubjectsApi = {
  list: async (): Promise<Subject[]> => {
    const res = await api.get<Envelope<Subject[]>>('/api/v1/subjects')
    return res.data.data ?? []
  },
}
