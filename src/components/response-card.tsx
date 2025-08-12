'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ThumbsUp, ThumbsDown, Send, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { handleImproveAnswer, type ImproveState } from '@/app/actions';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';

export interface ResponseData {
  prompt: string;
  category: string;
  answer: string;
}

interface ResponseCardProps {
  response: ResponseData;
}

type FeedbackState = 'idle' | 'giving_feedback' | 'submitting' | 'submitted_positive' | 'submitted_improvement';

const feedbackSchema = z.object({
  feedback: z.string().min(10, { message: 'Por favor, proporciona al menos 10 caracteres de feedback.' }),
});

export function ResponseCard({ response }: ResponseCardProps) {
  const { toast } = useToast();
  const [currentAnswer, setCurrentAnswer] = useState(response.answer);
  const [feedbackState, setFeedbackState] = useState<FeedbackState>('idle');
  
  const form = useForm<{ feedback: string }>({
    resolver: zodResolver(feedbackSchema),
  });

  const handleFeedbackSubmit = async (data: { feedback: string }) => {
    setFeedbackState('submitting');
    const result = await handleImproveAnswer({
      prompt: response.prompt,
      aiResponse: currentAnswer,
      feedback: data.feedback,
    });

    if (result.data) {
      setCurrentAnswer(result.data.improvedAnswer);
      setFeedbackState('submitted_improvement');
    } else if(result.error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: result.error,
      });
      setFeedbackState('giving_feedback');
    }
  };
  
  const renderFeedbackSection = () => {
    switch(feedbackState) {
        case 'submitted_positive':
            return <div className="text-sm text-green-600 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> ¡Gracias por tu feedback!</div>
        case 'submitted_improvement':
            return <div className="text-sm text-green-600 flex items-center gap-2"><Sparkles className="h-4 w-4" /> ¡Respuesta mejorada! Gracias por ayudarnos a mejorar.</div>
        case 'giving_feedback':
            return (
                <div className="w-full space-y-4">
                    <p className="text-sm text-muted-foreground">Lamentamos que la respuesta no haya sido útil. Por favor, dinos cómo podemos mejorarla.</p>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleFeedbackSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="feedback"
                                render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                    <Textarea placeholder="La respuesta debería haber incluido..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                            <Button type="submit" size="sm">
                                <Send className="mr-2 h-4 w-4" />
                                Enviar Feedback
                            </Button>
                        </form>
                    </Form>
                </div>
            )
        case 'submitting':
            return (
                 <div className="w-full space-y-4">
                    <p className="text-sm text-muted-foreground">Mejorando la respuesta según tu feedback...</p>
                    <Button disabled size="sm">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enviando...
                    </Button>
                </div>
            )
        case 'idle':
        default:
            return (
                 <>
                    <span className="text-sm text-muted-foreground mr-4">¿Fue útil esta respuesta?</span>
                    <Button variant="outline" size="sm" onClick={() => setFeedbackState('submitted_positive')}>
                        <ThumbsUp className="mr-2 h-4 w-4" /> Sí
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setFeedbackState('giving_feedback')}>
                        <ThumbsDown className="mr-2 h-4 w-4" /> No
                    </Button>
                </>
            )
    }
  }

  return (
    <Card className="shadow-lg animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex justify-between items-start">
            <span>{response.prompt}</span>
            <Badge variant="secondary" className="capitalize text-sm whitespace-nowrap ml-4">{response.category}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-body text-base leading-relaxed whitespace-pre-wrap">{currentAnswer}</p>
      </CardContent>
      <Separator className="my-4" />
      <CardFooter className="flex justify-end items-center space-x-2">
        {renderFeedbackSection()}
      </CardFooter>
    </Card>
  );
}
