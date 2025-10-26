import { useQuery } from '@tanstack/react-query'
import { SubjectsApi, Subject } from '@/services/subjects'

export function useSubjects() {
  return useQuery<Subject[]>({
    queryKey: ['subjects'],
    queryFn: () => SubjectsApi.list(),
  })
}
