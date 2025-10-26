import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { CreateTeacherPayload } from '@/services/teacherProfiles'

interface Props {
  onSubmit: (payload: CreateTeacherPayload) => Promise<void> | void
  onCancel: () => void
}

export default function TeacherCreateForm({ onSubmit, onCancel }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [userId, setUserId] = useState('')
  const [school, setSchool] = useState('')
  const [theme, setTheme] = useState('')
  const [language, setLanguage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password || !fullName || !userId || !school) {
      alert('Please fill all required fields.')
      return
    }

    const payload: CreateTeacherPayload = {
      email: email.trim(),
      password,
      fullName: fullName.trim(),
      userId: userId.trim(),
      school: school.trim(),
      preferences:
        theme || language
          ? { theme: theme || undefined, language: language || undefined }
          : undefined, // optional
    }

    await onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Email *</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Password *</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Full name *</Label>
        <Input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>School *</Label>
        <Input
          value={school}
          onChange={(e) => setSchool(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Preferences – Theme (optional)</Label>
          <Input
            placeholder="dark | light"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Preferences – Language (optional)</Label>
          <Input
            placeholder="vi | en"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create</Button>
      </div>
    </form>
  )
}
