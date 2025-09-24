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
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl group bg-card">
      <Link href={`/recipes/${recipe.id}`} className="flex flex-col h-full">
        <CardHeader className="p-0 relative overflow-hidden">
          <Image
            src={recipe.image}
            alt={recipe.title}
            width={400}
            height={300}
            className="object-cover w-full h-48 transition-transform duration-500 group-hover:scale-110"
            data-ai-hint="food photography"
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        </CardHeader>
        <CardContent className="p-4 flex-grow flex flex-col">
          <CardTitle className="text-xl font-headline leading-tight mb-2 group-hover:text-primary transition-colors">
            {recipe.title}
          </CardTitle>
           <div className="flex-grow"></div>
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
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
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
