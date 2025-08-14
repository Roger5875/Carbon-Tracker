'use server';

/**
 * @fileOverview This file contains the Genkit flow for providing personalized carbon reduction recommendations.
 *
 * - suggestReductions - A function that suggests carbon reduction strategies based on user data.
 * - SuggestReductionsInput - The input type for the suggestReductions function.
 * - SuggestReductionsOutput - The return type for the suggestReductions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestReductionsInputSchema = z.object({
  electricityUsage: z
    .number()
    .describe('Monthly electricity usage in kWh'),
  fuelConsumption: z
    .number()
    .describe('Monthly fuel consumption in liters'),
  wasteGeneration: z
    .number()
    .describe('Monthly waste generation in kg'),
  location: z
    .string()
    .describe('Geographic location of the user'),
  lifestyle: z
    .string()
    .describe('General lifestyle description of the user'),
});
export type SuggestReductionsInput = z.infer<typeof SuggestReductionsInputSchema>;

const SuggestReductionsOutputSchema = z.object({
  recommendations: z.array(z.string()).describe('A list of personalized carbon reduction recommendations.'),
});
export type SuggestReductionsOutput = z.infer<typeof SuggestReductionsOutputSchema>;

export async function suggestReductions(input: SuggestReductionsInput): Promise<SuggestReductionsOutput> {
  return suggestReductionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestReductionsPrompt',
  input: {schema: SuggestReductionsInputSchema},
  output: {schema: SuggestReductionsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized carbon reduction recommendations to users based on their provided data.  Consider the location and lifestyle of the user when providing suggestions.

Based on the following data, provide a list of actionable recommendations to reduce the user's carbon footprint:

Location: {{{location}}}
Lifestyle: {{{lifestyle}}}
Electricity Usage: {{{electricityUsage}}} kWh
Fuel Consumption: {{{fuelConsumption}}} liters
Waste Generation: {{{wasteGeneration}}} kg

Recommendations:`,
});

const suggestReductionsFlow = ai.defineFlow(
  {
    name: 'suggestReductionsFlow',
    inputSchema: SuggestReductionsInputSchema,
    outputSchema: SuggestReductionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
