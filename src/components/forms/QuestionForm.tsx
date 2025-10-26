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
import type { Question, Lesson, Objective, Level, QuestionType } from '@/types';

const formSchema = z.object({
  lesson_id: z.string().min(1, 'Lesson is required'),
  objective_id: z.string().min(1, 'Objective is required'),
  level_id: z.string().min(1, 'Level is required'),
  question_type_id: z.string().min(1, 'Question type is required'),
  text: z.string().trim().min(1, 'Question text is required').max(1000, 'Question too long'),
  explanation: z.string().trim().max(1000, 'Explanation too long').optional(),
});

type FormData = z.infer<typeof formSchema>;

interface QuestionFormProps {
  question?: Question;
  lessons: Lesson[];
  objectives: Objective[];
  levels: Level[];
  questionTypes: QuestionType[];
  onSubmit: (data: Omit<Question, 'id' | 'created_at' | 'created_by' | 'metadata'>) => void;
  onCancel: () => void;
}

export function QuestionForm({ 
  question, 
  lessons, 
  objectives, 
  levels, 
  questionTypes, 
  onSubmit, 
  onCancel 
}: QuestionFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lesson_id: question?.lesson_id || '',
      objective_id: question?.objective_id || '',
      level_id: question?.level_id || '',
      question_type_id: question?.question_type_id || '',
      text: question?.text || '',
      explanation: question?.explanation || '',
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data as Omit<Question, 'id' | 'created_at' | 'created_by' | 'metadata'>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
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
            name="objective_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objective</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select objective" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {objectives.map((objective) => (
                      <SelectItem key={objective.id} value={objective.id}>
                        {objective.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="level_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Level</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level.id} value={level.id}>
                        {level.name}
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
            name="question_type_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {questionTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Text</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="What is a variable in algebra?" 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Explanation (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="A variable is a symbol used to represent an unknown value..." 
                  {...field} 
                />
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
            {question ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
