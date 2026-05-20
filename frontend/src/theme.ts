/**
 * Mozart's Trail — Design Tokens
 *
 * Import in any component:
 *   import { C, F } from '../theme'
 *   import { C, F } from '../../theme'   // if two folders deep
 *
 * Usage:
 *   style={{ color: C.primary, fontFamily: F.headline }}
 */

// ── Colors ────────────────────────────────────────────────────────────────────
export const C = {
  // Core brand palette (from Figma "Amadeus Elegance" style guide)
  primary:   '#8B0000',   // deep red   — headers, buttons, active states
  secondary: '#D4AF37',   // gold       — accents, unlocked markers, progress bar
  tertiary:  '#5D4037',   // dark brown — borders, outlined buttons, secondary text
  neutral:   '#F5F5DC',   // warm beige — page backgrounds, cards

  // Derived shades
  primaryDark:   '#6B0000',   // darker red for hover / pressed states
  secondaryDark: '#A88A2A',   // darker gold for labels / small text on light bg
  tertiaryLight: '#8D6E63',   // lighter brown for muted icons / inactive nav
  neutralDark:   '#E8E5C8',   // slightly darker beige for dividers / borders

  // Text
  textDark:  '#2C1810',   // main body text (near-black with warm tint)
  textMuted: '#7A6A5A',   // secondary / description text

  white: '#FFFFFF',
} as const

// ── Typography ────────────────────────────────────────────────────────────────
export const F = {
  headline: '"Noto Serif", Georgia, serif',               // titles, location names
  body:     '"Manrope", Inter, system-ui, sans-serif',    // labels, descriptions, buttons
} as const
