'use server';

/**
 * @fileOverview Este archivo define un flujo de Genkit para generar respuestas de IA concisas a los prompts de los usuarios.
 *
 * - generateAnswer - La función para generar una respuesta concisa basada en el prompt del usuario.
 * - GenerateAnswerInput - El tipo de entrada para la función generateAnswer.
 * - GenerateAnswerOutput - El tipo de salida para la función generateAnswer.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAnswerInputSchema = z.object({
  prompt: z.string().describe('El prompt del usuario para el que se va a generar una respuesta.'),
});

export type GenerateAnswerInput = z.infer<typeof GenerateAnswerInputSchema>;

const GenerateAnswerOutputSchema = z.object({
  answer: z.string().describe('La respuesta concisa generada por la IA.'),
});

export type GenerateAnswerOutput = z.infer<typeof GenerateAnswerOutputSchema>;

export async function generateAnswer(input: GenerateAnswerInput): Promise<GenerateAnswerOutput> {
  return generateAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAnswerPrompt',
  input: {schema: GenerateAnswerInputSchema},
  output: {schema: GenerateAnswerOutputSchema},
  prompt: `Eres un asistente de IA que proporciona respuestas concisas e informativas en español a las consultas de los usuarios.

  Consulta del Usuario: {{{prompt}}}

  Respuesta:`,
});

const generateAnswerFlow = ai.defineFlow(
  {
    name: 'generateAnswerFlow',
    inputSchema: GenerateAnswerInputSchema,
    outputSchema: GenerateAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
