/**
 * Couple names used throughout the app.
 * Configure via environment variables:
 *   NEXT_PUBLIC_GROOM_NAME  (default: 'שם החתן')
 *   NEXT_PUBLIC_BRIDE_NAME  (default: 'שם הכלה')
 */
export const COUPLE_NAMES = {
  suson: process.env.NEXT_PUBLIC_GROOM_NAME || 'שם החתן',
  susonit: process.env.NEXT_PUBLIC_BRIDE_NAME || 'שם הכלה',
}
