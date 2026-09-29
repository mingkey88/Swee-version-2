import { expect, test } from '@playwright/test';
import { accounts, signIn, uniqueEmail } from './helpers';

test('the home page lists only approved businesses', async ({ page }) => {
  await page.goto('/');
  const listing = page.getByRole('region', { name: 'Now on Swee' });
  await expect(listing.getByText("Rita's Home Facials")).toBeVisible();
  await expect(listing.getByText('Studio Kaze')).toBeVisible();
  // Nail Nook is still waiting for review.
  await expect(listing.getByText('Nail Nook')).toHaveCount(0);
});

test('a merchant sees their own business dashboard', async ({ page }) => {
  await signIn(page, accounts.merchant);
  await expect(page).toHaveURL('/business');
  await expect(
    page.getByRole('heading', { name: "Rita's Home Facials" })
  ).toBeVisible();
  await expect(page.getByText('Live', { exact: true })).toBeVisible();
});

test('a new business signs up and waits for review', async ({ page }) => {
  await page.goto('/sign-up/business');
  await page.getByLabel('Business name').fill('Lash & Co');
  await page
    .getByLabel('Main category')
    .selectOption({ label: 'Brows & lashes' });
  await page.getByLabel('Neighbourhood').selectOption('Serangoon');
  await page.getByLabel('Address').fill('23 Serangoon Central, #03-11');
  await page.getByLabel('I run a home-based business').check();
  await page.getByLabel('Your name').fill('Priya Nair');
  await page.getByLabel('Email').fill(uniqueEmail('lash-co'));
  await page.getByLabel('Password').fill('a-strong-password');
  await page.getByRole('button', { name: 'Create business account' }).click();

  await expect(page).toHaveURL('/business');
  await expect(page.getByRole('heading', { name: 'Lash & Co' })).toBeVisible();
  await expect(page.getByText('Your business is under review')).toBeVisible();
  await expect(
    page.getByText('Serangoon · Brows & lashes · Home-based')
  ).toBeVisible();

  // Not public until an admin approves it.
  await page.goto('/');
  await expect(page.getByText('Lash & Co')).toHaveCount(0);
});

test('an admin approves a pending business and it goes live', async ({
  page,
}) => {
  await signIn(page, accounts.admin);
  await expect(page).toHaveURL('/admin');

  const pending = page.getByRole('region', { name: /Waiting for review/ });
  const nailNook = pending
    .getByRole('listitem')
    .filter({ hasText: 'Nail Nook' });
  await nailNook.getByRole('button', { name: 'Approve' }).click();
  await expect(pending.getByText('Nail Nook')).toHaveCount(0);

  await page.goto('/');
  await expect(
    page.getByRole('region', { name: 'Now on Swee' }).getByText('Nail Nook')
  ).toBeVisible();
});
