import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { QuestionType } from '@/types';

const questionTypeSchema = z.object({
  code: z.enum(['MCQ', 'TF', 'SHORT', 'ESSAY'], { required_error: 'Code is required' }),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  description: z.string().optional(),
});

type QuestionTypeFormData = z.infer<typeof questionTypeSchema>;

interface QuestionTypeFormProps {
  questionType?: QuestionType;
  onSubmit: (data: Omit<QuestionType, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

export function QuestionTypeForm({ questionType, onSubmit, onCancel }: QuestionTypeFormProps) {
  const form = useForm<QuestionTypeFormData>({
    resolver: zodResolver(questionTypeSchema),
    defaultValues: {
      code: questionType?.code || 'MCQ',
      name: questionType?.name || '',
      description: questionType?.description || '',
    },
  });

  const handleSubmit = (data: QuestionTypeFormData) => {
    onSubmit(data as Omit<QuestionType, 'id' | 'created_at'>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select code" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="MCQ">MCQ</SelectItem>
                  <SelectItem value="TF">TF</SelectItem>
                  <SelectItem value="SHORT">SHORT</SelectItem>
                  <SelectItem value="ESSAY">ESSAY</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Question type name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Question type description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            {questionType ? 'Update' : 'Create'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
