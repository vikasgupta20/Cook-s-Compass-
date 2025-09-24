'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { generateRecipe } from '@/ai/flows/generate-recipe-flow';
import type { GenerateRecipeOutput } from '@/ai/flows/generate-recipe-flow';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { UtensilsCrossed, ChefHat, Clock, Users, Circle, ChevronLeft } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import Link from 'next/link';

function GeneratedRecipeSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />

            <div className="grid md:grid-cols-3 gap-8 pt-4">
                <div className="md:col-span-1 space-y-4">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-40 w-full" />
                </div>
                <div className="md:col-span-2 space-y-4">
                    <Skeleton className="h-10 w-40" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        </div>
    )
}


export function GeneratedRecipeClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ingredients = searchParams.get('ingredients');
  const [recipe, setRecipe] = useState<GenerateRecipeOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!ingredients) {
      router.push('/');
      return;
    }

    const fetchGeneratedRecipe = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await generateRecipe({ ingredients });
        setRecipe(result);
      } catch (err) {
        console.error(err);
        setError('Sorry, we had trouble creating a recipe. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGeneratedRecipe();
  }, [ingredients, router]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-6 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" />
          Back to search
       </Link>
      
      {isLoading && <GeneratedRecipeSkeleton />}

      {error && (
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <UtensilsCrossed className="h-4 w-4" />
          <AlertTitle>Error Generating Recipe</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {recipe && (
        <article>
            <div className="flex items-center gap-3 mb-4">
                <ChefHat className="h-10 w-10 text-primary"/>
                <h1 className="text-4xl lg:text-5xl font-bold font-headline">{recipe.title}</h1>
            </div>
            
            <p className="text-lg text-muted-foreground mb-6 max-w-3xl">{recipe.description}</p>
            
            <Card className="mb-8 bg-card shadow-sm">
                <CardContent className="p-6 flex items-center justify-around text-center">
                    <div className="flex flex-col items-center gap-1">
                        <Clock className="h-7 w-7 text-primary" />
                        <span className="text-lg font-semibold">{recipe.readyInMinutes} min</span>
                        <span className="text-xs text-muted-foreground">Total Time</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <Users className="h-7 w-7 text-primary" />
                        <span className="text-lg font-semibold">{recipe.servings}</span>
                        <span className="text-xs text-muted-foreground">Servings</span>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-5 gap-8 lg:gap-12">
                <div className="md:col-span-2">
                    <h2 className="text-3xl font-headline font-semibold mb-4">Ingredients</h2>
                    <ul className="space-y-3">
                        {recipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="flex items-start gap-3 pb-3 border-b border-dashed">
                                <Circle className="h-2.5 w-2.5 mt-2 text-primary/50 shrink-0 fill-current" />
                                <span className="text-lg">{ingredient}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="md:col-span-3">
                    <h2 className="text-3xl font-headline font-semibold mb-4">Instructions</h2>
                    <ol className="space-y-8">
                        {recipe.instructions.map((step, index) => (
                            <li key={index} className="flex items-start gap-4">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold font-headline text-xl mt-1">
                                    {index + 1}
                                </div>
                                <p className="flex-1 pt-2 text-lg">{step}</p>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </article>
      )}

    </div>
  );
}
