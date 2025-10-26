import { api } from './api'

export interface TeacherProfileEnvelope<T> {
  message: string
  status: number
  data: T
}

export interface TeacherProfile {
  id: string
  user: {
    id: string
    email: string
    fullName: string
    role: string // "TEACHER" | "ADMIN"...
    active: boolean
    teacher: string
  }
  school?: string | null
  preferences?: any
  matrices: any[]
}

export interface TeacherRow {
  id: string
  email: string
  fullName: string
  role: string
  active: boolean
  school?: string | null
  matricesCount: number
}

export interface CreateTeacherPayload {
  email: string
  password: string
  fullName: string
  userId: string
  school: string
  preferences?: {
    theme?: string
    language?: string
  } | null
}

function mapToRow(t: TeacherProfile): TeacherRow {
  return {
    id: t.id,
    email: t.user?.email ?? '',
    fullName: t.user?.fullName ?? '',
    role: t.user?.role ?? '',
    active: !!t.user?.active,
    school: t.school ?? '',
    matricesCount: Array.isArray(t.matrices) ? t.matrices.length : 0,
  }
}

export const TeacherProfilesApi = {
  list: async (): Promise<TeacherRow[]> => {
    const res = await api.get<TeacherProfileEnvelope<TeacherProfile[]>>(
      '/api/v1/teachers'
    )
    return (res.data?.data ?? []).map(mapToRow)
  },

  create: async (body: CreateTeacherPayload): Promise<TeacherRow> => {
    const res = await api.post<TeacherProfileEnvelope<TeacherProfile>>(
      '/api/v1/teachers',
      body
    )
    return mapToRow(res.data.data)
  },
}
