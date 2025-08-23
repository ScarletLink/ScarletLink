
'use server';
/**
 * @fileOverview This file defines a Genkit flow for translating text.
 *
 * - translateText - A function that translates a list of strings to a target language.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateTextInputSchema = z.object({
  texts: z.array(z.string()).describe('An array of text strings to translate.'),
  targetLanguage: z
    .string()
    .describe(
      'The target language code (e.g., "es" for Spanish, "fr" for French).'
    ),
});

export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
  translations: z
    .array(z.string())
    .describe('An array of translated text strings.'),
});

export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;

export async function translateText(
  input: TranslateTextInput
): Promise<TranslateTextOutput> {
  return translateTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateTextPrompt',
  input: {schema: TranslateTextInputSchema},
  output: {schema: TranslateTextOutputSchema},
  prompt: `Translate the following array of text strings into the language specified by the target language code.
  Return the translated strings in the same order as the input array. Only return the translated text.

  Target Language: {{{targetLanguage}}}
  Texts to Translate:
  {{#each texts}}
  - "{{this}}"
  {{/each}}
`,
  config: {
    // Lower temperature for more deterministic, accurate translations
    temperature: 0.1,
  },
});

const translateTextFlow = ai.defineFlow(
  {
    name: 'translateTextFlow',
    inputSchema: TranslateTextInputSchema,
    outputSchema: TranslateTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

