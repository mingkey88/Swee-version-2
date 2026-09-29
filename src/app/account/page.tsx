import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarHeart } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { requireRole } from '@/lib/dal';

export const metadata: Metadata = { title: 'My account' };

export default async function AccountPage() {
  const { user } = await requireRole('CUSTOMER');
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">
        Hi, {user.name.split(' ')[0]}
      </h1>
      <p className="text-muted-foreground mt-1">{user.email}</p>

      <section aria-labelledby="bookings-heading" className="mt-8">
        <h2 id="bookings-heading" className="text-lg font-semibold">
          Your bookings
        </h2>
        <div className="bg-blush mt-3 flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center">
          <CalendarHeart className="text-coral size-8" aria-hidden />
          <p className="font-medium">No bookings yet</p>
          <p className="text-muted-foreground max-w-sm text-sm">
            When you book a service, it will show up here with its full price
            and the business&apos;s cancellation policy.
          </p>
          <Link
            href="/"
            className={buttonVariants({ variant: 'outline', size: 'lg' })}
          >
            See businesses on Swee
          </Link>
        </div>
      </section>
    </div>
  );
}
