import { z } from 'zod';
import { AREAS, CATEGORIES } from './constants';

const name = z.string().trim().min(2, 'Enter your name').max(80);
// Trim and lowercase *before* validating, so " Sarah@Gmail.com " (common with
// mobile autocomplete) is accepted as sarah@gmail.com.
const email = z
  .string()
  .trim()
  .toLowerCase()
  .pipe(z.email('Enter a valid email address'));
const password = z
  .string()
  .min(8, 'Use at least 8 characters')
  .max(128, 'Use at most 128 characters');

export const signInSchema = z.object({
  email,
  password: z.string().min(1, 'Enter your password'),
});

export const customerSignUpSchema = z.object({ name, email, password });

export const merchantSignUpSchema = z.object({
  name,
  email,
  password,
  businessName: z.string().trim().min(2, 'Enter your business name').max(80),
  category: z.enum(CATEGORIES, 'Choose a category'),
  area: z.enum(AREAS, 'Choose a neighbourhood'),
  address: z.string().trim().min(5, 'Enter your business address').max(200),
  isHomeBased: z.boolean(),
});

/** Field errors keyed by input name, for showing under each form field. */
export type FieldErrors = Partial<Record<string, string[]>>;

export function fieldErrors(error: z.ZodError): FieldErrors {
  return z.flattenError(error).fieldErrors as FieldErrors;
}
