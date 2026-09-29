import Link from 'next/link';
import { Suspense } from 'react';
import { signOut } from '@/app/(auth)/actions';
import { Logo } from '@/components/logo';
import { Button, buttonVariants } from '@/components/ui/button';
import type { Role } from '@/generated/prisma/enums';
import { getSession } from '@/lib/dal';
import { homeFor } from '@/lib/roles';
import { cn } from '@/lib/utils';

const ROLE_LINK_LABEL: Record<Role, string> = {
  CUSTOMER: 'My account',
  MERCHANT: 'My business',
  ADMIN: 'Admin',
};

export function SiteHeader() {
  return (
    <header className="border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" aria-label="Swee home" className="pt-1">
          <Logo />
        </Link>
        <nav aria-label="Account" className="flex items-center gap-1 sm:gap-2">
          {/* Only this part waits for the session, so the page streams first. */}
          <Suspense fallback={<div className="h-10 w-40" />}>
            <UserNav />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}

async function UserNav() {
  const session = await getSession();

  if (!session) {
    return (
      <>
        <Link
          href="/sign-up/business"
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'lg' }),
            'hidden sm:inline-flex'
          )}
        >
          For businesses
        </Link>
        <Link
          href="/sign-in"
          className={buttonVariants({ variant: 'ghost', size: 'lg' })}
        >
          Sign in
        </Link>
        <Link href="/sign-up" className={buttonVariants({ size: 'lg' })}>
          Sign up
        </Link>
      </>
    );
  }

  const role = session.user.role as Role;
  return (
    <>
      <Link
        href={homeFor(role)}
        className={buttonVariants({ variant: 'ghost', size: 'lg' })}
      >
        {ROLE_LINK_LABEL[role]}
      </Link>
      <form action={signOut}>
        <Button type="submit" variant="outline" size="lg">
          Sign out
        </Button>
      </form>
    </>
  );
}
