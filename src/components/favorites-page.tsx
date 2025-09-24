'use client';

import { HeartCrack, LogIn } from 'lucide-react';
import { useFavorites } from '@/hooks/use-favorites';
import { useAuth } from '@/hooks/use-auth';
import { RecipeCard } from './recipe-card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Button } from './ui/button';

export function FavoritesPage() {
  const { favorites, isLoaded: favoritesLoaded } = useFavorites();
  const { user, loading: authLoading } = useAuth();

  const favoriteRecipesAsSearchResults = favorites.map(fav => ({
    ...fav,
    usedIngredientCount: 0,
    missedIngredientCount: 0,
    missedIngredients: [],
    usedIngredients: [],
    unusedIngredients: [],
    likes: 0,
    imageType: fav.image.split('.').pop() || 'jpg',
  }));
  
  const isLoaded = favoritesLoaded && !authLoading;

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-8 text-center">
          Your Favorite Recipes
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-[192px] w-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="text-center py-16 rounded-lg border-2 border-dashed">
            <LogIn className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Please Log In</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                You need to be logged in to see your favorite recipes.
            </p>
            <Button asChild className="mt-6">
              <Link href="/login">Log In</Link>
            </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <h1 className="text-4xl md:text-5xl font-bold font-headline mb-8 text-center">
        Your Favorite Recipes
      </h1>
      
      {isLoaded && favorites.length === 0 && (
        <div className="text-center py-16 rounded-lg border-2 border-dashed">
            <HeartCrack className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Favorites Yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                You haven't saved any recipes. Start exploring!
            </p>
            <Button asChild className="mt-6">
              <Link href="/">Find Recipes</Link>
            </Button>
        </div>
      )}
      
      {isLoaded && favorites.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favoriteRecipesAsSearchResults.map((recipe) => (
                  <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
          </div>
      )}
    </div>
  );
}
