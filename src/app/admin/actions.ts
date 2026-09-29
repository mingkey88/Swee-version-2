'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireRole } from '@/lib/dal';
import { prisma } from '@/lib/prisma';

const statusChange = z.object({
  businessId: z.string().min(1),
  status: z.enum(['ACTIVE', 'SUSPENDED']),
});

/** Approve (ACTIVE) or suspend a business. Admin only. */
export async function setBusinessStatus(formData: FormData) {
  // Server actions are public endpoints, so the role check lives here too.
  await requireRole('ADMIN');
  const { businessId, status } = statusChange.parse({
    businessId: formData.get('businessId'),
    status: formData.get('status'),
  });
  await prisma.business.update({ where: { id: businessId }, data: { status } });
  revalidatePath('/admin');
  revalidatePath('/');
}
