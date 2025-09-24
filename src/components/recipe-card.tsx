import Link from 'next/link';
import Image from 'next/image';
import { Utensils, Heart } from 'lucide-react';
import type { RecipeSearchResult } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FavoriteButton } from './favorite-button';

type RecipeCardProps = {
  recipe: RecipeSearchResult;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl group">
      <Link href={`/recipes/${recipe.id}`} className="flex flex-col h-full bg-card">
        <CardHeader className="p-0 relative">
          <Image
            src={recipe.image}
            alt={recipe.title}
            width={400}
            height={300}
            className="object-cover w-full h-48"
            data-ai-hint="food photography"
          />
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-headline leading-tight mb-2 group-hover:text-primary transition-colors">
            {recipe.title}
          </CardTitle>
          <div className="text-sm text-muted-foreground flex items-center gap-4">
              <div className="flex items-center gap-1">
                  <Utensils className="h-4 w-4 text-primary"/>
                  <span>Uses {recipe.usedIngredientCount}</span>
              </div>
              <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-destructive/80"/>
                  <span>{recipe.likes} Likes</span>
              </div>
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 flex justify-between items-center bg-card">
         <Badge variant={recipe.missedIngredientCount === 0 ? 'default' : 'secondary'}>
            {recipe.missedIngredientCount === 0 ? 'Ready to cook!' : `Missing ${recipe.missedIngredientCount}`}
          </Badge>
        <FavoriteButton recipe={recipe} />
      </CardFooter>
    </Card>
  );
}
