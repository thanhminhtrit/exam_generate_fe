import { useQuery } from '@tanstack/react-query'
import { ExamsApi, type Exam } from '@/services/exams'

export function useExams() {
  return useQuery<Exam[]>({
    queryKey: ['exams'],
    queryFn: () => ExamsApi.list(),
  })
}
