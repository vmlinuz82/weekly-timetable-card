# Weekly Timetable Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Home Assistant Lovelace custom card that renders a weekly timetable for one or more people, in English or Bulgarian, in a free-form block layout or a classic slot grid, configured entirely through a visual editor.

**Architecture:** A single Lit `LitElement` card plus a Lit editor element, both bundled by esbuild into one `dist/weekly-timetable-card.js`. All schedule data lives in the card's Lovelace config; the editor produces new config objects and fires `config-changed`. Rendering is split into three pure renderer modules (`blocks`, `grid`, `stacked`) selected by layout and by a measured density; every non-visual decision (block time form, config normalisation, time formatting, colour derivation, language resolution, grid placement, config mutations) is a pure function in its own module, unit-tested before its consumer exists.

**Tech Stack:** TypeScript 5, Lit 3, esbuild, Vitest with jsdom. No Home Assistant instance in the development loop — a standalone `dev/` harness renders the card against a mock `hass`.

**Spec:** `docs/superpowers/specs/2026-09-21-weekly-timetable-card-design.md`

## Global Constraints

- Element name, repository name and bundle filename must all be `weekly-timetable-card`. HACS resolves the served file from the repository name; a mismatch installs cleanly then 404s its own JavaScript.
- Card config type string is `custom:weekly-timetable-card`. Never `custom:timetable-card` — that is the upstream card, and `customElements.define` throws on a duplicate element name.
- Supported languages in v1: exactly `en` and `bg`. Both string tables are declared `const x: Strings`, so a missing key is a compile error.
- UI chrome is translated; user content (activity labels, person names) is never translated.
- Default `days` is `["mon","tue","wed","thu","fri"]`. Default `layout` is `"blocks"`. Default `language` is `"auto"`. Default `highlight_today` is `true`. Default `header_color` is `"#1e3a5f"`.
- Density thresholds, in CSS pixels of card width per day column: `>= 110` → `full`, `>= 72` → `compact`, below → `stacked`.
- Activity colour derivation: fill is `color-mix(in srgb, <color> 14%, var(--card-background-color))`, border is the same at `35%`.
- Header text contrast crossover: relative luminance `> 0.179` → `#0f172a`, otherwise `#ffffff`.
- A person's `days`, when present, **replaces** the card-level list; it never intersects with it.
- Activity ids are generated once at creation and never regenerated from labels.
- Every editor mutation returns a **new** config object. Mutating and firing makes HA compare references, see no change, and discard the edit.
- The Vitest environment is **jsdom, not happy-dom**. happy-dom mangles Lit's
  marker nodes: an expression at a template's top-level root, or a nested
  `${...map()}` inside a sub-template, renders as `<?>` or vanishes, so tests
  silently see a DOM the browser would never produce. jsdom renders all of these
  correctly. Do not switch the environment back, and do not restructure production
  markup to appease a test environment.
- Never assert on a serialised `style` attribute string when the value was set by
  Lit's `styleMap`. It writes custom properties with no space after the colon
  (`--wtc-day-count:5;`), so an assertion like `toContain("--wtc-day-count: 5")`
  can never pass. Assert the value instead:
  `el.style.getPropertyValue("--wtc-day-count")` — verified working under jsdom.
- `tsc --noEmit` and `vitest run` must both pass before every commit.
- Commit messages: short title only, no body, no trailing attribution lines.

## File Structure

| File | Responsibility |
|---|---|
| `src/types.ts` | All config and Home Assistant shapes; `DAY_KEYS`. No logic. |
| `src/days.ts` | Day key guards, day list normalisation, effective days, today, first-weekday ordering. |
| `src/block.ts` | `blockForm` — the single place the four time forms are derived. |
| `src/activity.ts` | Activity id generation and lookup. |
| `src/config.ts` | `normaliseConfig`, defaults, `getStubConfig`. The only place raw config is trusted. |
| `src/time.ts` | `"HH:MM"` parsing and formatting against `hass.locale.time_format`. |
| `src/color.ts` | Fill and border derivation, hex parsing, contrast text choice. |
| `src/density.ts` | `densityFor(width, dayCount)`. |
| `src/grid-placement.ts` | Splits a day's blocks into slot-placed and loose. No Lit import. |
| `src/i18n/types.ts` | `Strings` and `EditorStrings` interfaces. |
| `src/i18n/en.ts`, `src/i18n/bg.ts` | The two string tables. |
| `src/i18n/index.ts` | `resolveLang`, `stringsFor`. |
| `src/renderers/context.ts` | `RenderContext` — everything a renderer needs, assembled once per render. |
| `src/renderers/block.ts` | `blockTimeLabel` and the single block template, shared by all three layouts. |
| `src/renderers/blocks.ts` | Day-column layout. |
| `src/renderers/grid.ts` | Slot ruler, grid cells, open-ended strip. |
| `src/styles.ts` | All card CSS as Lit `css` tagged templates. |
| `src/card.ts` | The card element: config, hass, density observer, tabs, layout dispatch, registration. |
| `src/editor/fire-event.ts` | `fireEvent` helper. |
| `src/editor/panel-context.ts` | `PanelContext` — config, strings, hass and the commit callback the panels share. |
| `src/editor/mutations.ts` | Every config mutation as a pure function. |
| `src/editor/editor.ts` | Editor element: tab state, panel dispatch, `config-changed`. |
| `src/editor/settings-panel.ts` | Card-level options. |
| `src/editor/activities-panel.ts` | Activity palette CRUD. |
| `src/editor/person-panel.ts` | Person fields, slot ruler, per-day block list editor. |
| `src/editor/dnd.ts` | Pointer-driven drag and tap-to-place. Holds no schedule logic. |
| `dev/index.html`, `dev/mock-hass.js` | Standalone harness with language, clock, theme and width controls. |
| `test/*.test.ts` | One test file per source module under test. |

`src/block.ts`, `src/activity.ts`, `src/density.ts`, `src/grid-placement.ts`, `src/renderers/context.ts`, `src/renderers/block.ts` and `src/editor/fire-event.ts` are additions to the tree sketched in the spec. Each exists so a pure function can be tested without importing Lit or constructing an element.

The spec's `src/renderers/stacked.ts` is deliberately **not** built. The stacked
layout it describes — each day a section with its blocks beneath — is byte-for-byte
what `renderBlocks` already produces; the only difference is a single CSS rule
(`grid-template-columns: 1fr`) keyed off `data-density="stacked"`. A separate
module would have been a copy of `blocks.ts` free to drift from it. The card
dispatches stacked density to `renderBlocks` for both layouts.

---

### Task 1: Project scaffold and toolchain

**Files:**
- Create: `package.json`, `tsconfig.json`, `vitest.config.ts`, `esbuild.config.mjs`, `.gitignore`
- Create: `src/version.ts`
- Test: `test/version.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `CARD_VERSION: string` from `src/version.ts`; working `npm test`, `npm run typecheck`, `npm run build`, `npm run watch`.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "weekly-timetable-card",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "description": "Weekly timetable card for Home Assistant, in English and Bulgarian",
  "license": "MIT",
  "scripts": {
    "build": "node esbuild.config.mjs",
    "watch": "node esbuild.config.mjs --watch",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "lit": "^3.2.0"
  },
  "devDependencies": {
    "esbuild": "^0.24.0",
    "jsdom": "^25.0.0",
    "typescript": "^5.6.0",
    "vitest": "^2.1.0"
  }
}
```

- [ ] **Step 2: Create `tsconfig.json`**

`useDefineForClassFields: false` together with `experimentalDecorators: true` is the configuration Lit 3 requires for TypeScript decorators; with the defaults, `@property` fields are shadowed by class field initialisers and reactivity silently stops working.

```json
{
  "compilerOptions": {
    "target": "ES2021",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2021", "DOM", "DOM.Iterable"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "exactOptionalPropertyTypes": false,
    "useDefineForClassFields": false,
    "experimentalDecorators": true,
    "skipLibCheck": true,
    "noEmit": true,
    "types": ["vitest/globals"]
  },
  "include": ["src", "test", "dev"]
}
```

- [ ] **Step 3: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    include: ["test/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: Create `esbuild.config.mjs`**

```js
import { build, context } from "esbuild";

const options = {
  entryPoints: ["src/card.ts"],
  bundle: true,
  format: "esm",
  target: "es2021",
  outfile: "dist/weekly-timetable-card.js",
  legalComments: "inline",
  logLevel: "info",
};

if (process.argv.includes("--watch")) {
  const ctx = await context({ ...options, minify: false, sourcemap: "inline" });
  await ctx.watch();
  const server = await ctx.serve({ servedir: ".", port: 8234 });
  const host = server.host === "0.0.0.0" ? "localhost" : server.host;
  console.log(`dev harness: http://${host}:${server.port}/dev/`);
} else {
  await build({ ...options, minify: true });
}
```

- [ ] **Step 5: Create `.gitignore`**

`dist/` is deliberately **not** ignored — it is committed so HACS can install from the default branch.

```gitignore
node_modules/
*.log
.DS_Store
```

- [ ] **Step 6: Install dependencies**

Run: `npm install`
Expected: `node_modules/` created, no errors. A lockfile `package-lock.json` appears and is committed.

- [ ] **Step 7: Write the failing test**

Create `test/version.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { CARD_VERSION } from "../src/version.js";

