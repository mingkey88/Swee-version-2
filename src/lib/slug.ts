/** Turns a business name into a URL-safe slug, e.g. "Rita's Facials!" -> "ritas-facials". */
export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip accents
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '');
}

/**
 * Returns `base`, or `base-2`, `base-3`, ... — the first candidate that
 * `isTaken` reports as free.
 */
export async function uniqueSlug(
  name: string,
  isTaken: (slug: string) => Promise<boolean>
): Promise<string> {
  const base = slugify(name) || 'business';
  let candidate = base;
  for (let n = 2; await isTaken(candidate); n++) {
    candidate = `${base}-${n}`;
  }
  return candidate;
}
