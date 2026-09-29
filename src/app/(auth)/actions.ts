'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { APIError } from 'better-auth/api';
import type { Role } from '@/generated/prisma/enums';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { homeFor } from '@/lib/roles';
import { uniqueSlug } from '@/lib/slug';
import {
  customerSignUpSchema,
  fieldErrors,
  merchantSignUpSchema,
  signInSchema,
  type FieldErrors,
} from '@/lib/validation';

export type FormState =
  | {
      error?: string;
      fieldErrors?: FieldErrors;
      /** Submitted values (never the password) so the form can be refilled. */
      values?: Record<string, string>;
    }
  | undefined;

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === 'string' ? value : '';
}

function apiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof APIError && error.body?.message) {
    return error.body.message;
  }
  return fallback;
}

export async function signIn(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const values = { email: text(formData, 'email') };
  const parsed = signInSchema.safeParse({
    ...values,
    password: text(formData, 'password'),
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), values };
  }

  try {
    await auth.api.signInEmail({ body: parsed.data, headers: await headers() });
  } catch (error) {
    if (error instanceof APIError) {
      return { error: 'Incorrect email or password.', values };
    }
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
    select: { role: true },
  });
  redirect(homeFor(user?.role ?? 'CUSTOMER'));
}

export async function signUpCustomer(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const values = {
    name: text(formData, 'name'),
    email: text(formData, 'email'),
  };
  const parsed = customerSignUpSchema.safeParse({
    ...values,
    password: text(formData, 'password'),
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), values };
  }

  try {
    await auth.api.signUpEmail({ body: parsed.data, headers: await headers() });
  } catch (error) {
    return {
      error: apiErrorMessage(error, 'Could not create your account.'),
      values,
    };
  }

  redirect(homeFor('CUSTOMER'));
}

export async function signUpMerchant(
  _prev: FormState,
  formData: FormData
): Promise<FormState> {
  const values = {
    name: text(formData, 'name'),
    email: text(formData, 'email'),
    businessName: text(formData, 'businessName'),
    category: text(formData, 'category'),
    area: text(formData, 'area'),
    address: text(formData, 'address'),
    isHomeBased: formData.get('isHomeBased') === 'on' ? 'on' : '',
  };
  const parsed = merchantSignUpSchema.safeParse({
    ...values,
    password: text(formData, 'password'),
    isHomeBased: values.isHomeBased === 'on',
  });
  if (!parsed.success) {
    return { fieldErrors: fieldErrors(parsed.error), values };
  }
  const { name, email, password, businessName, ...business } = parsed.data;

  let userId: string;
  try {
    const result = await auth.api.signUpEmail({
      body: { name, email, password },
      headers: await headers(),
    });
    userId = result.user.id;
  } catch (error) {
    return {
      error: apiErrorMessage(error, 'Could not create your account.'),
      values,
    };
  }

  // The role is set here on the server; the sign-up form can never choose it.
  try {
    const slug = await uniqueSlug(businessName, async candidate =>
      Boolean(await prisma.business.findUnique({ where: { slug: candidate } }))
    );
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { role: 'MERCHANT' satisfies Role },
      }),
      prisma.business.create({
        data: { ...business, name: businessName, slug, ownerId: userId },
      }),
    ]);
  } catch (error) {
    // Don't leave a half-created merchant behind.
    await prisma.user.delete({ where: { id: userId } }).catch(() => {});
    console.error('Merchant sign-up failed', error);
    return {
      error: 'Could not create your business. Please try again.',
      values,
    };
  }

  redirect(homeFor('MERCHANT'));
}

export async function signOut() {
  await auth.api.signOut({ headers: await headers() });
  redirect('/');
}
