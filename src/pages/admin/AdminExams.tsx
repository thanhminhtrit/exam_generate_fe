import { useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { FormModal } from '@/components/admin/FormModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { DetailDrawer } from '@/components/admin/DetailDrawer';
import { ExamForm } from '@/components/forms/ExamForm';
import { mockExams } from '@/services/mockData';
import type { Exam, ExamSpec } from '@/types';
import { toast } from 'sonner';

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
    notes: 'Updated version',
    created_at: '2024-02-15',
  },
];

const columns = [
  { key: 'title', label: 'Title', sortable: true },
  { key: 'exam_spec_id', label: 'Spec ID', sortable: false },
  {
    key: 'created_at',
    label: 'Created',
    sortable: true,
    render: (item: Exam) => new Date(item.created_at).toLocaleDateString()
  },
  { key: 'created_by', label: 'Created By', sortable: false },
];

export default function AdminExams() {
  const [exams, setExams] = useState<Exam[]>(mockExams);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | undefined>();

  const handleCreate = () => {
    setSelectedExam(undefined);
    setFormOpen(true);
  };

  const handleEdit = (exam: Exam) => {
    setSelectedExam(exam);
    setFormOpen(true);
  };

  const handleDelete = (exam: Exam) => {
    setSelectedExam(exam);
    setDeleteOpen(true);
  };

  const handleView = (exam: Exam) => {
    setSelectedExam(exam);
    setDetailOpen(true);
  };

  const handleSubmit = (data: Omit<Exam, 'id' | 'created_at'>) => {
    if (selectedExam) {
      setExams(exams.map(e =>
        e.id === selectedExam.id
          ? { ...e, ...data }
          : e
      ));
      toast.success('Exam updated successfully');
    } else {
      const newExam: Exam = {
        ...data,
        id: String(Date.now()),
        created_at: new Date().toISOString(),
      };
      setExams([...exams, newExam]);
      toast.success('Exam created successfully');
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (selectedExam) {
      setExams(exams.filter(e => e.id !== selectedExam.id));
      toast.success('Exam deleted successfully');
    }
    setDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Exams</h1>
        <p className="text-muted-foreground mt-1">
          Manage all generated exams
        </p>
      </div>

      <DataTable
        data={exams}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search exams..."
      />

      <FormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={selectedExam ? 'Edit Exam' : 'Create Exam'}
        description={selectedExam ? 'Update exam details' : 'Generate a new exam'}
      >
        <ExamForm
          exam={selectedExam}
          specs={mockExamSpecs}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </FormModal>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Exam"
        description={`Are you sure you want to delete "${selectedExam?.title}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
      />

      <DetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title="Exam Details"
      >
        {selectedExam && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Title</h3>
              <p className="mt-1">{selectedExam.title}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Exam Spec ID</h3>
              <p className="mt-1">{selectedExam.exam_spec_id}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Created By</h3>
              <p className="mt-1">{selectedExam.created_by}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
              <p className="mt-1">{new Date(selectedExam.created_at).toLocaleString()}</p>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
