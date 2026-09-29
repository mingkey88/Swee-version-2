import type { Metadata } from 'next';
import { BusinessStatusBadge } from '@/components/business-status-badge';
import { Button } from '@/components/ui/button';
import type { BusinessStatus } from '@/generated/prisma/enums';
import { requireRole } from '@/lib/dal';
import { CATEGORY_LABELS } from '@/lib/constants';
import { prisma } from '@/lib/prisma';
import { setBusinessStatus } from './actions';

export const metadata: Metadata = { title: 'Admin' };

const dateFormat = new Intl.DateTimeFormat('en-SG', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'Asia/Singapore',
});

export default async function AdminPage() {
  await requireRole('ADMIN');
  const businesses = await prisma.business.findMany({
    include: { owner: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
  const pending = businesses.filter(b => b.status === 'PENDING_REVIEW');
  const others = businesses.filter(b => b.status !== 'PENDING_REVIEW');

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Admin</h1>
      <p className="text-muted-foreground mt-1">
        Vet new businesses before they appear on Swee.
      </p>

      <section aria-labelledby="pending-heading" className="mt-8">
        <h2 id="pending-heading" className="text-lg font-semibold">
          Waiting for review ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-muted-foreground mt-3 text-sm">
            Nothing to review right now.
          </p>
        ) : (
          <BusinessList businesses={pending} />
        )}
      </section>

      <section aria-labelledby="all-heading" className="mt-10">
        <h2 id="all-heading" className="text-lg font-semibold">
          All other businesses ({others.length})
        </h2>
        <BusinessList businesses={others} />
      </section>
    </div>
  );
}

type AdminBusiness = Awaited<
  ReturnType<typeof prisma.business.findMany>
>[number] & {
  owner: { name: string; email: string };
};

function BusinessList({ businesses }: { businesses: AdminBusiness[] }) {
  return (
    <ul className="mt-3 divide-y rounded-xl border">
      {businesses.map(business => (
        <li
          key={business.id}
          className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium">{business.name}</span>
              <BusinessStatusBadge status={business.status} />
            </div>
            <p className="text-muted-foreground text-sm">
              {CATEGORY_LABELS[business.category]} · {business.area}
              {business.isHomeBased && ' · Home-based'} · {business.address}
            </p>
            <p className="text-muted-foreground text-sm">
              {business.owner.name} ({business.owner.email}) · joined{' '}
              {dateFormat.format(business.createdAt)}
            </p>
          </div>
          <StatusActions id={business.id} status={business.status} />
        </li>
      ))}
    </ul>
  );
}

function StatusActions({ id, status }: { id: string; status: BusinessStatus }) {
  return (
    <form action={setBusinessStatus} className="flex shrink-0 gap-2">
      <input type="hidden" name="businessId" value={id} />
      {status !== 'ACTIVE' && (
        <Button type="submit" name="status" value="ACTIVE" size="lg">
          {status === 'PENDING_REVIEW' ? 'Approve' : 'Reinstate'}
        </Button>
      )}
      {status !== 'SUSPENDED' && (
        <Button
          type="submit"
          name="status"
          value="SUSPENDED"
          variant="outline"
          size="lg"
        >
          Suspend
        </Button>
      )}
    </form>
  );
}
