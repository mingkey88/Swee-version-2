import { execSync } from 'node:child_process';
import { Client } from 'pg';
import { TEST_DATABASE_URL } from '../playwright.config';

/** Gives every test run a clean database with only the demo seed data. */
export default async function globalSetup() {
  const dbName = new URL(TEST_DATABASE_URL).pathname.slice(1);
  if (!dbName.endsWith('_test')) {
    throw new Error(
      `Refusing to wipe "${dbName}": e2e tests only run against a database whose name ends in "_test".`
    );
  }

  const env = { ...process.env, DATABASE_URL: TEST_DATABASE_URL };
  execSync('npx prisma migrate deploy', { stdio: 'inherit', env });

  const client = new Client({ connectionString: TEST_DATABASE_URL });
  await client.connect();
  try {
    const { rows } = await client.query<{ tablename: string }>(
      `SELECT tablename FROM pg_tables
       WHERE schemaname = 'public' AND tablename <> '_prisma_migrations'`
    );
    if (rows.length > 0) {
      const tables = rows.map(r => `"public"."${r.tablename}"`).join(', ');
      await client.query(`TRUNCATE ${tables} CASCADE`);
    }
  } finally {
    await client.end();
  }

  execSync('npx prisma db seed', { stdio: 'inherit', env });
}
