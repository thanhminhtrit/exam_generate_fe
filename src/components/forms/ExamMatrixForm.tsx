import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ExamMatrix, Subject, Grade } from '@/types';

const examMatrixSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  subject_id: z.string().min(1, 'Subject is required'),
  grade_id: z.string().min(1, 'Grade is required'),
  teacher_id: z.string().min(1, 'Teacher ID is required'),
  notes: z.string().optional(),
});

type ExamMatrixFormData = z.infer<typeof examMatrixSchema>;

interface ExamMatrixFormProps {
  matrix?: ExamMatrix;
  subjects: Subject[];
  grades: Grade[];
  onSubmit: (data: Omit<ExamMatrix, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

export function ExamMatrixForm({ matrix, subjects, grades, onSubmit, onCancel }: ExamMatrixFormProps) {
  const form = useForm<ExamMatrixFormData>({
    resolver: zodResolver(examMatrixSchema),
    defaultValues: {
      title: matrix?.title || '',
      subject_id: matrix?.subject_id || '',
      grade_id: matrix?.grade_id || '',
      teacher_id: matrix?.teacher_id || 'current_teacher',
      notes: matrix?.notes || '',
    },
  });

  const handleSubmit = (data: ExamMatrixFormData) => {
    onSubmit(data as Omit<ExamMatrix, 'id' | 'created_at'>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Exam matrix title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subject_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="grade_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Grade</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {grades.map(grade => (
                    <SelectItem key={grade.id} value={grade.id}>
                      {grade.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional notes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            {matrix ? 'Update' : 'Create'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
