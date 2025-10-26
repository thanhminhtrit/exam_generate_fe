import { useState } from 'react'
import { motion } from 'framer-motion'
import { Grid3x3, Plus } from 'lucide-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useMyMatrices } from '@/hooks/useExamMatrices'
import { ExamMatricesApi } from '@/services/examMatrices'
import { OptionsApi } from '@/services/options' 

type AnyObj = Record<string, any>
function ObjKV({ obj, empty = '-' }: { obj?: AnyObj; empty?: string }) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj))
    return <span className="text-muted-foreground">{empty}</span>
  const entries = Object.entries(obj)
  if (entries.length === 0)
    return <span className="text-muted-foreground">{empty}</span>
  return (
    <div className="flex flex-wrap gap-2">
      {entries.map(([k, v]) => (
        <Badge key={k} variant="outline" className="font-mono">
          {k}: {String(v)}
        </Badge>
      ))}
    </div>
  )
}

export default function MatrixPage() {
  const qc = useQueryClient()
  const { matrices, isLoading, isError, generateExam } = useMyMatrices()
  const [openCreate, setOpenCreate] = useState(false)

  const handleGenerateExam = async (matrixId: string) => {
    try {
      const exam = await generateExam.mutateAsync({
        matrixId,
        title: 'Final Term - Math G6',
        header: { duration: 45, grade: 6 },
        questionLimit: 10,
      })
      toast.success(`Exam generated: ${exam.title}`)
    } catch (e: any) {
      toast.error(e?.message || 'Generate exam failed')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Exam Matrices</h1>
          <p className="text-muted-foreground">
            List & generate exams from matrices
          </p>
        </div>
        <Button className="gap-2" onClick={() => setOpenCreate(true)}>
          <Plus className="h-4 w-4" />
          New Matrix
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Loading...
          </CardContent>
        </Card>
      ) : isError ? (
        <Card>
          <CardContent className="py-12 text-center text-red-500">
            Failed to load matrices
          </CardContent>
        </Card>
      ) : !matrices || matrices.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="py-16 text-center">
            <Grid3x3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-heading font-semibold mb-2">
              No matrices yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Create your first exam matrix to get started
            </p>
            <Button onClick={() => setOpenCreate(true)}>Create Matrix</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {matrices.map((m, idx) => {
            const examsCount = Array.isArray((m as any).generatedExams)
              ? (m as any).generatedExams.length
              : 0
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="shadow-card">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="font-heading">
                          {m.title}
                        </CardTitle>
                        <CardDescription>{m.notes || '-'}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{m.subjectCode}</Badge>
                        <Badge>{m.totalQuestions} Qs</Badge>
                        <Badge>{examsCount} exams</Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-5">
                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Subject
                        </div>
                        <div className="font-medium">{m.subjectCode}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Total Questions
                        </div>
                        <div className="font-medium">{m.totalQuestions}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Notes
                        </div>
                        <div className="font-medium">{m.notes || '-'}</div>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Blueprint</h4>
                        <ObjKV
                          obj={(m as any).blueprint}
                          empty="No blueprint"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Grading Rule
                        </h4>
                        <ObjKV
                          obj={(m as any).gradingRule}
                          empty="No grading rule"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-1">
                      <Button variant="outline">View Details</Button>
                      <Button variant="outline">Edit</Button>
                      <Button
                        variant="outline"
                        onClick={() => handleGenerateExam(m.id)}
                      >
                        Generate Exam
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* ===== Create Matrix Dialog ===== */}
      <CreateMatrixDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onCreated={() => qc.invalidateQueries({ queryKey: ['exam-matrices'] })}
      />
    </motion.div>
  )
}

function CreateMatrixDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onCreated?: (id: string) => void
}) {
  // form fields
  const [title, setTitle] = useState('')
  const [subjectCode, setSubjectCode] = useState('')
  const [totalQuestions, setTotalQuestions] = useState<number>(25)
  const [blueprint, setBlueprint] = useState<{ key: string; value: number }[]>([
    { key: 'MCQ', value: 10 },
  ])
  const [correct, setCorrect] = useState<number>(1)
  const [wrong, setWrong] = useState<number>(0)
  const [notes, setNotes] = useState('')

  // subjects for select (code list)
  const subjectsQ = useQuery({
    queryKey: ['subjects'],
    queryFn: OptionsApi.subjects,
  })
  const subjectCodes = (subjectsQ.data ?? []).map((s) => s.code)

  const qc = useQueryClient()

  const addRow = () => setBlueprint((p) => [...p, { key: '', value: 0 }])
  const removeRow = (i: number) =>
    setBlueprint((p) => p.filter((_, idx) => idx !== i))
  const updateRow = (
    i: number,
    patch: Partial<{ key: string; value: number }>
  ) =>
    setBlueprint((p) =>
      p.map((row, idx) => (idx === i ? { ...row, ...patch } : row))
    )

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const bp = blueprint.reduce<Record<string, number>>((acc, r) => {
      if (r.key) acc[r.key.trim()] = Number(r.value || 0)
      return acc
    }, {})
    if (!title.trim() || !subjectCode || !totalQuestions) {
      toast.error('Please fill Title, Subject and Total Questions')
      return
    }
    try {
      const created = await ExamMatricesApi.create({
        title: title.trim(),
        subjectCode,
        totalQuestions: Number(totalQuestions),
        blueprint: bp,
        gradingRule: { correct: Number(correct), wrong: Number(wrong) },
        notes: notes.trim() || undefined,
      })
      toast.success('Matrix created')
      onCreated?.(created.id)
      qc.invalidateQueries({ queryKey: ['exam-matrices'] })
      onOpenChange(false)
      // reset
      setTitle('')
      setSubjectCode('')
      setTotalQuestions(25)
      setBlueprint([{ key: 'MCQ', value: 10 }])
      setCorrect(1)
      setWrong(0)
      setNotes('')
    } catch (err: any) {
      toast.error(err?.message || 'Create matrix failed')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Exam Matrix</DialogTitle>
          <DialogDescription>
            Nhập thông tin để tạo matrix mới
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-5">
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

          {/* Blueprint dynamic */}
          <div className="space-y-3">
            <Label>Blueprint</Label>
            {blueprint.map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-3">
                <div className="col-span-6">
                  <Input
                    placeholder="Type (e.g., MCQ, SHORT, NB)"
                    value={row.key}
                    onChange={(e) => updateRow(idx, { key: e.target.value })}
                  />
                </div>
                <div className="col-span-4">
                  <Input
                    type="number"
                    min={0}
                    placeholder="Amount"
                    value={row.value}
                    onChange={(e) =>
                      updateRow(idx, { value: Number(e.target.value) })
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => removeRow(idx)}
                    className="w-full"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button type="button" variant="secondary" onClick={addRow}>
              + Add Blueprint Row
            </Button>
          </div>

          {/* Grading Rule & Notes */}
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

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Matrix</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
