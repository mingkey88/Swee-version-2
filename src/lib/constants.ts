import type { Category } from '@/generated/prisma/enums';

export const CATEGORY_LABELS: Record<Category, string> = {
  HAIR: 'Hair',
  NAILS: 'Nails',
  FACIAL: 'Facials & skin',
  BROWS_LASHES: 'Brows & lashes',
  MASSAGE: 'Massage & spa',
  WELLNESS: 'Wellness',
};

export const CATEGORIES = Object.keys(CATEGORY_LABELS) as Category[];

// Neighbourhoods customers can browse by (a subset of Singapore planning areas).
export const AREAS = [
  'Ang Mo Kio',
  'Bedok',
  'Bishan',
  'Bugis',
  'Bukit Batok',
  'Bukit Timah',
  'Clementi',
  'Hougang',
  'Jurong East',
  'Katong',
  'Novena',
  'Orchard',
  'Pasir Ris',
  'Punggol',
  'Queenstown',
  'Sengkang',
  'Serangoon',
  'Tampines',
  'Tanjong Pagar',
  'Toa Payoh',
  'Woodlands',
  'Yishun',
] as const;
