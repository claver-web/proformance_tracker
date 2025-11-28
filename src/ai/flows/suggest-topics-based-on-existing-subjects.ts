'use server';
/**
 * @fileOverview AI agent to suggest relevant topics for a new subject based on existing subjects.
 *
 * - suggestTopicsBasedOnExistingSubjects - A function that suggests topics based on existing subjects.
 * - SuggestTopicsInput - The input type for the suggestTopicsBasedOnExistingSubjects function.
 * - SuggestTopicsOutput - The return type for the suggestTopicsBasedOnExistingSubjects function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTopicsInputSchema = z.object({
  existingSubjects: z
    .array(z.string())
    .describe('An array of existing subject titles.'),
  newSubjectDescription: z
    .string()
    .describe('The description of the new subject.'),
});
export type SuggestTopicsInput = z.infer<typeof SuggestTopicsInputSchema>;

const SuggestTopicsOutputSchema = z.object({
  suggestedTopics: z
    .array(z.string())
    .describe('An array of suggested topics for the new subject.'),
});
export type SuggestTopicsOutput = z.infer<typeof SuggestTopicsOutputSchema>;

export async function suggestTopicsBasedOnExistingSubjects(
  input: SuggestTopicsInput
): Promise<SuggestTopicsOutput> {
  return suggestTopicsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestTopicsPrompt',
  input: {schema: SuggestTopicsInputSchema},
  output: {schema: SuggestTopicsOutputSchema},
  prompt: `You are an expert educator. Your job is to suggest relevant topics for a new subject, given existing subjects and a description of the new subject.

Existing Subjects:
{{#each existingSubjects}}- {{this}}\n{{/each}}

New Subject Description: {{{newSubjectDescription}}}

Please suggest a list of relevant topics for the new subject, based on the existing subjects and the new subject's description. Focus on topics that would be helpful and interesting for students.

Output the topics as a numbered list.

Topics:
`,
});

const suggestTopicsFlow = ai.defineFlow(
  {
    name: 'suggestTopicsFlow',
    inputSchema: SuggestTopicsInputSchema,
    outputSchema: SuggestTopicsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

