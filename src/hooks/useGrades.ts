import { useQuery } from '@tanstack/react-query'
import { GradesApi, type GradeRow } from '@/services/grades'

export function useGrades() {
  return useQuery<GradeRow[]>({
    queryKey: ['grades'],
    queryFn: () => GradesApi.list(),
  })
}
