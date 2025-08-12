'use client';

import { useState } from 'react';
import type { ComponentType } from 'react';
import { handleGenerateAnswer, type GenerateState } from '@/app/actions';
import { PromptForm, type PromptFormValues } from '@/components/prompt-form';
import { ResponseCard, type ResponseData } from '@/components/response-card';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Bot, Lightbulb } from 'lucide-react';

const ResponseSkeleton = () => (
  <Card>
    <CardContent className="p-6">
      <div className="flex flex-col space-y-4">
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex justify-end space-x-2 pt-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </CardContent>
  </Card>
);

const InitialState = () => (
  <Card className="border-dashed">
    <CardContent className="p-8 text-center text-muted-foreground">
        <div className="flex justify-center items-center mb-4">
            <Bot size={48} className="text-primary/50" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2 font-headline">Listo para tu consulta</h3>
        <p>Selecciona una categoría, escribe tu pregunta y deja que nuestra IA te dé una respuesta concisa.</p>
    </CardContent>
  </Card>
)

export default function Home() {
  const { toast } = useToast();
  const [state, setState] = useState<GenerateState>({ data: null, error: null });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: PromptFormValues) => {
    setIsLoading(true);
    setState({ data: null, error: null });
    const result = await handleGenerateAnswer(data);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
    }
    setState(result);
    setIsLoading(false);
  };

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8 sm:py-12 md:py-16">
      <header className="text-center mb-10">
        <h1 className="text-5xl md:text-6xl font-bold font-headline text-primary">Lunes</h1>
        <p className="text-lg text-muted-foreground mt-2 font-body">
          Tu guía concisa para todo.
        </p>
      </header>

      <section className="mb-8">
        <PromptForm onSubmit={handleSubmit} isLoading={isLoading} />
      </section>

      <section className="transition-all duration-300">
        {isLoading ? (
          <ResponseSkeleton />
        ) : state.error ? (
          // Errors are handled by the toast, so no need for an explicit alert here
          <InitialState />
        ) : state.data ? (
          <ResponseCard response={state.data as ResponseData} />
        ) : (
          <InitialState />
        )}
      </section>

      <footer className="text-center mt-12 text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Lunes. Potenciado por IA.</p>
      </footer>
    </main>
  );
}
