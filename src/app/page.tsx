import Link from 'next/link';
import { connection } from 'next/server';
import { BadgeCheck, Flag, MapPin, ReceiptText } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CATEGORY_LABELS } from '@/lib/constants';
import { prisma } from '@/lib/prisma';
import { cn } from '@/lib/utils';

const PILLARS = [
  {
    icon: ReceiptText,
    title: 'Clear, all-in prices',
    text: 'See the full price before you book. No bait-and-switch, no surprise add-ons at the counter.',
  },
  {
    icon: BadgeCheck,
    title: 'Vetted businesses',
    text: 'Every business is reviewed before it appears on Swee, on its values as well as its paperwork.',
  },
  {
    icon: Flag,
    title: 'Report hard selling',
    text: 'After each visit, tell us if you felt pressured. Reports shape each business’s Swee Trust Score.',
  },
];

export default async function HomePage() {
  // Always read fresh data at request time instead of at build time.
  await connection();
  const businesses = await prisma.business.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'asc' },
    take: 6,
  });

  return (
    <>
      <section className="bg-blush">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
          <p className="text-rose-deep text-sm font-semibold tracking-wide uppercase">
            Beauty &amp; wellness in Singapore
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Beauty services without the sales pressure.
          </h1>
          <p className="text-muted-foreground mt-5 max-w-2xl text-lg">
            Swee connects you with honest businesses. Clear prices, vetted
            practitioners, and a simple way to speak up if anyone pushes a
            package on you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/sign-up"
              className={cn(
                buttonVariants({ size: 'lg' }),
                'h-11 px-5 text-base'
              )}
            >
              Create a free account
            </Link>
            <Link
              href="/sign-up/business"
              className={cn(
                buttonVariants({ variant: 'outline', size: 'lg' }),
                'h-11 px-5 text-base'
              )}
            >
              List your business
            </Link>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="pillars-heading"
        className="mx-auto w-full max-w-6xl px-4 py-16"
      >
        <h2
          id="pillars-heading"
          className="text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          How Swee keeps it honest
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl border p-6">
              <Icon className="text-coral size-7" aria-hidden />
              <h3 className="mt-4 font-semibold">{title}</h3>
              <p className="text-muted-foreground mt-2 text-sm">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {businesses.length > 0 && (
        <section
          aria-labelledby="businesses-heading"
          className="mx-auto w-full max-w-6xl px-4 pb-16"
        >
          <h2
            id="businesses-heading"
            className="text-2xl font-semibold tracking-tight sm:text-3xl"
          >
            Now on Swee
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {businesses.map(business => (
              <li key={business.id} className="rounded-xl border p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    {CATEGORY_LABELS[business.category]}
                  </Badge>
                  {business.isHomeBased && (
                    <Badge variant="outline">Home-based</Badge>
                  )}
                </div>
                <h3 className="mt-3 font-semibold">{business.name}</h3>
                {business.description && (
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                    {business.description}
                  </p>
                )}
                <p className="text-muted-foreground mt-3 flex items-center gap-1 text-sm">
                  <MapPin className="size-4" aria-hidden />
                  {business.area}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="bg-blush-strong">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-4 py-12 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Run an honest beauty business?
            </h2>
            <p className="text-muted-foreground mt-1">
              Swee brings you customers who value good service, not hard
              selling.
            </p>
          </div>
          <Link
            href="/sign-up/business"
            className={cn(
              buttonVariants({ size: 'lg' }),
              'h-11 px-5 text-base'
            )}
          >
            List your business
          </Link>
        </div>
      </section>
    </>
  );
}
