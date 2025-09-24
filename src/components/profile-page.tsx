'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User as UserIcon } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

const profileSchema = z.object({
  displayName: z.string().min(1, 'Name is required.'),
  age: z.coerce.number().min(0, 'Age must be positive.').optional().nullable(),
  gender: z.enum(['male', 'female', 'other', 'prefer-not-to-say']).optional().nullable(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfilePage() {
  const { user, loading: authLoading, updateProfile: updateAuthProfile } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: '',
      age: null,
      gender: null,
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user && isMounted) {
      router.push('/login');
    }
  }, [user, authLoading, router, isMounted]);

  useEffect(() => {
    if (user && isMounted) {
      const fetchProfile = async () => {
        setIsLoading(true);
        try {
          const docRef = doc(db, 'profiles', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const profileData = docSnap.data() as UserProfile;
            reset({
              displayName: user.displayName || '',
              age: profileData.age,
              gender: profileData.gender,
            });
          } else {
            reset({
              displayName: user.displayName || '',
              age: null,
              gender: null,
            });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not load your profile. Please try again later.'
          })
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    }
  }, [user, reset, isMounted, toast]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      const profileData: UserProfile = {
        displayName: data.displayName,
        age: data.age || null,
        gender: data.gender || null,
      };

      await setDoc(doc(db, 'profiles', user.uid), profileData, { merge: true });

      if (user.displayName !== data.displayName) {
        await updateAuthProfile({ displayName: data.displayName });
      }

      toast({
        title: 'Success!',
        description: 'Your profile has been updated.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update your profile. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-8" />
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl">
            <UserIcon className="h-6 w-6" /> Your Profile
          </CardTitle>
          <CardDescription>Manage your personal information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="displayName">Name</Label>
              <Input id="displayName" {...register('displayName')} />
              {errors.displayName && <p className="text-sm text-destructive">{errors.displayName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" {...register('age')} />
              {errors.age && <p className="text-sm text-destructive">{errors.age.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Gender</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value ?? ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
