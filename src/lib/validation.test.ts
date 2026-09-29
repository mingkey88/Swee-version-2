import { describe, expect, it } from 'vitest';
import {
  customerSignUpSchema,
  fieldErrors,
  merchantSignUpSchema,
  signInSchema,
} from './validation';

const merchant = {
  name: 'Rita Lim',
  email: 'Rita@Swee.test ',
  password: 'sweedemo123',
  businessName: "Rita's Home Facials",
  category: 'FACIAL',
  area: 'Bedok',
  address: 'Bedok North Avenue 3',
  isHomeBased: true,
};

describe('signInSchema', () => {
  it('normalises the email', () => {
    const result = signInSchema.parse({
      email: ' Sarah@Swee.test ',
      password: 'x',
    });
    expect(result.email).toBe('sarah@swee.test');
  });

  it('requires a password', () => {
    const result = signInSchema.safeParse({ email: 'a@b.co', password: '' });
    expect(result.success).toBe(false);
  });
});

describe('customerSignUpSchema', () => {
  it('reports every invalid field with a readable message', () => {
    const result = customerSignUpSchema.safeParse({
      name: ' ',
      email: 'nope',
      password: 'short',
    });
    expect(result.success).toBe(false);
    expect(fieldErrors(result.error!)).toEqual({
      name: ['Enter your name'],
      email: ['Enter a valid email address'],
      password: ['Use at least 8 characters'],
    });
  });

  it('ignores a role sneaked into the form data', () => {
    const result = customerSignUpSchema.parse({
      name: 'Mallory',
      email: 'm@swee.test',
      password: 'password123',
      role: 'ADMIN',
    });
    expect(result).not.toHaveProperty('role');
  });
});

describe('merchantSignUpSchema', () => {
  it('accepts a valid business sign-up', () => {
    const result = merchantSignUpSchema.parse(merchant);
    expect(result.email).toBe('rita@swee.test');
    expect(result.category).toBe('FACIAL');
  });

  it('rejects unknown categories and neighbourhoods', () => {
    const result = merchantSignUpSchema.safeParse({
      ...merchant,
      category: 'TATTOO',
      area: 'Atlantis',
    });
    expect(result.success).toBe(false);
    const errors = fieldErrors(result.error!);
    expect(errors.category).toEqual(['Choose a category']);
    expect(errors.area).toEqual(['Choose a neighbourhood']);
  });
});
