import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { DataTable } from '@/components/admin/DataTable'
import { DetailDrawer } from '@/components/admin/DetailDrawer'
import { FormModal } from '@/components/admin/FormModal'
import { useState } from 'react'
import { useGrades } from '@/hooks/useGrades'
import type { GradeRow } from '@/services/grades'
import { toast } from 'sonner'

const columns = [
  { key: 'orderNo', label: 'Order No', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  {
    key: 'lessonsCount',
    label: 'Lessons',
    sortable: true,
    render: (item: GradeRow) => <span>{item.lessonsCount}</span>,
  },
]

export default function Grades() {
  const { data, isLoading, isError } = useGrades()

  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selected, setSelected] = useState<GradeRow | undefined>()

  const handleCreate = () => {
    setSelected(undefined)
    setFormOpen(true)
  }
  const handleEdit = (row: GradeRow) => {
    setSelected(row)
    setFormOpen(true)
  }
  const handleDelete = (row: GradeRow) => {
    setSelected(row)
    setDeleteOpen(true)
  }
  const handleView = (row: GradeRow) => {
    setSelected(row)
    setDetailOpen(true)
  }

  // TODO: nối CRUD khi BE sẵn sàng
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
        <h1 className="text-3xl font-bold">Grades</h1>
        <p className="text-muted-foreground mt-1">List of grades</p>
      </div>

      <DataTable<GradeRow>
        isLoading={isLoading}
        error={isError}
        data={data ?? []}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search grades..."
      />

      <FormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={selected ? 'Edit Grade' : 'Create Grade'}
        description={selected ? 'Update grade details' : 'Add a new grade'}
      >
        {/* <GradeForm grade={selected as any} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} /> */}
        <div className="text-sm text-muted-foreground">
          Placeholder form. Wire up your GradeForm to real API here.
        </div>
      </FormModal>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Grade"
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
        title="Grade Details"
      >
        {selected && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Order
              </h3>
              <p className="mt-1">{selected.id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Name
              </h3>
              <p className="mt-1">{selected.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Lessons
              </h3>
              <p className="mt-1">{selected.lessonsCount}</p>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  )
}
