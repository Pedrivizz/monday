'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Wand2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

const promptSchema = z.object({
  prompt: z.string().min(10, { message: 'Por favor, introduce una consulta de al menos 10 caracteres.' }),
});

export type PromptFormValues = z.infer<typeof promptSchema>;

interface PromptFormProps {
  onSubmit: (data: PromptFormValues) => Promise<void>;
  isLoading: boolean;
}

export function PromptForm({ onSubmit, isLoading }: PromptFormProps) {
  const form = useForm<PromptFormValues>({
    resolver: zodResolver(promptSchema),
    defaultValues: {
      prompt: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ingresa tu duda</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="p. ej., ¿Cuál es la historia de los Juegos Olímpicos?"
                  className="resize-none"
                  rows={3}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generando...
                    </>
                ) : (
                    <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Generar Respuesta
                    </>
                )}
            </Button>
        </div>
      </form>
    </Form>
  );
}
