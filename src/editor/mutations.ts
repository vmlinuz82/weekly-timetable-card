import { uniqueActivityId } from "../activity.js";
import { addMinutes } from "../time.js";
import type { Activity, Block, CardConfig, DayKey, Person, Slot } from "../types.js";

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

export interface PersonPatch {
  name?: string;
  emoji?: string | null;
  color?: string | null;
  days?: DayKey[] | null;
  slots?: Slot[] | null;
}

const DEFAULT_SLOT_START = "08:00";
const DEFAULT_SLOT_MINUTES = 45;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function replacePerson(config: CardConfig, index: number, next: Person): CardConfig {
  return {
    ...config,
    people: config.people.map((person, i) => (i === index ? next : person)),
  };
}

function blocksOf(person: Person, day: DayKey): Block[] {
  return person.schedule[day] ?? [];
}

function withBlocks(person: Person, day: DayKey, blocks: Block[]): Person {
  return { ...person, schedule: { ...person.schedule, [day]: blocks } };
}

export function updateCard(config: CardConfig, patch: Partial<CardConfig>): CardConfig {
  return { ...config, ...patch };
}

export function addPerson(config: CardConfig, name: string): CardConfig {
  return { ...config, people: [...config.people, { name, schedule: {} }] };
}

export function removePerson(config: CardConfig, index: number): CardConfig {
  if (config.people.length <= 1 || !config.people[index]) return config;
  return { ...config, people: config.people.filter((_, i) => i !== index) };
}

export function updatePerson(
  config: CardConfig,
  index: number,
  patch: PersonPatch,
): CardConfig {
  const person = config.people[index];
  if (!person) return config;

  const next: Person = { ...person, schedule: { ...person.schedule } };

  if (patch.name !== undefined) next.name = patch.name;

  if (patch.emoji !== undefined) {
    if (patch.emoji === null || patch.emoji === "") delete next.emoji;
    else next.emoji = patch.emoji;
  }

  if (patch.color !== undefined) {
    if (patch.color === null || patch.color === "") delete next.color;
    else next.color = patch.color;
  }

  if (patch.slots !== undefined) {
    if (patch.slots === null) delete next.slots;
    else next.slots = patch.slots.map((slot) => ({ ...slot }));
  }

  if (patch.days !== undefined) {
    if (patch.days === null || patch.days.length === 0) delete next.days;
    else next.days = [...patch.days];
    for (const day of next.days ?? config.days) {
      if (!next.schedule[day]) next.schedule[day] = [];
    }
  }

  return replacePerson(config, index, next);
}

export function addBlock(
  config: CardConfig,
  personIndex: number,
  day: DayKey,
  block: Block,
): CardConfig {
  const person = config.people[personIndex];
  if (!person) return config;
  return replacePerson(
    config,
    personIndex,
    withBlocks(person, day, [...blocksOf(person, day), { ...block }]),
  );
}

export function updateBlock(
  config: CardConfig,
  personIndex: number,
  day: DayKey,
  blockIndex: number,
  patch: BlockPatch,
): CardConfig {
  const person = config.people[personIndex];
  const current = person?.schedule[day]?.[blockIndex];
  if (!person || !current) return config;

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

  const blocks = blocksOf(person, day).map((block, i) => (i === blockIndex ? next : block));
  return replacePerson(config, personIndex, withBlocks(person, day, blocks));
}

export function removeBlock(
  config: CardConfig,
  personIndex: number,
  day: DayKey,
  blockIndex: number,
): CardConfig {
  const person = config.people[personIndex];
  if (!person || !person.schedule[day]?.[blockIndex]) return config;
  const blocks = blocksOf(person, day).filter((_, i) => i !== blockIndex);
  return replacePerson(config, personIndex, withBlocks(person, day, blocks));
}

export function moveBlock(
  config: CardConfig,
  personIndex: number,
  from: BlockRef,
  to: BlockRef,
): CardConfig {
  const person = config.people[personIndex];
  if (!person) return config;

  const source = [...blocksOf(person, from.day)];
  const block = source[from.index];
  if (!block) return config;
  source.splice(from.index, 1);

  if (from.day === to.day) {
    source.splice(clamp(to.index, 0, source.length), 0, block);
    return replacePerson(config, personIndex, withBlocks(person, from.day, source));
  }

  const target = [...blocksOf(person, to.day)];
  target.splice(clamp(to.index, 0, target.length), 0, block);
  return replacePerson(config, personIndex, {
    ...person,
    schedule: { ...person.schedule, [from.day]: source, [to.day]: target },
  });
}

export function moveBlockBy(
  config: CardConfig,
  personIndex: number,
  day: DayKey,
  index: number,
  delta: number,
): CardConfig {
  const person = config.people[personIndex];
  if (!person) return config;
  const target = index + delta;
  if (target < 0 || target >= blocksOf(person, day).length) return config;
  return moveBlock(config, personIndex, { day, index }, { day, index: target });
}

export function addActivity(config: CardConfig, label: string, color: string): CardConfig {
  const id = uniqueActivityId(
    label,
    config.activities.map((activity) => activity.id),
  );
  return { ...config, activities: [...config.activities, { id, label, color }] };
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
  for (const person of config.people) {
    for (const blocks of Object.values(person.schedule)) {
      for (const block of blocks ?? []) {
        if (block.activity === id) count += 1;
      }
    }
  }
  return count;
}

export function addSlot(config: CardConfig, personIndex: number): CardConfig {
  const person = config.people[personIndex];
  if (!person) return config;
  const slots = person.slots ?? [];
  const previous = slots[slots.length - 1];
  const start = previous?.end ?? DEFAULT_SLOT_START;
  const number = slots.reduce((max, slot) => Math.max(max, slot.slot), 0) + 1;
  return replacePerson(config, personIndex, {
    ...person,
    slots: [...slots, { slot: number, start, end: addMinutes(start, DEFAULT_SLOT_MINUTES) }],
  });
}

export function updateSlot(
  config: CardConfig,
  personIndex: number,
  slotIndex: number,
  patch: Partial<Slot>,
): CardConfig {
  const person = config.people[personIndex];
  if (!person?.slots?.[slotIndex]) return config;
  return replacePerson(config, personIndex, {
    ...person,
    slots: person.slots.map((slot, i) => (i === slotIndex ? { ...slot, ...patch } : slot)),
  });
}

export function removeSlot(
  config: CardConfig,
  personIndex: number,
  slotIndex: number,
): CardConfig {
  const person = config.people[personIndex];
  if (!person?.slots?.[slotIndex]) return config;
  return replacePerson(config, personIndex, {
    ...person,
    slots: person.slots.filter((_, i) => i !== slotIndex),
  });
}
