import { useState } from 'react';
import { DataTable } from '@/components/admin/DataTable';
import { FormModal } from '@/components/admin/FormModal';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { DetailDrawer } from '@/components/admin/DetailDrawer';
import { QuestionForm } from '@/components/forms/QuestionForm';
import { 
  mockQuestions, 
  mockLevels, 
  mockQuestionTypes,
  mockLessons,
  mockObjectives 
} from '@/services/mockData';
import type { Question } from '@/types';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const columns = [
  { 
    key: 'text', 
    label: 'Question', 
    sortable: false,
    render: (item: Question) => (
      <div className="max-w-md truncate">{item.text}</div>
    )
  },
  { 
    key: 'level_id', 
    label: 'Level', 
    sortable: false,
    render: (item: Question) => {
      const level = mockLevels.find(l => l.id === item.level_id);
      return level ? <Badge variant="secondary">{level.code}</Badge> : '-';
    }
  },
  { 
    key: 'question_type_id', 
    label: 'Type', 
    sortable: false,
    render: (item: Question) => {
      const type = mockQuestionTypes.find(t => t.id === item.question_type_id);
      return type ? <Badge>{type.code}</Badge> : '-';
    }
  },
  { 
    key: 'created_at', 
    label: 'Created', 
    sortable: true,
    render: (item: Question) => new Date(item.created_at).toLocaleDateString()
  },
];

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | undefined>();

  const handleCreate = () => {
    setSelectedQuestion(undefined);
    setFormOpen(true);
  };

  const handleEdit = (question: Question) => {
    setSelectedQuestion(question);
    setFormOpen(true);
  };

  const handleDelete = (question: Question) => {
    setSelectedQuestion(question);
    setDeleteOpen(true);
  };

  const handleView = (question: Question) => {
    setSelectedQuestion(question);
    setDetailOpen(true);
  };

  const handleSubmit = (data: Omit<Question, 'id' | 'created_at' | 'created_by' | 'metadata'>) => {
    if (selectedQuestion) {
      setQuestions(questions.map(q => 
        q.id === selectedQuestion.id 
          ? { ...q, ...data }
          : q
      ));
      toast.success('Question updated successfully');
    } else {
      const newQuestion: Question = {
        ...data,
        id: String(Date.now()),
        created_at: new Date().toISOString(),
        created_by: 'current_user',
        metadata: {},
      };
      setQuestions([...questions, newQuestion]);
      toast.success('Question created successfully');
    }
    setFormOpen(false);
  };

  const confirmDelete = () => {
    if (selectedQuestion) {
      setQuestions(questions.filter(q => q.id !== selectedQuestion.id));
      toast.success('Question deleted successfully');
    }
    setDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Questions</h1>
        <p className="text-muted-foreground mt-1">
          Manage all questions in the question bank
        </p>
      </div>

      <DataTable
        data={questions}
        columns={columns}
        onCreate={handleCreate}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        searchPlaceholder="Search questions..."
      />

      <FormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        title={selectedQuestion ? 'Edit Question' : 'Create Question'}
        description={selectedQuestion ? 'Update question details' : 'Add a new question to the bank'}
      >
        <QuestionForm
          question={selectedQuestion}
          lessons={mockLessons}
          objectives={mockObjectives}
          levels={mockLevels}
          questionTypes={mockQuestionTypes}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
        />
      </FormModal>

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Question"
        description="Are you sure you want to delete this question? This action cannot be undone."
        onConfirm={confirmDelete}
      />

      <DetailDrawer
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title="Question Details"
      >
        {selectedQuestion && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Question Text</h3>
              <p className="mt-1">{selectedQuestion.text}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Lesson</h3>
              <p className="mt-1">{mockLessons.find(l => l.id === selectedQuestion.lesson_id)?.name || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Objective</h3>
              <p className="mt-1">{mockObjectives.find(o => o.id === selectedQuestion.objective_id)?.name || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Level</h3>
              <p className="mt-1">{mockLevels.find(l => l.id === selectedQuestion.level_id)?.name || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Type</h3>
              <p className="mt-1">{mockQuestionTypes.find(t => t.id === selectedQuestion.question_type_id)?.name || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Explanation</h3>
              <p className="mt-1">{selectedQuestion.explanation || '-'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
              <p className="mt-1">{new Date(selectedQuestion.created_at).toLocaleString()}</p>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
}
