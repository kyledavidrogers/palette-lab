/**
 * Color helpers.
 *
 * We generate colors in HSL rather than picking random RGB values. Random RGB
 * gives muddy, unusable results about half the time; constraining saturation and
 * lightness means every swatch that comes out is something you could actually
 * put in a design.
 */

export type Swatch = {
  hex: string
  /** Locked swatches survive a regenerate. */
  locked: boolean
}

/** Convert HSL to a `#rrggbb` string. */
function hslToHex(h: number, s: number, l: number): string {
  // Normalize saturation and lightness to 0-1 for the math below.
  const sat = s / 100
  const light = l / 100

  const chroma = (1 - Math.abs(2 * light - 1)) * sat
  const secondary = chroma * (1 - Math.abs(((h / 60) % 2) - 1))
  const offset = light - chroma / 2

  let [r, g, b] = [0, 0, 0]
  if (h < 60) [r, g, b] = [chroma, secondary, 0]
  else if (h < 120) [r, g, b] = [secondary, chroma, 0]
  else if (h < 180) [r, g, b] = [0, chroma, secondary]
  else if (h < 240) [r, g, b] = [0, secondary, chroma]
  else if (h < 300) [r, g, b] = [secondary, 0, chroma]
  else [r, g, b] = [chroma, 0, secondary]

  const toHex = (value: number) =>
    Math.round((value + offset) * 255)
      .toString(16)
      .padStart(2, '0')

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

/** A single pleasant random color. */
export function randomSwatch(): Swatch {
  const hue = Math.floor(Math.random() * 360)
  const saturation = 55 + Math.floor(Math.random() * 30) // 55-85%
  const lightness = 45 + Math.floor(Math.random() * 25) // 45-70%
  return { hex: hslToHex(hue, saturation, lightness), locked: false }
}

/** A full palette of `count` colors. */
export function randomPalette(count = 5): Swatch[] {
  return Array.from({ length: count }, randomSwatch)
}

/** Re-roll every swatch except the locked ones, which pass through untouched. */
export function regeneratePalette(current: Swatch[]): Swatch[] {
  return current.map((swatch) => (swatch.locked ? swatch : randomSwatch()))
}

/**
 * Pick black or white label text for a given background, so the hex code stays
 * readable on both a pale yellow and a deep navy.
 *
 * Uses the WCAG relative-luminance formula rather than a naive average, because
 * the eye is far more sensitive to green than to blue.
 */
export function readableTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255

  const channel = (c: number) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4

  const luminance =
    0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)

  return luminance > 0.45 ? '#111111' : '#ffffff'
}
