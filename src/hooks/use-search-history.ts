'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';

const MAX_HISTORY_LENGTH = 20;

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const getHistoryKey = useCallback(() => {
    return user ? `pantrypal_search_history_${user.uid}` : null;
  }, [user]);

  useEffect(() => {
    const historyKey = getHistoryKey();
    if (historyKey) {
      try {
        const storedHistory = window.localStorage.getItem(historyKey);
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error('Failed to load search history from localStorage', error);
        toast({
          variant: 'destructive',
          title: 'Error loading history',
          description: 'Could not load your search history.',
        });
      }
    }
    setIsLoaded(true);
  }, [getHistoryKey, toast]);
  
  const saveHistory = useCallback((newHistory: string[]) => {
    const historyKey = getHistoryKey();
    if (!historyKey) return;
    
    try {
      setHistory(newHistory);
      window.localStorage.setItem(historyKey, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Failed to save search history to localStorage', error);
       toast({
        variant: 'destructive',
        title: 'Error saving history',
        description: 'Could not save your search to history.',
      });
    }
  }, [getHistoryKey, toast]);

  const addSearch = useCallback((query: string) => {
    if (!query.trim()) return;
    const newHistory = [query, ...history.filter(item => item !== query)].slice(0, MAX_HISTORY_LENGTH);
    saveHistory(newHistory);
  }, [history, saveHistory]);

  const clearHistory = useCallback(() => {
    saveHistory([]);
    toast({ title: 'Search history cleared.' });
  }, [saveHistory, toast]);


  return { history, addSearch, clearHistory, isLoaded };
}
