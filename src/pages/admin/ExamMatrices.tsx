import { useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { FormModal } from '@/components/admin/FormModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { DetailDrawer } from '@/components/admin/DetailDrawer';
import { ExamMatrixForm } from '@/components/forms/ExamMatrixForm';
import { mockExamMatrices, mockSubjects, mockGrades } from '@/services/mockData';
import type { ExamMatrix } from '@/types';
import { toast } from 'sonner';

const columns = [
  { key: 'title', label: 'Title', sortable: true },
  { 
    key: 'subject_id', 
    label: 'Subject', 
    sortable: false,
    render: (item: ExamMatrix) => {
      const subject = mockSubjects.find(s => s.id === item.subject_id);
      return subject?.name || '-';
    }
  },
  { 
    key: 'grade_id', 
    label: 'Grade', 
    sortable: false,
    render: (item: ExamMatrix) => {
      const grade = mockGrades.find(g => g.id === item.grade_id);
      return grade?.name || '-';
    }
  },
  { 
    key: 'created_at', 
    label: 'Created', 
    sortable: true,
    render: (item: ExamMatrix) => new Date(item.created_at).toLocaleDateString()
  },
];

export default function ExamMatrices() {
  const [matrices, setMatrices] = useState<ExamMatrix[]>(mockExamMatrices);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedMatrix, setSelectedMatrix] = useState<ExamMatrix | undefined>();

  const handleCreate = () => {
    setSelectedMatrix(undefined);
    setFormOpen(true);
  };

  const handleEdit = (matrix: ExamMatrix) => {
    setSelectedMatrix(matrix);
    setFormOpen(true);
  };

  const handleDelete = (matrix: ExamMatrix) => {
    setSelectedMatrix(matrix);
    setDeleteOpen(true);
  };

  const handleView = (matrix: ExamMatrix) => {
    setSelectedMatrix(matrix);
    setDetailOpen(true);
  };

  const handleSubmit = (data: Omit<ExamMatrix, 'id' | 'created_at'>) => {
    if (selectedMatrix) {
      setMatrices(matrices.map(m => 
        m.id === selectedMatrix.id 
          ? { ...m, ...data }
          : m
      ));
      toast.success('Exam matrix updated successfully');
    } else {
      const newMatrix: ExamMatrix = {
        ...data,
        id: String(Date.now()),
        created_at: new Date().toISOString(),
      };
      setMatrices([...matrices, newMatrix]);
      toast.success('Exam matrix created successfully');
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (selectedMatrix) {
      setMatrices(matrices.filter(m => m.id !== selectedMatrix.id));
      toast.success('Exam matrix deleted successfully');
    }
    setDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Exam Matrices</h1>
        <p className="text-muted-foreground mt-1">
          Manage exam blueprints and specifications
        </p>
      </div>

      <DataTable
        data={matrices}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search matrices..."
      />

      <FormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={selectedMatrix ? 'Edit Exam Matrix' : 'Create Exam Matrix'}
        description={selectedMatrix ? 'Update exam matrix details' : 'Add a new exam matrix to the system'}
      >
        <ExamMatrixForm
          matrix={selectedMatrix}
          subjects={mockSubjects}
          grades={mockGrades}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </FormModal>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Exam Matrix"
        description={`Are you sure you want to delete "${selectedMatrix?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />

      <DetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title="Exam Matrix Details"
      >
        {selectedMatrix && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
              <p className="mt-1">{selectedMatrix.title}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Subject</h3>
              <p className="mt-1">{mockSubjects.find(s => s.id === selectedMatrix.subject_id)?.name || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Grade</h3>
              <p className="mt-1">{mockGrades.find(g => g.id === selectedMatrix.grade_id)?.name || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
              <p className="mt-1">{selectedMatrix.notes || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
              <p className="mt-1">{new Date(selectedMatrix.created_at).toLocaleString()}</p>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
