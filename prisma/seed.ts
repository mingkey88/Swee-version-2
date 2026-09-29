import { randomUUID } from 'node:crypto';
import { PrismaPg } from '@prisma/adapter-pg';
import { hashPassword } from 'better-auth/crypto';
import { PrismaClient } from '../src/generated/prisma/client';
import type {
  BusinessStatus,
  Category,
  Role,
} from '../src/generated/prisma/enums';

// Demo data for local development only. Never seed production with this.
export const DEMO_PASSWORD = 'sweedemo123';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

type DemoBusiness = {
  slug: string;
  name: string;
  category: Category;
  description: string;
  area: string;
  address: string;
  isHomeBased?: boolean;
  status: BusinessStatus;
};

const MERCHANTS: { name: string; email: string; business: DemoBusiness }[] = [
  {
    name: 'Rita Lim',
    email: 'rita@swee.test',
    business: {
      slug: 'ritas-home-facials',
      name: "Rita's Home Facials",
      category: 'FACIAL',
      description:
        'Gentle, unhurried facials from a home studio. One therapist, one client at a time, and never a package pitch.',
      area: 'Bedok',
      address: 'Bedok North Avenue 3 (exact unit shared after booking)',
      isHomeBased: true,
      status: 'ACTIVE',
    },
  },
  {
    name: 'Daniel Tan',
    email: 'daniel@swee.test',
    business: {
      slug: 'studio-kaze',
      name: 'Studio Kaze',
      category: 'HAIR',
      description:
        'Cuts, colour and treatments with the price agreed before the scissors come out.',
      area: 'Tampines',
      address: '10 Tampines Central 1, #02-15',
      status: 'ACTIVE',
    },
  },
  {
    name: 'Mei Ong',
    email: 'mei@swee.test',
    business: {
      slug: 'quiet-hands-massage',
      name: 'Quiet Hands Massage',
      category: 'MASSAGE',
      description:
        'Therapeutic and relaxation massage. Pay per session; no memberships required.',
      area: 'Novena',
      address: '101 Thomson Road, #05-02',
      status: 'ACTIVE',
    },
  },
  {
    name: 'Aisha Rahman',
    email: 'aisha@swee.test',
    business: {
      slug: 'nail-nook',
      name: 'Nail Nook',
      category: 'NAILS',
      description: 'Gel manicures and nail art in Punggol.',
      area: 'Punggol',
      address: '681 Punggol Drive, #01-20',
      status: 'PENDING_REVIEW',
    },
  },
];

async function upsertUser(name: string, email: string, role: Role) {
  const user = await prisma.user.upsert({
    where: { email },
    update: { name, role },
    create: { id: randomUUID(), name, email, role, emailVerified: true },
  });
  // Better Auth stores email/password logins as a "credential" account.
  const existing = await prisma.account.findFirst({
    where: { userId: user.id, providerId: 'credential' },
  });
  if (!existing) {
    await prisma.account.create({
      data: {
        id: randomUUID(),
        accountId: user.id,
        providerId: 'credential',
        userId: user.id,
        password: await hashPassword(DEMO_PASSWORD),
      },
    });
  }
  return user;
}

async function main() {
  await upsertUser('Swee Admin', 'admin@swee.test', 'ADMIN');
  await upsertUser('Sarah Chen', 'customer@swee.test', 'CUSTOMER');

  for (const merchant of MERCHANTS) {
    const owner = await upsertUser(merchant.name, merchant.email, 'MERCHANT');
    await prisma.business.upsert({
      where: { slug: merchant.business.slug },
      update: { ...merchant.business },
      create: { ...merchant.business, ownerId: owner.id },
    });
  }

  console.log(
    `Seeded ${MERCHANTS.length + 2} demo users (password: ${DEMO_PASSWORD}) and ${MERCHANTS.length} businesses.`
  );
}

main()
  .catch(error => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
