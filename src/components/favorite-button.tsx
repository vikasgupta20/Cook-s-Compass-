'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from '@/hooks/use-favorites';
import type { RecipeSearchResult, RecipeDetails } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

type FavoriteButtonProps = {
  recipe: RecipeSearchResult | RecipeDetails;
};

export function FavoriteButton({ recipe }: FavoriteButtonProps) {
  const { addFavorite, removeFavorite, isFavorite, isLoaded } = useFavorites();
  const favorite = isFavorite(recipe.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) {
      removeFavorite(recipe.id);
    } else {
      addFavorite(recipe);
    }
  };

  if (!isLoaded) {
    return <Button variant="ghost" size="icon" className="h-8 w-8" disabled />;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={handleFavoriteClick} className="h-8 w-8">
            <Heart
              className={cn('h-5 w-5 transition-colors', favorite ? 'text-destructive fill-current' : 'text-muted-foreground')}
            />
            <span className="sr-only">{favorite ? 'Remove from favorites' : 'Add to favorites'}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{favorite ? 'Remove from favorites' : 'Add to favorites'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
