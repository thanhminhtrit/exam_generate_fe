import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AppUser } from '@/types';

const appUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'teacher']),
});

type AppUserFormData = z.infer<typeof appUserSchema>;

interface AppUserFormProps {
  user?: AppUser;
  onSubmit: (data: Omit<AppUser, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

export function AppUserForm({ user, onSubmit, onCancel }: AppUserFormProps) {
  const form = useForm<AppUserFormData>({
    resolver: zodResolver(appUserSchema),
    defaultValues: {
      email: user?.email || '',
      role: user?.role || 'teacher',
    },
  });

  const handleSubmit = (data: AppUserFormData) => {
    onSubmit(data as Omit<AppUser, 'id' | 'created_at'>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="user@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="teacher">Teacher</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            {user ? 'Update' : 'Create'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
