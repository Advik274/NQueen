'use server';

/**
 * @fileOverview Generates a random value for N within the range of 4 to 12 for the N-Queens problem.
 *
 * - generateRandomNValue - A function that generates a random N value.
 * - GenerateRandomNValueOutput - The return type for the generateRandomNValue function, which is just a number.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRandomNValueOutputSchema = z.number().min(4).max(12).describe('A random integer between 4 and 12 (inclusive).');
export type GenerateRandomNValueOutput = z.infer<typeof GenerateRandomNValueOutputSchema>;

export async function generateRandomNValue(): Promise<GenerateRandomNValueOutput> {
  return generateRandomNValueFlow();
}

const generateRandomNValueFlow = ai.defineFlow(
  {
    name: 'generateRandomNValueFlow',
    outputSchema: GenerateRandomNValueOutputSchema,
  },
  async () => {
    const randomN = Math.floor(Math.random() * (12 - 4 + 1)) + 4;
    return randomN;
  }
);
