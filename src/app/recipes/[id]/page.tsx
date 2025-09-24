import { getRecipeDetails } from '@/lib/actions';
import { RecipeDetail } from '@/components/recipe-detail';
import { ChefBot } from '@/components/chef-bot';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UtensilsCrossed, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

type RecipePageProps = {
  params: { id: string };
};

export default async function RecipePage({ params }: RecipePageProps) {
  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-8 text-center">
            <Alert variant="destructive">
                <UtensilsCrossed className="h-4 w-4" />
                <AlertTitle>Invalid Recipe ID</AlertTitle>
                <AlertDescription>The provided recipe ID is not valid.</AlertDescription>
            </Alert>
        </div>
    );
  }

  const { data: recipe, error } = await getRecipeDetails(id);

  if (error) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-8 text-center">
            <Alert variant="destructive">
                <UtensilsCrossed className="h-4 w-4" />
                <AlertTitle>Error loading recipe</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
    );
  }

  if (!recipe) {
    return (
        <div className="container mx-auto px-4 md:px-6 py-8 text-center">
            <Alert>
                <UtensilsCrossed className="h-4 w-4" />
                <AlertTitle>Recipe not found</AlertTitle>
                <AlertDescription>We couldn't find the recipe you're looking for.</AlertDescription>
            </Alert>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
       <Link href="/" className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
          Back to recipes
       </Link>
      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-2">
            <RecipeDetail recipe={recipe} />
        </div>
        <aside className="md:col-span-1">
            <ChefBot recipe={recipe} />
        </aside>
      </div>
    </div>
  );
}
