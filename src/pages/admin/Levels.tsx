import { useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { FormModal } from '@/components/admin/FormModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { DetailDrawer } from '@/components/admin/DetailDrawer';
import { LevelForm } from '@/components/forms/LevelForm';
import { mockLevels } from '@/services/mockData';
import type { Level } from '@/types';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const columns = [
  { 
    key: 'code', 
    label: 'Code', 
    sortable: true,
    render: (item: Level) => (
      <Badge variant="outline" className="font-mono">{item.code}</Badge>
    )
  },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'description', label: 'Description', sortable: false },
];

export default function Levels() {
  const [levels, setLevels] = useState<Level[]>(mockLevels);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level | undefined>();

  const handleCreate = () => {
    setSelectedLevel(undefined);
    setFormOpen(true);
  };

  const handleEdit = (level: Level) => {
    setSelectedLevel(level);
    setFormOpen(true);
  };

  const handleDelete = (level: Level) => {
    setSelectedLevel(level);
    setDeleteOpen(true);
  };

  const handleView = (level: Level) => {
    setSelectedLevel(level);
    setDetailOpen(true);
  };

  const handleSubmit = (data: Omit<Level, 'id' | 'created_at'>) => {
    if (selectedLevel) {
      setLevels(levels.map(l => 
        l.id === selectedLevel.id 
          ? { ...l, ...data }
          : l
      ));
      toast.success('Level updated successfully');
    } else {
      const newLevel: Level = {
        ...data,
        id: String(Date.now()),
      };
      setLevels([...levels, newLevel]);
      toast.success('Level created successfully');
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (selectedLevel) {
      setLevels(levels.filter(l => l.id !== selectedLevel.id));
      toast.success('Level deleted successfully');
    }
    setDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Question Levels</h1>
        <p className="text-muted-foreground mt-1">
          Manage cognitive complexity levels (Bloom's Taxonomy)
        </p>
      </div>

      <DataTable
        data={levels}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search levels..."
      />

      <FormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={selectedLevel ? 'Edit Level' : 'Create Level'}
        description={selectedLevel ? 'Update level details' : 'Add a new level to the system'}
      >
        <LevelForm
          level={selectedLevel}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </FormModal>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Level"
        description={`Are you sure you want to delete "${selectedLevel?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />

      <DetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title="Level Details"
      >
        {selectedLevel && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Code</h3>
              <p className="mt-1">{selectedLevel.code}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="mt-1">{selectedLevel.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="mt-1">{selectedLevel.description || '-'}</p>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
