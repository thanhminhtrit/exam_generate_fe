import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom'

import Login from './pages/Login'
import { DashboardLayout } from './components/layouts/DashboardLayout'
import DashboardHome from './pages/dashboard/DashboardHome'
import Exams from './pages/dashboard/Exams'
import QuestionBank from './pages/dashboard/QuestionBank'
import Matrix from './pages/dashboard/Matrix'
import Resources from './pages/dashboard/Resources'
import Settings from './pages/dashboard/Settings'
import NotFound from './pages/NotFound'

import { AdminLayout } from './components/layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import Subjects from './pages/admin/Subjects'
import Grades from './pages/admin/Grades'
import Lessons from './pages/admin/Lessons'
import Objectives from './pages/admin/Objectives'
import Questions from './pages/admin/Questions'
import Levels from './pages/admin/Levels'
import QuestionTypes from './pages/admin/QuestionTypes'
import ExamMatrices from './pages/admin/ExamMatrices'
import ExamSpecs from './pages/admin/ExamSpecs'
import AdminExams from './pages/admin/AdminExams'
import AdminResources from './pages/admin/Resources'
import Teachers from './pages/admin/Teachers'
import AppUsers from './pages/admin/AppUsers'
import AdminSettings from './pages/admin/AdminSettings'

const ACCESS_KEY = 'access_token'

function decodeJwt<T = any>(token: string): T | null {
  try {
    const base64 = token.split('.')[1]
    const normalized = base64.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(normalized)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(json) as T
  } catch {
    return null
  }
}
function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY)
}
function getRoleFromToken(token?: string | null) {
  if (!token) return undefined
  const payload = decodeJwt<any>(token)
  return payload?.role as string | undefined
}

// Must be logged in
function ProtectedRoute() {
  const token = getAccessToken()
  return token ? <Outlet /> : <Navigate to="/login" replace />
}

// Must be admin
function AdminRoute() {
  const token = getAccessToken()
  const norm = String(getRoleFromToken(token) || '').toLowerCase()
  const isAdmin =
    norm === 'admin' || norm === 'role_admin' || norm === 'administrator'
  return isAdmin ? <Outlet /> : <Navigate to="/dashboard" replace />
}

// React Query client with sane defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 0,
    },
  },
})

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />

          {/* Protected area: must be logged in */}
          <Route element={<ProtectedRoute />}>
            {/* Teacher/User dashboard */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="exams" element={<Exams />} />
              <Route path="questions" element={<QuestionBank />} />
              <Route path="matrix" element={<Matrix />} />
              <Route path="resources" element={<Resources />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Admin area: must be admin */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />

                {/* Academics */}
                <Route path="subjects" element={<Subjects />} />
                <Route path="grades" element={<Grades />} />
                <Route path="lessons" element={<Lessons />} />
                <Route path="objectives" element={<Objectives />} />

                {/* Question Bank */}
                <Route path="questions" element={<Questions />} />
                <Route path="levels" element={<Levels />} />
                <Route path="question-types" element={<QuestionTypes />} />

                {/* Exams */}
                <Route path="exam-matrices" element={<ExamMatrices />} />
                <Route path="exam-specs" element={<ExamSpecs />} />
                <Route path="exams" element={<AdminExams />} />

                {/* Resources & Users */}
                <Route path="resources" element={<AdminResources />} />
                <Route path="teachers" element={<Teachers />} />
                <Route path="app-users" element={<AppUsers />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  </BrowserRouter>
)

export default App
