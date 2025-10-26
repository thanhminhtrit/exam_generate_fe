import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ExamSpec, ExamMatrix } from '@/types';

const examSpecSchema = z.object({
  exam_matrix_id: z.string().min(1, 'Exam matrix is required'),
  version: z.coerce.number().min(1, 'Version must be at least 1'),
  notes: z.string().optional(),
});

type ExamSpecFormData = z.infer<typeof examSpecSchema>;

interface ExamSpecFormProps {
  spec?: ExamSpec;
  matrices: ExamMatrix[];
  onSubmit: (data: Omit<ExamSpec, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

export function ExamSpecForm({ spec, matrices, onSubmit, onCancel }: ExamSpecFormProps) {
  const form = useForm<ExamSpecFormData>({
    resolver: zodResolver(examSpecSchema),
    defaultValues: {
      exam_matrix_id: spec?.exam_matrix_id || '',
      version: spec?.version || 1,
      notes: spec?.notes || '',
    },
  });

  const handleSubmit = (data: ExamSpecFormData) => {
    onSubmit(data as Omit<ExamSpec, 'id' | 'created_at'>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="exam_matrix_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exam Matrix</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam matrix" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {matrices.map(matrix => (
                    <SelectItem key={matrix.id} value={matrix.id}>
                      {matrix.title}
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
          name="version"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Version</FormLabel>
              <FormControl>
                <Input type="number" min="1" placeholder="1" {...field} />
              </FormControl>
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
                <Textarea placeholder="Specification notes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            {spec ? 'Update' : 'Create'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
