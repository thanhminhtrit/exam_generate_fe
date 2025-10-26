import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { AppSetting } from '@/types';

const appSettingSchema = z.object({
  key: z.string().min(1, 'Key is required'),
  value: z.string().min(1, 'Value is required'),
  description: z.string().optional(),
});

type AppSettingFormData = z.infer<typeof appSettingSchema>;

interface AppSettingFormProps {
  setting?: AppSetting;
  onSubmit: (data: Omit<AppSetting, 'id'>) => void;
  onCancel: () => void;
}

export function AppSettingForm({ setting, onSubmit, onCancel }: AppSettingFormProps) {
  const form = useForm<AppSettingFormData>({
    resolver: zodResolver(appSettingSchema),
    defaultValues: {
      key: setting?.key || '',
      value: setting?.value || '',
      description: setting?.description || '',
    },
  });

  const handleSubmit = (data: AppSettingFormData) => {
    onSubmit(data as Omit<AppSetting, 'id'>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key</FormLabel>
              <FormControl>
                <Input placeholder="setting_key" {...field} disabled={!!setting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input placeholder="Setting value" {...field} />
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
                <Textarea placeholder="Setting description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3 pt-4">
          <Button type="submit" className="flex-1">
            {setting ? 'Update' : 'Create'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
