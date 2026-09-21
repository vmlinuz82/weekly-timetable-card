import type { Block } from "./types.js";

export type BlockForm = "range" | "until" | "after" | "bare";

/**
 * The single place the four time forms are derived. There is deliberately no
 * `mode` field on Block: presence of the times is the discriminator, so no
 * second field can contradict the first.
 */
export function blockForm(block: Block): BlockForm {
  const hasStart = Boolean(block.start);
  const hasEnd = Boolean(block.end);
  if (hasStart && hasEnd) return "range";
  if (hasEnd) return "until";
  if (hasStart) return "after";
  return "bare";
}
