import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Level } from '@/types';

const levelSchema = z.object({
  code: z.enum(['NB', 'TH', 'VD'], { required_error: 'Code is required' }),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  description: z.string().optional(),
});

type LevelFormData = z.infer<typeof levelSchema>;

interface LevelFormProps {
  level?: Level;
  onSubmit: (data: Omit<Level, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

export function LevelForm({ level, onSubmit, onCancel }: LevelFormProps) {
  const form = useForm<LevelFormData>({
    resolver: zodResolver(levelSchema),
    defaultValues: {
      code: level?.code || 'NB',
      name: level?.name || '',
      description: level?.description || '',
    },
  });

  const handleSubmit = (data: LevelFormData) => {
    onSubmit(data as Omit<Level, 'id' | 'created_at'>);
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
                  <SelectItem value="NB">NB</SelectItem>
                  <SelectItem value="TH">TH</SelectItem>
                  <SelectItem value="VD">VD</SelectItem>
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
                <Input placeholder="Level name" {...field} />
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
                <Textarea placeholder="Level description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            {level ? 'Update' : 'Create'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
