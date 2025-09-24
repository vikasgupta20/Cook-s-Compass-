'use server';

/**
 * @fileOverview This file defines the ChefBot assistance flow, which allows users to ask questions about recipes and get helpful answers from an AI assistant.
 *
 * - ChefBotInput - The input type for the chefBot function.
 * - ChefBotOutput - The output type for the chefBot function.
 * - chefBot - A function that accepts a query and recipe details and returns an answer from the AI assistant.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChefBotInputSchema = z.object({
  recipeName: z.string().describe('The name of the recipe.'),
  recipeIngredients: z.string().describe('The ingredients of the recipe.'),
  recipeInstructions: z.string().describe('The instructions for the recipe.'),
  query: z.string().describe('The user query about the recipe.'),
});

export type ChefBotInput = z.infer<typeof ChefBotInputSchema>;

const ChefBotOutputSchema = z.object({
  answer: z.string().describe('The answer from the AI assistant.'),
});

export type ChefBotOutput = z.infer<typeof ChefBotOutputSchema>;

export async function chefBot(input: ChefBotInput): Promise<ChefBotOutput> {
  return chefBotFlow(input);
}

const chefBotPrompt = ai.definePrompt({
  name: 'chefBotPrompt',
  input: {schema: ChefBotInputSchema},
  output: {schema: ChefBotOutputSchema},
  prompt: `You are a helpful AI assistant named ChefBot, specializing in answering questions about recipes.

  You are given the following recipe details:

  Recipe Name: {{{recipeName}}}
  Ingredients: {{{recipeIngredients}}}
  Instructions: {{{recipeInstructions}}}

  Answer the following question about the recipe:
  {{query}}

  Be concise and helpful.
`,
});

const chefBotFlow = ai.defineFlow(
  {
    name: 'chefBotFlow',
    inputSchema: ChefBotInputSchema,
    outputSchema: ChefBotOutputSchema,
  },
  async input => {
    const {output} = await chefBotPrompt(input);
    return output!;
  }
);
