import { api } from './api'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
  school: string

}

export interface ApiEnvelope<T> {
  message: string
  status: number
  data: T
}

export interface LoginEnvelope {
  message: string
  status: number
  data: string
}

export const AuthApi = {
  login: (body: LoginRequest) =>
    api.post<LoginEnvelope>('/api/v1/auth/login', body),


  register: (body: RegisterRequest) =>
    api.post<ApiEnvelope<null>>('/api/v1/auth/register', {
      ...body,
      role: 'TEACHER', 
    }),
}
