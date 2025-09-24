'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { recognizeIngredients } from '@/ai/flows/visual-ingredient-recognition';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { useSearchHistory } from '@/hooks/use-search-history';

type IngredientSearchFormProps = {
  initialIngredients?: string;
};

export function IngredientSearchForm({ initialIngredients = '' }: IngredientSearchFormProps) {
  const [ingredients, setIngredients] = useState(initialIngredients);
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [activeTab, setActiveTab] = useState('text');
  const router = useRouter();
  const { toast } = useToast();
  const { addSearch } = useSearchHistory();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isMounted) {
      setIsSearching(true);
      const cleanedIngredients = ingredients.trim().split(/\s*,\s*|\s+/).join(',');
      addSearch(cleanedIngredients);
      const params = new URLSearchParams();
      if (cleanedIngredients) {
        params.set('ingredients', cleanedIngredients);
      }
      router.push(`/?${params.toString()}`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsRecognizing(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const dataUri = event.target?.result as string;
        if (!dataUri) {
          throw new Error('Could not read file.');
        }

        const result = await recognizeIngredients({ photoDataUri: dataUri });
        if (result.ingredients && result.ingredients.length > 0) {
          setIngredients(result.ingredients.join(', '));
          setActiveTab('text');
          toast({
            title: 'Ingredients Recognized!',
            description: "We've added the ingredients to the search box.",
          });
        } else {
          toast({
            variant: 'destructive',
            title: 'No Ingredients Found',
            description: 'We couldn`t identify any ingredients in the photo. Please try another one.',
          });
        }
      };
      reader.onerror = () => {
        throw new Error('Failed to read file.');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Recognition Failed',
        description: error instanceof Error ? error.message : 'An unknown error occurred.',
      });
    } finally {
      setIsRecognizing(false);
      e.target.value = '';
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-xl border-2 border-primary/20 -mt-12 md:-mt-20 z-10 relative">
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-t-lg rounded-b-none h-14 bg-secondary/50">
            <TabsTrigger value="text" className="h-full text-base">
              <Wand2 className="mr-2 h-5 w-5" />
              Type Ingredients
            </TabsTrigger>
            <TabsTrigger value="visual" className="h-full text-base">
              <Camera className="mr-2 h-5 w-5" />
              Use Photo
            </TabsTrigger>
          </TabsList>
          <TabsContent value="text" className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <Textarea
                placeholder="e.g., chicken, broccoli, rice"
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                rows={4}
                className="text-base"
              />
              <Button type="submit" className="w-full text-lg h-12" disabled={isSearching || !ingredients}>
                {isSearching ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...</>
                ) : (
                  'Find Recipes'
                )}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="visual" className="p-6 text-center">
            <div className="space-y-4">
              <Label htmlFor="ingredient-photo" className="cursor-pointer border-2 border-dashed rounded-lg p-8 block hover:border-primary transition-colors bg-background hover:bg-accent/10">
                {isRecognizing ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="font-semibold text-lg">Analyzing your photo...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <Sparkles className="h-8 w-8 text-accent" />
                    <span className="font-semibold text-lg">Upload a photo of your ingredients</span>
                    <span className="text-sm text-muted-foreground">Click here to select an image</span>
                  </div>
                )}
              </Label>
              <Input
                id="ingredient-photo"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="sr-only"
                disabled={isRecognizing}
              />
               <p className="text-xs text-muted-foreground">Our AI will identify them and fill in the search box for you.</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
