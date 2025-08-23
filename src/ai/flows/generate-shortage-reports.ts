'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating blood shortage reports.
 *
 * - generateShortageReports - A function that generates blood shortage reports.
 * - GenerateShortageReportsInput - The input type for the generateShortageReports function.
 * - GenerateShortageReportsOutput - The return type for the generateShortageReports function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateShortageReportsInputSchema = z.object({
  reportType: z
    .enum(['weekly', 'monthly'])
    .describe('The type of report to generate (weekly or monthly).'),
  historicalData: z
    .string()
    .describe(
      'Historical data of blood donations and usage, in JSON format.'
    ),
  currentTrends: z
    .string()
    .describe('Current trends in blood demand and supply, in JSON format.'),
});

export type GenerateShortageReportsInput = z.infer<
  typeof GenerateShortageReportsInputSchema
>;

const GenerateShortageReportsOutputSchema = z.object({
  report: z
    .string()
    .describe(
      'A comprehensive report predicting blood shortages, in Markdown format, including data analysis and recommendations.'
    ),
  dataCharts: z
    .object({
      title: z.string().describe('The title of the chart.'),
      data: z
        .array(
          z.object({
            name: z.string().describe('The label for the data point (e.g., blood type or month).'),
            predictedShortage: z.number().describe('The predicted number of units in shortage.'),
            expectedDonations: z.number().describe('The expected number of units to be donated.'),
          })
        )
        .describe('The data points for the chart.'),
      dataKeys: z
        .object({
          predictedShortage: z.string().describe('The display name for the predicted shortage data series.'),
          expectedDonations: z.string().describe('The display name for the expected donations data series.'),
        })
        .describe('The display names for the data keys.'),
    })
    .describe('A JSON object representing data for a chart visualization.'),
  alertSummary: z.string().describe('A summary of critical shortage alerts.'),
});


export type GenerateShortageReportsOutput = z.infer<
  typeof GenerateShortageReportsOutputSchema
>;

export async function generateShortageReports(
  input: GenerateShortageReportsInput
): Promise<GenerateShortageReportsOutput> {
  return generateShortageReportsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateShortageReportsPrompt',
  input: {schema: GenerateShortageReportsInputSchema},
  output: {schema: GenerateShortageReportsOutputSchema},
  prompt: `You are a system administrator who needs to generate blood shortage reports.

  Based on the historical data and current trends provided, generate a comprehensive report predicting potential blood shortages.
  Include data analysis, visualized data charts, and a summary of critical shortage alerts.

  Report Type: {{{reportType}}}
  Historical Data: {{{historicalData}}}
  Current Trends: {{{currentTrends}}}

  Ensure the report is accurate, informative, and actionable for proactive blood supply management.
  The dataCharts should be a JSON object that can be used to generate interactive charts.
  The alertSummary should highlight the most critical shortages expected.
  The report should be in markdown format.
`,
});

const generateShortageReportsFlow = ai.defineFlow(
  {
    name: 'generateShortageReportsFlow',
    inputSchema: GenerateShortageReportsInputSchema,
    outputSchema: GenerateShortageReportsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
