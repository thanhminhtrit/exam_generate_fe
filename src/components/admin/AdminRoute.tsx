// src/components/auth/AdminRoute.tsx
import { Navigate, Outlet } from 'react-router-dom'
import { getAccessToken } from '@/hooks/useAuth'
import { getRoleFromToken } from '@/utils/jwt'

export default function AdminRoute() {
  const token = getAccessToken()
  if (!token) return <Navigate to="/login" replace />

  const role = (getRoleFromToken(token) || '').toString().toUpperCase()
  const isAdmin = role === 'ADMIN'

  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />
}
