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
import type { Teacher } from '@/types';

const formSchema = z.object({
  first_name: z.string().trim().min(1, 'First name is required').max(50, 'Name too long'),
  last_name: z.string().trim().min(1, 'Last name is required').max(50, 'Name too long'),
  email: z.string().trim().email('Invalid email address').max(255, 'Email too long'),
});

type FormData = z.infer<typeof formSchema>;

interface TeacherFormProps {
  teacher?: Teacher;
  onSubmit: (data: Omit<Teacher, 'id' | 'user_id' | 'created_at'>) => void;
  onCancel: () => void;
}

export function TeacherForm({ teacher, onSubmit, onCancel }: TeacherFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: teacher?.first_name || '',
      last_name: teacher?.last_name || '',
      email: teacher?.email || '',
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data as Omit<Teacher, 'id' | 'user_id' | 'created_at'>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Sarah" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Johnson" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="sarah.johnson@school.edu" {...field} />
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
            {teacher ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
