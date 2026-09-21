import { blockForm } from "./block.js";
import type { Block, Slot } from "./types.js";

export interface GridPlacement {
  bySlot: Map<number, Block[]>;
  loose: Block[];
}

/**
 * Only an exact range match lands on the ruler. Everything else — the three
 * open-ended forms, and a range that matches no slot — goes to the strip, so a
 * block is never silently dropped from the grid.
 */
export function gridPlacement(
  slots: readonly Slot[],
  blocks: readonly Block[],
): GridPlacement {
  const bySlot = new Map<number, Block[]>();
  const loose: Block[] = [];

  for (const block of blocks) {
    const slot =
      blockForm(block) === "range"
        ? slots.find((candidate) => candidate.start === block.start && candidate.end === block.end)
        : undefined;
    if (!slot) {
      loose.push(block);
      continue;
    }
    const existing = bySlot.get(slot.slot);
    if (existing) existing.push(block);
    else bySlot.set(slot.slot, [block]);
  }

  return { bySlot, loose };
}
