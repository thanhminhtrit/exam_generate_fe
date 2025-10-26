import { useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { FormModal } from '@/components/admin/FormModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { DetailDrawer } from '@/components/admin/DetailDrawer';
import { QuestionTypeForm } from '@/components/forms/QuestionTypeForm';
import { mockQuestionTypes } from '@/services/mockData';
import type { QuestionType } from '@/types';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const columns = [
  { 
    key: 'code', 
    label: 'Code', 
    sortable: true,
    render: (item: QuestionType) => (
      <Badge variant="outline" className="font-mono">{item.code}</Badge>
    )
  },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'description', label: 'Description', sortable: false },
];

export default function QuestionTypes() {
  const [types, setTypes] = useState<QuestionType[]>(mockQuestionTypes);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<QuestionType | undefined>();

  const handleCreate = () => {
    setSelectedType(undefined);
    setFormOpen(true);
  };

  const handleEdit = (type: QuestionType) => {
    setSelectedType(type);
    setFormOpen(true);
  };

  const handleDelete = (type: QuestionType) => {
    setSelectedType(type);
    setDeleteOpen(true);
  };

  const handleView = (type: QuestionType) => {
    setSelectedType(type);
    setDetailOpen(true);
  };

  const handleSubmit = (data: Omit<QuestionType, 'id' | 'created_at'>) => {
    if (selectedType) {
      setTypes(types.map(t => 
        t.id === selectedType.id 
          ? { ...t, ...data }
          : t
      ));
      toast.success('Question type updated successfully');
    } else {
      const newType: QuestionType = {
        ...data,
        id: String(Date.now()),
      };
      setTypes([...types, newType]);
      toast.success('Question type created successfully');
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (selectedType) {
      setTypes(types.filter(t => t.id !== selectedType.id));
      toast.success('Question type deleted successfully');
    }
    setDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Question Types</h1>
        <p className="text-muted-foreground mt-1">
          Manage question format types
        </p>
      </div>

      <DataTable
        data={types}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search question types..."
      />

      <FormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={selectedType ? 'Edit Question Type' : 'Create Question Type'}
        description={selectedType ? 'Update question type details' : 'Add a new question type to the system'}
      >
        <QuestionTypeForm
          questionType={selectedType}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </FormModal>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Question Type"
        description={`Are you sure you want to delete "${selectedType?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />

      <DetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title="Question Type Details"
      >
        {selectedType && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Code</h3>
              <p className="mt-1">{selectedType.code}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
              <p className="mt-1">{selectedType.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
              <p className="mt-1">{selectedType.description || '-'}</p>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
