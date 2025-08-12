'use server';

import { generateAnswer } from '@/ai/flows/generate-answer';
import { improveAnswer, type ImproveAnswerInput } from '@/ai/flows/improve-answer';
import { z } from 'zod';

const generateAnswerSchema = z.object({
  prompt: z.string().min(10, { message: 'Please enter a prompt with at least 10 characters.' }),
  category: z.string({ required_error: 'Please select a category.' }).min(1, { message: 'Please select a category.' }),
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
      error: errors.prompt?.[0] || errors.category?.[0] || 'Invalid input.',
    };
  }

  try {
    const fullPrompt = `Category: ${validatedFields.data.category}. Prompt: ${validatedFields.data.prompt}`;
    const result = await generateAnswer({ prompt: fullPrompt });
    return {
      data: {
        ...validatedFields.data,
        answer: result.answer,
      },
    };
  } catch (e) {
    console.error(e);
    return { error: 'An unexpected error occurred. Please try again later.' };
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
    return { error: 'An unexpected error occurred while improving the answer.' };
  }
}
