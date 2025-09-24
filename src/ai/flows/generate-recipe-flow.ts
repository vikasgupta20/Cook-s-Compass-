'use server';

/**
 * @fileOverview This file defines the recipe generation flow, which uses an AI model to create a new recipe from a list of ingredients.
 *
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The output type for the generateRecipe function.
 * - generateRecipe - A function that accepts a list of ingredients and returns a complete, newly generated recipe.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  ingredients: z.string().describe('A comma-separated list of ingredients the user has.'),
});

export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const GenerateRecipeOutputSchema = z.object({
  title: z.string().describe("The creative and appealing title of the generated recipe."),
  description: z.string().describe("A short, enticing description of the dish."),
  ingredients: z.array(z.string()).describe("A list of all ingredients required for the recipe, including amounts."),
  instructions: z.array(z.string()).describe("The step-by-step instructions for preparing the recipe."),
  servings: z.string().describe("The number of servings the recipe makes."),
  readyInMinutes: z.number().describe("The total time it takes to prepare and cook the recipe, in minutes."),
});

export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const generateRecipePrompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {schema: GenerateRecipeInputSchema},
  output: {schema: GenerateRecipeOutputSchema},
  prompt: `You are an expert chef who creates delicious and easy-to-follow recipes. A user has the following ingredients available: {{{ingredients}}}.

  Your task is to create a new, original recipe using primarily these ingredients. You can include a few common pantry staples like salt, pepper, oil, or water if necessary.

  The recipe should be creative but approachable for a home cook.

  Generate a complete recipe with a title, a short description, a formatted list of ingredients with quantities, and clear, step-by-step instructions. Also include the number of servings and the total preparation and cooking time.
`,
});

const generateRecipeFlow = ai.defineFlow(
  {
    name: 'generateRecipeFlow',
    inputSchema: GenerateRecipeInputSchema,
    outputSchema: GenerateRecipeOutputSchema,
  },
  async input => {
    const {output} = await generateRecipePrompt(input);
    return output!;
  }
);
