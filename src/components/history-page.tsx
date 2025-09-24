'use client';

import Link from 'next/link';
import { History, Trash2, LogIn } from 'lucide-react';
import { useSearchHistory } from '@/hooks/use-search-history';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

export function HistoryPage() {
  const { history, clearHistory, isLoaded: historyLoaded } = useSearchHistory();
  const { user, loading: authLoading } = useAuth();

  const isLoaded = historyLoaded && !authLoading;

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <h1 className="text-4xl md:text-5xl font-bold font-headline mb-8 text-center">
          Search History
        </h1>
        <div className="max-w-2xl mx-auto space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
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
            You need to be logged in to see your search history.
          </p>
          <Button asChild className="mt-6">
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">
            Search History
          </h1>
          {history.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your entire search history. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearHistory}>
                    Yes, delete it
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {history.length === 0 ? (
          <div className="text-center py-16 rounded-lg border-2 border-dashed">
            <History className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No Search History</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your past searches will appear here.
            </p>
            <Button asChild className="mt-6">
              <Link href="/">Find Recipes</Link>
            </Button>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
                <ul className="divide-y">
                    {history.map((query, index) => (
                    <li key={index}>
                        <Link href={`/?ingredients=${encodeURIComponent(query)}`} className="block p-4 hover:bg-muted transition-colors">
                            <p className="font-medium capitalize">{query.split(',').join(', ')}</p>
                        </Link>
                    </li>
                    ))}
                </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
