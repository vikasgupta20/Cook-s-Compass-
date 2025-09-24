'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile as updateFirebaseAuthProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: { displayName?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast({ title: 'Signed in successfully!' });
      router.push('/');
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: 'Could not sign in with Google. Please try again.',
      });
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      toast({ title: 'Signed in successfully!' });
      router.push('/');
    } catch (error) {
      console.error('Error signing in with email:', error);
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
        description: 'Invalid email or password. Please try again.',
      });
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      
      const displayName = email.split('@')[0];
      if(auth.currentUser) {
        await updateFirebaseAuthProfile(auth.currentUser, { displayName: displayName });
      }

      setUser({ ...userCredential.user, displayName });

      toast({ title: 'Account created successfully!' });
      router.push('/');

    } catch (error) {
      console.error('Error signing up with email:', error);
      let description = 'Could not create account. Please try again.';
      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string };
        if(firebaseError.code === 'auth/email-already-in-use') {
            description = 'This email is already in use. Please sign in or use a different email.';
        }
      }
      toast({
        variant: 'destructive',
        title: 'Sign up failed',
        description,
      });
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Signed out successfully.' });
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: 'destructive',
        title: 'Sign out failed',
        description: 'Could not sign out. Please try again.',
      });
    }
  };
  
  const updateProfile = async (updates: { displayName?: string }) => {
    if (!auth.currentUser) return;
    try {
      await updateFirebaseAuthProfile(auth.currentUser, updates);
      // Create a new user object with the updated info to trigger re-render
      const updatedUser = { ...auth.currentUser, ...updates } as User;
      setUser(updatedUser);
      toast({ title: 'Profile updated!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not update your profile.',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
