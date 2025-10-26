import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { Objective, Lesson } from '@/types';

const formSchema = z.object({
  lesson_id: z.string().min(1, 'Lesson is required'),
  name: z.string().trim().min(1, 'Name is required').max(200, 'Name too long'),
  description: z.string().trim().max(500, 'Description too long').optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ObjectiveFormProps {
  objective?: Objective;
  lessons: Lesson[];
  onSubmit: (data: Omit<Objective, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

export function ObjectiveForm({ objective, lessons, onSubmit, onCancel }: ObjectiveFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lesson_id: objective?.lesson_id || '',
      name: objective?.name || '',
      description: objective?.description || '',
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data as Omit<Objective, 'id' | 'created_at'>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="lesson_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lesson</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select lesson" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {lessons.map((lesson) => (
                    <SelectItem key={lesson.id} value={lesson.id}>
                      {lesson.name}
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Understand variables" {...field} />
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
                <Textarea placeholder="Objective description..." {...field} />
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
            {objective ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
