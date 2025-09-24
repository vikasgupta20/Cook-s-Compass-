'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Chrome, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';

const signInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(1, { message: 'Please enter your password.' }),
});

const signUpSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export function LoginPage() {
  const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
      resolver: zodResolver(signUpSchema),
      defaultValues: {
          email: '',
          password: '',
      },
  });

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    await signInWithEmail(values.email, values.password);
    setIsSubmitting(false);
  };

  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
      setIsSubmitting(true);
      await signUpWithEmail(values.email, values.password);
      setIsSubmitting(false);
  }

  if (loading || user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-12 md:py-20 px-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">
            Welcome to PantryPal
          </CardTitle>
          <CardDescription>
            Sign in or create an account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <Form {...signInForm}>
                <form
                  onSubmit={signInForm.handleSubmit(handleSignIn)}
                  className="space-y-4 pt-4"
                >
                  <FormField
                    control={signInForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="m@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={signInForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="animate-spin" /> : 'Sign In'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="signup">
                <Form {...signUpForm}>
                    <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4 pt-4">
                         <FormField
                            control={signUpForm.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                <Input type="email" placeholder="m@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={signUpForm.control}
                            name="password"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                           {isSubmitting ? <Loader2 className="animate-spin" /> : 'Create Account'}
                        </Button>
                    </form>
                </Form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            onClick={signInWithGoogle}
            className="w-full"
            variant="outline"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Chrome className="mr-2 h-4 w-4" />}
            Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
