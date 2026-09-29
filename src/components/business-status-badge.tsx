import { Badge } from '@/components/ui/badge';
import type { BusinessStatus } from '@/generated/prisma/enums';

const LABELS: Record<BusinessStatus, string> = {
  PENDING_REVIEW: 'Under review',
  ACTIVE: 'Live',
  SUSPENDED: 'Suspended',
};

const VARIANTS: Record<
  BusinessStatus,
  'secondary' | 'default' | 'destructive'
> = {
  PENDING_REVIEW: 'secondary',
  ACTIVE: 'default',
  SUSPENDED: 'destructive',
};

export function BusinessStatusBadge({ status }: { status: BusinessStatus }) {
  return <Badge variant={VARIANTS[status]}>{LABELS[status]}</Badge>;
}
