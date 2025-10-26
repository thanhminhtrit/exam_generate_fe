import { api } from './api'

export interface Grade {
  id: string
  subject?: string
  name: string
  orderNo: number
  lessons?: Array<any> 
}

interface Envelope<T> {
  message: string
  status: number
  data: T
}

export interface GradeRow {
  id: string
  orderNo: number
  name: string
  lessonsCount: number
}

export const GradesApi = {
  list: async (): Promise<GradeRow[]> => {
    const res = await api.get<Envelope<Grade[]>>('/api/v1/grades')
    const list = res.data?.data ?? []
    return list.map((g) => ({
      id: g.id,
      orderNo: Number(g.orderNo ?? 0),
      name: g.name ?? '',
      lessonsCount: Array.isArray(g.lessons) ? g.lessons.length : 0,
    }))
  },
}
