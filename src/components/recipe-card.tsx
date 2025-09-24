import Link from 'next/link';
import Image from 'next/image';
import { Utensils, Heart, PlusCircle } from 'lucide-react';
import type { RecipeSearchResult } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from './favorite-button';

type RecipeCardProps = {
  recipe: RecipeSearchResult;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-2xl group border-2 border-transparent hover:border-primary">
      <Link href={`/recipes/${recipe.id}`} className="flex flex-col h-full bg-card">
        <CardHeader className="p-0 relative overflow-hidden">
          <Image
            src={recipe.image}
            alt={recipe.title}
            width={400}
            height={300}
            className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
            data-ai-hint="food photography"
          />
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-xl font-headline leading-tight mb-2 group-hover:text-primary transition-colors">
            {recipe.title}
          </CardTitle>
          <div className="text-sm text-muted-foreground flex items-center gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                  <Utensils className="h-4 w-4 text-primary"/>
                  <span>Uses {recipe.usedIngredientCount}</span>
              </div>
              <div className="flex items-center gap-1.5">
                  <PlusCircle className="h-4 w-4 text-amber-600"/>
                  <span>Missing {recipe.missedIngredientCount}</span>
              </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-2 flex justify-between items-center bg-card">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Heart className="h-4 w-4 text-destructive/80"/>
            <span>{recipe.likes} Likes</span>
          </div>
          <FavoriteButton recipe={recipe} />
        </CardFooter>
      </Link>
    </Card>
  );
}
