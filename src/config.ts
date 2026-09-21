import { isDayKey, normaliseDays } from "./days.js";
import { resolveLang } from "./i18n/index.js";
import { DAY_KEYS } from "./types.js";
import type {
  Activity,
  Block,
  CardConfig,
  DayKey,
  Hass,
  Lang,
  Person,
  Slot,
} from "./types.js";

export const CARD_TYPE = "custom:weekly-timetable-card";
export const DEFAULT_DAYS: readonly DayKey[] = ["mon", "tue", "wed", "thu", "fri"];
export const DEFAULT_HEADER_COLOR = "#1e3a5f";
const FALLBACK_ACTIVITY_COLOR = "#888888";

/**
 * Times are kept as authored. An unparseable string is preserved so it renders
 * verbatim rather than as "Invalid Date"; a number is converted because an
 * unquoted `16:00` in a YAML dashboard is parsed by Home Assistant's YAML 1.1
 * loader as the sexagesimal integer 960.
 */
export function normaliseTimeString(value: unknown): string | undefined {
  if (typeof value === "number" && Number.isFinite(value) && value >= 0) {
    const hours = Math.floor(value / 60);
    const minutes = value % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function normaliseConfig(raw: unknown): CardConfig {
  const source = (raw ?? {}) as Record<string, unknown>;

  if (!Array.isArray(source.people) || source.people.length === 0) {
    throw new Error("weekly-timetable-card: `people` must be a non-empty list");
  }
  if (source.activities !== undefined && !Array.isArray(source.activities)) {
    throw new Error("weekly-timetable-card: `activities` must be a list");
  }

  const days = normaliseDays(source.days, DEFAULT_DAYS);
  const activities = (Array.isArray(source.activities) ? source.activities : [])
    .map(normaliseActivity)
    .filter((activity): activity is Activity => activity !== null);
  const people = source.people.map((person) => normalisePerson(person, days));

  return {
    type: typeof source.type === "string" ? source.type : CARD_TYPE,
    title: typeof source.title === "string" ? source.title : undefined,
    layout: source.layout === "grid" ? "grid" : "blocks",
    days,
    language: source.language === "en" || source.language === "bg" ? source.language : "auto",
    highlight_today: source.highlight_today !== false,
    header_color:
      typeof source.header_color === "string" && source.header_color.trim().length > 0
        ? source.header_color.trim()
        : DEFAULT_HEADER_COLOR,
    activities,
    people,
  };
}

function normaliseActivity(raw: unknown): Activity | null {
  const source = (raw ?? {}) as Record<string, unknown>;
  const id = typeof source.id === "string" ? source.id.trim() : "";
  if (id.length === 0) return null;
  const label = typeof source.label === "string" && source.label.trim().length > 0
    ? source.label.trim()
    : id;
  const color = typeof source.color === "string" && source.color.trim().length > 0
    ? source.color.trim()
    : FALLBACK_ACTIVITY_COLOR;
  return { id, label, color };
}

function normalisePerson(raw: unknown, cardDays: DayKey[]): Person {
  const source = (raw ?? {}) as Record<string, unknown>;
  const ownDays = Array.isArray(source.days)
    ? normaliseDays(source.days, cardDays)
    : undefined;
  const days = ownDays ?? cardDays;

  const rawSchedule = (source.schedule ?? {}) as Record<string, unknown>;
  const schedule: Partial<Record<DayKey, Block[]>> = {};
  // Every effective day gets an array so renderers never branch on undefined,
  // and any other stored day is preserved so narrowing `days` is reversible
  // rather than quietly deleting that day's blocks on the next reload.
  const kept = new Set<DayKey>(days);
  for (const key of Object.keys(rawSchedule)) {
    if (isDayKey(key)) kept.add(key);
  }
  for (const day of DAY_KEYS) {
    if (!kept.has(day)) continue;
    const entry = rawSchedule[day];
    schedule[day] = Array.isArray(entry)
      ? entry.map(normaliseBlock).filter((block): block is Block => block !== null)
      : [];
  }

  const slots = Array.isArray(source.slots)
    ? source.slots
        .map((slot, index) => normaliseSlot(slot, index))
        .filter((slot): slot is Slot => slot !== null)
    : undefined;

  const person: Person = {
    name: typeof source.name === "string" ? source.name : "",
    schedule,
  };
  if (typeof source.emoji === "string" && source.emoji.length > 0) person.emoji = source.emoji;
  if (typeof source.color === "string" && source.color.trim().length > 0) {
    person.color = source.color.trim();
  }
  if (ownDays) person.days = ownDays;
  if (slots) person.slots = slots;
  return person;
}

function normaliseBlock(raw: unknown): Block | null {
  const source = (raw ?? {}) as Record<string, unknown>;
  if (typeof source.activity !== "string" || source.activity.trim().length === 0) {
    return null;
  }
  const block: Block = { activity: source.activity.trim() };
  const start = normaliseTimeString(source.start);
  const end = normaliseTimeString(source.end);
  if (start) block.start = start;
  if (end) block.end = end;
  return block;
}

function normaliseSlot(raw: unknown, index: number): Slot | null {
  const source = (raw ?? {}) as Record<string, unknown>;
  const start = normaliseTimeString(source.start);
  const end = normaliseTimeString(source.end);
  if (!start || !end) return null;
  const slot = typeof source.slot === "number" && Number.isFinite(source.slot)
    ? source.slot
    : index + 1;
  return { slot, start, end };
}

const STUB_ACTIVITIES: Record<Lang, Activity[]> = {
  en: [
    { id: "english", label: "English", color: "#3b82f6" },
    { id: "daycare", label: "After-school club", color: "#64748b" },
    { id: "break", label: "Break and a snack", color: "#94a3b8" },
    { id: "judo", label: "Judo", color: "#f97316" },
    { id: "chess", label: "Chess", color: "#a855f7" },
    { id: "home", label: "Back home", color: "#22c55e" },
  ],
  bg: [
    { id: "english", label: "Английски", color: "#3b82f6" },
    { id: "daycare", label: "Занималня", color: "#64748b" },
    { id: "break", label: "Почивка и хапване", color: "#94a3b8" },
    { id: "judo", label: "Джудо", color: "#f97316" },
    { id: "chess", label: "Шах", color: "#a855f7" },
    { id: "home", label: "Връщане вкъщи", color: "#22c55e" },
  ],
};

const STUB_NAME: Record<Lang, string> = { en: "Alex", bg: "Иван" };

/**
 * `first_weekday` is deliberately not applied here: a Sunday-first rotation of a
 * five-day school week would produce [sun, mon, tue, wed, thu] and drop Friday.
 * It is used instead to order the day toggle chips in the editor.
 */
export function getStubConfig(hass?: Hass): CardConfig {
  const lang = resolveLang({ language: "auto" }, hass);
  const schoolDay = (afternoon: string): Block[] => [
    { activity: "english", start: "15:20", end: "16:20" },
    { activity: "break", start: "16:20", end: "17:30" },
    { activity: afternoon, start: "17:30", end: "18:30" },
    { activity: "home", start: "18:30" },
  ];

  return {
    type: CARD_TYPE,
    title: undefined,
    layout: "blocks",
    days: [...DEFAULT_DAYS],
    language: "auto",
    highlight_today: true,
    header_color: DEFAULT_HEADER_COLOR,
    activities: STUB_ACTIVITIES[lang].map((activity) => ({ ...activity })),
    people: [
      {
        name: STUB_NAME[lang],
        emoji: "🥋",
        color: "#f472b6",
        schedule: {
          mon: schoolDay("judo"),
          tue: [{ activity: "daycare", end: "16:00" }],
          wed: schoolDay("judo"),
          thu: [
            { activity: "daycare", end: "16:00" },
            { activity: "break", start: "16:00", end: "16:30" },
            { activity: "chess", start: "16:30", end: "17:30" },
          ],
          fri: [
            { activity: "daycare", end: "16:00" },
            { activity: "break", start: "16:00", end: "16:30" },
            { activity: "chess", start: "16:30", end: "17:30" },
          ],
        },
      },
    ],
  };
}
