import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AuthApi } from '@/services/auth'
import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth, getAccessToken } from '@/hooks/useAuth'
import { decodeJwt, extractRoleFromPayload, getRoleFromToken } from '@/utils/jwt'
import { api } from '@/services/api'

const ACCESS_KEY = 'access_token';

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [fullName, setFullName] = useState('')
  const [school, setSchool] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        // ===== REGISTER FLOW =====
        if (!email || !password || !fullName || !school) {
          throw new Error('Please fill all required fields.')
        }
        const res = await AuthApi.register({ email, password, fullName, school })
        if (res.data?.status !== 200) {
          throw new Error(res.data?.message || 'Register failed')
        }

        toast.success('Registered successfully. Please sign in.')
        setIsSignUp(false)          
        setPassword('')
        setFullName('')
        setSchool('')
        return
      }

      // ===== LOGIN FLOW =====
      await login.mutateAsync({ email, password })

      const token = getAccessToken()
      if (!token) throw new Error('Không tìm thấy token sau khi đăng nhập')

      const role = (getRoleFromToken(token) || '').toString().toUpperCase()
      if (role === 'ADMIN') navigate('/admin', { replace: true })
      else navigate('/dashboard', { replace: true })

      toast.success('Signed in successfully')
    } catch (err: any) {
      toast.error(err?.message || (isSignUp ? 'Register failed' : 'Login failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-primary-light via-background to-accent">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-medium">
              <BookOpen className="h-7 w-7 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-heading font-bold">EduBuilder</h1>
          </div>
        </div>

        <Card className="shadow-medium border-border">
          <CardHeader>
            <CardTitle className="text-2xl font-heading">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </CardTitle>
            <CardDescription>
              {isSignUp
                ? 'Sign up to start building exams'
                : 'Enter your credentials to continue'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="teacher@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name *</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="school">School *</Label>
                    <Input
                      id="school"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      required
                      className="h-11"
                    />
                  </div>
                </>
              )}

              {!isSignUp && (
                <div className="flex justify-end">
                  <Button variant="link" className="px-0 text-sm" type="button">
                    Forgot password?
                  </Button>
                </div>
              )}

              <Button type="submit" className="w-full h-11" disabled={loading}>
                {loading ? 'Please wait...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </Button>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Modern education platform for building and managing exams
        </p>
      </motion.div>
    </div>
  )
}
