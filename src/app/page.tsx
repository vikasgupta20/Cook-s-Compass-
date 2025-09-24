import { searchRecipes } from '@/lib/actions';
import { IngredientSearchForm } from '@/components/ingredient-search-form';
import { RecipeList } from '@/components/recipe-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UtensilsCrossed } from 'lucide-react';
import Image from 'next/image';

type HomePageProps = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function Home({ searchParams }: HomePageProps) {
  const ingredients = typeof searchParams.ingredients === 'string' ? searchParams.ingredients : '';
  const { data: recipes, error } = ingredients ? await searchRecipes(ingredients) : { data: null, error: null };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <section className="relative text-center mb-12 bg-card rounded-xl p-8 md:p-16 overflow-hidden">
        <div className="absolute -bottom-12 -left-12 opacity-5 text-primary/50">
          <UtensilsCrossed size={200} className="transform -rotate-12" />
        </div>
        <div className="absolute -top-12 -right-12 opacity-5 text-primary/50">
          <UtensilsCrossed size={200} className="transform rotate-12" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 text-foreground">
          Your Culinary Adventure Starts Here
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Enter ingredients, snap a photo, or generate a new recipe with AI. What will you create today?
        </p>
      </section>

      <IngredientSearchForm initialIngredients={ingredients} />
      
      <div className="mt-12">
        {error && (
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <UtensilsCrossed className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {recipes && recipes.length > 0 && <RecipeList recipes={recipes} />}
        {recipes && recipes.length === 0 && ingredients && (
          <div className="text-center py-16">
             <UtensilsCrossed className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Recipes Found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We couldn't find any recipes with those ingredients. Try a different combination.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
