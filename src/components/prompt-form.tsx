'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Medal, Palette, Landmark, ScrollText, Utensils, Wand2 } from 'lucide-react';
import type { ComponentType } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const promptSchema = z.object({
  prompt: z.string().min(10, { message: 'Please enter a prompt with at least 10 characters.' }),
  category: z.string({ required_error: 'Please select a category.' }).min(1, { message: 'Please select a category.' }),
});

export type PromptFormValues = z.infer<typeof promptSchema>;

interface Category {
  value: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

const categories: Category[] = [
  { value: 'sports', label: 'Sports', icon: Medal },
  { value: 'culture', label: 'Culture', icon: Palette },
  { value: 'politics', label: 'Politics', icon: Landmark },
  { value: 'history', label: 'History', icon: ScrollText },
  { value: 'gastronomy', label: 'Gastronomy', icon: Utensils },
];

interface PromptFormProps {
  onSubmit: (data: PromptFormValues) => Promise<void>;
  isLoading: boolean;
}

export function PromptForm({ onSubmit, isLoading }: PromptFormProps) {
  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      prompt: '',
      category: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
             <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(({ value, label, icon: Icon }) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-muted-foreground" />
                            <span>{label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., What is the history of the Olympic Games?"
                      className="resize-none"
                      rows={1}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generate Answer
                    </>
                )}
            </Button>
        </div>
      </form>
    </Form>
  );
}
