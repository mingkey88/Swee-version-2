import { describe, expect, it } from 'vitest';
import { homeFor } from './roles';

describe('homeFor', () => {
  it('sends each role to its own area', () => {
    expect(homeFor('CUSTOMER')).toBe('/account');
    expect(homeFor('MERCHANT')).toBe('/business');
    expect(homeFor('ADMIN')).toBe('/admin');
  });
});
