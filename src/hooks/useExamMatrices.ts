import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ExamMatricesApi, type ExamMatrix } from '@/services/examMatrices'
import { ExamsApi, type Exam, type GenerateExamPayload } from '@/services/exams'

export function useMyMatrices() {
  const qc = useQueryClient()

  const listQuery = useQuery<ExamMatrix[]>({
    queryKey: ['exam-matrices'],
    queryFn: () => ExamMatricesApi.list(),
  })

  const create = useMutation({
    mutationFn: ExamMatricesApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['exam-matrices'] })
    },
  })

  const generateExam = useMutation({
    mutationFn: (payload: GenerateExamPayload) => ExamsApi.generate(payload),
  })

  return {
    matrices: listQuery.data ?? [],
    isLoading: listQuery.isLoading,
    isError: listQuery.isError,
    create,
    generateExam,
  }
}
