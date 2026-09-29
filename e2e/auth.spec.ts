import { expect, test } from '@playwright/test';
import { accounts, expectSignedOut, signIn, uniqueEmail } from './helpers';

test.describe('customers', () => {
  test('can sign in, see their account, and sign out', async ({ page }) => {
    await signIn(page, accounts.customer);
    await expect(page).toHaveURL('/account');
    await expect(
      page.getByRole('heading', { name: 'Hi, Sarah' })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Sign out' }).click();
    await expect(page).toHaveURL('/');
    await expectSignedOut(page);
  });

  test('see an error for a wrong password', async ({ page }) => {
    await signIn(page, accounts.customer, 'not-the-password');
    // Filter by text: Next.js also renders an (empty) route-announcer alert.
    await expect(
      page.getByRole('alert').filter({ hasText: 'Incorrect email or password' })
    ).toBeVisible();
    await expect(page).toHaveURL('/sign-in');
    // The email stays filled in so they can retry.
    await expect(page.getByLabel('Email')).toHaveValue(accounts.customer);
  });

  test('can create an account', async ({ page }) => {
    await page.goto('/sign-up');
    await page.getByLabel('Name').fill('Nur Aisyah');
    await page.getByLabel('Email').fill(uniqueEmail('new-customer'));
    await page.getByLabel('Password').fill('a-strong-password');
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page).toHaveURL('/account');
    await expect(page.getByRole('heading', { name: 'Hi, Nur' })).toBeVisible();
  });

  test('get field errors for an invalid sign-up', async ({ page }) => {
    await page.goto('/sign-up');
    await page.getByLabel('Email').fill('not-an-email');
    await page.getByLabel('Password').fill('short');
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page.getByText('Enter your name')).toBeVisible();
    await expect(page.getByText('Enter a valid email address')).toBeVisible();
    await expect(page.getByText('Use at least 8 characters')).toBeVisible();
    await expect(page).toHaveURL('/sign-up');
  });

  test('cannot open the merchant or admin areas', async ({ page }) => {
    await signIn(page, accounts.customer);
    await expect(page).toHaveURL('/account');

    await page.goto('/admin');
    await expect(page).toHaveURL('/account');
    await page.goto('/business');
    await expect(page).toHaveURL('/account');
  });
});

test.describe('signed-out visitors', () => {
  test('are sent to sign in from protected pages', async ({ page }) => {
    for (const path of ['/account', '/business', '/admin']) {
      await page.goto(path);
      await expect(page).toHaveURL('/sign-in');
    }
  });

  test('cannot give themselves a role when signing up via the API', async ({
    request,
    baseURL,
  }) => {
    const email = uniqueEmail('role-injection');
    const signUp = await request.post('/api/auth/sign-up/email', {
      headers: { Origin: baseURL! },
      data: { name: 'Mallory', email, password: 'password123', role: 'ADMIN' },
    });
    expect(signUp.ok()).toBe(true);
    expect((await signUp.json()).user.role).toBe('CUSTOMER');

    const session = await request.get('/api/auth/get-session');
    expect((await session.json()).user.role).toBe('CUSTOMER');
  });
});
