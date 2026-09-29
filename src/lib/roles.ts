import type { Role } from '@/generated/prisma/enums';

/** Where each role lands after signing in. */
export function homeFor(role: Role): string {
  switch (role) {
    case 'MERCHANT':
      return '/business';
    case 'ADMIN':
      return '/admin';
    default:
      return '/account';
  }
}
