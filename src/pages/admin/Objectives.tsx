import { useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { FormModal } from '@/components/admin/FormModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { DetailDrawer } from '@/components/admin/DetailDrawer';
import { ObjectiveForm } from '@/components/forms/ObjectiveForm';
import { mockObjectives, mockLessons } from '@/services/mockData';
import type { Objective } from '@/types';
import { toast } from 'sonner';

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { 
    key: 'lesson_id', 
    label: 'Lesson', 
    sortable: false,
    render: (item: Objective) => {
      const lesson = mockLessons.find(l => l.id === item.lesson_id);
      return lesson?.name || '-';
    }
  },
  { key: 'description', label: 'Description', sortable: false },
];

export default function Objectives() {
  const [objectives, setObjectives] = useState<Objective[]>(mockObjectives);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedObjective, setSelectedObjective] = useState<Objective | undefined>();

  const handleCreate = () => {
    setSelectedObjective(undefined);
    setFormOpen(true);
  };

  const handleEdit = (objective: Objective) => {
    setSelectedObjective(objective);
    setFormOpen(true);
  };

  const handleDelete = (objective: Objective) => {
    setSelectedObjective(objective);
    setDeleteOpen(true);
  };

  const handleView = (objective: Objective) => {
    setSelectedObjective(objective);
    setDetailOpen(true);
  };

  const handleSubmit = (data: Omit<Objective, 'id' | 'created_at'>) => {
    if (selectedObjective) {
      setObjectives(objectives.map(o => 
        o.id === selectedObjective.id 
          ? { ...o, ...data }
          : o
      ));
      toast.success('Objective updated successfully');
    } else {
      const newObjective: Objective = {
        ...data,
        id: String(Date.now()),
        created_at: new Date().toISOString(),
      };
      setObjectives([...objectives, newObjective]);
      toast.success('Objective created successfully');
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (selectedObjective) {
      setObjectives(objectives.filter(o => o.id !== selectedObjective.id));
      toast.success('Objective deleted successfully');
    }
    setDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Objectives</h1>
        <p className="text-muted-foreground mt-1">
          Manage learning objectives for each lesson
        </p>
      </div>

      <DataTable
        data={objectives}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search objectives..."
      />

      <FormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={selectedObjective ? 'Edit Objective' : 'Create Objective'}
        description={selectedObjective ? 'Update objective details' : 'Add a new learning objective'}
      >
        <ObjectiveForm
          objective={selectedObjective}
          lessons={mockLessons}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </FormModal>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Objective"
        description={`Are you sure you want to delete "${selectedObjective?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />

      <DetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title="Objective Details"
      >
        {selectedObjective && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="mt-1">{selectedObjective.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Lesson</h3>
              <p className="mt-1">{mockLessons.find(l => l.id === selectedObjective.lesson_id)?.name || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="mt-1">{selectedObjective.description || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
              <p className="mt-1">{new Date(selectedObjective.created_at).toLocaleString()}</p>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
