import { useState } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import { FormModal } from '@/components/admin/FormModal'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { DetailDrawer } from '@/components/admin/DetailDrawer'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

import { useTeacherProfiles } from '@/hooks/useTeacherProfiles'
import type { TeacherRow } from '@/services/teacherProfiles'
import { useCreateTeacher } from '@/hooks/useTeacherProfiles'
import TeacherCreateForm from '@/components/forms/TeacherCreateForm'
import type { CreateTeacherPayload } from '@/services/teacherProfiles'

const columns = [
  {
    key: 'fullName',
    label: 'Teacher',
    sortable: true,
    render: (item: TeacherRow) => <span>{item.fullName || '-'}</span>,
  },
  { key: 'email', label: 'Email', sortable: true },
  {
    key: 'role',
    label: 'Role',
    sortable: true,
    render: (item: TeacherRow) => (
      <Badge
        variant={item.role?.toUpperCase() === 'ADMIN' ? 'default' : 'secondary'}
      >
        {item.role || '-'}
      </Badge>
    ),
  },
  {
    key: 'active',
    label: 'Active',
    sortable: true,
    render: (item: TeacherRow) => (
      <Badge variant={item.active ? ('success' as any) : 'destructive'}>
        {item.active ? 'Active' : 'Inactive'}
      </Badge>
    ),
  },
  { key: 'school', label: 'School', sortable: true },
  {
    key: 'matricesCount',
    label: 'Matrices',
    sortable: true,
    render: (item: TeacherRow) => <span>{item.matricesCount}</span>,
  },
]

export default function Teachers() {
  const { data, isLoading, isError } = useTeacherProfiles()
  const createMutation = useCreateTeacher()

  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selected, setSelected] = useState<TeacherRow | undefined>()

  const handleCreate = () => {
    setSelected(undefined)
    setFormOpen(true)
  }
  const handleSubmitCreate = async (payload: CreateTeacherPayload) => {
    try {
      await createMutation.mutateAsync(payload)
      toast.success('Teacher created successfully')
      setFormOpen(false)
    } catch (e: any) {
      toast.error(e?.message || 'Create teacher failed')
    }
  }
  const handleEdit = (row: TeacherRow) => {
    setSelected(row)
    setFormOpen(true)
  }
  const handleDelete = (row: TeacherRow) => {
    setSelected(row)
    setDeleteOpen(true)
  }
  const handleView = (row: TeacherRow) => {
    setSelected(row)
    setDetailOpen(true)
  }

  const handleSubmit = async () => {
    toast.info('Connect create/update API when ready.')
    setFormOpen(false)
  }
  const confirmDelete = async () => {
    toast.info('Connect delete API when ready.')
    setDeleteOpen(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Teachers</h1>
        <p className="text-muted-foreground mt-1">Manage teacher accounts</p>
      </div>

      <DataTable<TeacherRow>
        isLoading={isLoading}
        error={isError ? new Error('Failed to load teachers') : undefined}
        data={Array.isArray(data) ? data : []}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search teachers..."
      />

      <FormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={selected ? 'Edit Teacher' : 'Create Teacher'}
        description={
          selected
            ? 'Update teacher details'
            : 'Add a new teacher to the system'
        }
      >
        {selected ? (
          <div className="text-sm text-muted-foreground">
            Edit form not implemented yet.
          </div>
        ) : (
          <TeacherCreateForm
            onSubmit={handleSubmitCreate}
            onCancel={() => setFormOpen(false)}
          />
        )}
      </FormModal>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Teacher"
        description={
          selected
            ? `Are you sure you want to delete "${selected.fullName}"?`
            : ''
        }
        onConfirm={confirmDelete}
      />

      <DetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title="Teacher Details"
      >
        {selected && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Full name
              </h3>
              <p className="mt-1">{selected.fullName || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Email
              </h3>
              <p className="mt-1">{selected.email || '-'}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Role
                </h3>
                <p className="mt-1">{selected.role || '-'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">
                  Active
                </h3>
                <p className="mt-1">
                  {selected.active ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                School
              </h3>
              <p className="mt-1">{selected.school || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Matrices
              </h3>
              <p className="mt-1">{selected.matricesCount}</p>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  )
}
