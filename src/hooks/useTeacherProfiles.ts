import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  TeacherProfilesApi,
  type TeacherRow,
  type CreateTeacherPayload,
} from '@/services/teacherProfiles'

export function useTeacherProfiles() {
  return useQuery<TeacherRow[]>({
    queryKey: ['teachers', 'profiles'],
    queryFn: () => TeacherProfilesApi.list(),
  })
}

export function useCreateTeacher() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateTeacherPayload) =>
      TeacherProfilesApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['teachers', 'profiles'] })
    },
  })
}
