import { useMutation } from '@tanstack/react-query'
import { AuthApi, type LoginRequest, type LoginEnvelope } from '@/services/auth'

const ACCESS_KEY = 'access_token'

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY)
}

export function useAuth() {
  const login = useMutation({
    mutationFn: (input: LoginRequest) => AuthApi.login(input),
    onSuccess: (res) => {
      const token = res.data?.data
      if (token?.startsWith('Bearer ')) {
        localStorage.setItem(ACCESS_KEY, token.slice(7).trim())
      } else if (token) {
        localStorage.setItem(ACCESS_KEY, token)
      } else {
        // không có token -> xoá phòng hờ
        localStorage.removeItem(ACCESS_KEY)
      }
    },
  })

  const logout = () => localStorage.removeItem(ACCESS_KEY)

  return { login, logout }
}
