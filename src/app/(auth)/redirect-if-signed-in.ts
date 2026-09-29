import 'server-only';
import { redirect } from 'next/navigation';
import type { Role } from '@/generated/prisma/enums';
import { getSession } from '@/lib/dal';
import { homeFor } from '@/lib/roles';

/** Signed-in visitors don't need the sign-in or sign-up pages. */
export async function redirectIfSignedIn() {
  const session = await getSession();
  if (session) redirect(homeFor(session.user.role as Role));
}
