'use server';

import type { RecipeDetails, RecipeSearchResult } from './types';

const API_KEY = process.env.SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

async function fetchSpoonacular<T>(path: string, params?: Record<string, string>): Promise<{ data: T | null; error: string | null }> {
  if (!API_KEY) {
    const errorMessage = "Spoonacular API key is missing. Please add SPOONACULAR_API_KEY to your .env.local file.";
    console.error(errorMessage);
    return { data: null, error: errorMessage };
  }

  try {
    const url = new URL(`${BASE_URL}${path}`);
    url.searchParams.append('apiKey', API_KEY);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), { next: { revalidate: 3600 } }); // Revalidate every hour

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: 'Could not parse error response.' };
      }
      const errorMessage = `Spoonacular API error: ${response.statusText} - ${errorData.message || 'Unknown error'}`;
      console.error(errorMessage);
      return { data: null, error: "There was an issue with the recipe provider. Please check your API key or try again later." };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error(`Failed to fetch from Spoonacular: ${errorMessage}`);
    return { data: null, error: `Failed to fetch from Spoonacular. Please check your network connection.` };
  }
}

export async function searchRecipes(ingredients: string): Promise<{ data: RecipeSearchResult[] | null; error: string | null }> {
  return fetchSpoonacular<RecipeSearchResult[]>('/recipes/findByIngredients', {
    ingredients,
    number: '12',
    ranking: '1',
  });
}

export async function getRecipeDetails(id: number): Promise<{ data: RecipeDetails | null; error: string | null }> {
  const path = `/recipes/${id}/information`;
  return fetchSpoonacular<RecipeDetails>(path, {
    includeNutrition: 'false',
  });
}
