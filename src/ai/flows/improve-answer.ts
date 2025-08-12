'use server';
/**
 * @fileOverview Un flujo para mejorar las respuestas de la IA basándose en el feedback de los usuarios.
 *
 * - improveAnswer - Una función que acepta el prompt original, la respuesta de la IA y el feedback del usuario para generar una respuesta mejorada.
 * - ImproveAnswerInput - El tipo de entrada para la función improveAnswer.
 * - ImproveAnswerOutput - El tipo de retorno para la función improveAnswer.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveAnswerInputSchema = z.object({
  prompt: z.string().describe('El prompt original del usuario.'),
  aiResponse: z.string().describe('La respuesta inicial del modelo de IA al prompt.'),
  feedback: z.string().describe('El feedback del usuario sobre la respuesta de la IA.'),
});
export type ImproveAnswerInput = z.infer<typeof ImproveAnswerInputSchema>;

const ImproveAnswerOutputSchema = z.object({
  improvedAnswer: z.string().describe('La respuesta mejorada de la IA basada en el feedback del usuario.'),
});
export type ImproveAnswerOutput = z.infer<typeof ImproveAnswerOutputSchema>;

export async function improveAnswer(input: ImproveAnswerInput): Promise<ImproveAnswerOutput> {
  return improveAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveAnswerPrompt',
  input: {schema: ImproveAnswerInputSchema},
  output: {schema: ImproveAnswerOutputSchema},
  prompt: `Eres un asistente de IA que refina sus respuestas en español basándose en el feedback de los usuarios.

  Consulta Original: {{{prompt}}}
  Respuesta de la IA: {{{aiResponse}}}
  Feedback del Usuario: {{{feedback}}}

  Basándote en el feedback del usuario, proporciona una respuesta mejorada en español que aborde las preocupaciones del usuario y ofrezca una respuesta más precisa o útil.
  Respuesta Mejorada:`,
});

const improveAnswerFlow = ai.defineFlow(
  {
    name: 'improveAnswerFlow',
    inputSchema: ImproveAnswerInputSchema,
    outputSchema: ImproveAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
