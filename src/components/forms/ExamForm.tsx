import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Exam, ExamSpec } from '@/types';

const examSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  exam_spec_id: z.string().min(1, 'Exam specification is required'),
  created_by: z.string().min(1, 'Creator is required'),
});

type ExamFormData = z.infer<typeof examSchema>;

interface ExamFormProps {
  exam?: Exam;
  specs: ExamSpec[];
  onSubmit: (data: Omit<Exam, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

export function ExamForm({ exam, specs, onSubmit, onCancel }: ExamFormProps) {
  const form = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: exam?.title || '',
      exam_spec_id: exam?.exam_spec_id || '',
      created_by: exam?.created_by || 'current_user',
    },
  });

  const handleSubmit = (data: ExamFormData) => {
    onSubmit(data as Omit<Exam, 'id' | 'created_at'>);
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
                <Input placeholder="Exam title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="exam_spec_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exam Specification</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select exam spec" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {specs.map(spec => (
                    <SelectItem key={spec.id} value={spec.id}>
                      Version {spec.version} - {spec.notes || 'No notes'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            {exam ? 'Update' : 'Create'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
