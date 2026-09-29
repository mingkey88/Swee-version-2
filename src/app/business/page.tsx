import type { Metadata } from 'next';
import { Clock, MapPin, ShieldCheck, TriangleAlert } from 'lucide-react';
import { BusinessStatusBadge } from '@/components/business-status-badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { requireRole } from '@/lib/dal';
import { CATEGORY_LABELS } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

export const metadata: Metadata = { title: 'My business' };

const COMING_NEXT = [
  {
    title: 'Services & prices',
    text: 'List each service with its full, all-in price.',
  },
  { title: 'Team', text: 'Add the practitioners customers can book.' },
  { title: 'Opening hours', text: 'Set when customers can book you.' },
  { title: 'Calendar', text: 'See and manage every appointment.' },
];

export default async function BusinessDashboardPage() {
  const { user } = await requireRole('MERCHANT');
  const business = await prisma.business.findUnique({
    where: { ownerId: user.id },
  });

  if (!business) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-10">
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>No business found for this account</AlertTitle>
          <AlertDescription>Please contact Swee support.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-semibold tracking-tight">
          {business.name}
        </h1>
        <BusinessStatusBadge status={business.status} />
      </div>
      <p className="text-muted-foreground mt-1 flex items-center gap-1.5">
        <MapPin className="size-4" aria-hidden />
        {business.area} · {CATEGORY_LABELS[business.category]}
        {business.isHomeBased && ' · Home-based'}
      </p>

      {business.status === 'PENDING_REVIEW' && (
        <Alert className="bg-blush mt-6">
          <Clock />
          <AlertTitle>Your business is under review</AlertTitle>
          <AlertDescription>
            Swee checks every new business before customers can find it.
            We&apos;ll list you as soon as the review is done.
          </AlertDescription>
        </Alert>
      )}
      {business.status === 'ACTIVE' && (
        <Alert className="bg-blush mt-6">
          <ShieldCheck />
          <AlertTitle>You&apos;re live on Swee</AlertTitle>
          <AlertDescription>
            Customers can now find your business.
          </AlertDescription>
        </Alert>
      )}
      {business.status === 'SUSPENDED' && (
        <Alert variant="destructive" className="mt-6">
          <TriangleAlert />
          <AlertTitle>Your listing is suspended</AlertTitle>
          <AlertDescription>
            Customers can&apos;t see your business right now. Please contact
            Swee support.
          </AlertDescription>
        </Alert>
      )}

      <section aria-labelledby="setup-heading" className="mt-10">
        <h2 id="setup-heading" className="text-lg font-semibold">
          Coming next to your dashboard
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {COMING_NEXT.map(item => (
            <Card key={item.title}>
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.text}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-muted-foreground text-sm">
                  Coming soon
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
