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
import { BusinessSignUpForm } from './business-sign-up-form';

export const metadata: Metadata = { title: 'List your business' };

export default async function BusinessSignUpPage() {
  await redirectIfSignedIn();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">List your business on Swee</CardTitle>
        <CardDescription>
          Reach customers who value honest service. We review every new business
          before it appears in search.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BusinessSignUpForm />
      </CardContent>
      <CardFooter className="text-muted-foreground text-sm">
        <p>
          Already on Swee?{' '}
          <Link
            href="/sign-in"
            className="text-primary font-medium underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
