import { describe, expect, it } from 'vitest';
import { slugify, uniqueSlug } from './slug';

describe('slugify', () => {
  it.each([
    ["Rita's Home Facials", 'ritas-home-facials'],
    ['Lash & Co', 'lash-co'],
    ['  Café  Étoile!! ', 'cafe-etoile'],
    ['Studio   Kaze', 'studio-kaze'],
    ['!!!', ''],
  ])('%j -> %j', (input, expected) => {
    expect(slugify(input)).toBe(expected);
  });

  it('caps long names at 60 characters without a trailing dash', () => {
    const slug = slugify('a'.repeat(59) + ' b');
    expect(slug.length).toBeLessThanOrEqual(60);
    expect(slug.endsWith('-')).toBe(false);
  });
});

describe('uniqueSlug', () => {
  it('returns the plain slug when it is free', async () => {
    expect(await uniqueSlug('Nail Nook', async () => false)).toBe('nail-nook');
  });

  it('adds a number until it finds a free slug', async () => {
    const taken = new Set(['nail-nook', 'nail-nook-2']);
    expect(await uniqueSlug('Nail Nook', async s => taken.has(s))).toBe(
      'nail-nook-3'
    );
  });

  it('falls back to "business" for names with no letters or digits', async () => {
    expect(await uniqueSlug('!!!', async () => false)).toBe('business');
  });
});
