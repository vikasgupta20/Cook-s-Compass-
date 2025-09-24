'use client';

import { useState } from 'react';
import { Wand2, User, Loader2 } from 'lucide-react';
import { chefBot } from '@/ai/flows/chef-bot-assistance';
import type { RecipeDetails } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type ChefBotProps = {
  recipe: RecipeDetails;
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function ChefBot({ recipe }: ChefBotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setIsLoading(true);

    try {
      const recipeInstructions = recipe.analyzedInstructions
        .flatMap((instruction) => instruction.steps.map((step) => step.step))
        .join('\n');

      const recipeIngredients = recipe.extendedIngredients
        .map((ing) => ing.original)
        .join(', ');

      const response = await chefBot({
        recipeName: recipe.title,
        recipeIngredients,
        recipeInstructions,
        query,
      });

      const assistantMessage: Message = { role: 'assistant', content: response.answer };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'ChefBot Error',
        description: 'Sorry, I had trouble answering that. Please try again.',
      });
      setMessages((prev) => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="sticky top-24 shadow-lg bg-secondary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-2xl">
          <Wand2 className="text-primary" />
          ChefBot Assistant
        </CardTitle>
        <CardDescription>
          Ask anything about this recipe!
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-72 pr-4">
           <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground p-4 bg-background/50 rounded-lg">
                  e.g., "What can I use instead of flour?"
                </div>
              )}
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                    {message.role === 'assistant' && (
                        <Avatar className="h-8 w-8 bg-primary/20 border-2 border-primary/50">
                            <AvatarFallback className="bg-transparent"><Wand2 className="text-primary"/></AvatarFallback>
                        </Avatar>
                    )}
                  <div className={cn(
                    'p-3 rounded-lg max-w-[80%]',
                    message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background shadow-sm'
                  )}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                   {message.role === 'user' && (
                        <Avatar className="h-8 w-8">
                             <AvatarFallback><User/></AvatarFallback>
                        </Avatar>
                    )}
                </div>
              ))}
              {isLoading && (
                  <div className="flex items-start gap-3 justify-start">
                    <Avatar className="h-8 w-8 bg-primary/20 border-2 border-primary/50">
                        <AvatarFallback className="bg-transparent"><Wand2 className="text-primary"/></AvatarFallback>
                    </Avatar>
                    <div className="p-3 rounded-lg bg-background shadow-sm">
                        <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  </div>
              )}
            </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleQuery} className="flex w-full gap-2">
          <Textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question..."
            rows={1}
            className="flex-grow resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleQuery(e);
              }
            }}
          />
          <Button type="submit" disabled={isLoading || !query.trim()} size="icon">
            <Wand2 className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
