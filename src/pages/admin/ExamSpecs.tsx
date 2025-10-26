import { useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { FormModal } from '@/components/admin/FormModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { DetailDrawer } from '@/components/admin/DetailDrawer';
import { ExamSpecForm } from '@/components/forms/ExamSpecForm';
import { mockExamMatrices } from '@/services/mockData';
import type { ExamSpec } from '@/types';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const mockExamSpecs: ExamSpec[] = [
  {
    id: 'spec1',
    exam_matrix_id: '1',
    version: 1,
    notes: 'Initial version',
    created_at: '2024-02-01',
  },
  {
    id: 'spec2',
    exam_matrix_id: '1',
    version: 2,
    notes: 'Updated with more questions',
    created_at: '2024-02-15',
  },
];

const columns = [
  {
    key: 'exam_matrix_id',
    label: 'Matrix ID',
    sortable: true
  },
  {
    key: 'version',
    label: 'Version',
    sortable: true,
    render: (item: ExamSpec) => (
      <Badge variant="secondary">v{item.version}</Badge>
    )
  },
  { key: 'notes', label: 'Notes', sortable: false },
  {
    key: 'created_at',
    label: 'Created',
    sortable: true,
    render: (item: ExamSpec) => new Date(item.created_at).toLocaleDateString()
  },
];

export default function ExamSpecs() {
  const [specs, setSpecs] = useState<ExamSpec[]>(mockExamSpecs);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState<ExamSpec | undefined>();

  const handleCreate = () => {
    setSelectedSpec(undefined);
    setFormOpen(true);
  };

  const handleEdit = (spec: ExamSpec) => {
    setSelectedSpec(spec);
    setFormOpen(true);
  };

  const handleDelete = (spec: ExamSpec) => {
    setSelectedSpec(spec);
    setDeleteOpen(true);
  };

  const handleView = (spec: ExamSpec) => {
    setSelectedSpec(spec);
    setDetailOpen(true);
  };

  const handleSubmit = (data: Omit<ExamSpec, 'id' | 'created_at'>) => {
    if (selectedSpec) {
      setSpecs(specs.map(s =>
        s.id === selectedSpec.id
          ? { ...s, ...data }
          : s
      ));
      toast.success('Exam spec updated successfully');
    } else {
      const newSpec: ExamSpec = {
        ...data,
        id: String(Date.now()),
        created_at: new Date().toISOString(),
      };
      setSpecs([...specs, newSpec]);
      toast.success('Exam spec created successfully');
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (selectedSpec) {
      setSpecs(specs.filter(s => s.id !== selectedSpec.id));
      toast.success('Exam spec deleted successfully');
    }
    setDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Exam Specifications</h1>
        <p className="text-muted-foreground mt-1">
          Manage exam spec versions and configurations
        </p>
      </div>

      <DataTable
        data={specs}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search exam specs..."
      />

      <FormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={selectedSpec ? 'Edit Exam Spec' : 'Create Exam Spec'}
        description={selectedSpec ? 'Update exam spec details' : 'Add a new exam spec version'}
      >
        <ExamSpecForm
          spec={selectedSpec}
          matrices={mockExamMatrices}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </FormModal>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Exam Spec"
        description={`Are you sure you want to delete spec version ${selectedSpec?.version}? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />

      <DetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title="Exam Spec Details"
      >
        {selectedSpec && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Matrix</h3>
              <p className="mt-1">{mockExamMatrices.find(m => m.id === selectedSpec.exam_matrix_id)?.title || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Version</h3>
              <p className="mt-1">v{selectedSpec.version}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
              <p className="mt-1">{selectedSpec.notes || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
              <p className="mt-1">{new Date(selectedSpec.created_at).toLocaleString()}</p>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
