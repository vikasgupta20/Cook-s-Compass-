'use client';

import { Suspense } from 'react';
import { GeneratedRecipeClient } from '@/components/generated-recipe-client';

export default function GeneratedRecipePage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 md:px-6 py-8">Loading...</div>}>
      <GeneratedRecipeClient />
    </Suspense>
  );
}
