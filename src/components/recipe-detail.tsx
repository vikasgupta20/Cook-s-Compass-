import Image from 'next/image';
import { Clock, Users, Circle } from 'lucide-react';
import type { RecipeDetails } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { FavoriteButton } from './favorite-button';

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
                className="w-full rounded-lg object-cover aspect-[16/10] shadow-lg"
                priority
                data-ai-hint="food photography"
            />
            <div className="absolute top-4 right-4 bg-background/50 backdrop-blur-sm rounded-full">
                <FavoriteButton recipe={recipe} />
            </div>
        </div>
        
        <h1 className="text-4xl font-bold font-headline mb-4">{recipe.title}</h1>
        
        <div
          className="text-muted-foreground prose prose-lg max-w-none mb-6 prose-p:font-body"
          dangerouslySetInnerHTML={{ __html: recipe.summary }}
        />

        <Card className="mb-8 bg-secondary/50">
            <CardContent className="p-6 flex items-center justify-around text-center">
                <div className="flex flex-col items-center gap-1">
                    <Clock className="h-6 w-6 text-primary" />
                    <span className="font-semibold">{recipe.readyInMinutes} min</span>
                    <span className="text-xs text-muted-foreground">Total Time</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <Users className="h-6 w-6 text-primary" />
                    <span className="font-semibold">{recipe.servings}</span>
                    <span className="text-xs text-muted-foreground">Servings</span>
                </div>
            </CardContent>
        </Card>

        <div className="grid md:grid-cols-5 gap-8">
            <div className="md:col-span-2">
                <h2 className="text-2xl font-headline font-semibold mb-4">Ingredients</h2>
                <ul className="space-y-2">
                    {ingredients.map((ingredient) => (
                        <li key={ingredient.id} className="flex items-start gap-3">
                            <Circle className="h-2 w-2 mt-[9px] text-primary/50 shrink-0 fill-current" />
                            <span>{ingredient.original}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="md:col-span-3">
                <h2 className="text-2xl font-headline font-semibold mb-4">Instructions</h2>
                {instructions.length > 0 ? (
                  <ol className="space-y-6">
                      {instructions.map((step) => (
                          <li key={step.number} className="flex items-start gap-4">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold font-headline mt-1">
                                  {step.number}
                              </div>
                              <p className="flex-1 pt-1">{step.step}</p>
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
