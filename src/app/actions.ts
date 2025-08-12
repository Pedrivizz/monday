'use server';

import { generateAnswer } from '@/ai/flows/generate-answer';
import { improveAnswer, type ImproveAnswerInput } from '@/ai/flows/improve-answer';
import { z } from 'zod';

const generateAnswerSchema = z.object({
  prompt: z.string().min(10, { message: 'Por favor, introduce un prompt de al menos 10 caracteres.' }),
  category: z.string({ required_error: 'Por favor, selecciona una categoría.' }).min(1, { message: 'Por favor, selecciona una categoría.' }),
});

export interface GenerateState {
  data?: {
    prompt: string;
    category: string;
    answer: string;
  } | null;
  error?: string | null;
}

export async function handleGenerateAnswer(
  data: z.infer<typeof generateAnswerSchema>
): Promise<GenerateState> {
  const validatedFields = generateAnswerSchema.safeParse(data);

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return {
      error: errors.prompt?.[0] || errors.category?.[0] || 'Entrada inválida.',
    };
  }

  try {
    const fullPrompt = `Categoría: ${validatedFields.data.category}. Prompt: ${validatedFields.data.prompt}`;
    const result = await generateAnswer({ prompt: fullPrompt });
    return {
      data: {
        ...validatedFields.data,
        answer: result.answer,
      },
    };
  } catch (e) {
    console.error(e);
    return { error: 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.' };
  }
}

export interface ImproveState {
  data?: {
    improvedAnswer: string;
  } | null;
  error?: string | null;
}

export async function handleImproveAnswer(
  data: ImproveAnswerInput
): Promise<ImproveState> {
  try {
    const result = await improveAnswer(data);
    return {
      data: {
        improvedAnswer: result.improvedAnswer,
      },
    };
  } catch (e) {
    console.error(e);
    return { error: 'Ocurrió un error inesperado al mejorar la respuesta.' };
  }
}
