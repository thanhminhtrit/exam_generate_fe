import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { Grade } from '@/types';

const formSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(50, 'Name too long'),
  level: z.coerce.number().min(1, 'Level must be at least 1').max(12, 'Level must be at most 12'),
});

type FormData = z.infer<typeof formSchema>;

interface GradeFormProps {
  grade?: Grade;
  onSubmit: (data: Omit<Grade, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

export function GradeForm({ grade, onSubmit, onCancel }: GradeFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: grade?.name || '',
      level: grade?.level || 1,
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data as Omit<Grade, 'id' | 'created_at'>);
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
                <Input placeholder="Grade 7" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level</FormLabel>
              <FormControl>
                <Input type="number" min={1} max={12} {...field} />
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
            {grade ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
