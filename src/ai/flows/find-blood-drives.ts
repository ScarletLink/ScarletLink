
'use client';
/**
 * @fileOverview This file defines a Genkit flow for finding blood drives using web search.
 *
 * - findBloodDrives - A function that searches the web for blood drives based on a query.
 * - FindBloodDrivesOutput - The return type for the findBloodDrives function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const BloodDriveSchema = z.object({
  name: z.string().describe('The official name of the blood drive or event.'),
  location: z.string().describe('The physical address or general location of the blood drive.'),
  date: z.string().describe('The date or date range of the event (e.g., "August 25, 2024", "Sep 1-3, 2024").'),
  url: z.string().url().describe('A direct URL to the blood drive information or registration page.'),
});
export type BloodDrive = z.infer<typeof BloodDriveSchema>;

const FindBloodDrivesOutputSchema = z.object({
  drives: z.array(BloodDriveSchema).describe('A list of blood drives found from the web search.'),
});

export type FindBloodDrivesOutput = z.infer<typeof FindBloodDrivesOutputSchema>;

export async function findBloodDrives(query: string): Promise<FindBloodDrivesOutput> {
  return findBloodDrivesFlow(query);
}

const findBloodDrivesPrompt = ai.definePrompt({
  name: 'findBloodDrivesPrompt',
  input: { schema: z.string() },
  output: { schema: FindBloodDrivesOutputSchema },
  tools: [googleAI.googleSearchTool],
  prompt: `You are a helpful assistant for a blood donation app. Your task is to find upcoming blood drives based on the user's query.

  Use the web search tool to find at least 5 relevant, upcoming blood drives.
  For each blood drive, provide its name, location, date, and a direct URL to the event page.
  Prioritize official sources like the Red Cross, local hospitals, or community blood centers.
  Do not invent or hallucinate any information. If you cannot find any blood drives, return an empty list.

  User Query: {{{input}}}`,
});

const findBloodDrivesFlow = ai.defineFlow(
  {
    name: 'findBloodDrivesFlow',
    inputSchema: z.string(),
    outputSchema: FindBloodDrivesOutputSchema,
  },
  async (query) => {
    const { output } = await findBloodDrivesPrompt(query);
    // If output is null or undefined, return an empty list to prevent errors.
    return output ?? { drives: [] };
  }
);
