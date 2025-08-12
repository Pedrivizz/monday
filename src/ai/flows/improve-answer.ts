'use server';
/**
 * @fileOverview A flow to improve AI answers based on user feedback.
 *
 * - improveAnswer - A function that accepts the original prompt, AI response, and user feedback to generate an improved answer.
 * - ImproveAnswerInput - The input type for the improveAnswer function.
 * - ImproveAnswerOutput - The return type for the improveAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveAnswerInputSchema = z.object({
  prompt: z.string().describe('The original user prompt.'),
  aiResponse: z.string().describe('The AI model\'s initial response to the prompt.'),
  feedback: z.string().describe('User feedback on the AI response.'),
});
export type ImproveAnswerInput = z.infer<typeof ImproveAnswerInputSchema>;

const ImproveAnswerOutputSchema = z.object({
  improvedAnswer: z.string().describe('The improved AI response based on user feedback.'),
});
export type ImproveAnswerOutput = z.infer<typeof ImproveAnswerOutputSchema>;

export async function improveAnswer(input: ImproveAnswerInput): Promise<ImproveAnswerOutput> {
  return improveAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveAnswerPrompt',
  input: {schema: ImproveAnswerInputSchema},
  output: {schema: ImproveAnswerOutputSchema},
  prompt: `You are an AI assistant that refines its answers based on user feedback.

  Original Prompt: {{{prompt}}}
  AI Response: {{{aiResponse}}}
  User Feedback: {{{feedback}}}

  Based on the user feedback, provide an improved answer that addresses the user\'s concerns and provides a more accurate or helpful response.
  Improved Answer:`,
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
