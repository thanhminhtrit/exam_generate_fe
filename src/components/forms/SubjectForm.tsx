import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { Subject } from '@/types';

const formSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name too long'),
  description: z.string().trim().max(500, 'Description too long').optional(),
});

type FormData = z.infer<typeof formSchema>;

interface SubjectFormProps {
  subject?: Subject;
  onSubmit: (data: Omit<Subject, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

export function SubjectForm({ subject, onSubmit, onCancel }: SubjectFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: subject?.name || '',
      description: subject?.description || '',
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data as Omit<Subject, 'id' | 'created_at'>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Mathematics" {...field} />
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
                <Textarea placeholder="Subject description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {subject ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
