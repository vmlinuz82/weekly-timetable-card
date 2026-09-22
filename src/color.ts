export interface Rgb {
  r: number;
  g: number;
  b: number;
}

const HEX_PATTERN = /^#?(?:([0-9a-f]{3})|([0-9a-f]{6}))$/i;

/** WCAG relative-luminance crossover between white and dark text. */
const CONTRAST_CROSSOVER = 0.179;

const CARD_BACKGROUND = "var(--card-background-color, #ffffff)";

export function parseHexColor(color: string): Rgb | null {
  const match = HEX_PATTERN.exec(color.trim());
  if (!match) return null;
  const hex = match[1]
    ? match[1].split("").map((char) => char + char).join("")
    : match[2]!;
  return {
    r: Number.parseInt(hex.slice(0, 2), 16),
    g: Number.parseInt(hex.slice(2, 4), 16),
    b: Number.parseInt(hex.slice(4, 6), 16),
  };
}

function channelLuminance(value: number): number {
  const srgb = value / 255;
  return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance({ r, g, b }: Rgb): number {
  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
}

/**
 * White is the safe default for an unparseable colour: the shipped default
 * header is dark navy, and a theme variable we cannot read is far more likely
 * to be a brand colour than a pale one.
 */
export function contrastTextColor(background: string): string {
  const rgb = parseHexColor(background);
  if (!rgb) return "#ffffff";
  return relativeLuminance(rgb) > CONTRAST_CROSSOVER ? "#0f172a" : "#ffffff";
}

/**
 * The activity colour is an accent mixed into whatever background the theme
 * provides, so one configuration works in light and dark. The mix has to be
 * strong enough to tell a palette apart: at the original 14% the shipped
 * six-colour palette spanned a maximum difference of 42 out of a possible 294
 * on a dark card, and a low-saturation palette collapsed to 3 — every block the
 * same grey. 35% keeps the worst case above WCAG AA for body text in both
 * themes (5.3:1 for white-on-dark, 6.6:1 for black-on-light).
 */
export function activityFill(color: string): string {
  return `color-mix(in srgb, ${color} 35%, ${CARD_BACKGROUND})`;
}

export function activityBorder(color: string): string {
  return `color-mix(in srgb, ${color} 60%, ${CARD_BACKGROUND})`;
}

export function toHexInputValue(color: string, fallback: string): string {
  const rgb = parseHexColor(color);
  if (!rgb) return fallback;
  const channel = (value: number) => value.toString(16).padStart(2, "0");
  return `#${channel(rgb.r)}${channel(rgb.g)}${channel(rgb.b)}`;
}
