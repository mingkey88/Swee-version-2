import { expect, type Page } from '@playwright/test';

export const DEMO_PASSWORD = 'sweedemo123';

export const accounts = {
  admin: 'admin@swee.test',
  customer: 'customer@swee.test',
  merchant: 'rita@swee.test',
} as const;

export function uniqueEmail(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1e4)}@swee.test`;
}

export async function signIn(
  page: Page,
  email: string,
  password = DEMO_PASSWORD
) {
  await page.goto('/sign-in');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
}

export async function expectSignedOut(page: Page) {
  await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
}
