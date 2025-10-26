import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ExamMatricesApi,
  type CreateMatrixPayload,
} from '@/services/examMatrices'
import { OptionsApi } from '@/services/options'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

type KV = { key: string; value: number }

export default function CreateMatrixDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreated?: (id: string) => void
}) {
  const [title, setTitle] = useState('')
  const [subjectCode, setSubjectCode] = useState('')
  const [totalQuestions, setTotalQuestions] = useState<number>(25)
  const [blueprint, setBlueprint] = useState<KV[]>([{ key: 'MCQ', value: 10 }])
  const [correct, setCorrect] = useState<number>(1)
  const [wrong, setWrong] = useState<number>(0)
  const [notes, setNotes] = useState('')

  const subjectsQ = useQuery({
    queryKey: ['subjects'],
    queryFn: OptionsApi.subjects,
  })
  const gradesQ = useQuery({
    queryKey: ['grades'],
    queryFn: () => OptionsApi.grades(),
    enabled: !!subjectCode,
  })
  const lessonsQ = useQuery({
    queryKey: ['lessons'],
    queryFn: () => OptionsApi.lessons(),
    enabled: gradesQ.isSuccess,
  })
  const objectivesQ = useQuery({
    queryKey: ['objectives'],
    queryFn: () => OptionsApi.objectives(),
    enabled: lessonsQ.isSuccess,
  })

  const subjectCodes = useMemo(
    () => (subjectsQ.data ?? []).map((s) => s.code),
    [subjectsQ.data]
  )

  const qc = useQueryClient()
  const createMx = useMutation({
    mutationFn: (payload: CreateMatrixPayload) =>
      ExamMatricesApi.create(payload),
    onSuccess: (data) => {
      toast.success('Matrix created')
      qc.invalidateQueries({ queryKey: ['exam-matrices'] })
      onCreated?.(data.id)
      onOpenChange(false)
      setTitle('')
      setSubjectCode('')
      setTotalQuestions(25)
      setBlueprint([{ key: 'MCQ', value: 10 }])
      setCorrect(1)
      setWrong(0)
      setNotes('')
    },
    onError: (e: any) => toast.error(e?.message || 'Create matrix failed'),
  })

  const addBp = () => setBlueprint((prev) => [...prev, { key: '', value: 0 }])
  const updateBp = (i: number, patch: Partial<KV>) =>
    setBlueprint((prev) =>
      prev.map((row, idx) => (idx === i ? { ...row, ...patch } : row))
    )
  const removeBp = (i: number) =>
    setBlueprint((prev) => prev.filter((_, idx) => idx !== i))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const bpObj = blueprint.reduce<Record<string, number>>((acc, r) => {
      if (r.key && !Number.isNaN(Number(r.value)))
        acc[r.key.trim()] = Number(r.value)
      return acc
    }, {})
    const payload: CreateMatrixPayload = {
      title: title.trim(),
      subjectCode,
      totalQuestions: Number(totalQuestions),
      blueprint: bpObj,
      gradingRule: { correct: Number(correct), wrong: Number(wrong) },
      notes: notes.trim() || undefined,
    }
    if (!payload.title || !payload.subjectCode || !payload.totalQuestions) {
      toast.error('Please fill title, subject and totalQuestions')
      return
    }
    createMx.mutate(payload)
  }

  useEffect(() => {
    if (!open) return
    if (!subjectCode && subjectsQ.data && subjectsQ.data.length === 1) {
      setSubjectCode(subjectsQ.data[0].code)
    }
  }, [open, subjectsQ.data])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Exam Matrix</DialogTitle>
          <DialogDescription>
            Nhập thông tin và tạo matrix mới
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Midterm G7 - Fractions"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Subject *</Label>
              <Select value={subjectCode} onValueChange={setSubjectCode}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      subjectsQ.isLoading ? 'Loading...' : 'Select subject'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {subjectCodes.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Total Questions *</Label>
              <Input
                type="number"
                min={1}
                value={totalQuestions}
                onChange={(e) => setTotalQuestions(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Blueprint</Label>
            {blueprint.map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-3">
                <div className="col-span-6">
                  <Input
                    placeholder="Type (e.g., MCQ, SHORT, NB)"
                    value={row.key}
                    onChange={(e) => updateBp(idx, { key: e.target.value })}
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    type="number"
                    placeholder="Amount"
                    min={0}
                    value={row.value}
                    onChange={(e) =>
                      updateBp(idx, { value: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeBp(idx)}
                    className="w-full"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button type="button" onClick={addBp} variant="secondary">
              + Add Blueprint Row
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Correct</Label>
              <Input
                type="number"
                value={correct}
                onChange={(e) => setCorrect(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Wrong</Label>
              <Input
                type="number"
                value={wrong}
                onChange={(e) => setWrong(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Time 45 minutes"
              />
            </div>
          </div>

          <div className="rounded-lg border p-3 space-y-3">
            <div className="text-sm text-muted-foreground">
              Structure Builder (optional)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Subject (read from above)" />
                </SelectTrigger>
                <SelectContent />
              </Select>
              <Select disabled={gradesQ.isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Grade (coming from API)" />
                </SelectTrigger>
                <SelectContent>
                  {(gradesQ.data ?? []).map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select disabled={lessonsQ.isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Lesson (API)" />
                </SelectTrigger>
                <SelectContent>
                  {(lessonsQ.data ?? []).map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select disabled={objectivesQ.isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Objective (API)" />
                </SelectTrigger>
                <SelectContent>
                  {(objectivesQ.data ?? []).map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-xs text-muted-foreground">
              Bạn có thể dùng phần này để gợi ý blueprint, nhưng backend của bạn
              hiện chưa yêu cầu gửi các id này trong request tạo matrix.
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMx.isPending}>
              {createMx.isPending ? 'Creating...' : 'Create Matrix'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
