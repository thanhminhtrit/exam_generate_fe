import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TeachersApi, TeacherQuery } from '@/services/teachers'
import type { Teacher, ID } from '@/types'

const key = (params?: TeacherQuery) => ['teachers', params] as const

export function useTeachers(params?: TeacherQuery) {
  const qc = useQueryClient()

  const listQuery = useQuery({
    queryKey: key(params),
    queryFn: () => TeachersApi.list(params),
  })

  const create = useMutation({
    mutationFn: (payload: Omit<Teacher, 'id' | 'user_id' | 'created_at'>) =>
      TeachersApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(params) }),
  })

  const update = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: ID
      payload: Partial<Omit<Teacher, 'id' | 'user_id' | 'created_at'>>
    }) => TeachersApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(params) }),
  })

  const remove = useMutation({
    mutationFn: (id: ID) => TeachersApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: key(params) }),
  })

  return { ...listQuery, create, update, remove }
}
