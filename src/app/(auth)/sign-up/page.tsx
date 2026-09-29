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
import { SignUpForm } from './sign-up-form';

export const metadata: Metadata = { title: 'Create an account' };

export default async function SignUpPage() {
  await redirectIfSignedIn();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>
          Book beauty and wellness services with clear prices and no hard
          selling.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpForm />
      </CardContent>
      <CardFooter className="text-muted-foreground flex-col items-start gap-1 text-sm">
        <p>
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
        <p>
          Signing up a business?{' '}
          <Link
            href="/sign-up/business"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            Use the business sign-up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
