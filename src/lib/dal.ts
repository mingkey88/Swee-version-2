import 'server-only';
import { cache } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Role } from '@/generated/prisma/enums';
import { auth } from './auth';
import { homeFor } from './roles';

/**
 * Data Access Layer: every auth check goes through here, close to the data,
 * as the Next.js 16 authentication guide recommends. `cache` dedupes the
 * session lookup within one request.
 */
export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() })
);

/** Returns the signed-in session, or sends the visitor to sign in. */
export async function requireSession() {
  const session = await getSession();
  if (!session) redirect('/sign-in');
  return session;
}

/** Returns the session if the user has `role`; otherwise sends them to their own home. */
export async function requireRole(role: Role) {
  const session = await requireSession();
  if (session.user.role !== role) redirect(homeFor(session.user.role as Role));
  return session;
}
