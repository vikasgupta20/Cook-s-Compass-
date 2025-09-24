import Image from 'next/image';
import { Clock, Users, Circle } from 'lucide-react';
import type { RecipeDetails } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { FavoriteButton } from './favorite-button';
import { Separator } from '@/components/ui/separator';

type RecipeDetailProps = {
  recipe: RecipeDetails;
};

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  const instructions = recipe.analyzedInstructions[0]?.steps || [];
  const ingredients = recipe.extendedIngredients || [];

  return (
    <article>
        <div className="relative mb-6">
            <Image
                src={recipe.image}
                alt={recipe.title}
                width={800}
                height={500}
                className="w-full rounded-lg object-cover aspect-[16/10] shadow-2xl"
                priority
                data-ai-hint="food photography"
            />
            <div className="absolute top-4 right-4 bg-background/50 backdrop-blur-sm rounded-full">
                <FavoriteButton recipe={recipe} />
            </div>
        </div>
        
        <h1 className="text-4xl lg:text-5xl font-bold font-headline mb-4">{recipe.title}</h1>
        
        <div
          className="text-muted-foreground prose prose-lg max-w-none mb-6 prose-p:font-body"
          dangerouslySetInnerHTML={{ __html: recipe.summary }}
        />

        <Card className="mb-8 bg-secondary/50 shadow-sm">
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
                    {ingredients.map((ingredient) => (
                        <li key={ingredient.id} className="flex items-start gap-3 pb-3 border-b border-dashed">
                            <Circle className="h-2.5 w-2.5 mt-2 text-primary/50 shrink-0 fill-current" />
                            <span className="text-lg">{ingredient.original}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="md:col-span-3">
                <h2 className="text-3xl font-headline font-semibold mb-4">Instructions</h2>
                {instructions.length > 0 ? (
                  <ol className="space-y-8">
                      {instructions.map((step, index) => (
                          <li key={step.number} className="flex items-start gap-4">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold font-headline text-xl mt-1">
                                  {step.number}
                              </div>
                              <p className="flex-1 pt-2 text-lg">{step.step}</p>
                          </li>
                      ))}
                  </ol>
                ) : (
                  <p className="text-muted-foreground">No instructions available for this recipe.</p>
                )}
            </div>
        </div>
    </article>
  );
}
