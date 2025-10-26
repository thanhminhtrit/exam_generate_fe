import { useState } from 'react'
import { DataTable } from '@/components/admin/DataTable'
import { FormModal } from '@/components/admin/FormModal'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { DetailDrawer } from '@/components/admin/DetailDrawer'
import { toast } from 'sonner'
import { useLessons } from '@/hooks/useLessons'
import type { Lesson } from '@/services/lessons'

const columns = [
  { key: 'code', label: 'Code', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'summary', label: 'Summary', sortable: false },
]

export default function Lessons() {
  const { data, isLoading, isError } = useLessons()

  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selected, setSelected] = useState<Lesson | undefined>()

  const handleCreate = () => {
    setSelected(undefined)
    setFormOpen(true)
  }
  const handleEdit = (row: Lesson) => {
    setSelected(row)
    setFormOpen(true)
  }
  const handleDelete = (row: Lesson) => {
    setSelected(row)
    setDeleteOpen(true)
  }
  const handleView = (row: Lesson) => {
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
        <h1 className="text-3xl font-bold">Lessons</h1>
        <p className="text-muted-foreground mt-1">List of lessons</p>
      </div>

      <DataTable<Lesson>
        isLoading={isLoading}
        error={isError}
        data={data ?? []}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search lessons..."
      />

      <FormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={selected ? 'Edit Lesson' : 'Create Lesson'}
        description={selected ? 'Update lesson details' : 'Add a new lesson'}
      >
        <div className="text-sm text-muted-foreground">
          Placeholder form. Wire your LessonForm here.
        </div>
      </FormModal>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Lesson"
        description={
          selected ? `Are you sure you want to delete "${selected.name}"?` : ''
        }
        onConfirm={confirmDelete}
      />

      <DetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title="Lesson Details"
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
                Summary
              </h3>
              <p className="mt-1">{selected.summary || '-'}</p>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  )
}
