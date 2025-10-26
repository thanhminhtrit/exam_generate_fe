import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { DataTable } from '@/components/admin/DataTable'
import { DetailDrawer } from '@/components/admin/DetailDrawer'
import { FormModal } from '@/components/admin/FormModal'
import { SubjectForm } from '@/components/forms/SubjectForm'
import { useSubjects } from '@/hooks/useSubjects'
import type { Subject } from '@/services/subjects'
import { useState } from 'react'
import { toast } from 'sonner'

const columns = [
  { key: 'code', label: 'Code', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'description', label: 'Description', sortable: false },
]

export default function Subjects() {
  const { data, isLoading, isError } = useSubjects()

  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selected, setSelected] = useState<Subject | undefined>()

  const handleCreate = () => {
    setSelected(undefined)
    setFormOpen(true)
  }
  const handleEdit = (row: Subject) => {
    setSelected(row)
    setFormOpen(true)
  }
  const handleDelete = (row: Subject) => {
    setSelected(row)
    setDeleteOpen(true)
  }
  const handleView = (row: Subject) => {
    setSelected(row)
    setDetailOpen(true)
  }

  const handleSubmit = async (_payload: Omit<Subject, 'id'>) => {
    toast.info('Hooked up for UI — connect create/update API when ready.')
    setFormOpen(false)
  }
  const confirmDelete = async () => {
    toast.info('Hooked up for UI — connect delete API when ready.')
    setDeleteOpen(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Subjects</h1>
        <p className="text-muted-foreground mt-1">
          Manage all subjects in the curriculum
        </p>
      </div>

      <DataTable
        isLoading={isLoading}
        data={data ?? []}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search subjects..."
      />

      <FormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={selected ? 'Edit Subject' : 'Create Subject'}
        description={
          selected
            ? 'Update subject details'
            : 'Add a new subject to the system'
        }
      >
        <SubjectForm
          subject={selected as any} 
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </FormModal>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Subject"
        description={
          selected
            ? `Are you sure you want to delete "${selected.name}"? This action cannot be undone.`
            : ''
        }
        onConfirm={confirmDelete}
      />

      <DetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title="Subject Details"
      >
        {selected && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Code
              </h3>
              <p className="mt-1">{selected.code}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Name
              </h3>
              <p className="mt-1">{selected.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Description
              </h3>
              <p className="mt-1">{selected.description || '-'}</p>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  )
}
