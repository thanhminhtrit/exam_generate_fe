import { useQuery } from '@tanstack/react-query'
import { LessonsApi, type Lesson } from '@/services/lessons'

export function useLessons() {
  return useQuery<Lesson[]>({
    queryKey: ['lessons'],
    queryFn: () => LessonsApi.list(),
  })
}
