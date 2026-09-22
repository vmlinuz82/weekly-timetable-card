import { uniqueActivityId } from "../activity.js";
import { addMinutes } from "../time.js";
import type { Activity, Block, CardConfig, DayKey, Slot } from "../types.js";

export interface BlockRef {
  day: DayKey;
  index: number;
}

/**
 * `null` (or "") means "delete this key". Partial<Block> cannot express that:
 * after a spread, `{ start: undefined }` and `{}` are indistinguishable, and
 * clearing a time is exactly how an author produces the `until` / `after` forms.
 */
export interface BlockPatch {
  activity?: string;
  start?: string | null;
  end?: string | null;
}

const DEFAULT_SLOT_START = "08:00";
const DEFAULT_SLOT_MINUTES = 45;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function blocksOf(config: CardConfig, day: DayKey): Block[] {
  return config.schedule[day] ?? [];
}

function withBlocks(config: CardConfig, day: DayKey, blocks: Block[]): CardConfig {
  return { ...config, schedule: { ...config.schedule, [day]: blocks } };
}

export function updateCard(config: CardConfig, patch: Partial<CardConfig>): CardConfig {
  return { ...config, ...patch };
}

export function addBlock(config: CardConfig, day: DayKey, block: Block): CardConfig {
  return withBlocks(config, day, [...blocksOf(config, day), { ...block }]);
}

export function updateBlock(
  config: CardConfig,
  day: DayKey,
  blockIndex: number,
  patch: BlockPatch,
): CardConfig {
  const current = config.schedule[day]?.[blockIndex];
  if (!current) return config;

  const next: Block = { ...current };
  if (patch.activity !== undefined) next.activity = patch.activity;

  if (patch.start !== undefined) {
    if (patch.start === null || patch.start === "") delete next.start;
    else next.start = patch.start;
  }

  if (patch.end !== undefined) {
    if (patch.end === null || patch.end === "") delete next.end;
    else next.end = patch.end;
  }

  const blocks = blocksOf(config, day).map((block, i) => (i === blockIndex ? next : block));
  return withBlocks(config, day, blocks);
}

export function removeBlock(config: CardConfig, day: DayKey, blockIndex: number): CardConfig {
  if (!config.schedule[day]?.[blockIndex]) return config;
  const blocks = blocksOf(config, day).filter((_, i) => i !== blockIndex);
  return withBlocks(config, day, blocks);
}

export function moveBlock(config: CardConfig, from: BlockRef, to: BlockRef): CardConfig {
  const source = [...blocksOf(config, from.day)];
  const block = source[from.index];
  if (!block) return config;
  source.splice(from.index, 1);

  if (from.day === to.day) {
    source.splice(clamp(to.index, 0, source.length), 0, block);
    return withBlocks(config, from.day, source);
  }

  const target = [...blocksOf(config, to.day)];
  target.splice(clamp(to.index, 0, target.length), 0, block);
  return {
    ...config,
    schedule: { ...config.schedule, [from.day]: source, [to.day]: target },
  };
}

export function moveBlockBy(
  config: CardConfig,
  day: DayKey,
  index: number,
  delta: number,
): CardConfig {
  const target = index + delta;
  if (target < 0 || target >= blocksOf(config, day).length) return config;
  return moveBlock(config, { day, index }, { day, index: target });
}

export function addActivity(config: CardConfig, title: string, color: string): CardConfig {
  const id = uniqueActivityId(
    title,
    config.activities.map((activity) => activity.id),
  );
  return { ...config, activities: [...config.activities, { id, title, color }] };
}

/** `id` is intentionally not patchable — see "Activity ids" in the spec. */
export function updateActivity(
  config: CardConfig,
  index: number,
  patch: Partial<Omit<Activity, "id">>,
): CardConfig {
  if (!config.activities[index]) return config;
  return {
    ...config,
    activities: config.activities.map((activity, i) =>
      i === index ? { ...activity, ...patch } : activity,
    ),
  };
}

export function removeActivity(config: CardConfig, index: number): CardConfig {
  if (!config.activities[index]) return config;
  return { ...config, activities: config.activities.filter((_, i) => i !== index) };
}

export function countActivityUses(config: CardConfig, id: string): number {
  let count = 0;
  for (const blocks of Object.values(config.schedule)) {
    for (const block of blocks ?? []) {
      if (block.activity === id) count += 1;
    }
  }
  return count;
}

export function addSlot(config: CardConfig): CardConfig {
  const slots = config.slots ?? [];
  const previous = slots[slots.length - 1];
  const start = previous?.end ?? DEFAULT_SLOT_START;
  const number = slots.reduce((max, slot) => Math.max(max, slot.slot), 0) + 1;
  return {
    ...config,
    slots: [...slots, { slot: number, start, end: addMinutes(start, DEFAULT_SLOT_MINUTES) }],
  };
}

export function updateSlot(
  config: CardConfig,
  slotIndex: number,
  patch: Partial<Slot>,
): CardConfig {
  if (!config.slots?.[slotIndex]) return config;
  return {
    ...config,
    slots: config.slots.map((slot, i) => (i === slotIndex ? { ...slot, ...patch } : slot)),
  };
}

export function removeSlot(config: CardConfig, slotIndex: number): CardConfig {
  if (!config.slots?.[slotIndex]) return config;
  return { ...config, slots: config.slots.filter((_, i) => i !== slotIndex) };
}
