'use client';

import { useState, useEffect, useCallback } from 'react';
import type { RecipeSearchResult, RecipeDetails } from '@/lib/types';
import { useToast } from './use-toast';

type FavoriteRecipe = Pick<RecipeSearchResult, 'id' | 'title' | 'image'>;

const FAVORITES_KEY = 'pantrypal_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteRecipe[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedFavorites = window.localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Error loading favorites',
        description: 'Could not load your saved recipes from your browser.',
      })
    }
    setIsLoaded(true);
  }, [toast]);

  const saveFavorites = useCallback((newFavorites: FavoriteRecipe[]) => {
    try {
      setFavorites(newFavorites);
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to save favorites to localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Error saving favorite',
        description: 'Could not save the recipe to your browser storage.',
      })
    }
  }, [toast]);

  const addFavorite = useCallback((recipe: RecipeSearchResult | RecipeDetails) => {
    const newFavorite: FavoriteRecipe = {
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
    };
    saveFavorites([...favorites, newFavorite]);
    toast({ title: 'Recipe saved!', description: `"${recipe.title}" has been added to your favorites.` });
  }, [favorites, saveFavorites, toast]);

  const removeFavorite = useCallback((recipeId: number) => {
    const recipe = favorites.find(fav => fav.id === recipeId);
    const newFavorites = favorites.filter((fav) => fav.id !== recipeId);
    saveFavorites(newFavorites);
    if(recipe) {
      toast({ title: 'Recipe removed', description: `"${recipe.title}" has been removed from your favorites.` });
    }
  }, [favorites, saveFavorites, toast]);

  const isFavorite = useCallback((recipeId: number) => {
    return favorites.some((fav) => fav.id === recipeId);
  }, [favorites]);

  return { favorites, addFavorite, removeFavorite, isFavorite, isLoaded };
}