describe("CARD_VERSION", () => {
  it("is a semver string", () => {
    expect(CARD_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
```

- [ ] **Step 8: Run test to verify it fails**

Run: `npx vitest run test/version.test.ts`
Expected: FAIL — cannot resolve `../src/version.js`.

- [ ] **Step 9: Write minimal implementation**

Create `src/version.ts`:

```ts
export const CARD_VERSION = "0.1.0";
```

- [ ] **Step 10: Run test to verify it passes**

Run: `npx vitest run test/version.test.ts`
Expected: PASS, 1 test.

- [ ] **Step 11: Verify the build runs**

`src/card.ts` does not exist yet, so point esbuild at the one module that does, purely to prove the toolchain works:

Run: `npx esbuild src/version.ts --bundle --format=esm --outfile=/tmp/scaffold-check.js && echo BUILD_OK`
Expected: `BUILD_OK`.

- [ ] **Step 12: Commit**

```bash
git add package.json package-lock.json tsconfig.json vitest.config.ts esbuild.config.mjs .gitignore src/version.ts test/version.test.ts
git commit -m "Add TypeScript, Lit, esbuild and Vitest scaffold"
```

---

### Task 2: Types and day utilities

**Files:**
- Create: `src/types.ts`, `src/days.ts`
- Test: `test/days.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `DAY_KEYS: readonly ["mon","tue","wed","thu","fri","sat","sun"]`
  - `type DayKey`, `Lang`, `Layout`, `Density`
  - `interface Activity { id: string; label: string; color: string }`
  - `interface Block { activity: string; start?: string; end?: string }`
  - `interface Slot { slot: number; start: string; end: string }`
  - `interface Person { name: string; emoji?: string; color?: string; days?: DayKey[]; slots?: Slot[]; schedule: Partial<Record<DayKey, Block[]>> }`
  - `interface CardConfig { type: string; title?: string; layout: Layout; days: DayKey[]; language: "auto" | Lang; highlight_today: boolean; header_color: string; activities: Activity[]; people: Person[] }`
  - `interface Hass { language?: string; locale?: HassLocale; themes?: unknown }`
  - `isDayKey(v: unknown): v is DayKey`
  - `normaliseDays(v: unknown, fallback: DayKey[]): DayKey[]`
  - `effectiveDays(config: Pick<CardConfig,"days">, person: Pick<Person,"days">): DayKey[]`
  - `todayKey(now?: Date): DayKey`
  - `daysFromFirstWeekday(hass?: Hass): DayKey[]`

- [ ] **Step 1: Create `src/types.ts`**

```ts
export const DAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

export type DayKey = (typeof DAY_KEYS)[number];
export type Lang = "en" | "bg";
export type Layout = "blocks" | "grid";
export type Density = "full" | "compact" | "stacked";

export interface Activity {
  id: string;
  label: string;
  color: string;
}

export interface Block {
  activity: string;
  start?: string;
  end?: string;
}

export interface Slot {
  slot: number;
  start: string;
  end: string;
}

export interface Person {
  name: string;
  emoji?: string;
  color?: string;
  days?: DayKey[];
  slots?: Slot[];
  schedule: Partial<Record<DayKey, Block[]>>;
}

export interface CardConfig {
  type: string;
  title?: string;
  layout: Layout;
  days: DayKey[];
  language: "auto" | Lang;
  highlight_today: boolean;
  header_color: string;
  activities: Activity[];
  people: Person[];
}

export type TimeFormatSetting = "12" | "24" | "language" | "system";

export type FirstWeekdaySetting =
  | "language"
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface HassLocale {
  language?: string;
  time_format?: TimeFormatSetting;
  first_weekday?: FirstWeekdaySetting;
}

export interface Hass {
  language?: string;
  locale?: HassLocale;
  themes?: unknown;
}
```

- [ ] **Step 2: Write the failing test**

Create `test/days.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  daysFromFirstWeekday,
  effectiveDays,
  isDayKey,
  normaliseDays,
  todayKey,
} from "../src/days.js";
import type { DayKey } from "../src/types.js";

const WEEKDAYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri"];

describe("isDayKey", () => {
  it("accepts the seven keys and rejects anything else", () => {
    expect(isDayKey("mon")).toBe(true);
    expect(isDayKey("sun")).toBe(true);
    expect(isDayKey("Mo")).toBe(false);
    expect(isDayKey(3)).toBe(false);
    expect(isDayKey(undefined)).toBe(false);
  });
});

describe("normaliseDays", () => {
  it("falls back when the value is not an array", () => {
    expect(normaliseDays(undefined, WEEKDAYS)).toEqual(WEEKDAYS);
    expect(normaliseDays("mon", WEEKDAYS)).toEqual(WEEKDAYS);
  });

  it("drops unknown keys and preserves the author's order", () => {
    expect(normaliseDays(["fri", "nope", "mon"], WEEKDAYS)).toEqual(["fri", "mon"]);
  });

  it("de-duplicates while keeping the first occurrence", () => {
    expect(normaliseDays(["mon", "tue", "mon"], WEEKDAYS)).toEqual(["mon", "tue"]);
  });

  it("falls back when every entry is invalid", () => {
    expect(normaliseDays(["nope", 7], WEEKDAYS)).toEqual(WEEKDAYS);
  });

  it("returns a copy, not the fallback array itself", () => {
    const out = normaliseDays(undefined, WEEKDAYS);
    expect(out).not.toBe(WEEKDAYS);
  });
});

describe("effectiveDays", () => {
  it("uses the card days when the person has none", () => {
    expect(effectiveDays({ days: WEEKDAYS }, {})).toEqual(WEEKDAYS);
  });

  it("replaces rather than intersects, so a person may add a day the card omits", () => {
    expect(effectiveDays({ days: WEEKDAYS }, { days: ["sat"] })).toEqual(["sat"]);
  });

  it("ignores an empty person list", () => {
    expect(effectiveDays({ days: WEEKDAYS }, { days: [] })).toEqual(WEEKDAYS);
  });
});

describe("todayKey", () => {
  it("maps Sunday to sun and Monday to mon", () => {
    expect(todayKey(new Date(2026, 8, 20, 12, 0))).toBe("sun");
    expect(todayKey(new Date(2026, 8, 21, 12, 0))).toBe("mon");
    expect(todayKey(new Date(2026, 8, 26, 12, 0))).toBe("sat");
  });
});

describe("daysFromFirstWeekday", () => {
  it("defaults to a Monday-first week", () => {
    expect(daysFromFirstWeekday()).toEqual([
      "mon", "tue", "wed", "thu", "fri", "sat", "sun",
    ]);
  });

  it("rotates to an explicit first weekday", () => {
    expect(daysFromFirstWeekday({ locale: { first_weekday: "sunday" } })).toEqual([
      "sun", "mon", "tue", "wed", "thu", "fri", "sat",
    ]);
  });

  it("treats 'language' as Sunday-first only for US English", () => {
    expect(daysFromFirstWeekday({ language: "en-US", locale: { first_weekday: "language" } })[0]).toBe("sun");
    expect(daysFromFirstWeekday({ language: "bg", locale: { first_weekday: "language" } })[0]).toBe("mon");
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run test/days.test.ts`
Expected: FAIL — cannot resolve `../src/days.js`.

- [ ] **Step 4: Write minimal implementation**

Create `src/days.ts`:

```ts
import { DAY_KEYS } from "./types.js";
import type { CardConfig, DayKey, FirstWeekdaySetting, Hass, Person } from "./types.js";

export function isDayKey(value: unknown): value is DayKey {
  return typeof value === "string" && (DAY_KEYS as readonly string[]).includes(value);
}

export function normaliseDays(value: unknown, fallback: DayKey[]): DayKey[] {
  if (!Array.isArray(value)) return [...fallback];
  const out: DayKey[] = [];
  for (const entry of value) {
    if (isDayKey(entry) && !out.includes(entry)) out.push(entry);
  }
  return out.length > 0 ? out : [...fallback];
}

export function effectiveDays(
  config: Pick<CardConfig, "days">,
  person: Pick<Person, "days">,
): DayKey[] {
  return person.days && person.days.length > 0 ? person.days : config.days;
}

export function todayKey(now: Date = new Date()): DayKey {
  // Date#getDay is 0 for Sunday; DAY_KEYS starts at Monday.
  return DAY_KEYS[(now.getDay() + 6) % 7]!;
}

const FIRST_WEEKDAY_INDEX: Record<Exclude<FirstWeekdaySetting, "language">, number> = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
};

export function daysFromFirstWeekday(hass?: Hass): DayKey[] {
  const setting = hass?.locale?.first_weekday;
  let offset = 0;
  if (setting && setting !== "language") {
    offset = FIRST_WEEKDAY_INDEX[setting];
  } else if (setting === "language") {
    offset = usesSundayFirst(hass?.language) ? 6 : 0;
  }
  return DAY_KEYS.map((_, i) => DAY_KEYS[(i + offset) % 7]!);
}

function usesSundayFirst(language?: string): boolean {
  if (!language) return false;
  const tag = language.toLowerCase();
  return tag === "en-us" || tag.startsWith("en-us");
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run test/days.test.ts`
Expected: PASS with 0 failures, and the run reports this file (not "No test files found").

- [ ] **Step 6: Typecheck**

Run: `npm run typecheck`
Expected: no output, exit 0.

- [ ] **Step 7: Commit**

```bash
git add src/types.ts src/days.ts test/days.test.ts
git commit -m "Add config types and day utilities"
```

---

### Task 3: Block time forms and activity ids

**Files:**
- Create: `src/block.ts`, `src/activity.ts`
- Test: `test/block.test.ts`, `test/activity.test.ts`

**Interfaces:**
- Consumes: `Block`, `Activity` from `src/types.ts`.
- Produces:
  - `type BlockForm = "range" | "until" | "after" | "bare"`
  - `blockForm(block: Block): BlockForm`
  - `slugifyActivityId(label: string): string`
  - `uniqueActivityId(label: string, existing: readonly string[]): string`
  - `findActivity(activities: readonly Activity[], id: string): Activity | undefined`

- [ ] **Step 1: Write the failing test for block forms**

Create `test/block.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { blockForm } from "../src/block.js";

describe("blockForm", () => {
  it("is a range when both times are present", () => {
    expect(blockForm({ activity: "english", start: "15:20", end: "16:20" })).toBe("range");
  });

  it("is until when only the end is present", () => {
    expect(blockForm({ activity: "daycare", end: "16:00" })).toBe("until");
  });

  it("is after when only the start is present", () => {
    expect(blockForm({ activity: "home", start: "18:30" })).toBe("after");
  });

  it("is bare when neither time is present", () => {
    expect(blockForm({ activity: "free" })).toBe("bare");
  });

  it("treats an empty string as absent", () => {
    expect(blockForm({ activity: "free", start: "", end: "" })).toBe("bare");
    expect(blockForm({ activity: "daycare", start: "", end: "16:00" })).toBe("until");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/block.test.ts`
Expected: FAIL — cannot resolve `../src/block.js`.

- [ ] **Step 3: Write minimal implementation**

Create `src/block.ts`:

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/block.test.ts`
Expected: PASS with 0 failures, and the run reports this file (not "No test files found").

- [ ] **Step 5: Write the failing test for activity ids**

Create `test/activity.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { findActivity, slugifyActivityId, uniqueActivityId } from "../src/activity.js";
import type { Activity } from "../src/types.js";

describe("slugifyActivityId", () => {
  it("slugs Latin labels", () => {
    expect(slugifyActivityId("Chess Club")).toBe("chess-club");
  });

  it("keeps Cyrillic letters instead of stripping them to nothing", () => {
    expect(slugifyActivityId("Английски")).toBe("английски");
    expect(slugifyActivityId("Почивка и хапване")).toBe("почивка-и-хапване");
  });

  it("collapses runs of separators and trims the ends", () => {
    expect(slugifyActivityId("  Judo // Training!  ")).toBe("judo-training");
  });

  it("returns an empty string when nothing survives", () => {
    expect(slugifyActivityId("!!!")).toBe("");
  });
});

describe("uniqueActivityId", () => {
  it("uses the slug when it is free", () => {
    expect(uniqueActivityId("Шах", [])).toBe("шах");
  });

  it("suffixes on collision", () => {
    expect(uniqueActivityId("Шах", ["шах"])).toBe("шах-2");
    expect(uniqueActivityId("Шах", ["шах", "шах-2"])).toBe("шах-3");
  });

  it("falls back to a generic base when the label slugs to nothing", () => {
    expect(uniqueActivityId("!!!", [])).toBe("activity");
    expect(uniqueActivityId("!!!", ["activity"])).toBe("activity-2");
  });
});

describe("findActivity", () => {
  const activities: Activity[] = [
    { id: "english", label: "Английски", color: "#3b82f6" },
    { id: "judo", label: "Джудо", color: "#f97316" },
  ];

  it("finds by id", () => {
    expect(findActivity(activities, "judo")?.label).toBe("Джудо");
  });

  it("returns undefined for an orphaned reference", () => {
    expect(findActivity(activities, "gone")).toBeUndefined();
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run test/activity.test.ts`
Expected: FAIL — cannot resolve `../src/activity.js`.

- [ ] **Step 7: Write minimal implementation**

Create `src/activity.ts`:

```ts
import type { Activity } from "./types.js";

const SEPARATORS = /[^\p{L}\p{N}]+/gu;
const EDGE_HYPHENS = /^-+|-+$/g;

/**
 * Unicode-aware: an ASCII-only slug of "Английски" is the empty string, which
 * would collide for every Bulgarian activity.
 */
export function slugifyActivityId(label: string): string {
  return label.toLowerCase().replace(SEPARATORS, "-").replace(EDGE_HYPHENS, "");
}

/**
 * Called once, when an activity is created. Ids are never regenerated from
 * labels afterwards: doing so would orphan every block referencing an activity
 * the moment it was renamed.
 */
export function uniqueActivityId(label: string, existing: readonly string[]): string {
  const base = slugifyActivityId(label) || "activity";
  if (!existing.includes(base)) return base;
  let n = 2;
  while (existing.includes(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

export function findActivity(
  activities: readonly Activity[],
  id: string,
): Activity | undefined {
  return activities.find((activity) => activity.id === id);
}
```

- [ ] **Step 8: Run tests to verify they pass**

Run: `npx vitest run test/block.test.ts test/activity.test.ts`
Expected: PASS with 0 failures, and the run reports this file (not "No test files found").

- [ ] **Step 9: Typecheck**

Run: `npm run typecheck`
Expected: no output, exit 0.

- [ ] **Step 10: Commit**

```bash
git add src/block.ts src/activity.ts test/block.test.ts test/activity.test.ts
git commit -m "Add block time form derivation and activity id generation"
```

---

### Task 4: Internationalisation tables and resolution

This comes before config normalisation because `getStubConfig` needs example labels in the resolved language.

**Files:**
- Create: `src/i18n/types.ts`, `src/i18n/en.ts`, `src/i18n/bg.ts`, `src/i18n/index.ts`
- Test: `test/i18n.test.ts`

**Interfaces:**
- Consumes: `DayKey`, `Lang`, `Hass`, `CardConfig` from `src/types.ts`.
- Produces:
  - `interface DayNames { full: string; short: string }`
  - `interface EditorStrings` — exact keys as written in Step 1
  - `interface Strings { days: Record<DayKey, DayNames>; until(t: string): string; after(t: string): string; range(s: string, e: string): string; today: string; editor: EditorStrings }`
  - `en: Strings`, `bg: Strings`
  - `resolveLang(config: Pick<CardConfig,"language">, hass?: Hass): Lang`
  - `stringsFor(lang: Lang): Strings`

- [ ] **Step 1: Create `src/i18n/types.ts`**

```ts
import type { DayKey } from "../types.js";

export interface DayNames {
  full: string;
  short: string;
}

export interface EditorStrings {
  tabSettings: string;
  tabActivities: string;
  addPerson: string;
  removePerson: string;
  personNamePlaceholder: string;

  title: string;
  layout: string;
  layoutBlocks: string;
  layoutGrid: string;
  days: string;
  language: string;
  languageAuto: string;
  languageEnglish: string;
  languageBulgarian: string;
  highlightToday: string;
  headerColor: string;

  name: string;
  emoji: string;
  color: string;
  daysOverride: string;
  daysOverrideHint: string;
  slots: string;
  addSlot: string;
  slotColumn: string;

  addBlock: string;
  activity: string;
  start: string;
  end: string;
  slot: string;
  slotNone: string;
  moveUp: string;
  moveDown: string;
  remove: string;
  dragHint: string;

  label: string;
  addActivity: string;
  activityInUse: (label: string, count: number) => string;
  confirmRemoveActivity: string;

  noSlots: string;
  noBlocks: string;
  orphanActivity: string;
}

export interface Strings {
  days: Record<DayKey, DayNames>;
  until: (time: string) => string;
  after: (time: string) => string;
  range: (start: string, end: string) => string;
  today: string;
  editor: EditorStrings;
}
```

- [ ] **Step 2: Create `src/i18n/en.ts`**

```ts
import type { Strings } from "./types.js";

export const en: Strings = {
  days: {
    mon: { full: "Monday", short: "Mon" },
    tue: { full: "Tuesday", short: "Tue" },
    wed: { full: "Wednesday", short: "Wed" },
    thu: { full: "Thursday", short: "Thu" },
    fri: { full: "Friday", short: "Fri" },
    sat: { full: "Saturday", short: "Sat" },
    sun: { full: "Sunday", short: "Sun" },
  },
  until: (time) => `until ${time}`,
  after: (time) => `after ${time}`,
  range: (start, end) => `${start}–${end}`,
  today: "Today",
  editor: {
    tabSettings: "Settings",
    tabActivities: "Activities",
    addPerson: "Add person",
    removePerson: "Remove person",
    personNamePlaceholder: "New person",

    title: "Title",
    layout: "Layout",
    layoutBlocks: "Blocks",
    layoutGrid: "Grid",
    days: "Days",
    language: "Language",
    languageAuto: "Automatic",
    languageEnglish: "English",
    languageBulgarian: "Bulgarian",
    highlightToday: "Highlight today",
    headerColor: "Header colour",

    name: "Name",
    emoji: "Emoji",
    color: "Colour",
    daysOverride: "Days for this person",
    daysOverrideHint: "Leave empty to use the card's days",
    slots: "Time slots",
    addSlot: "Add slot",
    slotColumn: "Slot",

    addBlock: "Add block",
    activity: "Activity",
    start: "Start",
    end: "End",
    slot: "Slot",
    slotNone: "Not on the grid",
    moveUp: "Move up",
    moveDown: "Move down",
    remove: "Remove",
    dragHint: "Drag an activity onto a day, or tap it and then tap a day",

    label: "Label",
    addActivity: "Add activity",
    activityInUse: (label, count) =>
      `“${label}” is used by ${count} block${count === 1 ? "" : "s"}.`,
    confirmRemoveActivity: "Remove it anyway?",

    noSlots: "Add time slots to use the grid layout.",
    noBlocks: "Nothing scheduled",
    orphanActivity: "Unknown activity",
  },
};
```

- [ ] **Step 3: Create `src/i18n/bg.ts`**

The short day names are authored, not derived: `неделя` → `нд` and `четвъртък` → `чт` are two letters, so a three-character truncation produces wrong Bulgarian.

```ts
import type { Strings } from "./types.js";

export const bg: Strings = {
  days: {
    mon: { full: "понеделник", short: "пн" },
    tue: { full: "вторник", short: "вт" },
    wed: { full: "сряда", short: "ср" },
    thu: { full: "четвъртък", short: "чт" },
    fri: { full: "петък", short: "пт" },
    sat: { full: "събота", short: "сб" },
    sun: { full: "неделя", short: "нд" },
  },
  until: (time) => `до ${time}`,
  after: (time) => `след ${time}`,
  range: (start, end) => `${start}–${end}`,
  today: "Днес",
  editor: {
    tabSettings: "Настройки",
    tabActivities: "Дейности",
    addPerson: "Добави човек",
    removePerson: "Премахни човек",
    personNamePlaceholder: "Нов човек",

    title: "Заглавие",
    layout: "Изглед",
    layoutBlocks: "Блокове",
    layoutGrid: "Мрежа",
    days: "Дни",
    language: "Език",
    languageAuto: "Автоматично",
    languageEnglish: "Английски",
    languageBulgarian: "Български",
    highlightToday: "Отбелязвай днешния ден",
    headerColor: "Цвят на заглавката",

    name: "Име",
    emoji: "Емоджи",
    color: "Цвят",
    daysOverride: "Дни за този човек",
    daysOverrideHint: "Оставете празно, за да се използват дните на картата",
    slots: "Часови интервали",
    addSlot: "Добави интервал",
    slotColumn: "Интервал",

    addBlock: "Добави блок",
    activity: "Дейност",
    start: "Начало",
    end: "Край",
    slot: "Интервал",
    slotNone: "Извън мрежата",
    moveUp: "Премести нагоре",
    moveDown: "Премести надолу",
    remove: "Премахни",
    dragHint: "Влачете дейност върху ден или я докоснете и след това докоснете деня",

    label: "Название",
    addActivity: "Добави дейност",
    activityInUse: (label, count) =>
      `„${label}“ се използва в ${count} ${count === 1 ? "блок" : "блока"}.`,
    confirmRemoveActivity: "Да се премахне ли въпреки това?",

    noSlots: "Добавете часови интервали, за да използвате изгледа „Мрежа“.",
    noBlocks: "Няма занимания",
    orphanActivity: "Непозната дейност",
  },
};
```

- [ ] **Step 4: Write the failing test**

Create `test/i18n.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { bg } from "../src/i18n/bg.js";
import { en } from "../src/i18n/en.js";
import { resolveLang, stringsFor } from "../src/i18n/index.js";
import { DAY_KEYS } from "../src/types.js";

describe("string tables", () => {
  it("have identical top-level keys", () => {
    expect(Object.keys(bg).sort()).toEqual(Object.keys(en).sort());
  });

  it("have identical editor keys", () => {
    expect(Object.keys(bg.editor).sort()).toEqual(Object.keys(en.editor).sort());
  });

  it("cover all seven days with non-empty full and short forms", () => {
    for (const table of [en, bg]) {
      for (const day of DAY_KEYS) {
        expect(table.days[day].full.length).toBeGreaterThan(0);
        expect(table.days[day].short.length).toBeGreaterThan(0);
      }
    }
  });

  it("uses authored two-letter Bulgarian abbreviations, not truncations", () => {
    expect(bg.days.thu.short).toBe("чт");
    expect(bg.days.sun.short).toBe("нд");
  });

  it("phrases open-ended times per language", () => {
    expect(bg.until("16:00")).toBe("до 16:00");
    expect(bg.after("18:30")).toBe("след 18:30");
    expect(en.until("4:00 PM")).toBe("until 4:00 PM");
    expect(en.after("6:30 PM")).toBe("after 6:30 PM");
  });

  it("pluralises the in-use warning", () => {
    expect(en.editor.activityInUse("Chess", 1)).toContain("1 block.");
    expect(en.editor.activityInUse("Chess", 3)).toContain("3 blocks.");
    expect(bg.editor.activityInUse("Шах", 1)).toContain("1 блок.");
    expect(bg.editor.activityInUse("Шах", 3)).toContain("3 блока.");
  });
});

describe("resolveLang", () => {
  it("honours an explicit language over hass", () => {
    expect(resolveLang({ language: "bg" }, { language: "en" })).toBe("bg");
    expect(resolveLang({ language: "en" }, { language: "bg" })).toBe("en");
  });

  it("detects Bulgarian from hass on auto", () => {
    expect(resolveLang({ language: "auto" }, { language: "bg" })).toBe("bg");
    expect(resolveLang({ language: "auto" }, { language: "BG-bg" })).toBe("bg");
  });

  it("falls back to English for anything else or no hass", () => {
    expect(resolveLang({ language: "auto" }, { language: "de" })).toBe("en");
    expect(resolveLang({ language: "auto" }, {})).toBe("en");
    expect(resolveLang({ language: "auto" })).toBe("en");
  });
});

describe("stringsFor", () => {
  it("returns the matching table", () => {
    expect(stringsFor("bg")).toBe(bg);
    expect(stringsFor("en")).toBe(en);
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npx vitest run test/i18n.test.ts`
Expected: FAIL — cannot resolve `../src/i18n/index.js`.

- [ ] **Step 6: Write minimal implementation**

Create `src/i18n/index.ts`:

```ts
import type { CardConfig, Hass, Lang } from "../types.js";
import { bg } from "./bg.js";
import { en } from "./en.js";
import type { Strings } from "./types.js";

export type { DayNames, EditorStrings, Strings } from "./types.js";
export { bg } from "./bg.js";
export { en } from "./en.js";

export function resolveLang(
  config: Pick<CardConfig, "language">,
  hass?: Hass,
): Lang {
  if (config.language === "en" || config.language === "bg") return config.language;
  return (hass?.language ?? "en").toLowerCase().startsWith("bg") ? "bg" : "en";
}

export function stringsFor(lang: Lang): Strings {
  return lang === "bg" ? bg : en;
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npx vitest run test/i18n.test.ts`
Expected: PASS with 0 failures, and the run reports this file (not "No test files found").

Note: `resolveLang({ language: "auto" }, { language: "BG-bg" })` passes because the tag is lowercased before the prefix check.

- [ ] **Step 8: Typecheck**

Run: `npm run typecheck`
Expected: no output, exit 0.

- [ ] **Step 9: Commit**

```bash
git add src/i18n test/i18n.test.ts
git commit -m "Add English and Bulgarian string tables with language resolution"
```

---

### Task 5: Config normalisation and stub config

**Files:**
- Create: `src/config.ts`
- Test: `test/config.test.ts`

**Interfaces:**
- Consumes: `normaliseDays` from `src/days.ts`; `resolveLang` from `src/i18n/index.ts`; all types from `src/types.ts`.
- Produces:
  - `DEFAULT_DAYS: DayKey[]`, `DEFAULT_HEADER_COLOR: string`, `CARD_TYPE: string`
  - `normaliseTimeString(value: unknown): string | undefined`
  - `normaliseConfig(raw: unknown): CardConfig` — throws `Error` on unusable input
  - `getStubConfig(hass?: Hass): CardConfig`

- [ ] **Step 1: Write the failing test**

Create `test/config.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  DEFAULT_HEADER_COLOR,
  getStubConfig,
  normaliseConfig,
  normaliseTimeString,
} from "../src/config.js";

const minimal = { people: [{ name: "Иван", schedule: {} }] };

describe("normaliseTimeString", () => {
  it("passes through a plain time", () => {
    expect(normaliseTimeString("15:20")).toBe("15:20");
  });

  it("trims surrounding whitespace", () => {
    expect(normaliseTimeString("  16:00 ")).toBe("16:00");
  });

  it("converts a YAML 1.1 sexagesimal number back to a time", () => {
    // Unquoted `16:00` in a YAML dashboard parses as 960.
    expect(normaliseTimeString(960)).toBe("16:00");
    expect(normaliseTimeString(920)).toBe("15:20");
  });

  it("drops empty and non-string, non-number values", () => {
    expect(normaliseTimeString("")).toBeUndefined();
    expect(normaliseTimeString("   ")).toBeUndefined();
    expect(normaliseTimeString(undefined)).toBeUndefined();
    expect(normaliseTimeString(null)).toBeUndefined();
    expect(normaliseTimeString({})).toBeUndefined();
  });

  it("keeps an unparseable string so it can render verbatim", () => {
    expect(normaliseTimeString("half four")).toBe("half four");
  });
});

describe("normaliseConfig", () => {
  it("throws when people is missing or empty", () => {
    expect(() => normaliseConfig({})).toThrow(/people/);
    expect(() => normaliseConfig({ people: [] })).toThrow(/people/);
    expect(() => normaliseConfig(undefined)).toThrow(/people/);
  });

  it("throws when activities is present but not a list", () => {
    expect(() => normaliseConfig({ ...minimal, activities: "no" })).toThrow(/activities/);
  });

  it("applies every default", () => {
    const config = normaliseConfig(minimal);
    expect(config.layout).toBe("blocks");
    expect(config.days).toEqual(["mon", "tue", "wed", "thu", "fri"]);
    expect(config.language).toBe("auto");
    expect(config.highlight_today).toBe(true);
    expect(config.header_color).toBe(DEFAULT_HEADER_COLOR);
    expect(config.activities).toEqual([]);
    expect(config.title).toBeUndefined();
  });

  it("accepts highlight_today false but not other falsy values", () => {
    expect(normaliseConfig({ ...minimal, highlight_today: false }).highlight_today).toBe(false);
    expect(normaliseConfig({ ...minimal, highlight_today: 0 }).highlight_today).toBe(true);
  });

  it("rejects an unknown layout by falling back to blocks", () => {
    expect(normaliseConfig({ ...minimal, layout: "timeline" }).layout).toBe("blocks");
    expect(normaliseConfig({ ...minimal, layout: "grid" }).layout).toBe("grid");
  });

  it("drops unknown day keys and de-duplicates", () => {
    const config = normaliseConfig({ ...minimal, days: ["sun", "mon", "sun", "xx"] });
    expect(config.days).toEqual(["sun", "mon"]);
  });

  it("gives every effective day an array so renderers never see undefined", () => {
    const config = normaliseConfig({
      people: [{ name: "A", schedule: { mon: [{ activity: "english" }] } }],
    });
    const person = config.people[0]!;
    expect(person.schedule.mon).toHaveLength(1);
    expect(person.schedule.fri).toEqual([]);
  });

  it("treats a person's days as a replacement, including days the card omits", () => {
    const config = normaliseConfig({
      days: ["mon", "tue"],
      people: [{ name: "A", days: ["sat"], schedule: { sat: [{ activity: "judo" }] } }],
    });
    const person = config.people[0]!;
    expect(person.days).toEqual(["sat"]);
    expect(person.schedule.sat).toHaveLength(1);
    expect(person.schedule.mon).toBeUndefined();
  });

  it("leaves person.days undefined when absent, so it inherits", () => {
    expect(normaliseConfig(minimal).people[0]!.days).toBeUndefined();
  });

  it("preserves blocks for stored days outside the current list, so narrowing is reversible", () => {
    const config = normaliseConfig({
      days: ["mon", "tue"],
      people: [
        {
          name: "A",
          schedule: {
            mon: [{ activity: "english" }],
            fri: [{ activity: "judo" }],
          },
        },
      ],
    });
    const person = config.people[0]!;
    expect(person.schedule.tue).toEqual([]);
    expect(person.schedule.fri).toEqual([{ activity: "judo" }]);
  });

  it("drops blocks with no usable activity id", () => {
    const config = normaliseConfig({
      people: [{ name: "A", schedule: { mon: [{ activity: "" }, {}, { activity: "judo" }] } }],
    });
    expect(config.people[0]!.schedule.mon).toEqual([{ activity: "judo" }]);
  });

  it("keeps an activity id that matches no activity, for the orphan renderer", () => {
    const config = normaliseConfig({
      activities: [{ id: "judo", label: "Джудо", color: "#f97316" }],
      people: [{ name: "A", schedule: { mon: [{ activity: "gone" }] } }],
    });
    expect(config.people[0]!.schedule.mon).toEqual([{ activity: "gone" }]);
  });

  it("omits absent times rather than storing empty strings", () => {
    const config = normaliseConfig({
      people: [{ name: "A", schedule: { mon: [{ activity: "x", start: "", end: "16:00" }] } }],
    });
    expect(config.people[0]!.schedule.mon![0]).toEqual({ activity: "x", end: "16:00" });
  });

  it("normalises activities and drops unusable ones", () => {
    const config = normaliseConfig({
      ...minimal,
      activities: [
        { id: "judo", label: "Джудо", color: "#f97316" },
        { id: "", label: "No id", color: "#000" },
        { label: "No id at all" },
        { id: "chess", label: "", color: "" },
      ],
    });
    expect(config.activities.map((a) => a.id)).toEqual(["judo", "chess"]);
    expect(config.activities[1]).toEqual({ id: "chess", label: "chess", color: "#888888" });
  });

  it("normalises slots and drops ones without both times", () => {
    const config = normaliseConfig({
      people: [
        {
          name: "A",
          slots: [
            { slot: 1, start: "08:00", end: "08:45" },
            { slot: 2, start: "08:45" },
            { start: "09:00", end: "09:45" },
          ],
          schedule: {},
        },
      ],
    });
    expect(config.people[0]!.slots).toEqual([
      { slot: 1, start: "08:00", end: "08:45" },
      { slot: 3, start: "09:00", end: "09:45" },
    ]);
  });

  it("does not mutate the input", () => {
    const raw = { people: [{ name: "A", schedule: {} }] };
    const snapshot = JSON.stringify(raw);
    normaliseConfig(raw);
    expect(JSON.stringify(raw)).toBe(snapshot);
  });
});

describe("getStubConfig", () => {
  it("builds a Monday-to-Friday week regardless of first_weekday", () => {
    const config = getStubConfig({ locale: { first_weekday: "sunday" } });
    expect(config.days).toEqual(["mon", "tue", "wed", "thu", "fri"]);
  });

  it("uses Bulgarian example labels for a Bulgarian user", () => {
    const config = getStubConfig({ language: "bg" });
    expect(config.activities.some((a) => a.label === "Английски")).toBe(true);
  });

  it("uses English example labels otherwise", () => {
    const config = getStubConfig({ language: "de" });
    expect(config.activities.some((a) => a.label === "English")).toBe(true);
  });

  it("returns a config that survives normalisation unchanged", () => {
    const config = getStubConfig({ language: "bg" });
    expect(normaliseConfig(config)).toEqual(config);
  });

  it("references only activities it defines", () => {
    const config = getStubConfig();
    const ids = new Set(config.activities.map((a) => a.id));
    for (const person of config.people) {
      for (const blocks of Object.values(person.schedule)) {
        for (const block of blocks ?? []) {
          expect(ids.has(block.activity)).toBe(true);
        }
      }
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/config.test.ts`
Expected: FAIL — cannot resolve `../src/config.js`.

- [ ] **Step 3: Write minimal implementation**

Create `src/config.ts`:

```ts
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
export const DEFAULT_DAYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri"];
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/config.test.ts`
Expected: PASS with 0 failures, and the run reports this file (not "No test files found").

- [ ] **Step 5: Typecheck**

Run: `npm run typecheck`
Expected: no output, exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/config.ts test/config.test.ts
git commit -m "Add config normalisation, defaults and stub config"
```

---

### Task 6: Time formatting

**Files:**
- Create: `src/time.ts`
- Test: `test/time.test.ts`

**Interfaces:**
- Consumes: `Hass`, `Lang` from `src/types.ts`.
- Produces:
  - `localeUsesHour12(locale: string): boolean`
  - `resolveHour12(hass: Hass | undefined, lang: Lang): boolean`
  - `formatTime(value: string, hass: Hass | undefined, lang: Lang): string`

- [ ] **Step 1: Write the failing test**

Note the ` ` normalisation: since ICU 72 (Node 18.13+), `Intl` emits a narrow no-break space before `AM`/`PM`, not an ordinary space. Asserting `"3:20 PM"` with a plain space fails on a modern Node for reasons that have nothing to do with this code.

Create `test/time.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { formatTime, localeUsesHour12, resolveHour12 } from "../src/time.js";

const flat = (value: string) => value.replace(/ /g, " ");

describe("localeUsesHour12", () => {
  it("is true for US English and false for Bulgarian and British English", () => {
    expect(localeUsesHour12("en-US")).toBe(true);
    expect(localeUsesHour12("bg")).toBe(false);
    expect(localeUsesHour12("en-GB")).toBe(false);
  });

  it("is false for an unusable locale rather than throwing", () => {
    expect(localeUsesHour12("!!not a locale!!")).toBe(false);
  });
});

describe("resolveHour12", () => {
  it("honours an explicit 12 or 24 setting over the language", () => {
    expect(resolveHour12({ language: "bg", locale: { time_format: "12" } }, "bg")).toBe(true);
    expect(resolveHour12({ language: "en-US", locale: { time_format: "24" } }, "en")).toBe(false);
  });

  it("derives from the Home Assistant language when set to language", () => {
    expect(resolveHour12({ language: "en-US", locale: { time_format: "language" } }, "en")).toBe(true);
    expect(resolveHour12({ language: "bg", locale: { time_format: "language" } }, "bg")).toBe(false);
  });

  it("derives from the language when nothing is set", () => {
    expect(resolveHour12({ language: "en-US" }, "en")).toBe(true);
    expect(resolveHour12({ language: "bg" }, "bg")).toBe(false);
  });

  it("falls back to the card language when hass is absent", () => {
    expect(resolveHour12(undefined, "bg")).toBe(false);
    expect(resolveHour12(undefined, "en")).toBe(false);
  });
});

describe("formatTime", () => {
  it("zero-pads in 24-hour mode without going through Intl", () => {
    expect(formatTime("9:05", { locale: { time_format: "24" } }, "bg")).toBe("09:05");
    expect(formatTime("15:20", { locale: { time_format: "24" } }, "bg")).toBe("15:20");
    expect(formatTime("00:00", { locale: { time_format: "24" } }, "bg")).toBe("00:00");
  });

  it("formats 12-hour times for an English user", () => {
    const hass = { language: "en-US", locale: { time_format: "12" as const } };
    expect(flat(formatTime("15:20", hass, "en"))).toBe("3:20 PM");
    expect(flat(formatTime("00:30", hass, "en"))).toBe("12:30 AM");
    expect(flat(formatTime("12:00", hass, "en"))).toBe("12:00 PM");
  });

  it("renders an unparseable value verbatim rather than Invalid Date", () => {
    const hass = { language: "en-US", locale: { time_format: "12" as const } };
    expect(formatTime("half four", hass, "en")).toBe("half four");
    expect(formatTime("25:00", hass, "en")).toBe("25:00");
    expect(formatTime("15:99", hass, "en")).toBe("15:99");
  });

  it("trims before parsing", () => {
    expect(formatTime(" 15:20 ", { locale: { time_format: "24" } }, "bg")).toBe("15:20");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/time.test.ts`
Expected: FAIL — cannot resolve `../src/time.js`.

- [ ] **Step 3: Write minimal implementation**

Create `src/time.ts`:

```ts
import type { Hass, Lang } from "./types.js";

const TIME_PATTERN = /^(\d{1,2}):(\d{2})$/;

export function localeUsesHour12(locale: string): boolean {
  try {
    const parts = new Intl.DateTimeFormat(locale, { hour: "numeric" }).formatToParts(
      new Date(2020, 0, 1, 13, 0),
    );
    return parts.some((part) => part.type === "dayPeriod");
  } catch {
    return false;
  }
}

/**
 * A bare Lang code ("en") is ambiguous to Intl and resolves to US-style
 * hour12 defaults, so the no-hass fallback must name a region explicitly or
 * `resolveHour12(undefined, "en")` comes out 12-hour.
 */
const LANG_LOCALE: Record<Lang, string> = { en: "en-GB", bg: "bg" };

function localeFor(hass: Hass | undefined, lang: Lang): string {
  return hass?.language ?? LANG_LOCALE[lang];
}

export function resolveHour12(hass: Hass | undefined, lang: Lang): boolean {
  const setting = hass?.locale?.time_format;
  if (setting === "12") return true;
  if (setting === "24") return false;
  if (setting === "system") {
    const system = typeof navigator === "undefined" ? undefined : navigator.language;
    return localeUsesHour12(system ?? localeFor(hass, lang));
  }
  return localeUsesHour12(localeFor(hass, lang));
}

/**
 * The 24-hour path deliberately does not go through Intl: some locales render
 * midnight as "24:00" there, and we already hold the exact hour and minute.
 */
export function formatTime(value: string, hass: Hass | undefined, lang: Lang): string {
  const trimmed = value.trim();
  const match = TIME_PATTERN.exec(trimmed);
  if (!match) return trimmed;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return trimmed;

  if (!resolveHour12(hass, lang)) {
    return `${String(hours).padStart(2, "0")}:${match[2]}`;
  }

  try {
    return new Intl.DateTimeFormat(localeFor(hass, lang), {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(2020, 0, 1, hours, minutes));
  } catch {
    return trimmed;
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/time.test.ts`
Expected: PASS with 0 failures, and the run reports this file (not "No test files found").

- [ ] **Step 5: Typecheck**

Run: `npm run typecheck`
Expected: no output, exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/time.ts test/time.test.ts
git commit -m "Add time formatting against the Home Assistant clock setting"
```

---

### Task 7: Colour derivation and density thresholds

**Files:**
- Create: `src/color.ts`, `src/density.ts`
- Test: `test/color.test.ts`, `test/density.test.ts`

**Interfaces:**
- Consumes: `Density` from `src/types.ts`.
- Produces:
  - `interface Rgb { r: number; g: number; b: number }`
  - `parseHexColor(color: string): Rgb | null`
  - `relativeLuminance(rgb: Rgb): number`
  - `contrastTextColor(background: string): string`
  - `activityFill(color: string): string`
  - `activityBorder(color: string): string`
  - `DENSITY_FULL_MIN: 110`, `DENSITY_COMPACT_MIN: 72`
  - `densityFor(width: number, dayCount: number): Density`

- [ ] **Step 1: Write the failing test for colour**

Create `test/color.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  activityBorder,
  activityFill,
  contrastTextColor,
  parseHexColor,
  relativeLuminance,
} from "../src/color.js";

describe("parseHexColor", () => {
  it("parses six-digit hex with and without a hash", () => {
    expect(parseHexColor("#1e3a5f")).toEqual({ r: 30, g: 58, b: 95 });
    expect(parseHexColor("1e3a5f")).toEqual({ r: 30, g: 58, b: 95 });
  });

  it("expands three-digit hex", () => {
    expect(parseHexColor("#fff")).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseHexColor("#08f")).toEqual({ r: 0, g: 136, b: 255 });
  });

  it("is case-insensitive and tolerates whitespace", () => {
    expect(parseHexColor("  #1E3A5F ")).toEqual({ r: 30, g: 58, b: 95 });
  });

  it("returns null for anything that is not hex", () => {
    expect(parseHexColor("rebeccapurple")).toBeNull();
    expect(parseHexColor("var(--primary-color)")).toBeNull();
    expect(parseHexColor("#12345")).toBeNull();
    expect(parseHexColor("")).toBeNull();
  });
});

describe("relativeLuminance", () => {
  it("is 0 for black and 1 for white", () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0 })).toBeCloseTo(0, 5);
    expect(relativeLuminance({ r: 255, g: 255, b: 255 })).toBeCloseTo(1, 5);
  });

  it("puts the reference navy well below the crossover", () => {
    expect(relativeLuminance({ r: 30, g: 58, b: 95 })).toBeLessThan(0.179);
  });
});

describe("contrastTextColor", () => {
  it("picks white on the default navy header", () => {
    expect(contrastTextColor("#1e3a5f")).toBe("#ffffff");
  });

  it("picks near-black on light headers", () => {
    expect(contrastTextColor("#ffffff")).toBe("#0f172a");
    expect(contrastTextColor("#f9fafb")).toBe("#0f172a");
    expect(contrastTextColor("#808080")).toBe("#0f172a");
  });

  it("defaults to white when the colour cannot be parsed", () => {
    expect(contrastTextColor("var(--primary-color)")).toBe("#ffffff");
  });
});

describe("activity colour derivation", () => {
  it("mixes the activity colour into the card background so both themes work", () => {
    expect(activityFill("#3b82f6")).toBe(
      "color-mix(in srgb, #3b82f6 14%, var(--card-background-color, #ffffff))",
    );
    expect(activityBorder("#3b82f6")).toBe(
      "color-mix(in srgb, #3b82f6 35%, var(--card-background-color, #ffffff))",
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/color.test.ts`
Expected: FAIL — cannot resolve `../src/color.js`.

- [ ] **Step 3: Write minimal implementation**

Create `src/color.ts`:

```ts
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

export function activityFill(color: string): string {
  return `color-mix(in srgb, ${color} 14%, ${CARD_BACKGROUND})`;
}

export function activityBorder(color: string): string {
  return `color-mix(in srgb, ${color} 35%, ${CARD_BACKGROUND})`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/color.test.ts`
Expected: PASS with 0 failures, and the run reports this file (not "No test files found").

- [ ] **Step 5: Write the failing test for density**

Create `test/density.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { DENSITY_COMPACT_MIN, DENSITY_FULL_MIN, densityFor } from "../src/density.js";

describe("densityFor", () => {
  it("uses the documented thresholds", () => {
    expect(DENSITY_FULL_MIN).toBe(110);
    expect(DENSITY_COMPACT_MIN).toBe(72);
  });

  it("is full at or above 110px per column", () => {
    expect(densityFor(550, 5)).toBe("full");
    expect(densityFor(770, 7)).toBe("full");
  });

  it("drops to compact just below the full threshold", () => {
    expect(densityFor(769, 7)).toBe("compact");
    expect(densityFor(360, 5)).toBe("compact");
  });

  it("stacks below 72px per column", () => {
    expect(densityFor(359, 5)).toBe("stacked");
    expect(densityFor(300, 7)).toBe("stacked");
  });

  it("stacks defensively for a zero width or no days", () => {
    expect(densityFor(0, 5)).toBe("stacked");
    expect(densityFor(800, 0)).toBe("stacked");
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run test/density.test.ts`
Expected: FAIL — cannot resolve `../src/density.js`.

- [ ] **Step 7: Write minimal implementation**

Create `src/density.ts`:

```ts
import type { Density } from "./types.js";

export const DENSITY_FULL_MIN = 110;
export const DENSITY_COMPACT_MIN = 72;

/**
 * Measured from the card's own width, never the viewport: a Lovelace card in a
 * masonry dashboard can be 300px wide on a 2560px screen.
 */
export function densityFor(width: number, dayCount: number): Density {
  if (dayCount <= 0 || width <= 0) return "stacked";
  const perColumn = width / dayCount;
  if (perColumn >= DENSITY_FULL_MIN) return "full";
  if (perColumn >= DENSITY_COMPACT_MIN) return "compact";
  return "stacked";
}
```

- [ ] **Step 8: Run all tests**

Run: `npm test`
Expected: PASS with 0 failures across every test file.

- [ ] **Step 9: Typecheck**

Run: `npm run typecheck`
Expected: no output, exit 0.

- [ ] **Step 10: Commit**

```bash
git add src/color.ts src/density.ts test/color.test.ts test/density.test.ts
git commit -m "Add activity colour derivation and density thresholds"
```

---

### Task 8: Styles, render context and the shared block renderer

The three layouts all draw the same block, so it lives in one module they share. The card element is built later (Task 12) so that every renderer it imports already exists.

**Files:**
- Create: `src/styles.ts`, `src/renderers/context.ts`, `src/renderers/block.ts`, `test/helpers.ts`
- Test: `test/renderers-block.test.ts`

**Interfaces:**
- Consumes: `blockForm`, `findActivity`, `activityFill`, `activityBorder`, `formatTime`, `resolveLang`, `stringsFor`, `effectiveDays`, `todayKey`.
- Produces:
  - `blockStyles: CSSResult` and `cardStyles: CSSResult` from `src/styles.ts`
    (`cardStyles` composes `blockStyles`; the editor composes it too, in Task 13)
  - `interface RenderContext { config: CardConfig; person: Person; days: DayKey[]; strings: Strings; lang: Lang; hass?: Hass; density: Density; today: DayKey | null }`
  - `buildContext(params: { config: CardConfig; personIndex: number; hass?: Hass; density: Density; now?: Date }): RenderContext`
  - `blockTimeLabel(ctx: RenderContext, block: Block): string`
  - `renderBlock(ctx: RenderContext, block: Block): TemplateResult`
  - Test helpers `renderToHost(template)`, `textOf(host, selector)`, `textsOf(host, selector)`

- [ ] **Step 1: Create `src/styles.ts`**

```ts
import { css } from "lit";

/**
 * A block looks the same wherever it appears — in the card, and in the editor's
 * activity preview. Shared as its own CSSResult and composed into both style
 * sheets, rather than duplicated or (worse) defined only in cardStyles, which
 * would leave the editor's previews unstyled.
 */
export const blockStyles = css`
  .block {
    border-radius: 8px;
    padding: 8px 10px;
    text-align: center;
    /* The solid fallback is declared first so a browser without color-mix
       still shows a readable block rather than a transparent one. */
    background: var(--secondary-background-color);
    background: var(--wtc-block-fill, var(--secondary-background-color));
    border: 1px solid var(--divider-color);
    border-color: var(--wtc-block-border, var(--divider-color));
  }

  .block.orphan {
    border-style: dashed;
    background: var(--secondary-background-color);
  }

  .block-time {
    font-size: 11px;
    line-height: 1.3;
    color: var(--secondary-text-color);
  }

  .block-label {
    font-size: 13px;
    line-height: 1.3;
    font-weight: 600;
    color: var(--primary-text-color);
  }
`;

export const cardStyles = css`
  ${blockStyles}

  :host {
    display: block;
  }

  ha-card {
    padding: 12px;
    overflow: hidden;
  }

  .card-title {
    margin: 0 0 10px;
    font-size: 18px;
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
  }

  .tab {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    border: 1px solid var(--divider-color);
    border-radius: 999px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
  }

  .tab[aria-selected="true"] {
    border-color: var(--wtc-accent, var(--primary-color));
    background: color-mix(
      in srgb,
      var(--wtc-accent, var(--primary-color)) 14%,
      var(--card-background-color, #ffffff)
    );
    font-weight: 600;
  }

  .week {
    display: grid;
    grid-template-columns: repeat(var(--wtc-day-count, 5), minmax(0, 1fr));
    gap: 12px;
    align-items: stretch;
  }

  .day {
    display: flex;
    flex-direction: column;
    border: 1px solid var(--divider-color);
    border-radius: 10px;
    overflow: hidden;
    background: var(--card-background-color);
  }

  .day-head {
    padding: 10px 6px;
    background: var(--wtc-header-color, #1e3a5f);
    color: var(--wtc-header-text, #ffffff);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-align: center;
  }

  .day-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    align-content: start;
    gap: 10px;
    padding: 10px;
  }

  .day.today .day-body {
    background: color-mix(
      in srgb,
      var(--wtc-header-color, #1e3a5f) 7%,
      var(--card-background-color, #ffffff)
    );
  }

  .empty {
    padding: 4px 0;
    font-size: 12px;
    color: var(--secondary-text-color);
    text-align: center;
  }

  [data-density="compact"] .day-head {
    padding: 8px 4px;
    font-size: 11px;
    letter-spacing: 0.04em;
  }
  [data-density="compact"] .day-body {
    gap: 6px;
    padding: 6px;
  }
  [data-density="compact"] .block {
    padding: 6px;
  }
  [data-density="compact"] .block-time {
    font-size: 10px;
  }
  [data-density="compact"] .block-label {
    font-size: 12px;
  }

  [data-density="stacked"] .week {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  [data-density="stacked"] .day-head {
    padding-left: 12px;
    text-align: left;
  }

  .grid {
    display: grid;
    grid-template-columns: max-content repeat(var(--wtc-day-count, 5), minmax(0, 1fr));
    gap: 6px;
    align-items: stretch;
  }

  .grid-head {
    padding: 10px 6px;
    border-radius: 8px;
    background: var(--wtc-header-color, #1e3a5f);
    color: var(--wtc-header-text, #ffffff);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    text-align: center;
  }

  .grid-corner {
    background: transparent;
  }

  .slot-label {
    display: flex;
    align-items: center;
    padding: 6px 8px;
    font-size: 11px;
    color: var(--secondary-text-color);
    white-space: nowrap;
  }

  .grid-cell {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-height: 40px;
    padding: 4px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
  }

  .grid-cell.today {
    background: color-mix(
      in srgb,
      var(--wtc-header-color, #1e3a5f) 7%,
      var(--card-background-color, #ffffff)
    );
  }

  .strip {
    display: grid;
    grid-template-columns: max-content repeat(var(--wtc-day-count, 5), minmax(0, 1fr));
    gap: 6px;
    margin-bottom: 10px;
  }

  .strip-label {
    display: flex;
    align-items: center;
    padding: 6px 8px;
    font-size: 11px;
    color: var(--secondary-text-color);
  }

  .strip-cell {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .no-slots {
    padding: 16px;
    color: var(--secondary-text-color);
    text-align: center;
  }
`;
```

- [ ] **Step 2: Create `src/renderers/context.ts`**

```ts
import { effectiveDays, todayKey } from "../days.js";
import { resolveLang, stringsFor } from "../i18n/index.js";
import type { Strings } from "../i18n/types.js";
import type { CardConfig, DayKey, Density, Hass, Lang, Person } from "../types.js";

export interface RenderContext {
  config: CardConfig;
  person: Person;
  days: DayKey[];
  strings: Strings;
  lang: Lang;
  hass?: Hass;
  density: Density;
  /** null when highlight_today is off, so renderers never re-check the flag. */
  today: DayKey | null;
}

export interface BuildContextParams {
  config: CardConfig;
  personIndex: number;
  hass?: Hass;
  density: Density;
  now?: Date;
}

export function buildContext(params: BuildContextParams): RenderContext {
  const { config, hass, density, now } = params;
  const index = Math.min(Math.max(params.personIndex, 0), config.people.length - 1);
  const person = config.people[index]!;
  const lang = resolveLang(config, hass);
  return {
    config,
    person,
    days: effectiveDays(config, person),
    strings: stringsFor(lang),
    lang,
    hass,
    density,
    today: config.highlight_today ? todayKey(now) : null,
  };
}
```

- [ ] **Step 3: Create `src/renderers/block.ts`**

```ts
import { html, nothing, type TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { findActivity } from "../activity.js";
import { blockForm } from "../block.js";
import { activityBorder, activityFill } from "../color.js";
import { formatTime } from "../time.js";
import type { Block } from "../types.js";
import type { RenderContext } from "./context.js";

export function blockTimeLabel(ctx: RenderContext, block: Block): string {
  const fmt = (value: string) => formatTime(value, ctx.hass, ctx.lang);
  switch (blockForm(block)) {
    case "range":
      return ctx.strings.range(fmt(block.start!), fmt(block.end!));
    case "until":
      return ctx.strings.until(fmt(block.end!));
    case "after":
      return ctx.strings.after(fmt(block.start!));
    case "bare":
      return "";
  }
}

export function renderBlock(ctx: RenderContext, block: Block): TemplateResult {
  const activity = findActivity(ctx.config.activities, block.activity);
  const time = blockTimeLabel(ctx, block);
  const styles = activity
    ? {
        "--wtc-block-fill": activityFill(activity.color),
        "--wtc-block-border": activityBorder(activity.color),
      }
    : {};

  return html`
    <div
      class="block ${activity ? "" : "orphan"}"
      style=${styleMap(styles)}
      title=${activity ? nothing : ctx.strings.editor.orphanActivity}
    >
      ${time ? html`<div class="block-time">${time}</div>` : nothing}
      <div class="block-label">${activity ? activity.label : block.activity}</div>
    </div>
  `;
}
```

- [ ] **Step 4: Create `test/helpers.ts`**

```ts
import { render, type TemplateResult } from "lit";
import { normaliseConfig } from "../src/config.js";
import { buildContext, type RenderContext } from "../src/renderers/context.js";
import type { Density, Hass } from "../src/types.js";

export function renderToHost(template: TemplateResult): HTMLElement {
  const host = document.createElement("div");
  render(template, host);
  return host;
}

export function textOf(host: HTMLElement, selector: string): string {
  return host.querySelector(selector)?.textContent?.trim() ?? "";
}

export function textsOf(host: HTMLElement, selector: string): string[] {
  return [...host.querySelectorAll(selector)].map(
    (node) => node.textContent?.trim() ?? "",
  );
}

export interface ContextOptions {
  raw: unknown;
  personIndex?: number;
  hass?: Hass;
  density?: Density;
  now?: Date;
}

/** Builds a context the same way the card does, from raw (un-normalised) config. */
export function makeContext(options: ContextOptions): RenderContext {
  return buildContext({
    config: normaliseConfig(options.raw),
    personIndex: options.personIndex ?? 0,
    hass: options.hass,
    density: options.density ?? "full",
    now: options.now,
  });
}

export const BG_24H: Hass = { language: "bg", locale: { time_format: "24" } };
export const EN_12H: Hass = { language: "en-US", locale: { time_format: "12" } };
```

- [ ] **Step 5: Write the failing test**

Create `test/renderers-block.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { blockTimeLabel, renderBlock } from "../src/renderers/block.js";
import { BG_24H, EN_12H, makeContext, renderToHost, textOf } from "./helpers.js";

const raw = {
  activities: [
    { id: "english", label: "Английски", color: "#3b82f6" },
    { id: "daycare", label: "Занималня", color: "#64748b" },
    { id: "home", label: "Връщане вкъщи", color: "#22c55e" },
    { id: "free", label: "Свободен следобед", color: "#22c55e" },
  ],
  people: [{ name: "Иван", schedule: {} }],
};

const bg = makeContext({ raw, hass: BG_24H });
const en = makeContext({ raw, hass: EN_12H });
const flat = (value: string) => value.replace(/ /g, " ");

describe("blockTimeLabel", () => {
  it("renders a range", () => {
    expect(blockTimeLabel(bg, { activity: "english", start: "15:20", end: "16:20" }))
      .toBe("15:20–16:20");
  });

  it("renders the until form in Bulgarian and English", () => {
    expect(blockTimeLabel(bg, { activity: "daycare", end: "16:00" })).toBe("до 16:00");
    expect(flat(blockTimeLabel(en, { activity: "daycare", end: "16:00" })))
      .toBe("until 4:00 PM");
  });

  it("renders the after form in Bulgarian and English", () => {
    expect(blockTimeLabel(bg, { activity: "home", start: "18:30" })).toBe("след 18:30");
    expect(flat(blockTimeLabel(en, { activity: "home", start: "18:30" })))
      .toBe("after 6:30 PM");
  });

  it("renders nothing for a bare block", () => {
    expect(blockTimeLabel(bg, { activity: "free" })).toBe("");
  });
});

describe("renderBlock", () => {
  it("shows the activity label and the time line", () => {
    const host = renderToHost(
      renderBlock(bg, { activity: "english", start: "15:20", end: "16:20" }),
    );
    expect(textOf(host, ".block-label")).toBe("Английски");
    expect(textOf(host, ".block-time")).toBe("15:20–16:20");
  });

  it("omits the time element entirely for a bare block", () => {
    const host = renderToHost(renderBlock(bg, { activity: "free" }));
    expect(host.querySelector(".block-time")).toBeNull();
    expect(textOf(host, ".block-label")).toBe("Свободен следобед");
  });

  it("sets the derived fill and border custom properties", () => {
    const host = renderToHost(renderBlock(bg, { activity: "english" }));
    const style = host.querySelector(".block")!.getAttribute("style") ?? "";
    expect(style).toContain("--wtc-block-fill");
    expect(style).toContain("#3b82f6 14%");
    expect(style).toContain("#3b82f6 35%");
  });

  it("renders an orphaned reference as a grey block showing the raw id", () => {
    const host = renderToHost(renderBlock(bg, { activity: "gone" }));
    const block = host.querySelector(".block")!;
    expect(block.classList.contains("orphan")).toBe(true);
    expect(textOf(host, ".block-label")).toBe("gone");
    expect(block.getAttribute("title")).toBe(bg.strings.editor.orphanActivity);
  });

  it("does not mark a known activity as an orphan", () => {
    const host = renderToHost(renderBlock(bg, { activity: "english" }));
    const block = host.querySelector(".block")!;
    expect(block.classList.contains("orphan")).toBe(false);
    expect(block.hasAttribute("title")).toBe(false);
  });
});
```

- [ ] **Step 6: Run test to verify it passes**

Note on step order: Steps 1–3 write the implementation before Step 5 writes the
test, so there is no RED phase to observe here — the run below is the
verification. To get genuine TDD evidence instead, do Steps 4–5 first, run the
test and watch it fail to resolve `../src/renderers/block.js`, then do Steps 1–3
and run it again.

Run: `npx vitest run test/renderers-block.test.ts`
Expected: PASS with 0 failures, and the run reports this file (not "No test files found").

- [ ] **Step 8: Typecheck**

Run: `npm run typecheck`
Expected: no output, exit 0.

- [ ] **Step 9: Commit**

```bash
git add src/styles.ts src/renderers/context.ts src/renderers/block.ts test/helpers.ts test/renderers-block.test.ts
git commit -m "Add card styles, render context and the shared block renderer"
```

---

### Task 9: Day-column blocks layout

**Files:**
- Create: `src/renderers/blocks.ts`
- Test: `test/renderers-blocks.test.ts`

**Interfaces:**
- Consumes: `RenderContext`, `renderBlock`.
- Produces: `dayHeading(ctx: RenderContext, day: DayKey): string`, `renderBlocks(ctx: RenderContext): TemplateResult`

- [ ] **Step 1: Write the failing test**

Create `test/renderers-blocks.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { dayHeading, renderBlocks } from "../src/renderers/blocks.js";
import { BG_24H, makeContext, renderToHost, textsOf } from "./helpers.js";

const raw = {
  days: ["mon", "tue", "wed", "thu", "fri"],
  activities: [
    { id: "english", label: "Английски", color: "#3b82f6" },
    { id: "daycare", label: "Занималня", color: "#64748b" },
    { id: "judo", label: "Джудо", color: "#f97316" },
  ],
  people: [
    {
      name: "Иван",
      schedule: {
        mon: [
          { activity: "english", start: "15:20", end: "16:20" },
          { activity: "judo", start: "17:30", end: "18:30" },
        ],
        tue: [{ activity: "daycare", end: "16:00" }],
      },
    },
  ],
};

// 2026-09-21 is a Monday.
const MONDAY = new Date(2026, 8, 21, 9, 0);

describe("dayHeading", () => {
  it("uses full names at full density", () => {
    const ctx = makeContext({ raw, hass: BG_24H, density: "full" });
    expect(dayHeading(ctx, "mon")).toBe("понеделник");
  });

  it("uses authored short names at compact density", () => {
    const ctx = makeContext({ raw, hass: BG_24H, density: "compact" });
    expect(dayHeading(ctx, "thu")).toBe("чт");
  });

  it("uses full names again when stacked, where width is not the constraint", () => {
    const ctx = makeContext({ raw, hass: BG_24H, density: "stacked" });
    expect(dayHeading(ctx, "thu")).toBe("четвъртък");
  });
});

describe("renderBlocks", () => {
  it("renders one column per day in the configured order", () => {
    const ctx = makeContext({ raw, hass: BG_24H, now: MONDAY });
    const host = renderToHost(renderBlocks(ctx));
    expect(textsOf(host, ".day-head")).toEqual([
      "понеделник", "вторник", "сряда", "четвъртък", "петък",
    ]);
  });

  it("exposes the day count so the grid template can size itself", () => {
    const ctx = makeContext({ raw, hass: BG_24H, now: MONDAY });
    const host = renderToHost(renderBlocks(ctx));
    const week = host.querySelector<HTMLElement>(".week")!;
    expect(week.style.getPropertyValue("--wtc-day-count")).toBe("5");
  });

  it("stacks a day's blocks in order", () => {
    const ctx = makeContext({ raw, hass: BG_24H, now: MONDAY });
    const host = renderToHost(renderBlocks(ctx));
    const monday = host.querySelectorAll(".day")[0]!;
    expect([...monday.querySelectorAll(".block-label")].map((n) => n.textContent))
      .toEqual(["Английски", "Джудо"]);
  });

  it("marks exactly one column as today", () => {
    const ctx = makeContext({ raw, hass: BG_24H, now: MONDAY });
    const host = renderToHost(renderBlocks(ctx));
    const today = host.querySelectorAll(".day.today");
    expect(today).toHaveLength(1);
    expect(today[0]!.querySelector(".day-head")!.textContent!.trim()).toBe("понеделник");
  });

  it("marks no column when highlight_today is off", () => {
    const ctx = makeContext({
      raw: { ...raw, highlight_today: false },
      hass: BG_24H,
      now: MONDAY,
    });
    const host = renderToHost(renderBlocks(ctx));
    expect(host.querySelectorAll(".day.today")).toHaveLength(0);
  });

  it("marks no column when today is not in the configured days", () => {
    const ctx = makeContext({
      raw: { ...raw, days: ["sat", "sun"] },
      hass: BG_24H,
      now: MONDAY,
    });
    const host = renderToHost(renderBlocks(ctx));
    expect(host.querySelectorAll(".day.today")).toHaveLength(0);
  });

  it("renders an empty-day message rather than a collapsed column", () => {
    const ctx = makeContext({ raw, hass: BG_24H, now: MONDAY });
    const host = renderToHost(renderBlocks(ctx));
    const wednesday = host.querySelectorAll(".day")[2]!;
    expect(wednesday.querySelector(".empty")!.textContent!.trim()).toBe("Няма занимания");
  });

  it("follows a person's own day list", () => {
    const ctx = makeContext({
      raw: {
        ...raw,
        days: ["mon", "tue"],
        people: [{ name: "Иван", days: ["sat"], schedule: { sat: [{ activity: "judo" }] } }],
      },
      hass: BG_24H,
      now: MONDAY,
    });
    const host = renderToHost(renderBlocks(ctx));
    expect(textsOf(host, ".day-head")).toEqual(["събота"]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/renderers-blocks.test.ts`
Expected: FAIL — cannot resolve `../src/renderers/blocks.js`.

- [ ] **Step 3: Write minimal implementation**

Create `src/renderers/blocks.ts`:

```ts
import { html, type TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import type { DayKey } from "../types.js";
import { renderBlock } from "./block.js";
import type { RenderContext } from "./context.js";

/**
 * Short names exist to buy horizontal room. Stacked gives each day a full row,
 * so it goes back to the full name.
 */
export function dayHeading(ctx: RenderContext, day: DayKey): string {
  const names = ctx.strings.days[day];
  return ctx.density === "compact" ? names.short : names.full;
}

export function renderBlocks(ctx: RenderContext): TemplateResult {
  return html`
    <div class="week" style=${styleMap({ "--wtc-day-count": String(ctx.days.length) })}>
      ${ctx.days.map((day) => renderDayColumn(ctx, day))}
    </div>
  `;
}

function renderDayColumn(ctx: RenderContext, day: DayKey): TemplateResult {
  const blocks = ctx.person.schedule[day] ?? [];
  return html`
    <section class="day ${ctx.today === day ? "today" : ""}">
      <header class="day-head">${dayHeading(ctx, day)}</header>
      <div class="day-body">
        ${blocks.length > 0
          ? blocks.map((block) => renderBlock(ctx, block))
          : html`<div class="empty">${ctx.strings.editor.noBlocks}</div>`}
      </div>
    </section>
  `;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/renderers-blocks.test.ts`
Expected: PASS with 0 failures, and the run reports this file (not "No test files found").

- [ ] **Step 5: Typecheck**

Run: `npm run typecheck`
Expected: no output, exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/renderers/blocks.ts test/renderers-blocks.test.ts
git commit -m "Add day-column blocks layout"
```

---

### Task 10: Grid placement and grid layout

**Files:**
- Create: `src/grid-placement.ts`, `src/renderers/grid.ts`
- Test: `test/grid-placement.test.ts`, `test/renderers-grid.test.ts`

**Interfaces:**
- Consumes: `blockForm`, `RenderContext`, `renderBlock`, `dayHeading`, `formatTime`.
- Produces:
  - `interface GridPlacement { bySlot: Map<number, Block[]>; loose: Block[] }`
  - `gridPlacement(slots: readonly Slot[], blocks: readonly Block[]): GridPlacement`
  - `renderGrid(ctx: RenderContext): TemplateResult`

- [ ] **Step 1: Write the failing test for placement**

Create `test/grid-placement.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { gridPlacement } from "../src/grid-placement.js";
import type { Slot } from "../src/types.js";

const slots: Slot[] = [
  { slot: 1, start: "08:00", end: "08:45" },
  { slot: 2, start: "08:45", end: "09:30" },
];

describe("gridPlacement", () => {
  it("places a range block on the slot whose times it matches exactly", () => {
    const { bySlot, loose } = gridPlacement(slots, [
      { activity: "maths", start: "08:45", end: "09:30" },
    ]);
    expect(bySlot.get(2)).toEqual([{ activity: "maths", start: "08:45", end: "09:30" }]);
    expect(loose).toEqual([]);
  });

  it("sends a range matching no slot to the loose strip", () => {
    const { bySlot, loose } = gridPlacement(slots, [
      { activity: "judo", start: "17:30", end: "18:30" },
    ]);
    expect(bySlot.size).toBe(0);
    expect(loose).toHaveLength(1);
  });

  it("sends every open-ended and bare block to the loose strip", () => {
    const { bySlot, loose } = gridPlacement(slots, [
      { activity: "daycare", end: "16:00" },
      { activity: "home", start: "18:30" },
      { activity: "free" },
    ]);
    expect(bySlot.size).toBe(0);
    expect(loose.map((block) => block.activity)).toEqual(["daycare", "home", "free"]);
  });

  it("keeps several blocks in one slot, in order", () => {
    const { bySlot } = gridPlacement(slots, [
      { activity: "a", start: "08:00", end: "08:45" },
      { activity: "b", start: "08:00", end: "08:45" },
    ]);
    expect(bySlot.get(1)!.map((block) => block.activity)).toEqual(["a", "b"]);
  });

  it("treats everything as loose when there are no slots", () => {
    const { bySlot, loose } = gridPlacement([], [
      { activity: "maths", start: "08:00", end: "08:45" },
    ]);
    expect(bySlot.size).toBe(0);
    expect(loose).toHaveLength(1);
  });

  it("does not mutate the blocks it is given", () => {
    const blocks = [{ activity: "maths", start: "08:00", end: "08:45" }];
    const snapshot = JSON.stringify(blocks);
    gridPlacement(slots, blocks);
    expect(JSON.stringify(blocks)).toBe(snapshot);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/grid-placement.test.ts`
Expected: FAIL — cannot resolve `../src/grid-placement.js`.

- [ ] **Step 3: Write minimal implementation**

Create `src/grid-placement.ts`:

```ts
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/grid-placement.test.ts`
Expected: PASS with 0 failures, and the run reports this file (not "No test files found").

- [ ] **Step 5: Write the failing test for the grid renderer**

Create `test/renderers-grid.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { renderGrid } from "../src/renderers/grid.js";
import { BG_24H, makeContext, renderToHost, textsOf } from "./helpers.js";

const MONDAY = new Date(2026, 8, 21, 9, 0);

const raw = {
  layout: "grid",
  days: ["mon", "tue"],
  activities: [
    { id: "maths", label: "Математика", color: "#3b82f6" },
    { id: "daycare", label: "Занималня", color: "#64748b" },
    { id: "judo", label: "Джудо", color: "#f97316" },
  ],
  people: [
    {
      name: "Иван",
      slots: [
        { slot: 1, start: "08:00", end: "08:45" },
        { slot: 2, start: "08:45", end: "09:30" },
      ],
      schedule: {
        mon: [
          { activity: "maths", start: "08:00", end: "08:45" },
          { activity: "daycare", end: "16:00" },
        ],
        tue: [{ activity: "judo", start: "17:30", end: "18:30" }],
      },
    },
  ],
};

describe("renderGrid", () => {
  it("renders a header per day plus a leading corner cell", () => {
    const host = renderToHost(renderGrid(makeContext({ raw, hass: BG_24H, now: MONDAY })));
    expect(textsOf(host, ".grid-head")).toEqual(["понеделник", "вторник"]);
    expect(host.querySelectorAll(".grid-corner")).toHaveLength(1);
  });

  it("labels each slot row with its time range", () => {
    const host = renderToHost(renderGrid(makeContext({ raw, hass: BG_24H, now: MONDAY })));
    expect(textsOf(host, ".slot-label")).toEqual(["08:00–08:45", "08:45–09:30"]);
  });

  it("places a matching range block in its slot cell", () => {
    const host = renderToHost(renderGrid(makeContext({ raw, hass: BG_24H, now: MONDAY })));
    const firstRowMonday = host.querySelectorAll(".grid-cell")[0]!;
    expect(firstRowMonday.querySelector(".block-label")!.textContent!.trim())
      .toBe("Математика");
  });

  it("puts open-ended and unmatched blocks in the strip above the grid", () => {
    const host = renderToHost(renderGrid(makeContext({ raw, hass: BG_24H, now: MONDAY })));
    const strip = host.querySelector(".strip")!;
    expect([...strip.querySelectorAll(".block-label")].map((n) => n.textContent!.trim()))
      .toEqual(["Занималня", "Джудо"]);
    // The strip precedes the grid in document order.
    expect(strip.compareDocumentPosition(host.querySelector(".grid")!))
      .toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it("omits the strip entirely when every block sits on the ruler", () => {
    const host = renderToHost(
      renderGrid(
        makeContext({
          raw: {
            ...raw,
            people: [
              {
                name: "Иван",
                slots: raw.people[0]!.slots,
                schedule: { mon: [{ activity: "maths", start: "08:00", end: "08:45" }], tue: [] },
              },
            ],
          },
          hass: BG_24H,
          now: MONDAY,
        }),
      ),
    );
    expect(host.querySelector(".strip")).toBeNull();
  });

  it("marks today's cells", () => {
    const host = renderToHost(renderGrid(makeContext({ raw, hass: BG_24H, now: MONDAY })));
    // Two slot rows, Monday column in each.
    expect(host.querySelectorAll(".grid-cell.today")).toHaveLength(2);
  });

  it("prompts for slots and shows only the strip when a person defines none", () => {
    const host = renderToHost(
      renderGrid(
        makeContext({
          raw: {
            ...raw,
            people: [{ name: "Иван", schedule: { mon: [{ activity: "judo" }], tue: [] } }],
          },
          hass: BG_24H,
          now: MONDAY,
        }),
      ),
    );
    expect(host.querySelector(".grid")).toBeNull();
    expect(host.querySelector(".no-slots")!.textContent!.trim())
      .toBe("Добавете часови интервали, за да използвате изгледа „Мрежа“.");
    expect(host.querySelector(".strip")).not.toBeNull();
  });

  it("orders slot rows by slot number, not config order", () => {
    const host = renderToHost(
      renderGrid(
        makeContext({
          raw: {
            ...raw,
            people: [
              {
                name: "Иван",
                slots: [
                  { slot: 2, start: "08:45", end: "09:30" },
                  { slot: 1, start: "08:00", end: "08:45" },
                ],
                schedule: { mon: [], tue: [] },
              },
            ],
          },
          hass: BG_24H,
          now: MONDAY,
        }),
      ),
    );
    expect(textsOf(host, ".slot-label")).toEqual(["08:00–08:45", "08:45–09:30"]);
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run test/renderers-grid.test.ts`
Expected: FAIL — cannot resolve `../src/renderers/grid.js`.

- [ ] **Step 7: Write minimal implementation**

Create `src/renderers/grid.ts`:

```ts
import { html, nothing, type TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { gridPlacement, type GridPlacement } from "../grid-placement.js";
import { formatTime } from "../time.js";
import type { DayKey } from "../types.js";
import { renderBlock } from "./block.js";
import { dayHeading } from "./blocks.js";
import type { RenderContext } from "./context.js";

export function renderGrid(ctx: RenderContext): TemplateResult {
  const slots = [...(ctx.person.slots ?? [])].sort((a, b) => a.slot - b.slot);

  const placements = new Map<DayKey, GridPlacement>();
  for (const day of ctx.days) {
    placements.set(day, gridPlacement(slots, ctx.person.schedule[day] ?? []));
  }

  const hasLoose = ctx.days.some((day) => placements.get(day)!.loose.length > 0);
  const sizing = styleMap({ "--wtc-day-count": String(ctx.days.length) });

  return html`
    ${hasLoose
      ? html`
          <div class="strip" style=${sizing}>
            <div class="strip-label"></div>
            ${ctx.days.map(
              (day) => html`
                <div class="strip-cell">
                  ${placements.get(day)!.loose.map((block) => renderBlock(ctx, block))}
                </div>
              `,
            )}
          </div>
        `
      : nothing}
    ${slots.length === 0
      ? html`<div class="no-slots">${ctx.strings.editor.noSlots}</div>`
      : html`
          <div class="grid" style=${sizing}>
            <div class="grid-corner"></div>
            ${ctx.days.map((day) => html`<div class="grid-head">${dayHeading(ctx, day)}</div>`)}
            ${slots.map(
              (slot) => html`
                <div class="slot-label">
                  ${ctx.strings.range(
                    formatTime(slot.start, ctx.hass, ctx.lang),
                    formatTime(slot.end, ctx.hass, ctx.lang),
                  )}
                </div>
                ${ctx.days.map(
                  (day) => html`
                    <div class="grid-cell ${ctx.today === day ? "today" : ""}">
                      ${(placements.get(day)!.bySlot.get(slot.slot) ?? []).map((block) =>
                        renderBlock(ctx, block),
                      )}
                    </div>
                  `,
                )}
              `,
            )}
          </div>
        `}
  `;
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run test/renderers-grid.test.ts`
Expected: PASS with 0 failures, and the run reports this file (not "No test files found").

- [ ] **Step 9: Typecheck**

Run: `npm run typecheck`
Expected: no output, exit 0.

- [ ] **Step 10: Commit**

```bash
git add src/grid-placement.ts src/renderers/grid.ts test/grid-placement.test.ts test/renderers-grid.test.ts
git commit -m "Add grid layout with slot placement and open-ended strip"
```

---

### Task 11: Card element and development harness

This task wires the renderers into a real custom element and gives it somewhere to be looked at. `getConfigElement` is deliberately **not** added here — the editor element does not exist yet, and a `getConfigElement` returning an undefined tag would render an empty editor dialog. Task 13 adds it.

**Files:**
- Create: `src/card.ts`, `dev/index.html`, `dev/mock-hass.js`
- Test: `test/card.test.ts`

**Interfaces:**
- Consumes: `normaliseConfig`, `getStubConfig`, `buildContext`, `renderBlocks`, `renderGrid`, `densityFor`, `contrastTextColor`, `cardStyles`, `CARD_VERSION`.
- Produces:
  - `class WeeklyTimetableCard extends LitElement`, registered as `weekly-timetable-card`
  - Public reactive properties: `hass?: Hass`, `density: Density`
  - `setConfig(config: unknown): void`, `getCardSize(): number`
  - `static getStubConfig(hass?: Hass): CardConfig`, `static getLayoutOptions()`

- [ ] **Step 1: Write the failing test**

Create `test/card.test.ts`:

```ts
import { beforeAll, describe, expect, it } from "vitest";
import "../src/card.js";
import type { WeeklyTimetableCard } from "../src/card.js";
import { BG_24H, EN_12H } from "./helpers.js";

const raw = {
  days: ["mon", "tue"],
  activities: [
    { id: "english", label: "Английски", color: "#3b82f6" },
    { id: "maths", label: "Математика", color: "#22c55e" },
  ],
  people: [
    { name: "Иван", emoji: "🥋", schedule: { mon: [{ activity: "english" }], tue: [] } },
    { name: "Мария", emoji: "🎻", schedule: { mon: [{ activity: "maths" }], tue: [] } },
  ],
};

async function makeCard(config: unknown, hass = BG_24H): Promise<WeeklyTimetableCard> {
  const card = document.createElement("weekly-timetable-card") as WeeklyTimetableCard;
  card.hass = hass;
  card.setConfig(config);
  document.body.append(card);
  await card.updateComplete;
  return card;
}

const shadow = (card: WeeklyTimetableCard) => card.shadowRoot!;

describe("WeeklyTimetableCard", () => {
  beforeAll(() => {
    document.body.innerHTML = "";
  });

  it("is registered under the distinct element name", () => {
    expect(customElements.get("weekly-timetable-card")).toBeDefined();
  });

  it("advertises itself to the Add-card picker", () => {
    const entry = (window as unknown as { customCards?: Array<Record<string, unknown>> })
      // HA's card picker prepends "custom:" itself when it builds the config,
      // so the registry entry carries the bare element name. Verified against
      // the upstream lovelace-timetable-card, which pushes "timetable-card".
      .customCards?.find((card) => card.type === "weekly-timetable-card");
    expect(entry).toBeDefined();
    expect(entry!.preview).toBe(true);
  });

  it("propagates a config error from setConfig so HA can display it", () => {
    const card = document.createElement("weekly-timetable-card") as WeeklyTimetableCard;
    expect(() => card.setConfig({})).toThrow(/people/);
  });

  it("renders the blocks layout by default", async () => {
    const card = await makeCard(raw);
    expect(shadow(card).querySelector(".week")).not.toBeNull();
    expect(shadow(card).querySelector(".grid")).toBeNull();
  });

  it("renders the grid layout when configured", async () => {
    const card = await makeCard({
      ...raw,
      layout: "grid",
      people: [
        {
          name: "Иван",
          slots: [{ slot: 1, start: "08:00", end: "08:45" }],
          schedule: { mon: [{ activity: "english", start: "08:00", end: "08:45" }], tue: [] },
        },
      ],
    });
    expect(shadow(card).querySelector(".grid")).not.toBeNull();
  });

  it("falls back to the blocks layout when stacked, even in grid mode", async () => {
    const card = await makeCard({ ...raw, layout: "grid" });
    card.density = "stacked";
    await card.updateComplete;
    expect(shadow(card).querySelector(".week")).not.toBeNull();
    expect(shadow(card).querySelector(".grid")).toBeNull();
  });

  it("exposes the density on the body so CSS can key off it", async () => {
    const card = await makeCard(raw);
    card.density = "compact";
    await card.updateComplete;
    expect(shadow(card).querySelector(".body")!.getAttribute("data-density")).toBe("compact");
  });

  it("renders the title only when one is configured", async () => {
    expect(shadow(await makeCard(raw)).querySelector(".card-title")).toBeNull();
    const titled = await makeCard({ ...raw, title: "Седмична програма" });
    expect(shadow(titled).querySelector(".card-title")!.textContent!.trim())
      .toBe("Седмична програма");
  });

  it("shows tabs only when there is more than one person", async () => {
    const many = await makeCard(raw);
    expect(shadow(many).querySelectorAll(".tab")).toHaveLength(2);

    const one = await makeCard({ ...raw, people: [raw.people[0]] });
    expect(shadow(one).querySelector(".tabs")).toBeNull();
  });

  it("switches person when a tab is clicked", async () => {
    const card = await makeCard(raw);
    const tabs = shadow(card).querySelectorAll<HTMLButtonElement>(".tab");
    expect(shadow(card).querySelector(".block-label")!.textContent!.trim()).toBe("Английски");

    tabs[1]!.click();
    await card.updateComplete;
    expect(shadow(card).querySelector(".block-label")!.textContent!.trim()).toBe("Математика");
    expect(tabs[1]!.getAttribute("aria-selected")).toBe("true");
  });

  it("re-renders in the viewer's language when hass changes", async () => {
    const card = await makeCard(raw, BG_24H);
    expect(shadow(card).querySelector(".day-head")!.textContent!.trim()).toBe("понеделник");

    card.hass = EN_12H;
    await card.updateComplete;
    expect(shadow(card).querySelector(".day-head")!.textContent!.trim()).toBe("Monday");
  });

  it("clamps the active person when the config shrinks", async () => {
    const card = await makeCard(raw);
    shadow(card).querySelectorAll<HTMLButtonElement>(".tab")[1]!.click();
    await card.updateComplete;

    card.setConfig({ ...raw, people: [raw.people[0]] });
    await card.updateComplete;
    expect(shadow(card).querySelector(".block-label")!.textContent!.trim()).toBe("Английски");
  });

  it("sets the header colour and a contrasting header text colour", async () => {
    const card = await makeCard({ ...raw, header_color: "#ffffff" });
    const haCard = shadow(card).querySelector<HTMLElement>("ha-card")!;
    expect(haCard.style.getPropertyValue("--wtc-header-color")).toBe("#ffffff");
    expect(haCard.style.getPropertyValue("--wtc-header-text")).toBe("#0f172a");
  });

  it("offers a stub config for the card picker", () => {
    const stub = (customElements.get("weekly-timetable-card") as typeof WeeklyTimetableCard)
      .getStubConfig(BG_24H);
    expect(stub.people).toHaveLength(1);
    expect(stub.days).toEqual(["mon", "tue", "wed", "thu", "fri"]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/card.test.ts`
Expected: FAIL — cannot resolve `../src/card.js`.

- [ ] **Step 3: Write minimal implementation**

`density` is a public reactive property rather than internal state so the ResizeObserver, the dev harness and the tests all drive it the same way. The observer is created only when `ResizeObserver` exists, so the card still renders in a test environment that lacks it.

Create `src/card.ts`:

```ts
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { contrastTextColor } from "./color.js";
import { CARD_TYPE, DEFAULT_DAYS, getStubConfig, normaliseConfig } from "./config.js";
import { densityFor } from "./density.js";
import { renderBlocks } from "./renderers/blocks.js";
import { buildContext } from "./renderers/context.js";
import { renderGrid } from "./renderers/grid.js";
import { cardStyles } from "./styles.js";
import type { CardConfig, Density, Hass } from "./types.js";
import { CARD_VERSION } from "./version.js";

@customElement("weekly-timetable-card")
export class WeeklyTimetableCard extends LitElement {
  static override styles = cardStyles;

  @property({ attribute: false }) hass?: Hass;
  @property({ attribute: false }) density: Density = "full";

  @state() private _config?: CardConfig;
  @state() private _personIndex = 0;

  private _observer?: ResizeObserver;

  static getStubConfig(hass?: Hass): CardConfig {
    return getStubConfig(hass);
  }

  static getLayoutOptions(): { grid_columns: string; grid_rows: string } {
    return { grid_columns: "full", grid_rows: "auto" };
  }

  setConfig(config: unknown): void {
    this._config = normaliseConfig(config);
    this._personIndex = Math.min(this._personIndex, this._config.people.length - 1);
  }

  getCardSize(): number {
    return 6;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (typeof ResizeObserver === "undefined") return;
    this._observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      const next = densityFor(width, this._dayCount());
      if (next !== this.density) this.density = next;
    });
    this._observer.observe(this);
  }

  override disconnectedCallback(): void {
    this._observer?.disconnect();
    this._observer = undefined;
    super.disconnectedCallback();
  }

  private _dayCount(): number {
    const config = this._config;
    if (!config) return DEFAULT_DAYS.length;
    const person = config.people[Math.min(this._personIndex, config.people.length - 1)];
    return (person?.days ?? config.days).length;
  }

  override render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;

    const ctx = buildContext({
      config,
      personIndex: this._personIndex,
      hass: this.hass,
      density: this.density,
    });

    const body =
      this.density === "stacked" || config.layout === "blocks"
        ? renderBlocks(ctx)
        : renderGrid(ctx);

    const cardStyle = styleMap({
      "--wtc-header-color": config.header_color,
      "--wtc-header-text": contrastTextColor(config.header_color),
      "--wtc-accent": ctx.person.color ?? "var(--primary-color)",
    });

    return html`
      <ha-card style=${cardStyle}>
        ${config.title ? html`<h1 class="card-title">${config.title}</h1>` : nothing}
        ${config.people.length > 1 ? this._renderTabs(config) : nothing}
        <div class="body" data-density=${this.density}>${body}</div>
      </ha-card>
    `;
  }

  private _renderTabs(config: CardConfig): TemplateResult {
    return html`
      <div class="tabs" role="tablist">
        ${config.people.map(
          (person, index) => html`
            <button
              class="tab"
              role="tab"
              type="button"
              aria-selected=${index === this._personIndex ? "true" : "false"}
              style=${styleMap({ "--wtc-accent": person.color ?? "var(--primary-color)" })}
              @click=${() => {
                this._personIndex = index;
              }}
            >
              ${person.emoji ? html`<span>${person.emoji}</span>` : nothing}
              <span>${person.name}</span>
            </button>
          `,
        )}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "weekly-timetable-card": WeeklyTimetableCard;
  }
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

console.info(
  `%c WEEKLY-TIMETABLE-CARD %c v${CARD_VERSION} `,
  "color:#fff;background:#1e3a5f;padding:2px 4px;border-radius:3px 0 0 3px",
  "color:#1e3a5f;background:#e2e8f0;padding:2px 4px;border-radius:0 3px 3px 0",
);

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: CARD_TYPE.replace(/^custom:/, ""),
  name: "Weekly Timetable Card",
  description: "Weekly timetable for one or more people, in English or Bulgarian",
  preview: true,
  documentationURL: "https://github.com/kosio/weekly-timetable-card",
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/card.test.ts`
Expected: PASS with 0 failures, and the run reports this file (not "No test files found").

- [ ] **Step 5: Build the bundle**

Run: `npm run build`
Expected: esbuild reports `dist/weekly-timetable-card.js` written.

- [ ] **Step 6: Create `dev/mock-hass.js`**

`ha-card` only exists inside Home Assistant, so the harness defines a stand-in. Without it the card renders into an unstyled inline element and every layout looks broken for reasons that have nothing to do with the card.

```js
class HaCardStub extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = `
      <style>
        :host {
          display: block;
          background: var(--card-background-color, #fff);
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
          color: var(--primary-text-color, #212121);
        }
      </style>
      <slot></slot>
    `;
  }
}
if (!customElements.get("ha-card")) customElements.define("ha-card", HaCardStub);

const ACTIVITIES = [
  { id: "english", label: "Английски", color: "#3b82f6" },
  { id: "daycare", label: "Занималня", color: "#64748b" },
  { id: "break", label: "Почивка и хапване", color: "#94a3b8" },
  { id: "judo", label: "Джудо", color: "#f97316" },
  { id: "chess", label: "Шах", color: "#a855f7" },
  { id: "free", label: "Свободен следобед", color: "#22c55e" },
  { id: "home", label: "Връщане вкъщи", color: "#22c55e" },
];

const SCHOOL_DAY = (afternoon) => [
  { activity: "english", start: "15:20", end: "16:20" },
  { activity: "break", start: "16:20", end: "17:30" },
  { activity: afternoon, start: "17:30", end: "18:30" },
  { activity: "home", start: "18:30" },
];

const CLUB_DAY = [
  { activity: "daycare", end: "16:00" },
  { activity: "break", start: "16:00", end: "16:30" },
  { activity: "chess", start: "16:30", end: "17:30" },
];

const baseConfig = () => ({
  type: "custom:weekly-timetable-card",
  title: "Седмична програма",
  layout: "blocks",
  days: ["mon", "tue", "wed", "thu", "fri"],
  language: "auto",
  highlight_today: true,
  header_color: "#1e3a5f",
  activities: ACTIVITIES,
  people: [
    {
      name: "Иван",
      emoji: "🥋",
      color: "#f472b6",
      slots: [
        { slot: 1, start: "08:00", end: "08:45" },
        { slot: 2, start: "08:45", end: "09:30" },
        { slot: 3, start: "09:50", end: "10:35" },
      ],
      schedule: {
        mon: SCHOOL_DAY("judo"),
        tue: [{ activity: "daycare", end: "16:00" }, { activity: "free", start: "16:00" }],
        wed: SCHOOL_DAY("judo"),
        thu: CLUB_DAY,
        fri: CLUB_DAY,
        sat: [{ activity: "judo", start: "10:00", end: "11:30" }],
        sun: [],
      },
    },
    {
      name: "Мария",
      emoji: "🎻",
      color: "#38bdf8",
      schedule: {
        mon: [{ activity: "daycare", end: "16:00" }],
        tue: SCHOOL_DAY("chess"),
        wed: [],
        thu: [{ activity: "free" }],
        fri: CLUB_DAY,
        sat: [],
        sun: [],
      },
    },
  ],
});

const card = document.querySelector("weekly-timetable-card");
const frame = document.querySelector("#frame");
const controls = document.querySelector(".controls");

function readControls() {
  const value = (name) => controls.querySelector(`[name="${name}"]`).value;
  return {
    hassLanguage: value("hass-language"),
    timeFormat: value("time-format"),
    cardLanguage: value("card-language"),
    layout: value("layout"),
    dayCount: Number(value("day-count")),
    width: Number(value("width")),
    theme: value("theme"),
  };
}

function apply() {
  const state = readControls();

  card.hass = {
    language: state.hassLanguage,
    locale: { language: state.hassLanguage, time_format: state.timeFormat, first_weekday: "monday" },
  };

  const config = baseConfig();
  config.language = state.cardLanguage;
  config.layout = state.layout;
  config.days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"].slice(0, state.dayCount);
  card.setConfig(config);

  frame.style.width = `${state.width}px`;
  document.documentElement.dataset.theme = state.theme;
  controls.querySelector("#width-readout").textContent = `${state.width}px`;
}

controls.addEventListener("input", apply);
controls.addEventListener("change", apply);
apply();
```

- [ ] **Step 7: Create `dev/index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Weekly Timetable Card — dev harness</title>
    <style>
      :root {
        --card-background-color: #ffffff;
        --primary-text-color: #212121;
        --secondary-text-color: #727272;
        --secondary-background-color: #f1f5f9;
        --divider-color: #e0e0e0;
        --primary-color: #03a9f4;
        --ha-card-border-radius: 12px;
        color-scheme: light;
        --page-background: #f4f6f8;
      }
      :root[data-theme="dark"] {
        --card-background-color: #1c1c1c;
        --primary-text-color: #e1e1e1;
        --secondary-text-color: #9b9b9b;
        --secondary-background-color: #282828;
        --divider-color: #3a3a3a;
        --primary-color: #03a9f4;
        color-scheme: dark;
        --page-background: #111315;
      }
      body {
        margin: 0;
        padding: 24px;
        background: var(--page-background);
        color: var(--primary-text-color);
        font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
      }
      .controls {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        align-items: end;
        margin-bottom: 24px;
        padding: 16px;
        background: var(--card-background-color);
        border-radius: 12px;
      }
      .controls label {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 12px;
        color: var(--secondary-text-color);
      }
      .controls select,
      .controls input {
        font: inherit;
        font-size: 13px;
        padding: 4px 6px;
      }
      #frame {
        max-width: 100%;
        margin: 0 auto;
        transition: width 120ms ease;
      }
    </style>
  </head>
  <body>
    <div class="controls">
      <label>
        HA language
        <select name="hass-language">
          <option value="bg">bg</option>
          <option value="en-GB">en-GB</option>
          <option value="en-US">en-US</option>
          <option value="de">de</option>
        </select>
      </label>
      <label>
        Clock
        <select name="time-format">
          <option value="language">language</option>
          <option value="24">24</option>
          <option value="12">12</option>
          <option value="system">system</option>
        </select>
      </label>
      <label>
        Card language
        <select name="card-language">
          <option value="auto">auto</option>
          <option value="bg">bg</option>
          <option value="en">en</option>
        </select>
      </label>
      <label>
        Layout
        <select name="layout">
          <option value="blocks">blocks</option>
          <option value="grid">grid</option>
        </select>
      </label>
      <label>
        Days
        <select name="day-count">
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
        </select>
      </label>
      <label>
        Theme
        <select name="theme">
          <option value="light">light</option>
          <option value="dark">dark</option>
        </select>
      </label>
      <label>
        Width <span id="width-readout">900px</span>
        <input name="width" type="range" min="280" max="1400" step="10" value="900" />
      </label>
    </div>

    <div id="frame"><weekly-timetable-card></weekly-timetable-card></div>

    <script type="module" src="../dist/weekly-timetable-card.js"></script>
    <script type="module" src="./mock-hass.js"></script>
  </body>
</html>
```

- [ ] **Step 8: Verify the harness by eye**

Run: `npm run watch`
Open the printed URL, then check each of the following and fix any that are wrong before committing:
- Blocks layout at 900px with 5 days matches the reference design: navy uppercase headers, pastel blocks, time line above label.
- Setting HA language to `bg` shows `ПОНЕДЕЛНИК`; `en-GB` shows `MONDAY`.
- Clock `12` with `en-US` shows `until 4:00 PM`; clock `24` shows `до 16:00`.
- Dragging Width down switches day names to short forms, then to a single stacked column.
- 7 days at 900px is still `full` density (≈129px per column) and must not look
  cramped; drag Width down to ≈700px to see it switch to short day names.
- Layout `grid` shows the slot ruler with the open-ended strip above it for Иван, and the "add time slots" prompt for Мария.
- Theme `dark` keeps every block readable.

- [ ] **Step 9: Typecheck and run the full suite**

Run: `npm run typecheck && npm test`
Expected: typecheck silent; every test file passes with 0 failures.

- [ ] **Step 10: Commit**

```bash
git add src/card.ts dev/index.html dev/mock-hass.js dist/weekly-timetable-card.js test/card.test.ts
git commit -m "Add the card element and a standalone development harness"
```

---

### Task 12: Editor mutations

Every editor gesture routes through this module. It has no DOM and no Lit, so the whole edit surface is unit-testable, and the drag layer added later calls exactly the same functions the buttons do.

**Files:**
- Create: `src/editor/mutations.ts`
- Modify: `src/time.ts` (add `addMinutes`)
- Test: `test/mutations.test.ts`, `test/time.test.ts` (extend)

**Interfaces:**
- Consumes: `uniqueActivityId`, `DAY_KEYS`, config types.
- Produces:
  - `addMinutes(time: string, minutes: number): string` (from `src/time.ts`)
  - `interface BlockRef { day: DayKey; index: number }`
  - `interface BlockPatch { activity?: string; start?: string | null; end?: string | null }`
  - `interface PersonPatch { name?: string; emoji?: string | null; color?: string | null; days?: DayKey[] | null; slots?: Slot[] | null }`
  - `updateCard`, `addPerson`, `removePerson`, `updatePerson`
  - `addBlock`, `updateBlock`, `removeBlock`, `moveBlock`, `moveBlockBy`
  - `addActivity`, `updateActivity`, `removeActivity`, `countActivityUses`
  - `addSlot`, `updateSlot`, `removeSlot`

- [ ] **Step 1: Extend the time test**

Append to `test/time.test.ts`:

```ts
import { addMinutes } from "../src/time.js";

describe("addMinutes", () => {
  it("adds within the hour and across it", () => {
    expect(addMinutes("08:00", 45)).toBe("08:45");
    expect(addMinutes("08:45", 45)).toBe("09:30");
  });

  it("wraps around midnight in both directions", () => {
    expect(addMinutes("23:30", 45)).toBe("00:15");
    expect(addMinutes("00:15", -45)).toBe("23:30");
  });

  it("returns an unparseable value unchanged", () => {
    expect(addMinutes("half four", 45)).toBe("half four");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/time.test.ts`
Expected: FAIL — `addMinutes` is not exported.

- [ ] **Step 3: Add `addMinutes` to `src/time.ts`**

```ts
const MINUTES_PER_DAY = 24 * 60;

export function addMinutes(time: string, minutes: number): string {
  const match = TIME_PATTERN.exec(time.trim());
  if (!match) return time;
  const base = Number(match[1]) * 60 + Number(match[2]);
  const total = ((base + minutes) % MINUTES_PER_DAY + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  const hours = Math.floor(total / 60);
  return `${String(hours).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/time.test.ts`
Expected: PASS with 0 failures, and the run reports this file (not "No test files found").

- [ ] **Step 5: Write the failing test for mutations**

Create `test/mutations.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { normaliseConfig } from "../src/config.js";
import {
  addActivity,
  addBlock,
  addPerson,
  addSlot,
  countActivityUses,
  moveBlock,
  moveBlockBy,
  removeActivity,
  removeBlock,
  removePerson,
  removeSlot,
  updateActivity,
  updateBlock,
  updateCard,
  updatePerson,
  updateSlot,
} from "../src/editor/mutations.js";
import type { CardConfig } from "../src/types.js";

const base = (): CardConfig =>
  normaliseConfig({
    days: ["mon", "tue"],
    activities: [
      { id: "english", label: "Английски", color: "#3b82f6" },
      { id: "judo", label: "Джудо", color: "#f97316" },
    ],
    people: [
      {
        name: "Иван",
        slots: [{ slot: 1, start: "08:00", end: "08:45" }],
        schedule: {
          mon: [
            { activity: "english", start: "15:20", end: "16:20" },
            { activity: "judo", start: "17:30", end: "18:30" },
          ],
          tue: [{ activity: "english" }],
        },
      },
      // Мария carries one `english` block so countActivityUses is actually
      // exercised across people, not just across days. Her `mon` must stay
      // empty — Task 17's insertBlock test inserts into it.
      { name: "Мария", schedule: { mon: [], tue: [{ activity: "english" }] } },
    ],
  });

/** Runs a mutation and asserts it neither returned nor mutated the input. */
function immutable(run: (config: CardConfig) => CardConfig): CardConfig {
  const config = base();
  const snapshot = JSON.stringify(config);
  const next = run(config);
  expect(JSON.stringify(config)).toBe(snapshot);
  expect(next).not.toBe(config);
  return next;
}

describe("updateCard", () => {
  it("patches card-level fields", () => {
    const next = immutable((config) => updateCard(config, { layout: "grid", title: "X" }));
    expect(next.layout).toBe("grid");
    expect(next.title).toBe("X");
    expect(next.people).toHaveLength(2);
  });
});

describe("people", () => {
  it("appends a person with an empty schedule", () => {
    const next = immutable((config) => addPerson(config, "Нов"));
    expect(next.people).toHaveLength(3);
    expect(next.people[2]).toEqual({ name: "Нов", schedule: {} });
  });

  it("removes a person", () => {
    const next = immutable((config) => removePerson(config, 0));
    expect(next.people.map((person) => person.name)).toEqual(["Мария"]);
  });

  it("refuses to remove the last person", () => {
    const config = normaliseConfig({ people: [{ name: "Solo", schedule: {} }] });
    expect(removePerson(config, 0)).toBe(config);
  });

  it("patches a person's name", () => {
    const next = immutable((config) => updatePerson(config, 1, { name: "Мери" }));
    expect(next.people[1]!.name).toBe("Мери");
    expect(next.people[0]!.name).toBe("Иван");
  });

  it("clears an optional field with null and sets it with a value", () => {
    const withEmoji = updatePerson(base(), 0, { emoji: "🎻", color: "#123456" });
    expect(withEmoji.people[0]!.emoji).toBe("🎻");
    const cleared = updatePerson(withEmoji, 0, { emoji: null, color: null });
    expect("emoji" in cleared.people[0]!).toBe(false);
    expect("color" in cleared.people[0]!).toBe(false);
  });

  it("clears a day override with null so the person inherits again", () => {
    const narrowed = updatePerson(base(), 0, { days: ["sat"] });
    expect(narrowed.people[0]!.days).toEqual(["sat"]);
    const restored = updatePerson(narrowed, 0, { days: null });
    expect("days" in restored.people[0]!).toBe(false);
  });

  it("treats an empty day list as clearing the override", () => {
    const next = updatePerson(base(), 0, { days: [] });
    expect("days" in next.people[0]!).toBe(false);
  });

  it("creates empty schedule arrays for days the override adds", () => {
    const next = updatePerson(base(), 0, { days: ["mon", "sat"] });
    expect(next.people[0]!.schedule.sat).toEqual([]);
    expect(next.people[0]!.schedule.mon).toHaveLength(2);
  });

  it("ignores an out-of-range person index", () => {
    const config = base();
    expect(updatePerson(config, 9, { name: "X" })).toBe(config);
  });
});

describe("blocks", () => {
  it("appends a block to a day", () => {
    const next = immutable((config) =>
      addBlock(config, 0, "tue", { activity: "judo", end: "16:00" }),
    );
    expect(next.people[0]!.schedule.tue).toEqual([
      { activity: "english" },
      { activity: "judo", end: "16:00" },
    ]);
  });

  it("patches a block's activity", () => {
    const next = immutable((config) => updateBlock(config, 0, "mon", 0, { activity: "judo" }));
    expect(next.people[0]!.schedule.mon![0]!.activity).toBe("judo");
  });

  it("clearing the start turns a range into the until form", () => {
    const next = updateBlock(base(), 0, "mon", 0, { start: null });
    expect(next.people[0]!.schedule.mon![0]).toEqual({ activity: "english", end: "16:20" });
  });

  it("clearing the end turns a range into the after form", () => {
    const next = updateBlock(base(), 0, "mon", 0, { end: "" });
    expect(next.people[0]!.schedule.mon![0]).toEqual({ activity: "english", start: "15:20" });
  });

  it("clearing both times gives the bare form", () => {
    const next = updateBlock(base(), 0, "mon", 0, { start: null, end: null });
    expect(next.people[0]!.schedule.mon![0]).toEqual({ activity: "english" });
  });

  it("setting a time on a bare block gives the until form", () => {
    const next = updateBlock(base(), 0, "tue", 0, { end: "16:00" });
    expect(next.people[0]!.schedule.tue![0]).toEqual({ activity: "english", end: "16:00" });
  });

  it("removes a block", () => {
    const next = immutable((config) => removeBlock(config, 0, "mon", 0));
    expect(next.people[0]!.schedule.mon!.map((block) => block.activity)).toEqual(["judo"]);
  });

  it("ignores an out-of-range block index", () => {
    const config = base();
    expect(removeBlock(config, 0, "mon", 9)).toBe(config);
    expect(updateBlock(config, 0, "mon", 9, { activity: "judo" })).toBe(config);
  });
});

describe("moving blocks", () => {
  it("reorders within a day", () => {
    const next = immutable((config) =>
      moveBlock(config, 0, { day: "mon", index: 0 }, { day: "mon", index: 1 }),
    );
    expect(next.people[0]!.schedule.mon!.map((block) => block.activity)).toEqual([
      "judo", "english",
    ]);
  });

  it("moves to another day and removes it from the source exactly once", () => {
    const next = moveBlock(base(), 0, { day: "mon", index: 0 }, { day: "tue", index: 0 });
    expect(next.people[0]!.schedule.mon!.map((block) => block.activity)).toEqual(["judo"]);
    expect(next.people[0]!.schedule.tue!.map((block) => block.activity)).toEqual([
      "english", "english",
    ]);
  });

  it("clamps a target index past the end", () => {
    const next = moveBlock(base(), 0, { day: "mon", index: 0 }, { day: "tue", index: 99 });
    expect(next.people[0]!.schedule.tue!).toHaveLength(2);
  });

  it("moveBlockBy shifts up and down", () => {
    const down = moveBlockBy(base(), 0, "mon", 0, 1);
    expect(down.people[0]!.schedule.mon!.map((block) => block.activity)).toEqual([
      "judo", "english",
    ]);
    const up = moveBlockBy(down, 0, "mon", 1, -1);
    expect(up.people[0]!.schedule.mon!.map((block) => block.activity)).toEqual([
      "english", "judo",
    ]);
  });

  it("moveBlockBy is a no-op at either end", () => {
    const config = base();
    expect(moveBlockBy(config, 0, "mon", 0, -1)).toBe(config);
    expect(moveBlockBy(config, 0, "mon", 1, 1)).toBe(config);
  });
});

describe("activities", () => {
  it("adds an activity with a generated id", () => {
    const next = immutable((config) => addActivity(config, "Шах", "#a855f7"));
    expect(next.activities[2]).toEqual({ id: "шах", label: "Шах", color: "#a855f7" });
  });

  it("suffixes a colliding generated id", () => {
    const once = addActivity(base(), "Шах", "#a855f7");
    const twice = addActivity(once, "Шах", "#000000");
    expect(twice.activities.map((activity) => activity.id)).toContain("шах-2");
  });

  it("renaming does not change the id, so blocks keep resolving", () => {
    const next = immutable((config) => updateActivity(config, 0, { label: "English" }));
    expect(next.activities[0]).toEqual({ id: "english", label: "English", color: "#3b82f6" });
    expect(countActivityUses(next, "english")).toBe(3);
  });

  it("removes an activity, leaving referencing blocks as orphans", () => {
    const next = immutable((config) => removeActivity(config, 0));
    expect(next.activities.map((activity) => activity.id)).toEqual(["judo"]);
    expect(next.people[0]!.schedule.mon![0]!.activity).toBe("english");
  });

  it("counts uses across every person and day", () => {
    expect(countActivityUses(base(), "english")).toBe(3);
    expect(countActivityUses(base(), "judo")).toBe(1);
    expect(countActivityUses(base(), "missing")).toBe(0);
  });

  it("ignores out-of-range activity indices", () => {
    const config = base();
    expect(updateActivity(config, 9, { label: "X" })).toBe(config);
    expect(removeActivity(config, 9)).toBe(config);
  });
});

describe("slots", () => {
  it("appends a slot continuing from the previous one", () => {
    const next = immutable((config) => addSlot(config, 0));
    expect(next.people[0]!.slots).toEqual([
      { slot: 1, start: "08:00", end: "08:45" },
      { slot: 2, start: "08:45", end: "09:30" },
    ]);
  });

  it("seeds the first slot when a person has none", () => {
    const next = addSlot(base(), 1);
    expect(next.people[1]!.slots).toEqual([{ slot: 1, start: "08:00", end: "08:45" }]);
  });

  it("patches and removes a slot", () => {
    const patched = updateSlot(base(), 0, 0, { end: "09:00" });
    expect(patched.people[0]!.slots![0]!.end).toBe("09:00");
    expect(removeSlot(patched, 0, 0).people[0]!.slots).toEqual([]);
  });

  it("ignores out-of-range slot indices", () => {
    const config = base();
    expect(updateSlot(config, 0, 9, { end: "09:00" })).toBe(config);
    expect(removeSlot(config, 0, 9)).toBe(config);
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run test/mutations.test.ts`
Expected: FAIL — cannot resolve `../src/editor/mutations.js`.

- [ ] **Step 7: Write minimal implementation**

Create `src/editor/mutations.ts`:

```ts
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
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run test/mutations.test.ts`
Expected: PASS with 0 failures, and the run reports this file (not "No test files found").

- [ ] **Step 9: Typecheck**

Run: `npm run typecheck`
Expected: no output, exit 0.

- [ ] **Step 10: Commit**

```bash
git add src/editor/mutations.ts src/time.ts test/mutations.test.ts test/time.test.ts
git commit -m "Add pure config mutations for the editor"
```

---

### Task 13: Panel context, editor styles and the Settings panel

**Design note — native inputs.** The panels use plain `<input>`, `<select>` and `<button>` styled with Home Assistant's CSS variables, not `ha-textfield` / `ha-select` / `ha-switch`. Those are internal HA components with no cross-version API guarantee, and they cannot be instantiated under jsdom, so using them would both couple us to HA internals and make the entire editor untestable. Native elements avoid both and still pick up the active theme.

Panels are **pure functions** returning a `TemplateResult`, exactly like the renderers. They receive the current config and a `commit` callback; they hold no state of their own. The editor element owns all state.

**Never bind `.value` on a `<select>` whose options come from the same template.** Lit commits template parts in document order, so the `.value` binding on the `<select>` runs *before* the child part that creates its `<option>` elements — on first render it assigns a value no option has yet, and silently resolves to `""`. Selectedness is bound on the options instead, with `.selected=${...}`, which commits after each option exists. Every `<select>` in the editor follows this pattern.

**Files:**
- Create: `src/editor/panel-context.ts`, `src/editor/settings-panel.ts`
- Modify: `src/days.ts` (add `toggleDayList`), `src/color.ts` (add `toHexInputValue`), `src/styles.ts` (add `editorStyles`)
- Test: `test/days.test.ts` (extend), `test/color.test.ts` (extend), `test/settings-panel.test.ts`

**Interfaces:**
- Consumes: `updateCard`, `daysFromFirstWeekday`, `Strings`.
- Produces:
  - `interface PanelContext { config: CardConfig; strings: Strings; hass?: Hass; commit: (next: CardConfig) => void }`
  - `toggleDayList(days: DayKey[], day: DayKey, order: DayKey[]): DayKey[]`
  - `toHexInputValue(color: string, fallback: string): string`
  - `editorStyles: CSSResult` (composes `blockStyles` from Task 8, so the
    Activities panel's preview chips are styled identically to the card's blocks)
  - `renderSettingsPanel(ctx: PanelContext): TemplateResult`

- [ ] **Step 1: Extend the days test**

Append to `test/days.test.ts`:

```ts
import { toggleDayList } from "../src/days.js";

describe("toggleDayList", () => {
  const order: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

  it("removes a selected day", () => {
    expect(toggleDayList(["mon", "tue", "wed"], "tue", order)).toEqual(["mon", "wed"]);
  });

  it("inserts an unselected day at its canonical position", () => {
    expect(toggleDayList(["mon", "wed"], "tue", order)).toEqual(["mon", "tue", "wed"]);
    expect(toggleDayList(["mon", "tue"], "sat", order)).toEqual(["mon", "tue", "sat"]);
  });

  it("preserves an author's custom order rather than re-sorting", () => {
    expect(toggleDayList(["fri", "mon"], "sun", order)).toEqual(["fri", "mon", "sun"]);
  });

  it("refuses to empty the list", () => {
    const only: DayKey[] = ["mon"];
    expect(toggleDayList(only, "mon", order)).toBe(only);
  });

  it("does not mutate the input", () => {
    const days: DayKey[] = ["mon", "wed"];
    toggleDayList(days, "tue", order);
    expect(days).toEqual(["mon", "wed"]);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/days.test.ts`
Expected: FAIL — `toggleDayList` is not exported.

- [ ] **Step 3: Add `toggleDayList` to `src/days.ts`**

```ts
/**
 * Inserts at the position implied by `order` while leaving the existing
 * relative order alone, so an author who hand-ordered days in YAML does not
 * have that order re-sorted by a click in the editor.
 */
export function toggleDayList(days: DayKey[], day: DayKey, order: DayKey[]): DayKey[] {
  if (days.includes(day)) {
    if (days.length <= 1) return days;
    return days.filter((entry) => entry !== day);
  }
  const rank = (entry: DayKey) => order.indexOf(entry);
  const position = days.findIndex((entry) => rank(entry) > rank(day));
  const next = [...days];
  next.splice(position === -1 ? next.length : position, 0, day);
  return next;
}
```

- [ ] **Step 4: Extend the colour test**

Append to `test/color.test.ts`:

```ts
import { toHexInputValue } from "../src/color.js";

describe("toHexInputValue", () => {
  it("normalises to the six-digit form an <input type=color> requires", () => {
    expect(toHexInputValue("#FFF", "#1e3a5f")).toBe("#ffffff");
    expect(toHexInputValue("1e3a5f", "#000000")).toBe("#1e3a5f");
  });

  it("falls back for a colour the input cannot represent", () => {
    expect(toHexInputValue("var(--primary-color)", "#1e3a5f")).toBe("#1e3a5f");
    expect(toHexInputValue("", "#1e3a5f")).toBe("#1e3a5f");
  });
});
```

- [ ] **Step 5: Add `toHexInputValue` to `src/color.ts`**

```ts
export function toHexInputValue(color: string, fallback: string): string {
  const rgb = parseHexColor(color);
  if (!rgb) return fallback;
  const channel = (value: number) => value.toString(16).padStart(2, "0");
  return `#${channel(rgb.r)}${channel(rgb.g)}${channel(rgb.b)}`;
}
```

- [ ] **Step 6: Run both tests to verify they pass**

Run: `npx vitest run test/days.test.ts test/color.test.ts`
Expected: PASS with 0 failures, and the run reports this file (not "No test files found").

- [ ] **Step 7: Create `src/editor/panel-context.ts`**

```ts
import type { Strings } from "../i18n/types.js";
import type { CardConfig, Hass } from "../types.js";

export interface PanelContext {
  config: CardConfig;
  strings: Strings;
  hass?: Hass;
  /** Always called with a NEW config object. See fire-event.ts. */
  commit: (next: CardConfig) => void;
}

export function inputValue(event: Event): string {
  return (event.target as HTMLInputElement | HTMLSelectElement).value;
}

export function checkboxValue(event: Event): boolean {
  return (event.target as HTMLInputElement).checked;
}
```

- [ ] **Step 8: Add `editorStyles` to `src/styles.ts`**

```ts
export const editorStyles = css`
  ${blockStyles}

  :host {
    display: block;
  }

  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 16px;
  }

  .tab {
    padding: 6px 12px;
    border: 1px solid var(--divider-color);
    border-radius: 999px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 13px;
    cursor: pointer;
  }

  .tab[aria-selected="true"] {
    border-color: var(--primary-color);
    background: color-mix(in srgb, var(--primary-color) 14%, var(--card-background-color, #ffffff));
    font-weight: 600;
  }

  .panel {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
    color: var(--secondary-text-color);
  }

  .field.inline {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .hint {
    font-size: 11px;
    color: var(--secondary-text-color);
  }

  input[type="text"],
  input[type="time"],
  input[type="number"],
  select {
    padding: 6px 8px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 13px;
  }

  input[type="color"] {
    width: 40px;
    height: 32px;
    padding: 0;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: none;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .chip {
    padding: 5px 10px;
    border: 1px solid var(--divider-color);
    border-radius: 999px;
    background: var(--card-background-color);
    color: var(--secondary-text-color);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
  }

  .chip[aria-pressed="true"] {
    border-color: var(--primary-color);
    background: color-mix(in srgb, var(--primary-color) 16%, var(--card-background-color, #ffffff));
    color: var(--primary-text-color);
    font-weight: 600;
  }

  .row {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .row .grow {
    flex: 1;
    min-width: 0;
  }

  .icon-button {
    width: 30px;
    height: 30px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: var(--card-background-color);
    color: var(--primary-text-color);
    font: inherit;
    line-height: 1;
    cursor: pointer;
  }

  .icon-button[disabled] {
    opacity: 0.4;
    cursor: default;
  }

  .day-group {
    padding: 10px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
  }

  .day-group > h4 {
    margin: 0 0 8px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--secondary-text-color);
  }

  .day-group.drop-target {
    border-color: var(--primary-color);
    background: color-mix(in srgb, var(--primary-color) 8%, var(--card-background-color, #ffffff));
  }

  .block-rows {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .drag-handle {
    cursor: grab;
    touch-action: none;
  }

  .palette {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .palette-chip {
    padding: 6px 10px;
    border: 1px solid var(--divider-color);
    border-radius: 999px;
    font: inherit;
    font-size: 12px;
    cursor: pointer;
    touch-action: none;
  }

  .palette-chip[aria-pressed="true"] {
    outline: 2px solid var(--primary-color);
  }
`;
```

- [ ] **Step 9: Write the failing test**

Create `test/settings-panel.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { normaliseConfig } from "../src/config.js";
import { renderSettingsPanel } from "../src/editor/settings-panel.js";
import { en } from "../src/i18n/en.js";
import type { CardConfig } from "../src/types.js";
import { renderToHost } from "./helpers.js";

function mount(raw: unknown) {
  const config = normaliseConfig(raw);
  const commit = vi.fn<(next: CardConfig) => void>();
  const host = renderToHost(
    renderSettingsPanel({ config, strings: en, hass: undefined, commit }),
  );
  return { config, commit, host };
}

const raw = { people: [{ name: "Иван", schedule: {} }] };

describe("renderSettingsPanel", () => {
  it("shows the current values", () => {
    const { host } = mount({ ...raw, title: "Week", layout: "grid", header_color: "#ffffff" });
    expect(host.querySelector<HTMLInputElement>('[data-field="title"]')!.value).toBe("Week");
    expect(host.querySelector<HTMLSelectElement>('[data-field="layout"]')!.value).toBe("grid");
    expect(host.querySelector<HTMLInputElement>('[data-field="header_color"]')!.value)
      .toBe("#ffffff");
    expect(host.querySelector<HTMLInputElement>('[data-field="highlight_today"]')!.checked)
      .toBe(true);
  });

  it("commits a new config object on title change", () => {
    const { config, commit, host } = mount(raw);
    const input = host.querySelector<HTMLInputElement>('[data-field="title"]')!;
    input.value = "Седмична програма";
    input.dispatchEvent(new Event("change"));

    expect(commit).toHaveBeenCalledOnce();
    const next = commit.mock.calls[0]![0];
    expect(next).not.toBe(config);
    expect(next.title).toBe("Седмична програма");
  });

  it("clears the title back to undefined when emptied", () => {
    const { commit, host } = mount({ ...raw, title: "Week" });
    const input = host.querySelector<HTMLInputElement>('[data-field="title"]')!;
    input.value = "";
    input.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[0]![0].title).toBeUndefined();
  });

  it("commits a layout change", () => {
    const { commit, host } = mount(raw);
    const select = host.querySelector<HTMLSelectElement>('[data-field="layout"]')!;
    select.value = "grid";
    select.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[0]![0].layout).toBe("grid");
  });

  it("renders all seven day chips with the configured ones pressed", () => {
    const { host } = mount(raw);
    const chips = host.querySelectorAll<HTMLButtonElement>(".chip[data-day]");
    expect(chips).toHaveLength(7);
    const pressed = [...chips].filter((chip) => chip.getAttribute("aria-pressed") === "true");
    expect(pressed.map((chip) => chip.dataset.day)).toEqual([
      "mon", "tue", "wed", "thu", "fri",
    ]);
  });

  it("adds a day when an unpressed chip is clicked", () => {
    const { commit, host } = mount(raw);
    host.querySelector<HTMLButtonElement>('.chip[data-day="sat"]')!.click();
    expect(commit.mock.calls[0]![0].days).toEqual(["mon", "tue", "wed", "thu", "fri", "sat"]);
  });

  it("removes a day when a pressed chip is clicked", () => {
    const { commit, host } = mount(raw);
    host.querySelector<HTMLButtonElement>('.chip[data-day="wed"]')!.click();
    expect(commit.mock.calls[0]![0].days).toEqual(["mon", "tue", "thu", "fri"]);
  });

  it("commits the language and highlight-today controls", () => {
    const { commit, host } = mount(raw);

    const language = host.querySelector<HTMLSelectElement>('[data-field="language"]')!;
    language.value = "bg";
    language.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[0]![0].language).toBe("bg");

    const toggle = host.querySelector<HTMLInputElement>('[data-field="highlight_today"]')!;
    toggle.checked = false;
    toggle.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[1]![0].highlight_today).toBe(false);
  });

  it("orders the day chips by the Home Assistant first weekday", () => {
    const config = normaliseConfig(raw);
    const host = renderToHost(
      renderSettingsPanel({
        config,
        strings: en,
        hass: { locale: { first_weekday: "sunday" } },
        commit: vi.fn(),
      }),
    );
    const chips = [...host.querySelectorAll<HTMLButtonElement>(".chip[data-day]")];
    expect(chips[0]!.dataset.day).toBe("sun");
  });
});
```

- [ ] **Step 10: Run test to verify it fails**

Run: `npx vitest run test/settings-panel.test.ts`
Expected: FAIL — cannot resolve `../src/editor/settings-panel.js`.

- [ ] **Step 11: Write minimal implementation**

Create `src/editor/settings-panel.ts`:

```ts
import { html, type TemplateResult } from "lit";
import { toHexInputValue } from "../color.js";
import { DEFAULT_HEADER_COLOR } from "../config.js";
import { daysFromFirstWeekday, toggleDayList } from "../days.js";
import type { Layout } from "../types.js";
import { updateCard } from "./mutations.js";
import { checkboxValue, inputValue, type PanelContext } from "./panel-context.js";

export function renderSettingsPanel(ctx: PanelContext): TemplateResult {
  const { config, strings, commit } = ctx;
  const order = daysFromFirstWeekday(ctx.hass);

  return html`
    <div class="panel">
      <label class="field">
        <span>${strings.editor.title}</span>
        <input
          type="text"
          data-field="title"
          .value=${config.title ?? ""}
          @change=${(event: Event) =>
            commit(updateCard(config, { title: inputValue(event) || undefined }))}
        />
      </label>

      <label class="field">
        <span>${strings.editor.layout}</span>
        <select
          data-field="layout"
          @change=${(event: Event) =>
            commit(updateCard(config, { layout: inputValue(event) as Layout }))}
        >
          <option value="blocks" .selected=${config.layout === "blocks"}>
            ${strings.editor.layoutBlocks}
          </option>
          <option value="grid" .selected=${config.layout === "grid"}>
            ${strings.editor.layoutGrid}
          </option>
        </select>
      </label>

      <div class="field">
        <span>${strings.editor.days}</span>
        <div class="chips">
          ${order.map(
            (day) => html`
              <button
                type="button"
                class="chip"
                data-day=${day}
                aria-pressed=${config.days.includes(day) ? "true" : "false"}
                @click=${() =>
                  commit(updateCard(config, { days: toggleDayList(config.days, day, order) }))}
              >
                ${strings.days[day].short}
              </button>
            `,
          )}
        </div>
      </div>

      <label class="field">
        <span>${strings.editor.language}</span>
        <select
          data-field="language"
          @change=${(event: Event) =>
            commit(updateCard(config, { language: inputValue(event) as CardConfig["language"] }))}
        >
          <option value="auto" .selected=${config.language === "auto"}>
            ${strings.editor.languageAuto}
          </option>
          <option value="en" .selected=${config.language === "en"}>
            ${strings.editor.languageEnglish}
          </option>
          <option value="bg" .selected=${config.language === "bg"}>
            ${strings.editor.languageBulgarian}
          </option>
        </select>
      </label>

      <label class="field inline">
        <input
          type="checkbox"
          data-field="highlight_today"
          .checked=${config.highlight_today}
          @change=${(event: Event) =>
            commit(updateCard(config, { highlight_today: checkboxValue(event) }))}
        />
        <span>${strings.editor.highlightToday}</span>
      </label>

      <label class="field inline">
        <input
          type="color"
          data-field="header_color"
          .value=${toHexInputValue(config.header_color, DEFAULT_HEADER_COLOR)}
          @change=${(event: Event) =>
            commit(updateCard(config, { header_color: inputValue(event) }))}
        />
        <span>${strings.editor.headerColor}</span>
      </label>
    </div>
  `;
}
```

- [ ] **Step 12: Run test to verify it passes**

Run: `npx vitest run test/settings-panel.test.ts`
Expected: PASS with 0 failures, and the run reports this file (not "No test files found").

- [ ] **Step 13: Typecheck**

Run: `npm run typecheck`
Expected: no output, exit 0.

- [ ] **Step 14: Commit**

```bash
git add src/editor/panel-context.ts src/editor/settings-panel.ts src/days.ts src/color.ts src/styles.ts test/settings-panel.test.ts test/days.test.ts test/color.test.ts
git commit -m "Add editor panel context, editor styles and the Settings panel"
```

---

### Task 14: Activities panel

**Files:**
- Create: `src/editor/activities-panel.ts`
- Test: `test/activities-panel.test.ts`

**Interfaces:**
- Consumes: `addActivity`, `updateActivity`, `removeActivity`, `countActivityUses`, `activityFill`, `activityBorder`, `toHexInputValue`, `PanelContext`.
- Produces: `renderActivitiesPanel(ctx: PanelContext): TemplateResult`

- [ ] **Step 1: Write the failing test**

Create `test/activities-panel.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { normaliseConfig } from "../src/config.js";
import { renderActivitiesPanel } from "../src/editor/activities-panel.js";
import { en } from "../src/i18n/en.js";
import type { CardConfig } from "../src/types.js";
import { renderToHost } from "./helpers.js";

const raw = {
  activities: [
    { id: "english", label: "Английски", color: "#3b82f6" },
    { id: "judo", label: "Джудо", color: "#f97316" },
  ],
  people: [{ name: "Иван", schedule: { mon: [{ activity: "english" }] } }],
};

function mount(source: unknown = raw) {
  const config = normaliseConfig(source);
  const commit = vi.fn<(next: CardConfig) => void>();
  const host = renderToHost(
    renderActivitiesPanel({ config, strings: en, hass: undefined, commit }),
  );
  return { config, commit, host };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("renderActivitiesPanel", () => {
  it("lists every activity with its label and colour", () => {
    const { host } = mount();
    const labels = [...host.querySelectorAll<HTMLInputElement>('[data-field="label"]')];
    expect(labels.map((input) => input.value)).toEqual(["Английски", "Джудо"]);
    expect(host.querySelector<HTMLInputElement>('[data-field="color"]')!.value).toBe("#3b82f6");
  });

  it("renames without changing the id", () => {
    const { commit, host } = mount();
    const input = host.querySelectorAll<HTMLInputElement>('[data-field="label"]')[0]!;
    input.value = "English";
    input.dispatchEvent(new Event("change"));

    const next = commit.mock.calls[0]![0];
    expect(next.activities[0]).toEqual({ id: "english", label: "English", color: "#3b82f6" });
  });

  it("commits a colour change", () => {
    const { commit, host } = mount();
    const input = host.querySelectorAll<HTMLInputElement>('[data-field="color"]')[1]!;
    input.value = "#ff0000";
    input.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[0]![0].activities[1]!.color).toBe("#ff0000");
  });

  it("adds an activity from the new-activity field", () => {
    const { commit, host } = mount();
    const input = host.querySelector<HTMLInputElement>('[data-field="new-label"]')!;
    input.value = "Шах";
    host.querySelector<HTMLButtonElement>('[data-action="add-activity"]')!.click();

    const next = commit.mock.calls[0]![0];
    expect(next.activities[2]).toMatchObject({ id: "шах", label: "Шах" });
  });

  it("ignores an add with a blank label", () => {
    const { commit, host } = mount();
    host.querySelector<HTMLInputElement>('[data-field="new-label"]')!.value = "   ";
    host.querySelector<HTMLButtonElement>('[data-action="add-activity"]')!.click();
    expect(commit).not.toHaveBeenCalled();
  });

  it("removes an unused activity without asking", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    const { commit, host } = mount();
    host.querySelectorAll<HTMLButtonElement>('[data-action="remove-activity"]')[1]!.click();

    expect(confirmSpy).not.toHaveBeenCalled();
    expect(commit.mock.calls[0]![0].activities.map((a) => a.id)).toEqual(["english"]);
  });

  it("warns before removing an activity still in use, naming the count", () => {
    const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);
    const { commit, host } = mount();
    host.querySelectorAll<HTMLButtonElement>('[data-action="remove-activity"]')[0]!.click();

    expect(confirmSpy).toHaveBeenCalledOnce();
    expect(confirmSpy.mock.calls[0]![0]).toContain("1 block");
    expect(commit).toHaveBeenCalledOnce();
  });

  it("keeps the activity when the warning is declined", () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const { commit, host } = mount();
    host.querySelectorAll<HTMLButtonElement>('[data-action="remove-activity"]')[0]!.click();
    expect(commit).not.toHaveBeenCalled();
  });

  it("shows a live preview chip per activity", () => {
    const { host } = mount();
    expect(host.querySelectorAll(".block")).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/activities-panel.test.ts`
Expected: FAIL — cannot resolve `../src/editor/activities-panel.js`.

- [ ] **Step 3: Write minimal implementation**

Create `src/editor/activities-panel.ts`:

```ts
import { html, type TemplateResult } from "lit";
import { styleMap } from "lit/directives/style-map.js";
import { activityBorder, activityFill, toHexInputValue } from "../color.js";
import type { Activity } from "../types.js";
import {
  addActivity,
  countActivityUses,
  removeActivity,
  updateActivity,
} from "./mutations.js";
import { inputValue, type PanelContext } from "./panel-context.js";

const NEW_ACTIVITY_COLOR = "#64748b";

export function renderActivitiesPanel(ctx: PanelContext): TemplateResult {
  const { config, strings, commit } = ctx;

  const onRemove = (index: number, activity: Activity) => {
    const uses = countActivityUses(config, activity.id);
    if (uses > 0) {
      const message = `${strings.editor.activityInUse(activity.label, uses)} ${
        strings.editor.confirmRemoveActivity
      }`;
      if (!window.confirm(message)) return;
    }
    commit(removeActivity(config, index));
  };

  return html`
    <div class="panel">
      ${config.activities.map(
        (activity, index) => html`
          <div class="row" data-activity=${activity.id}>
            <input
              type="color"
              data-field="color"
              .value=${toHexInputValue(activity.color, NEW_ACTIVITY_COLOR)}
              @change=${(event: Event) =>
                commit(updateActivity(config, index, { color: inputValue(event) }))}
            />
            <input
              class="grow"
              type="text"
              data-field="label"
              .value=${activity.label}
              @change=${(event: Event) =>
                commit(updateActivity(config, index, { label: inputValue(event) }))}
            />
            <button
              class="icon-button"
              type="button"
              data-action="remove-activity"
              title=${strings.editor.remove}
              @click=${() => onRemove(index, activity)}
            >
              ×
            </button>
          </div>
        `,
      )}

      <div class="row">
        <input
          class="grow"
          type="text"
          data-field="new-label"
          placeholder=${strings.editor.label}
        />
        <button
          class="icon-button"
          type="button"
          data-action="add-activity"
          title=${strings.editor.addActivity}
          @click=${(event: Event) => {
            const button = event.currentTarget as HTMLElement;
            const field = button.parentElement!.querySelector<HTMLInputElement>(
              '[data-field="new-label"]',
            )!;
            const label = field.value.trim();
            if (label.length === 0) return;
            field.value = "";
            commit(addActivity(config, label, NEW_ACTIVITY_COLOR));
          }}
        >
          +
        </button>
      </div>

      <div class="palette">
        ${config.activities.map(
          (activity) => html`
            <div
              class="block"
              style=${styleMap({
                "--wtc-block-fill": activityFill(activity.color),
                "--wtc-block-border": activityBorder(activity.color),
              })}
            >
              <div class="block-label">${activity.label}</div>
            </div>
          `,
        )}
      </div>
    </div>
  `;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/activities-panel.test.ts`
Expected: PASS with 0 failures, and the run reports this file (not "No test files found").

- [ ] **Step 5: Typecheck**

Run: `npm run typecheck`
Expected: no output, exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/editor/activities-panel.ts test/activities-panel.test.ts
git commit -m "Add the Activities panel with in-use warning on delete"
```

---

### Task 15: Person panel and the schedule list editor

This is the largest panel. It is complete on its own: add, edit, reorder, move between days and remove all have a control. Task 17 layers dragging over the same mutations.

**Files:**
- Create: `src/editor/person-panel.ts`
- Test: `test/person-panel.test.ts`

**Interfaces:**
- Consumes: every mutation from `src/editor/mutations.ts`; `effectiveDays`, `daysFromFirstWeekday`, `toggleDayList`, `toHexInputValue`, `blockForm`.
- Produces:
  - `interface PersonPanelOptions { personIndex: number; selectedActivity: string | null; onSelectActivity: (id: string | null) => void }`
  - `renderPersonPanel(ctx: PanelContext, options: PersonPanelOptions): TemplateResult`

- [ ] **Step 1: Write the failing test**

Create `test/person-panel.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { normaliseConfig } from "../src/config.js";
import { renderPersonPanel } from "../src/editor/person-panel.js";
import { en } from "../src/i18n/en.js";
import type { CardConfig } from "../src/types.js";
import { renderToHost } from "./helpers.js";

const raw = {
  days: ["mon", "tue"],
  activities: [
    { id: "english", label: "Английски", color: "#3b82f6" },
    { id: "judo", label: "Джудо", color: "#f97316" },
  ],
  people: [
    {
      name: "Иван",
      emoji: "🥋",
      color: "#f472b6",
      slots: [
        { slot: 1, start: "08:00", end: "08:45" },
        { slot: 2, start: "08:45", end: "09:30" },
      ],
      schedule: {
        mon: [
          { activity: "english", start: "15:20", end: "16:20" },
          { activity: "judo", start: "17:30", end: "18:30" },
        ],
        tue: [{ activity: "english", end: "16:00" }],
      },
    },
    { name: "Мария", schedule: { mon: [], tue: [] } },
  ],
};

function mount(source: unknown = raw, personIndex = 0) {
  const config = normaliseConfig(source);
  const commit = vi.fn<(next: CardConfig) => void>();
  const onSelectActivity = vi.fn<(id: string | null) => void>();
  const host = renderToHost(
    renderPersonPanel(
      { config, strings: en, hass: undefined, commit },
      { personIndex, selectedActivity: null, onSelectActivity },
    ),
  );
  return { config, commit, onSelectActivity, host };
}

const rows = (host: HTMLElement, day: string) =>
  [...host.querySelectorAll<HTMLElement>(`[data-day="${day}"] [data-block-index]`)];

describe("person fields", () => {
  it("shows name, emoji and colour", () => {
    const { host } = mount();
    expect(host.querySelector<HTMLInputElement>('[data-field="name"]')!.value).toBe("Иван");
    expect(host.querySelector<HTMLInputElement>('[data-field="emoji"]')!.value).toBe("🥋");
    expect(host.querySelector<HTMLInputElement>('[data-field="person-color"]')!.value)
      .toBe("#f472b6");
  });

  it("commits a name change", () => {
    const { commit, host } = mount();
    const input = host.querySelector<HTMLInputElement>('[data-field="name"]')!;
    input.value = "Ivan";
    input.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[0]![0].people[0]!.name).toBe("Ivan");
  });

  it("clears the person colour", () => {
    const { commit, host } = mount();
    host.querySelector<HTMLButtonElement>('[data-action="clear-person-color"]')!.click();
    expect("color" in commit.mock.calls[0]![0].people[0]!).toBe(false);
  });

  it("removes the person", () => {
    const { commit, host } = mount();
    host.querySelector<HTMLButtonElement>('[data-action="remove-person"]')!.click();
    expect(commit.mock.calls[0]![0].people.map((person) => person.name)).toEqual(["Мария"]);
  });
});

describe("day override", () => {
  it("is unchecked and hides the chips when the person inherits", () => {
    const { host } = mount();
    expect(host.querySelector<HTMLInputElement>('[data-field="own-days"]')!.checked).toBe(false);
    expect(host.querySelectorAll(".chip[data-person-day]")).toHaveLength(0);
  });

  it("seeds the override from the card days when checked", () => {
    const { commit, host } = mount();
    const toggle = host.querySelector<HTMLInputElement>('[data-field="own-days"]')!;
    toggle.checked = true;
    toggle.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[0]![0].people[0]!.days).toEqual(["mon", "tue"]);
  });

  it("clears the override when unchecked", () => {
    const { commit, host } = mount({
      ...raw,
      people: [{ ...raw.people[0], days: ["mon", "sat"] }, raw.people[1]],
    });
    const toggle = host.querySelector<HTMLInputElement>('[data-field="own-days"]')!;
    toggle.checked = false;
    toggle.dispatchEvent(new Event("change"));
    expect("days" in commit.mock.calls[0]![0].people[0]!).toBe(false);
  });

  it("toggles a day within the override", () => {
    const { commit, host } = mount({
      ...raw,
      people: [{ ...raw.people[0], days: ["mon", "tue"] }, raw.people[1]],
    });
    host.querySelector<HTMLButtonElement>('.chip[data-person-day="sat"]')!.click();
    expect(commit.mock.calls[0]![0].people[0]!.days).toEqual(["mon", "tue", "sat"]);
  });
});

describe("slots", () => {
  it("are hidden in the blocks layout", () => {
    const { host } = mount();
    expect(host.querySelector('[data-section="slots"]')).toBeNull();
  });

  it("are listed in the grid layout", () => {
    const { host } = mount({ ...raw, layout: "grid" });
    expect(host.querySelectorAll('[data-section="slots"] [data-slot-index]')).toHaveLength(2);
  });

  it("appends a slot", () => {
    const { commit, host } = mount({ ...raw, layout: "grid" });
    host.querySelector<HTMLButtonElement>('[data-action="add-slot"]')!.click();
    expect(commit.mock.calls[0]![0].people[0]!.slots).toHaveLength(3);
  });

  it("edits and removes a slot", () => {
    const { commit, host } = mount({ ...raw, layout: "grid" });
    const end = host.querySelectorAll<HTMLInputElement>('[data-field="slot-end"]')[0]!;
    end.value = "09:00";
    end.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[0]![0].people[0]!.slots![0]!.end).toBe("09:00");

    host.querySelectorAll<HTMLButtonElement>('[data-action="remove-slot"]')[0]!.click();
    expect(commit.mock.calls[1]![0].people[0]!.slots).toHaveLength(1);
  });
});

describe("schedule rows", () => {
  it("renders one group per effective day and one row per block", () => {
    const { host } = mount();
    expect(host.querySelectorAll("[data-day]")).toHaveLength(2);
    expect(rows(host, "mon")).toHaveLength(2);
    expect(rows(host, "tue")).toHaveLength(1);
  });

  it("shows start and end fields in the blocks layout", () => {
    const { host } = mount();
    const row = rows(host, "mon")[0]!;
    expect(row.querySelector<HTMLInputElement>('[data-field="start"]')!.value).toBe("15:20");
    expect(row.querySelector<HTMLInputElement>('[data-field="end"]')!.value).toBe("16:20");
    expect(row.querySelector('[data-field="slot"]')).toBeNull();
  });

  it("shows a slot dropdown instead of time fields in the grid layout", () => {
    const { host } = mount({ ...raw, layout: "grid" });
    const row = rows(host, "mon")[0]!;
    expect(row.querySelector('[data-field="start"]')).toBeNull();
    expect(row.querySelector<HTMLSelectElement>('[data-field="slot"]')).not.toBeNull();
  });

  it("changing the activity commits the new id", () => {
    const { commit, host } = mount();
    const select = rows(host, "mon")[0]!.querySelector<HTMLSelectElement>('[data-field="activity"]')!;
    select.value = "judo";
    select.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[0]![0].people[0]!.schedule.mon![0]!.activity).toBe("judo");
  });

  it("clearing the start field produces the until form", () => {
    const { commit, host } = mount();
    const input = rows(host, "mon")[0]!.querySelector<HTMLInputElement>('[data-field="start"]')!;
    input.value = "";
    input.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[0]![0].people[0]!.schedule.mon![0]!)
      .toEqual({ activity: "english", end: "16:20" });
  });

  it("choosing a slot writes both times, and the none option clears them", () => {
    const { commit, host } = mount({ ...raw, layout: "grid" });
    const select = rows(host, "tue")[0]!.querySelector<HTMLSelectElement>('[data-field="slot"]')!;
    select.value = "2";
    select.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[0]![0].people[0]!.schedule.tue![0]!)
      .toEqual({ activity: "english", start: "08:45", end: "09:30" });

    select.value = "";
    select.dispatchEvent(new Event("change"));
    expect(commit.mock.calls[1]![0].people[0]!.schedule.tue![0]!)
      .toEqual({ activity: "english" });
  });

  it("reorders with the move buttons and disables them at the ends", () => {
    const { commit, host } = mount();
    const first = rows(host, "mon")[0]!;
    const last = rows(host, "mon")[1]!;

    expect(first.querySelector<HTMLButtonElement>('[data-action="move-up"]')!.disabled).toBe(true);
    expect(last.querySelector<HTMLButtonElement>('[data-action="move-down"]')!.disabled).toBe(true);

    first.querySelector<HTMLButtonElement>('[data-action="move-down"]')!.click();
    expect(commit.mock.calls[0]![0].people[0]!.schedule.mon!.map((b) => b.activity))
      .toEqual(["judo", "english"]);
  });

  it("removes a block", () => {
    const { commit, host } = mount();
    rows(host, "mon")[0]!.querySelector<HTMLButtonElement>('[data-action="remove-block"]')!.click();
    expect(commit.mock.calls[0]![0].people[0]!.schedule.mon!).toHaveLength(1);
  });

  it("adds a block to a day with the first activity", () => {
    const { commit, host } = mount();
    host.querySelector<HTMLButtonElement>('[data-day="tue"] [data-action="add-block"]')!.click();
    expect(commit.mock.calls[0]![0].people[0]!.schedule.tue!).toEqual([
      { activity: "english", end: "16:00" },
      { activity: "english" },
    ]);
  });
});

describe("palette and tap-to-place", () => {
  it("renders a palette chip per activity", () => {
    const { host } = mount();
    expect(host.querySelectorAll(".palette-chip")).toHaveLength(2);
  });

  it("selects an activity on chip click", () => {
    const { onSelectActivity, host } = mount();
    host.querySelectorAll<HTMLButtonElement>(".palette-chip")[1]!.click();
    expect(onSelectActivity).toHaveBeenCalledWith("judo");
  });

  it("deselects when the selected chip is clicked again", () => {
    const config = normaliseConfig(raw);
    const onSelectActivity = vi.fn<(id: string | null) => void>();
    const host = renderToHost(
      renderPersonPanel(
        { config, strings: en, hass: undefined, commit: vi.fn() },
        { personIndex: 0, selectedActivity: "judo", onSelectActivity },
      ),
    );
    host.querySelectorAll<HTMLButtonElement>(".palette-chip")[1]!.click();
    expect(onSelectActivity).toHaveBeenCalledWith(null);
  });

  it("appends the selected activity when a day group is clicked, then clears the selection", () => {
    const config = normaliseConfig(raw);
    const commit = vi.fn<(next: CardConfig) => void>();
    const onSelectActivity = vi.fn<(id: string | null) => void>();
    const host = renderToHost(
      renderPersonPanel(
        { config, strings: en, hass: undefined, commit },
        { personIndex: 0, selectedActivity: "judo", onSelectActivity },
      ),
    );
    host.querySelector<HTMLElement>('[data-day="tue"]')!.click();

    // Array.prototype.at is ES2022; this project's tsconfig lib is ES2021.
    const tue = commit.mock.calls[0]![0].people[0]!.schedule.tue!;
    expect(tue[tue.length - 1]).toEqual({ activity: "judo" });
    expect(onSelectActivity).toHaveBeenCalledWith(null);
  });

  it("does nothing on a day click with no selection", () => {
    const { commit, host } = mount();
    host.querySelector<HTMLElement>('[data-day="tue"]')!.click();
    expect(commit).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/person-panel.test.ts`
Expected: FAIL — cannot resolve `../src/editor/person-panel.js`.

- [ ] **Step 3: Write minimal implementation**

Create `src/editor/person-panel.ts`:

```ts
import { html, nothing, type TemplateResult } from "lit";
import { blockForm } from "../block.js";
import { toHexInputValue } from "../color.js";
import { daysFromFirstWeekday, effectiveDays, toggleDayList } from "../days.js";
import type { Block, DayKey, Person, Slot } from "../types.js";
import {
  addBlock,
  addSlot,
  moveBlockBy,
  removeBlock,
  removePerson,
  removeSlot,
  updateBlock,
  updatePerson,
  updateSlot,
} from "./mutations.js";
import { checkboxValue, inputValue, type PanelContext } from "./panel-context.js";

const DEFAULT_PERSON_COLOR = "#f472b6";

export interface PersonPanelOptions {
  personIndex: number;
  selectedActivity: string | null;
  onSelectActivity: (id: string | null) => void;
}

export function renderPersonPanel(
  ctx: PanelContext,
  options: PersonPanelOptions,
): TemplateResult {
  const { config, strings, commit } = ctx;
  const { personIndex } = options;
  const person = config.people[personIndex];
  if (!person) return html``;

  const order = daysFromFirstWeekday(ctx.hass);
  const days = effectiveDays(config, person);

  return html`
    <div class="panel">
      <div class="row">
        <input
          type="text"
          class="grow"
          data-field="name"
          .value=${person.name}
          placeholder=${strings.editor.personNamePlaceholder}
          @change=${(event: Event) =>
            commit(updatePerson(config, personIndex, { name: inputValue(event) }))}
        />
        <input
          type="text"
          data-field="emoji"
          style="width: 3.5rem"
          .value=${person.emoji ?? ""}
          placeholder=${strings.editor.emoji}
          @change=${(event: Event) =>
            commit(updatePerson(config, personIndex, { emoji: inputValue(event) || null }))}
        />
        <input
          type="color"
          data-field="person-color"
          .value=${toHexInputValue(person.color ?? DEFAULT_PERSON_COLOR, DEFAULT_PERSON_COLOR)}
          @change=${(event: Event) =>
            commit(updatePerson(config, personIndex, { color: inputValue(event) }))}
        />
        <button
          class="icon-button"
          type="button"
          data-action="clear-person-color"
          title=${strings.editor.color}
          @click=${() => commit(updatePerson(config, personIndex, { color: null }))}
        >
          ⌫
        </button>
        <button
          class="icon-button"
          type="button"
          data-action="remove-person"
          title=${strings.editor.removePerson}
          ?disabled=${config.people.length <= 1}
          @click=${() => commit(removePerson(config, personIndex))}
        >
          ×
        </button>
      </div>

      <label class="field inline">
        <input
          type="checkbox"
          data-field="own-days"
          .checked=${person.days !== undefined}
          @change=${(event: Event) =>
            commit(
              updatePerson(config, personIndex, {
                days: checkboxValue(event) ? [...config.days] : null,
              }),
            )}
        />
        <span>${strings.editor.daysOverride}</span>
      </label>
      ${person.days === undefined
        ? html`<div class="hint">${strings.editor.daysOverrideHint}</div>`
        : html`
            <div class="chips">
              ${order.map(
                (day) => html`
                  <button
                    type="button"
                    class="chip"
                    data-person-day=${day}
                    aria-pressed=${person.days!.includes(day) ? "true" : "false"}
                    @click=${() =>
                      commit(
                        updatePerson(config, personIndex, {
                          days: toggleDayList(person.days!, day, order),
                        }),
                      )}
                  >
                    ${strings.days[day].short}
                  </button>
                `,
              )}
            </div>
          `}

      ${config.layout === "grid" ? renderSlots(ctx, personIndex, person) : nothing}

      <div class="palette">
        ${config.activities.map(
          (activity) => html`
            <button
              type="button"
              class="palette-chip"
              data-palette-activity=${activity.id}
              aria-pressed=${options.selectedActivity === activity.id ? "true" : "false"}
              @click=${() =>
                options.onSelectActivity(
                  options.selectedActivity === activity.id ? null : activity.id,
                )}
            >
              ${activity.label}
            </button>
          `,
        )}
      </div>
      <div class="hint">${strings.editor.dragHint}</div>

      ${days.map((day) => renderDayGroup(ctx, options, person, day))}
    </div>
  `;
}

function renderSlots(
  ctx: PanelContext,
  personIndex: number,
  person: Person,
): TemplateResult {
  const { config, strings, commit } = ctx;
  const slots: Slot[] = person.slots ?? [];
  return html`
    <div class="day-group" data-section="slots">
      <h4>${strings.editor.slots}</h4>
      <div class="block-rows">
        ${slots.map(
          (slot, index) => html`
            <div class="row" data-slot-index=${index}>
              <span class="hint" style="width: 2rem">${slot.slot}</span>
              <input
                type="time"
                data-field="slot-start"
                .value=${slot.start}
                @change=${(event: Event) =>
                  commit(updateSlot(config, personIndex, index, { start: inputValue(event) }))}
              />
              <input
                type="time"
                data-field="slot-end"
                .value=${slot.end}
                @change=${(event: Event) =>
                  commit(updateSlot(config, personIndex, index, { end: inputValue(event) }))}
              />
              <button
                class="icon-button"
                type="button"
                data-action="remove-slot"
                title=${strings.editor.remove}
                @click=${() => commit(removeSlot(config, personIndex, index))}
              >
                ×
              </button>
            </div>
          `,
        )}
        <button
          class="chip"
          type="button"
          data-action="add-slot"
          @click=${() => commit(addSlot(config, personIndex))}
        >
          ＋ ${strings.editor.addSlot}
        </button>
      </div>
    </div>
  `;
}

function renderDayGroup(
  ctx: PanelContext,
  options: PersonPanelOptions,
  person: Person,
  day: DayKey,
): TemplateResult {
  const { config, strings, commit } = ctx;
  const { personIndex } = options;
  const blocks = person.schedule[day] ?? [];
  const firstActivity = config.activities[0]?.id;

  return html`
    <div
      class="day-group"
      data-day=${day}
      @click=${() => {
        if (!options.selectedActivity) return;
        commit(addBlock(config, personIndex, day, { activity: options.selectedActivity }));
        options.onSelectActivity(null);
      }}
    >
      <h4>${strings.days[day].full}</h4>
      <div class="block-rows">
        ${blocks.map((block, index) =>
          renderBlockRow(ctx, options, day, block, index, blocks.length),
        )}
        ${firstActivity
          ? html`
              <button
                class="chip"
                type="button"
                data-action="add-block"
                @click=${(event: Event) => {
                  event.stopPropagation();
                  commit(addBlock(config, personIndex, day, { activity: firstActivity }));
                }}
              >
                ＋ ${strings.editor.addBlock}
              </button>
            `
          : nothing}
      </div>
    </div>
  `;
}

function renderBlockRow(
  ctx: PanelContext,
  options: PersonPanelOptions,
  day: DayKey,
  block: Block,
  index: number,
  total: number,
): TemplateResult {
  const { config, strings, commit } = ctx;
  const { personIndex } = options;
  const person = config.people[personIndex]!;

  return html`
    <div class="row" data-block-index=${index} @click=${(event: Event) => event.stopPropagation()}>
      <span class="drag-handle" data-drag-block=${index} data-drag-day=${day}>⠿</span>
      <select
        class="grow"
        data-field="activity"
        @change=${(event: Event) =>
          commit(updateBlock(config, personIndex, day, index, { activity: inputValue(event) }))}
      >
        ${config.activities.map(
          (activity) => html`
            <option value=${activity.id} .selected=${activity.id === block.activity}>
              ${activity.label}
            </option>
          `,
        )}
        ${config.activities.some((activity) => activity.id === block.activity)
          ? nothing
          : html`<option value=${block.activity} .selected=${true}>${block.activity}</option>`}
      </select>

      ${config.layout === "grid"
        ? renderSlotSelect(ctx, personIndex, day, block, index, person.slots ?? [])
        : html`
            <input
              type="time"
              data-field="start"
              .value=${block.start ?? ""}
              @change=${(event: Event) =>
                commit(updateBlock(config, personIndex, day, index, { start: inputValue(event) || null }))}
            />
            <input
              type="time"
              data-field="end"
              .value=${block.end ?? ""}
              @change=${(event: Event) =>
                commit(updateBlock(config, personIndex, day, index, { end: inputValue(event) || null }))}
            />
          `}

      <button
        class="icon-button"
        type="button"
        data-action="move-up"
        title=${strings.editor.moveUp}
        ?disabled=${index === 0}
        @click=${() => commit(moveBlockBy(config, personIndex, day, index, -1))}
      >
        ↑
      </button>
      <button
        class="icon-button"
        type="button"
        data-action="move-down"
        title=${strings.editor.moveDown}
        ?disabled=${index >= total - 1}
        @click=${() => commit(moveBlockBy(config, personIndex, day, index, 1))}
      >
        ↓
      </button>
      <button
        class="icon-button"
        type="button"
        data-action="remove-block"
        title=${strings.editor.remove}
        @click=${() => commit(removeBlock(config, personIndex, day, index))}
      >
        ×
      </button>
    </div>
  `;
}

function renderSlotSelect(
  ctx: PanelContext,
  personIndex: number,
  day: DayKey,
  block: Block,
  index: number,
  slots: readonly Slot[],
): TemplateResult {
  const { config, strings, commit } = ctx;
  const current =
    blockForm(block) === "range"
      ? slots.find((slot) => slot.start === block.start && slot.end === block.end)
      : undefined;

  return html`
    <select
      data-field="slot"
      @change=${(event: Event) => {
        const raw = inputValue(event);
        if (raw === "") {
          commit(updateBlock(config, personIndex, day, index, { start: null, end: null }));
          return;
        }
        const slot = slots.find((candidate) => String(candidate.slot) === raw);
        if (!slot) return;
        commit(
          updateBlock(config, personIndex, day, index, { start: slot.start, end: slot.end }),
        );
      }}
    >
      <option value="" .selected=${current === undefined}>${strings.editor.slotNone}</option>
      ${slots.map(
        (slot) => html`
          <option value=${String(slot.slot)} .selected=${current?.slot === slot.slot}>
            ${slot.slot}. ${slot.start}–${slot.end}
          </option>
        `,
      )}
    </select>
  `;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run test/person-panel.test.ts`
Expected: PASS with 0 failures, and the run reports this file (not "No test files found").

- [ ] **Step 5: Typecheck**

Run: `npm run typecheck`
Expected: no output, exit 0.

- [ ] **Step 6: Commit**

```bash
git add src/editor/person-panel.ts test/person-panel.test.ts
git commit -m "Add the person panel with the schedule list editor"
```

---

### Task 16: Editor element and card wiring

**Files:**
- Create: `src/editor/fire-event.ts`, `src/editor/editor.ts`
- Modify: `src/card.ts` (import the editor, add `getConfigElement`)
- Test: `test/editor.test.ts`

**Interfaces:**
- Consumes: `normaliseConfig`, `resolveLang`, `stringsFor`, `editorStyles`, all three panels, `addPerson`.
- Produces:
  - `fireEvent<T>(node: HTMLElement, type: string, detail: T): void`
  - `class WeeklyTimetableCardEditor extends LitElement`, registered as `weekly-timetable-card-editor`
  - `WeeklyTimetableCard.getConfigElement(): HTMLElement`

- [ ] **Step 1: Write the failing test**

Create `test/editor.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import "../src/editor/editor.js";
import type { WeeklyTimetableCardEditor } from "../src/editor/editor.js";
import type { CardConfig } from "../src/types.js";
import { BG_24H, EN_12H } from "./helpers.js";

const raw = {
  days: ["mon", "tue"],
  activities: [{ id: "english", label: "Английски", color: "#3b82f6" }],
  people: [
    { name: "Иван", schedule: { mon: [{ activity: "english" }], tue: [] } },
    { name: "Мария", schedule: { mon: [], tue: [] } },
  ],
};

async function mount(config: unknown = raw, hass = EN_12H) {
  const editor = document.createElement(
    "weekly-timetable-card-editor",
  ) as WeeklyTimetableCardEditor;
  editor.hass = hass;
  editor.setConfig(config);
  document.body.append(editor);
  await editor.updateComplete;

  const events: CardConfig[] = [];
  editor.addEventListener("config-changed", (event) => {
    events.push((event as CustomEvent<{ config: CardConfig }>).detail.config);
  });
  return { editor, events, shadow: editor.shadowRoot! };
}

describe("WeeklyTimetableCardEditor", () => {
  it("is registered", () => {
    expect(customElements.get("weekly-timetable-card-editor")).toBeDefined();
  });

  it("renders Settings, a tab per person, add and Activities", async () => {
    const { shadow } = await mount();
    const labels = [...shadow.querySelectorAll(".tab")].map((tab) => tab.textContent!.trim());
    expect(labels).toEqual(["Settings", "Иван", "Мария", "＋", "Activities"]);
  });

  it("opens on the Settings panel", async () => {
    const { shadow } = await mount();
    expect(shadow.querySelector('[data-field="layout"]')).not.toBeNull();
  });

  it("switches to a person panel", async () => {
    const { editor, shadow } = await mount();
    shadow.querySelectorAll<HTMLButtonElement>(".tab")[1]!.click();
    await editor.updateComplete;
    expect(shadow.querySelector<HTMLInputElement>('[data-field="name"]')!.value).toBe("Иван");
  });

  it("switches to the Activities panel", async () => {
    const { editor, shadow } = await mount();
    shadow.querySelector<HTMLButtonElement>('[data-tab="activities"]')!.click();
    await editor.updateComplete;
    expect(shadow.querySelector('[data-field="new-label"]')).not.toBeNull();
  });

  it("fires config-changed with a new object when a panel commits", async () => {
    const { editor, events, shadow } = await mount();
    const input = shadow.querySelector<HTMLInputElement>('[data-field="title"]')!;
    input.value = "Седмична програма";
    input.dispatchEvent(new Event("change"));
    await editor.updateComplete;

    expect(events).toHaveLength(1);
    expect(events[0]!.title).toBe("Седмична програма");
  });

  it("fires a config-changed event that bubbles and is composed", async () => {
    const { editor, shadow } = await mount();
    const listener = vi.fn();
    document.body.addEventListener("config-changed", listener);

    const input = shadow.querySelector<HTMLInputElement>('[data-field="title"]')!;
    input.value = "X";
    input.dispatchEvent(new Event("change"));
    await editor.updateComplete;

    expect(listener).toHaveBeenCalledOnce();
    document.body.removeEventListener("config-changed", listener);
  });

  it("adds a person and selects the new tab", async () => {
    const { editor, events, shadow } = await mount();
    shadow.querySelector<HTMLButtonElement>('[data-tab="add"]')!.click();
    await editor.updateComplete;

    expect(events[0]!.people).toHaveLength(3);
    expect(shadow.querySelector<HTMLInputElement>('[data-field="name"]')!.value).toBe("");
  });

  it("falls back to Settings when the open person tab disappears", async () => {
    const { editor, shadow } = await mount();
    shadow.querySelectorAll<HTMLButtonElement>(".tab")[2]!.click();
    await editor.updateComplete;

    editor.setConfig({ ...raw, people: [raw.people[0]] });
    await editor.updateComplete;
    expect(shadow.querySelector('[data-field="layout"]')).not.toBeNull();
  });

  it("renders its own chrome in the viewer's language", async () => {
    const { shadow } = await mount(raw, BG_24H);
    expect(shadow.querySelector(".tab")!.textContent!.trim()).toBe("Настройки");
  });

  it("keeps a tap-to-place selection across a re-render", async () => {
    const { editor, shadow } = await mount();
    shadow.querySelectorAll<HTMLButtonElement>(".tab")[1]!.click();
    await editor.updateComplete;

    shadow.querySelector<HTMLButtonElement>(".palette-chip")!.click();
    await editor.updateComplete;
    expect(shadow.querySelector(".palette-chip")!.getAttribute("aria-pressed")).toBe("true");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run test/editor.test.ts`
Expected: FAIL — cannot resolve `../src/editor/editor.js`.

- [ ] **Step 3: Create `src/editor/fire-event.ts`**

```ts
/**
 * `composed: true` is required: the event is dispatched from inside the
 * editor's shadow root and Home Assistant listens on the host side of it.
 */
export function fireEvent<T>(node: HTMLElement, type: string, detail: T): void {
  node.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
}
```

- [ ] **Step 4: Create `src/editor/editor.ts`**

```ts
import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { normaliseConfig } from "../config.js";
import { resolveLang, stringsFor } from "../i18n/index.js";
import { editorStyles } from "../styles.js";
import type { CardConfig, Hass } from "../types.js";
import { renderActivitiesPanel } from "./activities-panel.js";
import { fireEvent } from "./fire-event.js";
import { addPerson } from "./mutations.js";
import type { PanelContext } from "./panel-context.js";
import { renderPersonPanel } from "./person-panel.js";
import { renderSettingsPanel } from "./settings-panel.js";

type Tab = "settings" | "activities" | { person: number };

@customElement("weekly-timetable-card-editor")
export class WeeklyTimetableCardEditor extends LitElement {
  static override styles = editorStyles;

  @property({ attribute: false }) hass?: Hass;

  @state() private _config?: CardConfig;
  @state() private _tab: Tab = "settings";
  @state() private _selectedActivity: string | null = null;

  setConfig(config: unknown): void {
    this._config = normaliseConfig(config);
    if (typeof this._tab === "object" && !this._config.people[this._tab.person]) {
      this._tab = "settings";
    }
  }

  private _commit(next: CardConfig): void {
    this._config = next;
    fireEvent(this, "config-changed", { config: next });
  }

  override render(): TemplateResult | typeof nothing {
    const config = this._config;
    if (!config) return nothing;

    const strings = stringsFor(resolveLang(config, this.hass));
    const ctx: PanelContext = {
      config,
      strings,
      hass: this.hass,
      commit: (next) => this._commit(next),
    };

    return html`
      <div class="tabs" role="tablist">
        <button
          class="tab"
          type="button"
          role="tab"
          data-tab="settings"
          aria-selected=${this._tab === "settings" ? "true" : "false"}
          @click=${() => {
            this._tab = "settings";
          }}
        >
          ${strings.editor.tabSettings}
        </button>

        ${config.people.map(
          (person, index) => html`
            <button
              class="tab"
              type="button"
              role="tab"
              data-tab="person"
              data-person-index=${index}
              aria-selected=${typeof this._tab === "object" && this._tab.person === index
                ? "true"
                : "false"}
              @click=${() => {
                this._tab = { person: index };
              }}
            >
              ${person.emoji ? `${person.emoji} ` : ""}${person.name ||
              strings.editor.personNamePlaceholder}
            </button>
          `,
        )}

        <button
          class="tab"
          type="button"
          data-tab="add"
          title=${strings.editor.addPerson}
          @click=${() => {
            const next = addPerson(config, "");
            this._tab = { person: next.people.length - 1 };
            this._commit(next);
          }}
        >
          ＋
        </button>

        <button
          class="tab"
          type="button"
          role="tab"
          data-tab="activities"
          aria-selected=${this._tab === "activities" ? "true" : "false"}
          @click=${() => {
            this._tab = "activities";
          }}
        >
          ${strings.editor.tabActivities}
        </button>
      </div>

      ${this._renderPanel(ctx)}
    `;
  }

  private _renderPanel(ctx: PanelContext): TemplateResult {
    if (this._tab === "settings") return renderSettingsPanel(ctx);
    if (this._tab === "activities") return renderActivitiesPanel(ctx);
    return renderPersonPanel(ctx, {
      personIndex: this._tab.person,
      selectedActivity: this._selectedActivity,
      onSelectActivity: (id) => {
        this._selectedActivity = id;
      },
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "weekly-timetable-card-editor": WeeklyTimetableCardEditor;
  }
}
```

- [ ] **Step 5: Wire the editor into `src/card.ts`**

Add the import at the top of `src/card.ts`, after the existing imports:

```ts
import "./editor/editor.js";
```

And add this static method to `WeeklyTimetableCard`, directly above `getStubConfig`:

```ts
  static getConfigElement(): HTMLElement {
    return document.createElement("weekly-timetable-card-editor");
  }
```

- [ ] **Step 6: Add a card test for the wiring**

Append to `test/card.test.ts`:

```ts
describe("editor wiring", () => {
  it("returns the editor element for HA's config dialog", () => {
    const element = (customElements.get("weekly-timetable-card") as typeof WeeklyTimetableCard)
      .getConfigElement();
    expect(element.tagName.toLowerCase()).toBe("weekly-timetable-card-editor");
  });
});
```

- [ ] **Step 7: Run the tests to verify they pass**

Run: `npx vitest run test/editor.test.ts test/card.test.ts`
Expected: PASS with 0 failures, and the run reports this file (not "No test files found").

- [ ] **Step 8: Typecheck, full suite and build**

Run: `npm run typecheck && npm test && npm run build`
Expected: typecheck silent; every test file passes with 0 failures; bundle written.

- [ ] **Step 9: Verify the editor by eye**

The dev harness renders the card, not the editor. Add a temporary block at the end of `dev/index.html`'s body, above the script tags, to exercise the editor:

```html
    <h3 style="margin-top: 32px">Editor</h3>
    <div id="editor-frame" style="max-width: 560px"></div>
```

and at the end of `dev/mock-hass.js`:

```js
const editor = document.createElement("weekly-timetable-card-editor");
editor.hass = card.hass;
editor.setConfig(baseConfig());
editor.addEventListener("config-changed", (event) => {
  card.setConfig(event.detail.config);
  editor.setConfig(event.detail.config);
});
document.querySelector("#editor-frame").append(editor);
```

Run `npm run watch` and confirm: every tab opens; editing a title, layout, day chip, activity, person name, block activity and block time all update the card above; the ↑/↓ buttons reorder and disable at the ends; tapping a palette chip then a day appends a block; removing an in-use activity warns first. Keep this harness code — it is part of the deliverable.

- [ ] **Step 10: Commit**

```bash
git add src/editor/fire-event.ts src/editor/editor.ts src/card.ts dev/index.html dev/mock-hass.js dist/weekly-timetable-card.js test/editor.test.ts test/card.test.ts
git commit -m "Add the visual editor element and wire it to the card"
```

---

### Task 17: Drag and drop

The drag layer holds no schedule logic. It resolves a gesture to a target and then calls the same mutations the buttons call, so everything that can go wrong beyond hit-testing is already under test.

**Files:**
- Create: `src/editor/dnd.ts`
- Modify: `src/editor/mutations.ts` (add `insertBlock`), `src/editor/person-panel.ts` (hover class), `src/editor/editor.ts` (wire the controller)
- Test: `test/dnd.test.ts`, `test/mutations.test.ts` (extend)

**Interfaces:**
- Consumes: `isDayKey`, `moveBlock`, `insertBlock`.
- Produces:
  - `insertBlock(config: CardConfig, personIndex: number, day: DayKey, index: number, block: Block): CardConfig`
  - `type DragSource = { kind: "block"; day: DayKey; index: number } | { kind: "activity"; activityId: string }`
  - `interface Bounds { top: number; bottom: number }`
  - `parseDragSource(element: Element | null): DragSource | null`
  - `insertionIndex(bounds: readonly Bounds[], clientY: number): number`
  - `adjustForRemoval(source: DragSource, targetDay: DayKey, index: number): number`
  - `class DndController` with `active`, `hoverDay`, `onPointerDown`
  - `PersonPanelOptions.hoverDay: DayKey | null`

- [ ] **Step 1: Extend the mutations test**

Append to `test/mutations.test.ts`:

```ts
import { insertBlock } from "../src/editor/mutations.js";

describe("insertBlock", () => {
  it("inserts at the given index", () => {
    const next = immutable((config) =>
      insertBlock(config, 0, "mon", 1, { activity: "judo" }),
    );
    expect(next.people[0]!.schedule.mon!.map((block) => block.activity)).toEqual([
      "english", "judo", "judo",
    ]);
  });

  it("inserts at the front and clamps past the end", () => {
    expect(
      insertBlock(base(), 0, "mon", 0, { activity: "judo" }).people[0]!.schedule.mon![0]!
        .activity,
    ).toBe("judo");
    expect(insertBlock(base(), 0, "mon", 99, { activity: "judo" }).people[0]!.schedule.mon!)
      .toHaveLength(3);
  });

  it("works on a day with no blocks yet", () => {
    const next = insertBlock(base(), 1, "mon", 0, { activity: "judo" });
    expect(next.people[1]!.schedule.mon!).toEqual([{ activity: "judo" }]);
  });
});
```

- [ ] **Step 2: Add `insertBlock` to `src/editor/mutations.ts`**

```ts
export function insertBlock(
  config: CardConfig,
  personIndex: number,
  day: DayKey,
  index: number,
  block: Block,
): CardConfig {
  const person = config.people[personIndex];
  if (!person) return config;
  const blocks = [...blocksOf(person, day)];
  blocks.splice(clamp(index, 0, blocks.length), 0, { ...block });
  return replacePerson(config, personIndex, withBlocks(person, day, blocks));
}
```

- [ ] **Step 3: Run test to verify it passes**

Run: `npx vitest run test/mutations.test.ts`
Expected: PASS with 0 failures, and the run reports this file (not "No test files found").

- [ ] **Step 4: Write the failing test for the drag logic**

Create `test/dnd.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  adjustForRemoval,
  insertionIndex,
  parseDragSource,
  type Bounds,
  type DragSource,
} from "../src/editor/dnd.js";

function fixture(): HTMLElement {
  const host = document.createElement("div");
  host.innerHTML = `
    <div class="day-group" data-day="mon">
      <div class="row" data-block-index="0">
        <span class="drag-handle" data-drag-block="0" data-drag-day="mon">handle</span>
      </div>
    </div>
    <button class="palette-chip" data-palette-activity="judo"><span>Judo</span></button>
    <button class="chip" data-action="add-block">add</button>
  `;
  return host;
}

describe("parseDragSource", () => {
  it("reads a block source from the handle, including a click on a child node", () => {
    const host = fixture();
    const handle = host.querySelector("[data-drag-block]")!;
    expect(parseDragSource(handle)).toEqual({ kind: "block", day: "mon", index: 0 });
    expect(parseDragSource(handle.firstChild as Element | null ?? handle))
      .toEqual({ kind: "block", day: "mon", index: 0 });
  });

  it("reads an activity source from a palette chip, including from its inner span", () => {
    const host = fixture();
    expect(parseDragSource(host.querySelector(".palette-chip")!))
      .toEqual({ kind: "activity", activityId: "judo" });
    expect(parseDragSource(host.querySelector(".palette-chip span")!))
      .toEqual({ kind: "activity", activityId: "judo" });
  });

  it("returns null for anything that is not a drag source", () => {
    const host = fixture();
    expect(parseDragSource(host.querySelector('[data-action="add-block"]')!)).toBeNull();
    expect(parseDragSource(null)).toBeNull();
  });

  it("rejects a handle with an invalid day", () => {
    const host = document.createElement("div");
    host.innerHTML = `<span data-drag-block="0" data-drag-day="xx"></span>`;
    expect(parseDragSource(host.firstElementChild)).toBeNull();
  });
});

describe("insertionIndex", () => {
  const bounds: Bounds[] = [
    { top: 0, bottom: 20 },
    { top: 20, bottom: 40 },
    { top: 40, bottom: 60 },
  ];

  it("inserts before a row when above its midpoint", () => {
    expect(insertionIndex(bounds, 5)).toBe(0);
    expect(insertionIndex(bounds, 25)).toBe(1);
  });

  it("inserts after a row when below its midpoint", () => {
    expect(insertionIndex(bounds, 15)).toBe(1);
    expect(insertionIndex(bounds, 35)).toBe(2);
  });

  it("appends past the last row", () => {
    expect(insertionIndex(bounds, 100)).toBe(3);
  });

  it("returns 0 for an empty day", () => {
    expect(insertionIndex([], 100)).toBe(0);
  });
});

describe("adjustForRemoval", () => {
  const block: DragSource = { kind: "block", day: "mon", index: 1 };

  it("decrements a same-day target below the source, because the source is spliced out first", () => {
    expect(adjustForRemoval(block, "mon", 3)).toBe(2);
    expect(adjustForRemoval(block, "mon", 2)).toBe(1);
  });

  it("leaves a same-day target at or above the source alone", () => {
    expect(adjustForRemoval(block, "mon", 1)).toBe(1);
    expect(adjustForRemoval(block, "mon", 0)).toBe(0);
  });

  it("leaves a cross-day target alone", () => {
    expect(adjustForRemoval(block, "tue", 3)).toBe(3);
  });

  it("leaves an activity source alone", () => {
    expect(adjustForRemoval({ kind: "activity", activityId: "judo" }, "mon", 3)).toBe(3);
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npx vitest run test/dnd.test.ts`
Expected: FAIL — cannot resolve `../src/editor/dnd.js`.

- [ ] **Step 6: Create `src/editor/dnd.ts`**

```ts
import { isDayKey } from "../days.js";
import type { DayKey } from "../types.js";

const DRAG_THRESHOLD_PX = 5;

export type DragSource =
  | { kind: "block"; day: DayKey; index: number }
  | { kind: "activity"; activityId: string };

export interface Bounds {
  top: number;
  bottom: number;
}

export interface DropTarget {
  day: DayKey;
  index: number;
}

export interface DndCallbacks {
  moveBlock: (from: { day: DayKey; index: number }, to: DropTarget) => void;
  insertActivity: (activityId: string, to: DropTarget) => void;
  requestUpdate: () => void;
}

export function parseDragSource(element: Element | null): DragSource | null {
  const handle = element?.closest<HTMLElement>("[data-drag-block]");
  if (handle) {
    const day = handle.dataset.dragDay;
    const index = Number(handle.dataset.dragBlock);
    if (isDayKey(day) && Number.isInteger(index) && index >= 0) {
      return { kind: "block", day, index };
    }
    return null;
  }
  const chip = element?.closest<HTMLElement>("[data-palette-activity]");
  const activityId = chip?.dataset.paletteActivity;
  return activityId ? { kind: "activity", activityId } : null;
}

/** Geometry kept separate from the DOM so it can be tested over plain numbers. */
export function insertionIndex(bounds: readonly Bounds[], clientY: number): number {
  for (let i = 0; i < bounds.length; i += 1) {
    const row = bounds[i]!;
    if (clientY < (row.top + row.bottom) / 2) return i;
  }
  return bounds.length;
}

/**
 * Hit-testing yields an index into the rows as drawn; moveBlock splices the
 * dragged block out before inserting, so a same-day drop below the source is
 * one position too high.
 */
export function adjustForRemoval(
  source: DragSource,
  targetDay: DayKey,
  index: number,
): number {
  if (source.kind !== "block" || source.day !== targetDay) return index;
  return index > source.index ? index - 1 : index;
}

export class DndController {
  private _source: DragSource | null = null;
  private _origin = { x: 0, y: 0 };
  private _active = false;
  private _hoverDay: DayKey | null = null;

  constructor(
    private readonly getRoot: () => ShadowRoot | null,
    private readonly callbacks: DndCallbacks,
  ) {}

  get active(): boolean {
    return this._active;
  }

  get hoverDay(): DayKey | null {
    return this._hoverDay;
  }

  readonly onPointerDown = (event: PointerEvent): void => {
    const source = parseDragSource(event.target as Element | null);
    if (!source) return;
    this._source = source;
    this._origin = { x: event.clientX, y: event.clientY };
    this._active = false;
    window.addEventListener("pointermove", this._onPointerMove);
    window.addEventListener("pointerup", this._onPointerUp);
    window.addEventListener("pointercancel", this._onPointerCancel);
  };

  private readonly _onPointerMove = (event: PointerEvent): void => {
    if (!this._source) return;
    if (!this._active) {
      const dx = event.clientX - this._origin.x;
      const dy = event.clientY - this._origin.y;
      if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
      this._active = true;
    }
    event.preventDefault();
    const day = this._dayUnder(event.clientX, event.clientY);
    if (day !== this._hoverDay) {
      this._hoverDay = day;
      this.callbacks.requestUpdate();
    }
  };

  private readonly _onPointerUp = (event: PointerEvent): void => {
    const source = this._source;
    const wasActive = this._active;
    this._teardown();
    if (!source || !wasActive) return;

    const group = this._groupUnder(event.clientX, event.clientY);
    const day = group?.dataset.day;
    if (!group || !isDayKey(day)) return;

    const bounds: Bounds[] = [...group.querySelectorAll("[data-block-index]")].map((row) => {
      const rect = row.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom };
    });
    const index = adjustForRemoval(source, day, insertionIndex(bounds, event.clientY));

    if (source.kind === "block") {
      this.callbacks.moveBlock({ day: source.day, index: source.index }, { day, index });
      return;
    }
    this.callbacks.insertActivity(source.activityId, { day, index });
  };

  private readonly _onPointerCancel = (): void => {
    this._teardown();
  };

  private _teardown(): void {
    window.removeEventListener("pointermove", this._onPointerMove);
    window.removeEventListener("pointerup", this._onPointerUp);
    window.removeEventListener("pointercancel", this._onPointerCancel);
    const needsRepaint = this._active || this._hoverDay !== null;
    this._source = null;
    this._active = false;
    this._hoverDay = null;
    if (needsRepaint) this.callbacks.requestUpdate();
  }

  private _groupUnder(x: number, y: number): HTMLElement | null {
    const root = this.getRoot();
    const element =
      root?.elementFromPoint?.(x, y) ??
      (typeof document.elementFromPoint === "function" ? document.elementFromPoint(x, y) : null);
    return (element as Element | null)?.closest<HTMLElement>("[data-day]") ?? null;
  }

  private _dayUnder(x: number, y: number): DayKey | null {
    const day = this._groupUnder(x, y)?.dataset.day;
    return isDayKey(day) ? day : null;
  }
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npx vitest run test/dnd.test.ts`
Expected: PASS with 0 failures, and the run reports this file (not "No test files found").

- [ ] **Step 8: Show the hover target in `src/editor/person-panel.ts`**

Add `hoverDay` to the options interface:

```ts
export interface PersonPanelOptions {
  personIndex: number;
  selectedActivity: string | null;
  onSelectActivity: (id: string | null) => void;
  hoverDay: DayKey | null;
}
```

and in `renderDayGroup`, replace the opening tag of the day group with:

```ts
    <div
      class="day-group ${options.hoverDay === day ? "drop-target" : ""}"
      data-day=${day}
```

Then update every existing call site that constructs `PersonPanelOptions`: add `hoverDay: null` to each of the three options literals in `test/person-panel.test.ts` (one in `mount`, two inline in the "palette and tap-to-place" block), and to `src/editor/editor.ts` in the next step. With `strict` on, a missing property is a compile error, so `npm run typecheck` will name any site that was missed.

- [ ] **Step 9: Wire the controller into `src/editor/editor.ts`**

Add the imports:

```ts
import { DndController } from "./dnd.js";
import { insertBlock, moveBlock } from "./mutations.js";
```

(keep the existing `addPerson` import; `moveBlock` and `insertBlock` are new)

Add the field, after `_selectedActivity`:

```ts
  private readonly _dnd = new DndController(
    () => this.shadowRoot,
    {
      moveBlock: (from, to) => {
        const config = this._config;
        if (!config || typeof this._tab !== "object") return;
        this._commit(moveBlock(config, this._tab.person, from, to));
      },
      insertActivity: (activityId, to) => {
        const config = this._config;
        if (!config || typeof this._tab !== "object") return;
        this._commit(
          insertBlock(config, this._tab.person, to.day, to.index, { activity: activityId }),
        );
      },
      requestUpdate: () => this.requestUpdate(),
    },
  );
```

Wrap the panel in a pointer-down handler by replacing `${this._renderPanel(ctx)}` in `render()` with:

```ts
      <div @pointerdown=${this._dnd.onPointerDown}>${this._renderPanel(ctx)}</div>
```

And pass the hover day in `_renderPanel`:

```ts
    return renderPersonPanel(ctx, {
      personIndex: this._tab.person,
      selectedActivity: this._selectedActivity,
      onSelectActivity: (id) => {
        this._selectedActivity = id;
      },
      hoverDay: this._dnd.hoverDay,
    });
```

- [ ] **Step 10: Run the full suite, typecheck and build**

Run: `npm run typecheck && npm test && npm run build`
Expected: typecheck silent; every test file passes with 0 failures; bundle written.

- [ ] **Step 11: Verify dragging by hand**

Run `npm run watch` and check in the editor section of the harness, with a mouse and then with the browser's touch emulation:
- Dragging a palette chip into a day group appends a block there, and the group highlights while hovering.
- Dragging a row's ⠿ handle within a day reorders it, and dropping it **below** its original position lands exactly where the indicator was — the off-by-one case.
- Dragging a handle into another day moves the block and removes it from the source day.
- Releasing outside any day group changes nothing.
- A click on the handle that does not move beyond the threshold does not reorder anything.
- The ↑/↓/× buttons still work, and clicking a row's fields does not start a drag.

- [ ] **Step 12: Commit**

```bash
git add src/editor/dnd.ts src/editor/mutations.ts src/editor/person-panel.ts src/editor/editor.ts dist/weekly-timetable-card.js test/dnd.test.ts test/mutations.test.ts test/person-panel.test.ts
git commit -m "Add drag-and-drop over the existing editor mutations"
```

---

### Task 18: Packaging, CI and documentation

**Files:**
- Create: `hacs.json`, `LICENSE`, `README.md`, `.github/workflows/ci.yml`, `.github/workflows/release.yml`

**Interfaces:**
- Consumes: the built `dist/weekly-timetable-card.js`.
- Produces: a HACS-installable repository with CI.

- [ ] **Step 1: Create `hacs.json`**

```json
{
  "name": "Weekly Timetable Card",
  "render_readme": true,
  "filename": "weekly-timetable-card.js",
  "homeassistant": "2024.8.0"
}
```

- [ ] **Step 2: Create `LICENSE`**

```
MIT License

Copyright (c) 2026 Konstantin Ivanov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

- [ ] **Step 3: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci
      - run: npm run typecheck
      - run: npm test
      - run: npm run build

      - name: Repository, bundle and element names must agree
        run: |
          test -f dist/weekly-timetable-card.js
          grep -q '"filename": "weekly-timetable-card.js"' hacs.json
          grep -q 'customElement("weekly-timetable-card")' src/card.ts
          grep -q 'outfile: "dist/weekly-timetable-card.js"' esbuild.config.mjs

      - name: Committed bundle must match the sources
        run: git diff --exit-code -- dist
```

- [ ] **Step 4: Create `.github/workflows/release.yml`**

```yaml
name: Release

on:
  push:
    tags: ["v*"]

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - run: npm ci
      - run: npm run build

      - uses: softprops/action-gh-release@v2
        with:
          files: dist/weekly-timetable-card.js
          generate_release_notes: true
```

- [ ] **Step 5: Create `README.md`**

````markdown
# Weekly Timetable Card

A weekly timetable card for [Home Assistant](https://www.home-assistant.io/), in
English and Bulgarian. Day columns of free-form activity blocks, or a classic
numbered-slot grid. One card, several people, configured visually.

Седмична програма за Home Assistant, на английски и български. Виж
[Български](#български) по-долу.

---

## Features

- **Two layouts** — `blocks` (day columns of stacked activity blocks) and `grid`
  (numbered slots against a time ruler).
- **Open-ended times** — a block can be a range (`15:20–16:20`), open at the end
  (`until 16:00`), open at the start (`after 18:30`), or have no time at all.
- **Any days** — show any subset of Monday to Sunday, in the order you choose.
- **Several people** — one tab each, with their own colour, days and schedule.
- **English and Bulgarian** — the interface follows each Home Assistant user's
  own language, so the same dashboard reads in Bulgarian for one person and
  English for another. Times follow their 12/24-hour preference too.
- **Visual editor** — buttons for everything, with drag-and-drop and
  tap-to-place on top.
- **Responsive** — full day names, then short ones, then a stacked single column,
  measured from the card's own width rather than the screen's.
- **Theme-aware** — activity colours are mixed into the card background, so one
  configuration works in both light and dark themes.

## Installation

### HACS

1. HACS → three-dot menu → **Custom repositories**
2. Add `https://github.com/kosio/weekly-timetable-card`, category **Dashboard**
3. Find **Weekly Timetable Card** → **Download**
4. Hard-refresh the browser (`Ctrl+Shift+R`)

### Manual

1. Copy `dist/weekly-timetable-card.js` to `/config/www/weekly-timetable-card.js`
2. Settings → Dashboards → three-dot menu → **Resources** → add
   `/local/weekly-timetable-card.js?v=1` as a **JavaScript module**
3. Hard-refresh the browser

Lovelace caches resources by URL. If a change does not appear, bump the `?v=`
number, and check the browser console — the card logs its version on load.

## Usage

Add a card, search for **Weekly Timetable**, and edit it visually. No YAML
required.

## Options

| Option | Type | Default | Description |
|---|---|---|---|
| `layout` | `blocks` \| `grid` | `blocks` | Day columns of blocks, or a slot grid. |
| `title` | string | — | Optional heading above the card. |
| `days` | list of `mon`…`sun` | `[mon, tue, wed, thu, fri]` | Which days to show, in display order. |
| `language` | `auto` \| `en` \| `bg` | `auto` | `auto` follows each user's Home Assistant language. |
| `highlight_today` | boolean | `true` | Tint today's column. |
| `header_color` | CSS colour | `#1e3a5f` | Day header background; text contrast is chosen automatically. |
| `activities` | list | `[]` | The shared palette. Each has `id`, `label`, `color`. |
| `people` | list | required | One entry per tab. |

### Per person

| Option | Type | Description |
|---|---|---|
| `name` | string | Tab label. |
| `emoji` | string | Optional, shown on the tab. |
| `color` | CSS colour | Optional tab accent. |
| `days` | list of `mon`…`sun` | Optional. **Replaces** the card-level list, so it may include days the card omits. |
| `slots` | list | Grid layout only: `slot`, `start`, `end`. |
| `schedule` | map of day → blocks | The timetable itself. |

### Blocks

A block is `{ activity, start?, end? }`. Which times are present decides how it
renders:

| `start` | `end` | Renders as |
|---|---|---|
| set | set | `15:20–16:20` |
| — | set | `until 16:00` / `до 16:00` |
| set | — | `after 18:30` / `след 18:30` |
| — | — | the label alone |

In `grid` layout, a block whose `start` and `end` match a slot exactly is placed
on that slot. Everything else appears in a strip above the grid, so nothing is
ever hidden.

Quote your times. Unquoted `16:00` in a YAML dashboard is parsed as the number
960, which the card converts back, but quoting is clearer.

## Example

```yaml
type: custom:weekly-timetable-card
title: Седмична програма
layout: blocks
days: [mon, tue, wed, thu, fri]

activities:
  - { id: english, label: Английски, color: "#3b82f6" }
  - { id: daycare, label: Занималня, color: "#64748b" }
  - { id: break, label: Почивка и хапване, color: "#94a3b8" }
  - { id: judo, label: Джудо, color: "#f97316" }
  - { id: chess, label: Шах, color: "#a855f7" }
  - { id: home, label: Връщане вкъщи, color: "#22c55e" }

people:
  - name: Иван
    emoji: "🥋"
    color: "#f472b6"
    schedule:
      mon:
        - { activity: english, start: "15:20", end: "16:20" }
        - { activity: break, start: "16:20", end: "17:30" }
        - { activity: judo, start: "17:30", end: "18:30" }
        - { activity: home, start: "18:30" }
      tue:
        - { activity: daycare, end: "16:00" }
      wed:
        - { activity: english, start: "15:20", end: "16:20" }
        - { activity: judo, start: "17:30", end: "18:30" }
      thu:
        - { activity: daycare, end: "16:00" }
        - { activity: chess, start: "16:30", end: "17:30" }
      fri:
        - { activity: daycare, end: "16:00" }
        - { activity: chess, start: "16:30", end: "17:30" }
```

## Development

```bash
npm install
npm run watch    # dev harness with language, clock, theme and width controls
npm test
npm run typecheck
npm run build
```

The harness in `dev/` renders the card and the editor against a mock `hass`, so
no Home Assistant instance is needed for day-to-day work.

## Credits

Inspired by [AyKay35/lovelace-timetable-card](https://github.com/AyKay35/lovelace-timetable-card).
This is a separate implementation with a different data model, two layouts and
internationalisation.

Licensed MIT.

---

## Български

Карта за седмична програма за Home Assistant, на български и английски.

### Възможности

- **Два изгледа** — `blocks` (колони по дни с блокове занимания) и `grid`
  (номерирани часови интервали).
- **Отворени часове** — блок може да е интервал (`15:20–16:20`), отворен в
  края (`до 16:00`), отворен в началото (`след 18:30`), или без час.
- **Произволни дни** — показвайте всяко подмножество от понеделник до неделя, в
  избран от вас ред.
- **Няколко човека** — по един таб за всеки, със свой цвят, дни и програма.
- **Автоматичен език** — интерфейсът следва езика на всеки потребител на Home
  Assistant, както и предпочитанието му за 12- или 24-часов формат.
- **Визуален редактор** — бутони за всичко, плюс влачене и докосване.
- **Адаптивен** — пълни имена на дните, после съкратени, после една колона.
- **Съобразен с темата** — цветовете на заниманията се смесват с фона на
  картата, така че една конфигурация работи и на светла, и на тъмна тема.

### Инсталиране

**Чрез HACS:** HACS → менюто с три точки → **Custom repositories** → добавете
`https://github.com/kosio/weekly-timetable-card`, категория **Dashboard** →
намерете **Weekly Timetable Card** → **Download** → презаредете браузъра с
`Ctrl+Shift+R`.

**Ръчно:** копирайте `dist/weekly-timetable-card.js` в
`/config/www/weekly-timetable-card.js`, след което го добавете като ресурс
`/local/weekly-timetable-card.js?v=1` от тип **JavaScript module**.

### Настройки

Всички настройки са описани в таблиците по-горе. Добавете картата, потърсете
**Weekly Timetable** и я настройте визуално — не е нужен YAML.

Слагайте часовете в кавички. Неоградено `16:00` в YAML се разчита като числото
960; картата го преобразува обратно, но с кавички е по-ясно.
````

- [ ] **Step 6: Verify the CI checks locally**

Run the same commands the workflow runs, so a red build is caught before pushing:

```bash
npm run typecheck && npm test && npm run build
test -f dist/weekly-timetable-card.js
grep -q '"filename": "weekly-timetable-card.js"' hacs.json
grep -q 'customElement("weekly-timetable-card")' src/card.ts
grep -q 'outfile: "dist/weekly-timetable-card.js"' esbuild.config.mjs
git diff --exit-code -- dist && echo CHECKS_OK
```

Expected: `CHECKS_OK`.

- [ ] **Step 7: Commit**

```bash
git add hacs.json LICENSE README.md .github
git commit -m "Add HACS packaging, CI workflows and documentation"
```

- [ ] **Step 8: Install once into real Home Assistant**

Not automatable, and the one thing the mock harness cannot prove. Copy
`dist/weekly-timetable-card.js` to the instance's `/config/www/`, register the
resource, add the card, and confirm:
- The card appears in the Add-card picker with a preview.
- The console shows the version banner.
- The visual editor opens inside HA's dialog and saves.
- The card picks up the active HA theme in both light and dark.
- A second HA user with a different profile language sees the other language.

Record anything that needed fixing as a follow-up task; do not change the plan
retroactively.
