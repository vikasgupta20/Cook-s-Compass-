import { searchRecipes } from '@/lib/actions';
import { IngredientSearchForm } from '@/components/ingredient-search-form';
import { RecipeList } from '@/components/recipe-list';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UtensilsCrossed } from 'lucide-react';

type HomePageProps = {
  searchParams: {
    ingredients?: string;
  };
};

export default async function Home({ searchParams }: HomePageProps) {
  const ingredients = searchParams.ingredients || '';
  const { data: recipes, error } = ingredients ? await searchRecipes(ingredients) : { data: null, error: null };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4 text-foreground">
          What's in your pantry?
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Enter the ingredients you have, and we'll find delicious recipes for
          you. Or, snap a photo and let our AI do the work!
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
