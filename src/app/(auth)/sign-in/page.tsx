import type { Metadata } from 'next';
import Link from 'next/link';
import { redirectIfSignedIn } from '@/app/(auth)/redirect-if-signed-in';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { SignInForm } from './sign-in-form';

export const metadata: Metadata = { title: 'Sign in' };

export default async function SignInPage() {
  await redirectIfSignedIn();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to book, manage your business, or review reports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm />
      </CardContent>
      <CardFooter className="text-muted-foreground flex-col items-start gap-1 text-sm">
        <p>
          New to Swee?{' '}
          <Link
            href="/sign-up"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
        <p>
          Own a beauty business?{' '}
          <Link
            href="/sign-up/business"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            List it on Swee
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
