import { api } from './api'
import type { Envelope } from './examMatrices'

interface TeacherProfile {
  id: string 
  user: {
    id: string
    email: string
    fullName: string
    role: string
    active: boolean
    teacher: string | null
  }
}

export const TeachersLiteApi = {
  findByUserId: async (userId: string): Promise<string | null> => {
    const res = await api.get<Envelope<TeacherProfile[]>>('/api/v1/teachers', {
      params: { userId },
    })
    const list = res.data?.data ?? []
    return list[0]?.id ?? null
  },
}
