import type { RecipeSearchResult } from '@/lib/types';
import { RecipeCard } from './recipe-card';

type RecipeListProps = {
  recipes: RecipeSearchResult[];
};

export function RecipeList({ recipes }: RecipeListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
