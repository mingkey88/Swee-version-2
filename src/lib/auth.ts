import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { prisma } from './prisma';

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  user: {
    additionalFields: {
      role: {
        type: ['CUSTOMER', 'MERCHANT', 'ADMIN'],
        required: false,
        defaultValue: 'CUSTOMER',
        // Never accept a role from the sign-up form; only the server sets it.
        input: false,
      },
    },
  },
  // Must stay last: lets Server Actions set auth cookies.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
