# Single-person cards and two-column blocks — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make each card show exactly one timetable, and restructure a block into a stacked time column on the left with a title and optional subtitle on the right.

**Architecture:** Two passes that barely overlap. Pass one removes the person dimension — first its UI, then the data model — deleting `Person`, the `personIndex` parameter threaded through every mutation, and the editor tab-index self-heal. Pass two renames `Activity.label` to `title`, adds `Activity.subtitle`, and rebuilds the block renderer as two columns. Pass two touches only the activity record, the renderer and the styles; pass one touches everything except rendering.

**Tech Stack:** TypeScript 5 (strict), Lit 3, esbuild, Vitest + jsdom.

**Spec:** [`docs/superpowers/specs/2026-09-22-single-person-block-structure-design.md`](../specs/2026-09-22-single-person-block-structure-design.md)

## Global Constraints

- TypeScript `strict` with `noUncheckedIndexedAccess` and `noUnusedLocals`: every index access yields `T | undefined` and must be narrowed; an unused local fails the build.
- Lit 3 with `experimentalDecorators: true` and `useDefineForClassFields: false`. Do not change either.
- Tests run under **jsdom**, never happy-dom: happy-dom mangles expressions at a Lit template's root and nested `${...map()}` inside a sub-template.
- `Activity.title` is required. **`label` is NOT accepted as an alias** — a config still using `label` must fail loudly, not render a blank title.
- A config carrying `people:` is **rejected with a clear error**. There is no migration.
- Activity titles and subtitles are author content and are **never translated**. Only chrome is.
- The four time forms stay derived from field presence by `blockForm()`. Never introduce a `mode` discriminator.
- `schedule` entries for days outside the effective `days` list are preserved, so narrowing `days` stays reversible.
- Never use backticks inside a `css` tagged template — they terminate the string and break the build.
- **User-facing docs describe the card as it is now.** No migration guides, no before/after, no reference to how anything used to work. Internal design docs under `docs/superpowers/` keep their history.
- Commits: a short single-sentence title. No body. No `Co-Authored-By`.
- `dist/` is rebuilt and committed **only in Task 9**. CI checks `git diff --exit-code -- dist` at the PR tip, not per commit.
- Work on branch `redesign-single-person`, which already carries the spec commit.

---

### Task 1: Remove the multi-person UI

Keeps `people: Person[]` in the data model but makes the card and editor treat it as a single entry. This is deliberately split from the data-model flattening in Task 2 so a reviewer can approve "multi-person UI is gone" independently — and because after this task the card already behaves as specified even if Task 2 were deferred.

**Files:**
- Modify: `src/card.ts` — delete `_personIndex`, `_renderTabs`, the accent from `person.color`
- Modify: `src/editor/editor.ts` — three fixed tabs
- Modify: `src/editor/person-panel.ts` — delete the person identity row
- Modify: `src/editor/mutations.ts` — delete `addPerson`, `removePerson`, `updatePerson`, `PersonPatch`
- Modify: `src/i18n/types.ts`, `src/i18n/en.ts`, `src/i18n/bg.ts`
- Test: `test/card.test.ts`, `test/editor.test.ts`, `test/mutations.test.ts`, `test/person-panel.test.ts`

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces: `Tab = "settings" | "schedule" | "activities"`; `renderPersonPanel(ctx, options)` where `options` is `{ selectedActivity: string | null; onSelectActivity: (id: string | null) => void }` — `personIndex` is gone from the options object but still passed to mutations in this task.

- [ ] **Step 1: Write the failing test for the editor's three tabs**

In `test/editor.test.ts`, replace any test asserting person tabs with:

```ts
it("exposes exactly three fixed tabs", async () => {
  const el = document.createElement("weekly-timetable-card-editor") as WeeklyTimetableCardEditor;
  document.body.append(el);
  el.setConfig(getStubConfig());
  await el.updateComplete;

  const tabs = [...el.shadowRoot!.querySelectorAll<HTMLElement>(".tab")];
  expect(tabs.map((tab) => tab.dataset.tab)).toEqual(["settings", "schedule", "activities"]);
  expect(el.shadowRoot!.querySelector('[data-tab="add"]')).toBeNull();
  expect(el.shadowRoot!.querySelector('[data-tab="person"]')).toBeNull();
  el.remove();
});
```

- [ ] **Step 2: Write the failing test for the card rendering no tabs**

In `test/card.test.ts`:

```ts
it("never renders person tabs", async () => {
  const el = document.createElement("weekly-timetable-card") as WeeklyTimetableCard;
  document.body.append(el);
  el.setConfig(getStubConfig());
  await el.updateComplete;

  expect(el.shadowRoot!.querySelector(".tabs")).toBeNull();
  el.remove();
});
```

- [ ] **Step 3: Run both tests to verify they fail**

Run: `npx vitest run test/editor.test.ts test/card.test.ts`
Expected: FAIL — the editor still renders a person tab and a `＋` tab; the card renders `.tabs` when more than one person exists (and the stub has one, so this second test may pass already — that is fine, it is a regression guard).

- [ ] **Step 4: Strip the person UI from the card**

In `src/card.ts`: delete the `_personIndex` state field, the whole `_renderTabs` method, and the `${config.people.length > 1 ? this._renderTabs(config) : nothing}` line from `render()`. In `setConfig`, delete the `_personIndex` clamp. In `buildContext(...)` pass `personIndex: 0`. In `_dayCount()` read `config.people[0]`. In the `cardStyle` styleMap, replace `"--wtc-accent": ctx.person.color ?? "var(--primary-color)"` with `"--wtc-accent": "var(--primary-color)"`.

Also update the card-picker description, which currently advertises the removed feature:

```ts
description: "Weekly timetable in English or Bulgarian",
```

- [ ] **Step 5: Give the editor three fixed tabs**

In `src/editor/editor.ts`, replace the `Tab` type and the tab list:

```ts
type Tab = "settings" | "schedule" | "activities";
```

`setConfig` becomes just `this._config = normaliseConfig(config);` — the person guard has nothing to guard. Delete the entire `_commit` self-heal block, leaving:

```ts
private _commit(next: CardConfig): void {
  this._config = next;
  fireEvent(this, "config-changed", { config: next });
}
```

Render three buttons with `data-tab` of `settings`, `schedule` and `activities`, each setting `this._tab`. Delete the `addPerson` import and the `＋` button. `_renderPanel` becomes:

```ts
private _renderPanel(ctx: PanelContext): TemplateResult {
  if (this._tab === "settings") return renderSettingsPanel(ctx);
  if (this._tab === "activities") return renderActivitiesPanel(ctx);
  return renderPersonPanel(ctx, {
    selectedActivity: this._selectedActivity,
    onSelectActivity: (id) => {
      this._selectedActivity = id;
    },
  });
}
```

- [ ] **Step 6: Delete the person identity row from the panel**

In `src/editor/person-panel.ts`: change `PersonPanelOptions` to drop `personIndex` and read the person as `config.people[0]`. Delete the name input, emoji input, colour input, clear-colour button, remove-person button, and the days-override toggles with their hint. Keep the slots section and the per-day block rows; they now use a hardcoded person index of `0` when calling mutations. Replace `effectiveDays(config, person)` with `config.days`.

- [ ] **Step 7: Delete the person mutations**

In `src/editor/mutations.ts`, delete `PersonPatch`, `addPerson`, `removePerson` and `updatePerson`. Leave every other function's signature untouched — `personIndex` is removed in Task 2.

- [ ] **Step 8: Remove the person strings**

Delete from `EditorStrings` and from both `en.ts` and `bg.ts`: `addPerson`, `removePerson`, `personNamePlaceholder`, `name`, `emoji`, `color`, `daysOverride`, `daysOverrideHint`. Add `tabSchedule` — `"Schedule"` in `en.ts`, `"Разписание"` in `bg.ts`.

- [ ] **Step 9: Update the affected tests**

In `test/mutations.test.ts` delete the `addPerson`, `removePerson` and `updatePerson` describe blocks. In `test/person-panel.test.ts` remove the three `personIndex: 0` literals from the options objects and delete any assertion about the name, emoji, colour or days-override controls.

- [ ] **Step 10: Run the full suite**

Run: `npm run typecheck && npm test`
Expected: PASS. `noUnusedLocals` will flag any import left behind by the deletions — remove those imports rather than suppressing the error.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "Remove the multi-person UI from the card and editor"
```

---

### Task 2: Flatten the data model

Removes `Person` entirely. This cannot be split further: `personIndex` is a parameter on eight mutations consumed by the schedule panel, so any partial state fails `tsc`. There is no intermediate green commit.

**Files:**
- Modify: `src/types.ts`, `src/config.ts`, `src/days.ts`, `src/renderers/context.ts`, `src/card.ts`, `src/editor/mutations.ts`
- Rename: `src/editor/person-panel.ts` → `src/editor/schedule-panel.ts`
- Test: `test/config.test.ts`, `test/card.test.ts`, `test/mutations.test.ts`, `test/renderers-*.test.ts`, `test/settings-panel.test.ts`, `test/activities-panel.test.ts`; rename `test/person-panel.test.ts` → `test/schedule-panel.test.ts`

**Interfaces:**
- Consumes: Task 1's three-tab editor and the panel options without `personIndex`.
- Produces:
  - `CardConfig` with `slots?: Slot[]` and `schedule: Partial<Record<DayKey, Block[]>>` at the top level; no `people`.
  - `Person` deleted; `effectiveDays` deleted.
  - `RenderContext` without a `person` field; `BuildContextParams` without `personIndex`.
  - Mutations without `personIndex`: `addBlock(config, day, block)`, `updateBlock(config, day, blockIndex, patch)`, `removeBlock(config, day, blockIndex)`, `moveBlock(config, from, to)`, `moveBlockBy(config, day, index, delta)`, `addSlot(config)`, `updateSlot(config, slotIndex, patch)`, `removeSlot(config, slotIndex)`.
  - `renderSchedulePanel(ctx, options)` exported from `schedule-panel.ts`.

- [ ] **Step 1: Write the failing test for the rejected legacy key**

In `test/config.test.ts`:

```ts
it("rejects a legacy people config rather than guessing", () => {
  expect(() =>
    normaliseConfig({
      type: CARD_TYPE,
      people: [{ name: "Sami", schedule: { mon: [] } }],
    }),
  ).toThrow(/people/);
});

it("reads slots and schedule from the top level", () => {
  const config = normaliseConfig({
    type: CARD_TYPE,
    days: ["mon"],
    slots: [{ slot: 1, start: "08:00", end: "08:45" }],
    schedule: { mon: [{ activity: "english", start: "15:20", end: "16:20" }] },
  });
  expect(config.slots).toEqual([{ slot: 1, start: "08:00", end: "08:45" }]);
  expect(config.schedule.mon).toEqual([{ activity: "english", start: "15:20", end: "16:20" }]);
});

it("preserves schedule entries for days outside the day list", () => {
  const config = normaliseConfig({
    type: CARD_TYPE,
    days: ["mon"],
    schedule: { sat: [{ activity: "judo" }] },
  });
  expect(config.schedule.sat).toEqual([{ activity: "judo" }]);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run test/config.test.ts`
Expected: FAIL — `normaliseConfig` currently *requires* `people` and throws for the second and third cases.

- [ ] **Step 3: Flatten the types**

In `src/types.ts` delete `Person` and rewrite `CardConfig`:

```ts
export interface CardConfig {
  type: string;
  title?: string;
  layout: Layout;
  days: DayKey[];
  language: "auto" | Lang;
  highlight_today: boolean;
  header_color: string;
  activities: Activity[];
  slots?: Slot[];
  schedule: Partial<Record<DayKey, Block[]>>;
}
```

- [ ] **Step 4: Flatten normalisation**

In `src/config.ts`, delete `normalisePerson` and fold its body into `normaliseConfig`. Replace the `people` guard with a rejection, and read `slots`/`schedule` from `source`:

```ts
export function normaliseConfig(raw: unknown): CardConfig {
  const source = (raw ?? {}) as Record<string, unknown>;

  // A card holds one timetable, so `schedule` and `slots` are top-level keys.
  // `people` is rejected rather than ignored: silently dropping a key that
  // carries the whole schedule would render an empty card with no explanation.
  if (source.people !== undefined) {
    throw new Error(
      "weekly-timetable-card: unknown key `people` — a card shows one timetable. " +
        "Put `slots` and `schedule` at the top level.",
    );
  }
  if (source.activities !== undefined && !Array.isArray(source.activities)) {
    throw new Error("weekly-timetable-card: `activities` must be a list");
  }

  const days = normaliseDays(source.days, DEFAULT_DAYS);
  const activities = (Array.isArray(source.activities) ? source.activities : [])
    .map(normaliseActivity)
    .filter((activity): activity is Activity => activity !== null);

  const rawSchedule = (source.schedule ?? {}) as Record<string, unknown>;
  const schedule: Partial<Record<DayKey, Block[]>> = {};
  // Every listed day gets an array so renderers never branch on undefined, and
  // any other stored day is preserved so narrowing `days` is reversible rather
  // than quietly deleting that day's blocks on the next reload.
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

  const config: CardConfig = {
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
    schedule,
  };
  if (slots) config.slots = slots;
  return config;
}
```

Rewrite `getStubConfig`'s return to put `schedule` at the top level and drop the `people` array, `STUB_NAME`, `emoji` and `color`. Set `title: STUB_TITLE[lang]` with:

```ts
// A name needs no translation, so both languages show the same example.
const STUB_TITLE: Record<Lang, string> = { en: "Sami", bg: "Sami" };
```

- [ ] **Step 5: Delete `effectiveDays`**

In `src/days.ts` delete `effectiveDays` and drop `CardConfig`/`Person` from the type import if they become unused.

- [ ] **Step 6: Simplify the render context**

`src/renderers/context.ts` in full:

```ts
import { todayKey } from "../days.js";
import { resolveLang, stringsFor } from "../i18n/index.js";
import type { Strings } from "../i18n/types.js";
import type { CardConfig, DayKey, Density, Hass, Lang } from "../types.js";

export interface RenderContext {
  config: CardConfig;
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
  hass?: Hass;
  density: Density;
  now?: Date;
}

export function buildContext(params: BuildContextParams): RenderContext {
  const { config, hass, density, now } = params;
  const lang = resolveLang(config, hass);
  return {
    config,
    days: config.days,
    strings: stringsFor(lang),
    lang,
    hass,
    density,
    today: config.highlight_today ? todayKey(now) : null,
  };
}
```

- [ ] **Step 7: Update every `ctx.person` reader**

`src/renderers/blocks.ts`: `ctx.person.schedule[day]` becomes `ctx.config.schedule[day]`.
`src/renderers/grid.ts`: `ctx.person.slots` becomes `ctx.config.slots`; `ctx.person.schedule[day]` becomes `ctx.config.schedule[day]`.
`src/card.ts`: drop `personIndex` from the `buildContext` call, and `_dayCount()` becomes:

```ts
private _dayCount(): number {
  return this._config?.days.length ?? DEFAULT_DAYS.length;
}
```

Also update the comment above `_measuredWidth`, which explains the caching in terms of a per-person `days` override that no longer exists:

```ts
// Cached from the last ResizeObserver reading. `_dayCount()` also changes when
// the day list is edited with no resize in between, so density must be
// re-derived from this cached width on every update — not only inside the
// observer callback. Left at 0 until the first real measurement (jsdom never
// provides one), which the guard in `willUpdate` treats as "don't know yet"
// rather than "stacked".
```

- [ ] **Step 8: Drop `personIndex` from the mutations**

In `src/editor/mutations.ts` delete `replacePerson`, and rewrite `blocksOf`/`withBlocks` against the config:

```ts
function blocksOf(config: CardConfig, day: DayKey): Block[] {
  return config.schedule[day] ?? [];
}

function withBlocks(config: CardConfig, day: DayKey, blocks: Block[]): CardConfig {
  return { ...config, schedule: { ...config.schedule, [day]: blocks } };
}
```

Then remove the `personIndex` parameter and the `const person = config.people[...]` guard from `addBlock`, `updateBlock`, `removeBlock`, `moveBlock`, `moveBlockBy`, `addSlot`, `updateSlot` and `removeSlot`, returning `withBlocks(config, ...)` instead of `replacePerson(...)`. For example:

```ts
export function addBlock(config: CardConfig, day: DayKey, block: Block): CardConfig {
  return withBlocks(config, day, [...blocksOf(config, day), { ...block }]);
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
```

`countActivityUses` loses its outer loop:

```ts
export function countActivityUses(config: CardConfig, id: string): number {
  let count = 0;
  for (const blocks of Object.values(config.schedule)) {
    for (const block of blocks ?? []) {
      if (block.activity === id) count += 1;
    }
  }
  return count;
}
```

`addSlot`, `updateSlot` and `removeSlot` read `config.slots ?? []` and return `{ ...config, slots: [...] }`.

- [ ] **Step 9: Rename the panel**

```bash
git mv src/editor/person-panel.ts src/editor/schedule-panel.ts
git mv test/person-panel.test.ts test/schedule-panel.test.ts
```

Rename the exported function to `renderSchedulePanel` and the options interface to `SchedulePanelOptions`, drop the `config.people[0]` lookup in favour of reading `config.schedule` / `config.slots`, and drop the `0` person index from every mutation call. Update the import and call site in `src/editor/editor.ts`.

- [ ] **Step 10: Update the shared test helpers**

`test/helpers.ts` builds every renderer test's context and currently threads a person index. Drop it:

```ts
export interface ContextOptions {
  raw: unknown;
  hass?: Hass;
  density?: Density;
  now?: Date;
}

/** Builds a context the same way the card does, from raw (un-normalised) config. */
export function makeContext(options: ContextOptions): RenderContext {
  return buildContext({
    config: normaliseConfig(options.raw),
    hass: options.hass,
    density: options.density ?? "full",
    now: options.now,
  });
}
```

`renderToHost`, `textOf`, `textsOf`, `BG_24H` and `EN_12H` are unchanged.

- [ ] **Step 11: Update the remaining test fixtures**

Every fixture of the shape `{ people: [{ name, schedule }] }` becomes a flat `{ schedule }` — this is the `raw` constant at the top of most test files. Affected: `test/card.test.ts`, `test/config.test.ts`, `test/mutations.test.ts`, `test/renderers-blocks.test.ts`, `test/renderers-block.test.ts`, `test/renderers-grid.test.ts`, `test/settings-panel.test.ts`, `test/activities-panel.test.ts`, `test/schedule-panel.test.ts`. Mutation call sites drop their index argument, and `makeContext` calls drop `personIndex`.

- [ ] **Step 12: Run the full suite**

Run: `npm run typecheck && npm test`
Expected: PASS, and `grep -rn "people\|Person" src/` returns only the rejection message in `config.ts`.

- [ ] **Step 13: Commit**

```bash
git add -A
git commit -m "Flatten the card config to a single timetable"
```

---

### Task 3: Rename `Activity.label` to `title` and add `subtitle`

One atomic rename across every consumer, so the tree stays green. The subtitle is added to the type and the trust boundary here; its editor input arrives in Task 7 and its rendering in Task 5.

**Files:**
- Modify: `src/types.ts`, `src/config.ts`, `src/editor/mutations.ts`, `src/editor/activities-panel.ts`, `src/renderers/block.ts`, `src/i18n/types.ts`, `src/i18n/en.ts`, `src/i18n/bg.ts`
- Test: `test/config.test.ts`, `test/activities-panel.test.ts`, `test/renderers-block.test.ts`, `test/mutations.test.ts`

**Interfaces:**
- Consumes: the flattened `CardConfig` from Task 2.
- Produces: `Activity { id: string; title: string; subtitle?: string; color: string }`; `addActivity(config, title, color)`; editor strings `title` (field label), `subtitle`, `newActivityTitle`.

- [ ] **Step 1: Write the failing normalisation tests**

In `test/config.test.ts`:

```ts
it("reads an activity title and trims an optional subtitle", () => {
  const config = normaliseConfig({
    type: CARD_TYPE,
    schedule: {},
    activities: [{ id: "english", title: "  English  ", subtitle: "  Room 12  ", color: "#3b82f6" }],
  });
  expect(config.activities[0]).toEqual({
    id: "english",
    title: "English",
    subtitle: "Room 12",
    color: "#3b82f6",
  });
});

it("omits an empty subtitle entirely rather than passing an empty string on", () => {
  const config = normaliseConfig({
    type: CARD_TYPE,
    schedule: {},
    activities: [{ id: "judo", title: "Judo", subtitle: "   ", color: "#f97316" }],
  });
  expect(config.activities[0]).not.toHaveProperty("subtitle");
});

it("does not accept `label` as an alias for `title`", () => {
  const config = normaliseConfig({
    type: CARD_TYPE,
    schedule: {},
    activities: [{ id: "english", label: "English", color: "#3b82f6" }],
  });
  // With no title, the id stands in — the author sees the raw id and knows.
  expect(config.activities[0]!.title).toBe("english");
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run test/config.test.ts`
Expected: FAIL — `normaliseActivity` reads `label` and emits no `subtitle`.

- [ ] **Step 3: Update the type**

```ts
export interface Activity {
  id: string;
  title: string;
  subtitle?: string;
  color: string;
}
```

- [ ] **Step 4: Update normalisation and the stub**

In `src/config.ts`:

```ts
function normaliseActivity(raw: unknown): Activity | null {
  const source = (raw ?? {}) as Record<string, unknown>;
  const id = typeof source.id === "string" ? source.id.trim() : "";
  if (id.length === 0) return null;
  const title = typeof source.title === "string" && source.title.trim().length > 0
    ? source.title.trim()
    : id;
  const color = typeof source.color === "string" && source.color.trim().length > 0
    ? source.color.trim()
    : FALLBACK_ACTIVITY_COLOR;
  const activity: Activity = { id, title, color };
  const subtitle = typeof source.subtitle === "string" ? source.subtitle.trim() : "";
  if (subtitle.length > 0) activity.subtitle = subtitle;
  return activity;
}
```

In `STUB_ACTIVITIES`, rename every `label:` to `title:` and add two subtitles so the stub demonstrates the feature: `english` gets `subtitle: "Room 12"` / `subtitle: "Стая 12"`, and `judo` gets `subtitle: "Sports hall"` / `subtitle: "Спортна зала"`.

- [ ] **Step 5: Update the remaining consumers**

`src/editor/mutations.ts` — `addActivity(config, title, color)`, building `{ id, title, color }` and passing `title` to `uniqueActivityId`.
`src/editor/activities-panel.ts` — `strings.editor.activityInUse(activity.title, uses)`; the text input's `data-field` becomes `title` with `.value=${activity.title}` committing `{ title: inputValue(event) }`; the add row's `data-field` becomes `new-title` with placeholder `strings.editor.newActivityTitle`; the preview chip renders `activity.title`.
`src/renderers/block.ts` — `${activity ? activity.title : block.activity}`.

- [ ] **Step 6: Update the strings**

`EditorStrings` already has a `title` key — it labels the *card's* title field in the settings panel. Do not reuse it. Name the activity fields explicitly instead: replace `label: string;` with `activityTitle: string;` and `activitySubtitle: string;`, and rename `newActivityLabel` to `newActivityTitle`. In `en.ts`: `activityTitle: "Title"`, `activitySubtitle: "Subtitle"`, `newActivityTitle: "New activity name"`. In `bg.ts`: `activityTitle: "Заглавие"`, `activitySubtitle: "Подзаглавие"`, `newActivityTitle: "Име на нова дейност"`. Also rename the `activityInUse` parameter from `label` to `title`.

- [ ] **Step 7: Update the tests**

In `test/activities-panel.test.ts`, `test/renderers-block.test.ts` and `test/mutations.test.ts`, rename every activity fixture's `label` to `title` and every `[data-field="label"]` selector to `[data-field="title"]`, `[data-field="new-label"]` to `[data-field="new-title"]`.

- [ ] **Step 8: Run the full suite**

Run: `npm run typecheck && npm test`
Expected: PASS, and `grep -rn '\blabel\b' src/` returns nothing.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "Rename the activity label to title and add an optional subtitle"
```

---

### Task 4: Structured two-line time

Adds the two-line form beside the existing one-line wording. Both switch on the same `blockForm()` result — the form is derived once; only the presentation differs.

**Files:**
- Modify: `src/renderers/block.ts`, `src/i18n/types.ts`, `src/i18n/en.ts`, `src/i18n/bg.ts`
- Test: `test/renderers-block.test.ts`

**Interfaces:**
- Consumes: `blockForm(block)` from `src/block.ts`; `TimeLabelContext` from `src/renderers/block.ts`.
- Produces: `blockTimeLines(ctx: TimeLabelContext, block: Block): { top: string; bottom: string } | null` — `null` for the `bare` form. Top-level strings `untilWord` and `afterWord`.

- [ ] **Step 1: Write the failing test**

In `test/renderers-block.test.ts`:

Add `blockTimeLines` to the existing import from `../src/renderers/block.js`. The file already defines `bg` and `en` contexts via `makeContext`, and a `flat()` helper that replaces the narrow no-break space `Intl` puts before `AM`/`PM` — reuse all three rather than building contexts inline.

```ts
describe("blockTimeLines", () => {
  it("stacks start over end for a range", () => {
    expect(blockTimeLines(bg, { activity: "english", start: "15:20", end: "16:20" })).toEqual({
      top: "15:20",
      bottom: "16:20",
    });
  });

  it("puts the wording word above the time for an end-only block", () => {
    expect(blockTimeLines(bg, { activity: "daycare", end: "16:00" })).toEqual({
      top: "до",
      bottom: "16:00",
    });
    const lines = blockTimeLines(en, { activity: "daycare", end: "16:00" })!;
    expect(lines.top).toBe("until");
    expect(flat(lines.bottom)).toBe("4:00 PM");
  });

  it("puts the wording word above the time for a start-only block", () => {
    expect(blockTimeLines(bg, { activity: "home", start: "18:30" })).toEqual({
      top: "след",
      bottom: "18:30",
    });
    const lines = blockTimeLines(en, { activity: "home", start: "18:30" })!;
    expect(lines.top).toBe("after");
    expect(flat(lines.bottom)).toBe("6:30 PM");
  });

  it("returns null for a block with no times at all", () => {
    expect(blockTimeLines(bg, { activity: "free" })).toBeNull();
  });

  it("keeps an end-only and a start-only block distinguishable", () => {
    // The wording word is the only thing separating them once the time is on
    // its own line — this is the assertion that fails if it is ever dropped.
    expect(blockTimeLines(bg, { activity: "english", end: "16:00" })).not.toEqual(
      blockTimeLines(bg, { activity: "english", start: "16:00" }),
    );
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run test/renderers-block.test.ts`
Expected: FAIL with `blockTimeLines is not a function`.

- [ ] **Step 3: Add the strings**

In `Strings` (not `EditorStrings`), beside `until` and `after`:

```ts
  /** The bare word for the stacked time column, where the time is on its own line. */
  untilWord: string;
  afterWord: string;
```

`en.ts`: `untilWord: "until"`, `afterWord: "after"`. `bg.ts`: `untilWord: "до"`, `afterWord: "след"`.

- [ ] **Step 4: Implement the function**

In `src/renderers/block.ts`, below `blockTimeLabel`:

```ts
/**
 * The two-line form for the card's left-hand time column. `blockTimeLabel`
 * above keeps the one-line wording for the editor, which has no room to stack.
 * Both switch on the same `blockForm()` result: the form is derived in exactly
 * one place, and only the presentation differs. Letting the two drift is a real
 * failure mode — the editor's copy once dropped the until/after wording
 * entirely, making an end-only and a start-only block indistinguishable.
 */
export function blockTimeLines(
  ctx: TimeLabelContext,
  block: Block,
): { top: string; bottom: string } | null {
  const fmt = (value: string) => formatTime(value, ctx.hass, ctx.lang);
  switch (blockForm(block)) {
    case "range":
      return { top: fmt(block.start!), bottom: fmt(block.end!) };
    case "until":
      return { top: ctx.strings.untilWord, bottom: fmt(block.end!) };
    case "after":
      return { top: ctx.strings.afterWord, bottom: fmt(block.start!) };
    case "bare":
      return null;
  }
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run test/renderers-block.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add the two-line stacked form for a block's time"
```

---

### Task 5: Two-column block markup and styles

**Files:**
- Modify: `src/renderers/block.ts`, `src/styles.ts`
- Test: `test/renderers-block.test.ts`, `test/styles.test.ts`

**Interfaces:**
- Consumes: `blockTimeLines` from Task 4; `Activity.subtitle` from Task 3.
- Produces: `renderBlock(ctx, block, opts?: { hideTime?: boolean })`. Markup: `.block > .block-time > (.block-time-top, .block-time-bottom)` and `.block > .block-text > (.block-title, .block-subtitle)`. `.block-label` no longer exists.

- [ ] **Step 1: Write the failing render test**

In `test/renderers-block.test.ts`:

These are renderer tests: they call `renderBlock` and render the returned template into a plain host with `renderToHost`. There is no card element and no shadow root. Give the `raw` constant at the top of the file a subtitle on one activity first:

```ts
const raw = {
  activities: [
    { id: "english", title: "Английски", subtitle: "Стая 12", color: "#3b82f6" },
    { id: "daycare", title: "Занималня", color: "#64748b" },
    { id: "home", title: "Връщане вкъщи", color: "#22c55e" },
    { id: "free", title: "Свободен следобед", color: "#22c55e" },
  ],
  schedule: {},
};
```

```ts
it("renders the time as two stacked lines beside a title and subtitle", () => {
  const host = renderToHost(
    renderBlock(bg, { activity: "english", start: "15:20", end: "16:20" }),
  );
  expect(textOf(host, ".block-time-top")).toBe("15:20");
  expect(textOf(host, ".block-time-bottom")).toBe("16:20");
  expect(textOf(host, ".block-title")).toBe("Английски");
  expect(textOf(host, ".block-subtitle")).toBe("Стая 12");
  expect(host.querySelector(".block-label")).toBeNull();
});

it("omits the subtitle element when the activity has none", () => {
  const host = renderToHost(
    renderBlock(bg, { activity: "daycare", start: "15:20", end: "16:20" }),
  );
  expect(textOf(host, ".block-title")).toBe("Занималня");
  expect(host.querySelector(".block-subtitle")).toBeNull();
});

it("omits the whole time column for a block with no times", () => {
  const host = renderToHost(renderBlock(bg, { activity: "free" }));
  expect(host.querySelector(".block-time")).toBeNull();
  expect(textOf(host, ".block-title")).toBe("Свободен следобед");
});

it("omits the time column when asked to hide it", () => {
  const host = renderToHost(
    renderBlock(bg, { activity: "english", start: "15:20", end: "16:20" }, { hideTime: true }),
  );
  expect(host.querySelector(".block-time")).toBeNull();
  expect(textOf(host, ".block-title")).toBe("Английски");
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run test/renderers-block.test.ts`
Expected: FAIL — the markup still emits `.block-time` as a single line and `.block-label`.

- [ ] **Step 3: Rewrite the renderer**

```ts
export function renderBlock(
  ctx: RenderContext,
  block: Block,
  opts?: { hideTime?: boolean },
): TemplateResult {
  const activity = findActivity(ctx.config.activities, block.activity);
  const lines = opts?.hideTime === true ? null : blockTimeLines(ctx, block);
  const styles = activity
    ? {
        "--wtc-block-fill": activityFill(activity.color),
        "--wtc-block-border": activityBorder(activity.color),
      }
    : {};

  return html`
    <div
      class=${activity ? "block" : "block orphan"}
      style=${styleMap(styles)}
      title=${activity ? nothing : ctx.strings.editor.orphanActivity}
    >
      ${lines
        ? html`
            <div class="block-time">
              <div class="block-time-top">${lines.top}</div>
              <div class="block-time-bottom">${lines.bottom}</div>
            </div>
          `
        : nothing}
      <div class="block-text">
        <div class="block-title">${activity ? activity.title : block.activity}</div>
        ${activity?.subtitle
          ? html`<div class="block-subtitle">${activity.subtitle}</div>`
          : nothing}
      </div>
    </div>
  `;
}
```

- [ ] **Step 4: Restyle the block**

Replace `blockStyles` in `src/styles.ts`:

```ts
export const blockStyles = css`
  .block {
    display: flex;
    align-items: baseline;
    gap: 8px;
    border-radius: 8px;
    padding: 8px 10px;
    text-align: left;
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

  /* Content-sized so the text column takes the remainder, and right-aligned so
     the two stacked times line up with each other rather than with the title.
     The words until/after are the widest content and set the column's floor. */
  .block-time {
    flex: 0 0 auto;
    text-align: right;
    font-size: 11px;
    line-height: 1.3;
    color: var(--secondary-text-color);
    font-variant-numeric: tabular-nums;
  }

  .block-text {
    flex: 1 1 auto;
    min-width: 0;
  }

  .block-title {
    font-size: 13px;
    line-height: 1.3;
    font-weight: 600;
    color: var(--primary-text-color);
  }

  .block-subtitle {
    font-size: 11px;
    line-height: 1.3;
    color: var(--secondary-text-color);
  }
`;
```

In the compact tier, replace the `.block-time` and `.block-label` rules with:

```ts
  [data-density="compact"] .block {
    padding: 5px 7px;
    gap: 6px;
  }

  [data-density="compact"] .block-time,
  [data-density="compact"] .block-subtitle {
    font-size: 10px;
  }

  [data-density="compact"] .block-title {
    font-size: 12px;
  }
```

- [ ] **Step 5: Update the styles test**

In `test/styles.test.ts`, replace `'[data-density="compact"] .block'`-adjacent selectors so the list reads `.day-head`, `.day-body`, `.block`, `.block-title`, `.grid-head`, `.slot-label`, `.grid-cell`.

- [ ] **Step 6: Update the two grid tests that assert the old class**

`test/renderers-grid.test.ts` asserts `.block-label` in two places — around line 48 (a block on a slot) and line 55 (blocks in the strip). Change both selectors to `.block-title`. Leave line 48's *time* expectations alone for now; Task 6 changes what that cell renders.

Nothing else asserts `.block-label`. `.palette-chip` in `test/editor.test.ts` and the schedule panel's palette is a different class and is unaffected.

One intermediate state is expected and harmless: `src/editor/activities-panel.ts` still emits `.block-label` for its preview chips after this task, so those chips lose their styling until Task 7 rewrites that markup. No test asserts it, and the panel stays usable.

- [ ] **Step 7: Run the full suite**

Run: `npm run typecheck && npm test`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Render a block as a stacked time column beside its title and subtitle"
```

---

### Task 6: Grid blocks on a slot do not repeat their time

**Files:**
- Modify: `src/renderers/grid.ts`
- Test: `test/renderers-grid.test.ts`

**Interfaces:**
- Consumes: `renderBlock(ctx, block, opts)` from Task 5.
- Produces: no new exports.

- [ ] **Step 1: Write the failing test**

In `test/renderers-grid.test.ts`:

Follow the file's existing pattern — `makeContext` with a grid `raw`, then `renderToHost(renderGrid(ctx))`.

```ts
it("does not repeat the slot's time inside a block placed on that slot", () => {
  const ctx = makeContext({
    raw: {
      layout: "grid",
      days: ["mon"],
      activities: [{ id: "english", title: "Английски", color: "#3b82f6" }],
      slots: [{ slot: 1, start: "15:20", end: "16:20" }],
      schedule: { mon: [{ activity: "english", start: "15:20", end: "16:20" }] },
    },
    hass: BG_24H,
  });
  const host = renderToHost(renderGrid(ctx));

  const cell = host.querySelector(".grid-cell")!;
  expect(cell.querySelector(".block-title")!.textContent!.trim()).toBe("Английски");
  expect(cell.querySelector(".block-time")).toBeNull();
});

it("keeps the time on a block in the open-ended strip, which has no row", () => {
  const ctx = makeContext({
    raw: {
      layout: "grid",
      days: ["mon"],
      activities: [{ id: "daycare", title: "Занималня", color: "#64748b" }],
      slots: [{ slot: 1, start: "15:20", end: "16:20" }],
      schedule: { mon: [{ activity: "daycare", end: "16:00" }] },
    },
    hass: BG_24H,
  });
  const host = renderToHost(renderGrid(ctx));

  const strip = host.querySelector(".strip-cell")!;
  expect(strip.querySelector(".block-time-top")!.textContent!.trim()).toBe("до");
  expect(strip.querySelector(".block-time-bottom")!.textContent!.trim()).toBe("16:00");
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run test/renderers-grid.test.ts`
Expected: FAIL on the first test — the slot cell still renders `.block-time`.

- [ ] **Step 3: Pass the flag for on-slot blocks only**

In `src/renderers/grid.ts`, in the `.grid-cell` branch:

```ts
                      ${(placements.get(day)!.bySlot.get(slot.slot) ?? []).map((block) =>
                        renderBlock(ctx, block, { hideTime: true }),
                      )}
```

Leave the `.strip-cell` call as `renderBlock(ctx, block)`.

- [ ] **Step 4: Run the suite**

Run: `npm run typecheck && npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Stop grid blocks repeating the time their slot already states"
```

---

### Task 7: Subtitle input in the activities panel

**Files:**
- Modify: `src/editor/activities-panel.ts`
- Test: `test/activities-panel.test.ts`

**Interfaces:**
- Consumes: `updateActivity(config, index, patch)` where `patch` is `Partial<Omit<Activity, "id">>`; strings `activitySubtitle`.
- Produces: no new exports.

- [ ] **Step 1: Write the failing test**

In `test/activities-panel.test.ts`:

The file already has a local `mount(source?)` returning `{ config, commit, host }`, where `commit` is a `vi.fn()`. Use it.

```ts
it("edits an activity's subtitle", () => {
  const { commit, host } = mount();
  const input = host.querySelector<HTMLInputElement>('[data-field="subtitle"]')!;
  input.value = "Стая 12";
  input.dispatchEvent(new Event("change"));

  const next = commit.mock.calls[0]![0];
  expect(next.activities[0]).toEqual({
    id: "english",
    title: "Английски",
    subtitle: "Стая 12",
    color: "#3b82f6",
  });
});

it("shows an existing subtitle in the field", () => {
  const { host } = mount({
    activities: [
      { id: "english", title: "Английски", subtitle: "Стая 12", color: "#3b82f6" },
    ],
    schedule: {},
  });
  expect(host.querySelector<HTMLInputElement>('[data-field="subtitle"]')!.value)
    .toBe("Стая 12");
});

it("emptying the field commits an empty subtitle, which normalisation then drops", () => {
  const { commit, host } = mount({
    activities: [
      { id: "english", title: "Английски", subtitle: "Стая 12", color: "#3b82f6" },
    ],
    schedule: {},
  });
  const input = host.querySelector<HTMLInputElement>('[data-field="subtitle"]')!;
  input.value = "";
  input.dispatchEvent(new Event("change"));

  // updateActivity is a plain spread, so the in-editor config carries "".
  // The renderer treats "" as absent, and normaliseConfig strips the key on
  // the next load. Asserted so nobody "fixes" this into a delete and breaks
  // the round-trip.
  expect(commit.mock.calls[0]![0].activities[0]!.subtitle).toBe("");
});
```

`new Event("change")` needs no `bubbles: true` here: the panel binds `@change` directly on the input, not on an ancestor. (The harness's *delegated* listeners do need it — that distinction cost a debugging session earlier in this project.)

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run test/activities-panel.test.ts`
Expected: FAIL — there is no `[data-field="subtitle"]`.

- [ ] **Step 3: Add the input**

In the activity row in `src/editor/activities-panel.ts`, after the title input:

```ts
            <input
              class="grow"
              type="text"
              data-field="subtitle"
              placeholder=${strings.editor.activitySubtitle}
              .value=${activity.subtitle ?? ""}
              @change=${(event: Event) =>
                commit(updateActivity(config, index, { subtitle: inputValue(event) }))}
            />
```

The row already wraps at narrow widths (`.row { flex-wrap: wrap }` with `.grow { flex: 1 1 7rem; min-width: 7rem }`), so a third field does not collapse the others at HA's 390px dialog width. Verify that in the harness in Task 8 rather than assuming it.

- [ ] **Step 4: Render the subtitle on the preview chips**

In the `.palette` loop, replace the single label div with:

```ts
              <div class="block-text">
                <div class="block-title">${activity.title}</div>
                ${activity.subtitle
                  ? html`<div class="block-subtitle">${activity.subtitle}</div>`
                  : nothing}
              </div>
```

Add `nothing` to the `lit` import if it is not already there.

- [ ] **Step 5: Run the suite**

Run: `npm run typecheck && npm test`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "Add a subtitle field to the activities editor"
```

---

### Task 8: Update the dev harness

**Files:**
- Modify: `dev/mock-hass.js`, `dev/index.html`

**Interfaces:**
- Consumes: the flattened config shape and the renamed activity fields.
- Produces: nothing consumed by code.

- [ ] **Step 1: Flatten the harness config**

In `dev/mock-hass.js`, replace the `people` array with a top-level `schedule` (and `slots` where the grid demo needs them), keep `title: "Sami"`, rename every activity `label` to `title`, and give two activities a Bulgarian `subtitle` so the harness stays a live Cyrillic check. Delete the second demo person and any person-switching control in `dev/index.html`.

- [ ] **Step 2: Build the harness bundle and look at it**

```bash
npm run watch
```

Open `dev/index.html`. Verify by eye, at each control setting:
- A range block shows two stacked times on the left, title and subtitle on the right.
- An `until` block shows the word above the time, in both languages.
- A bare block shows no time column and does not leave a gap where one was.
- `grid` layout: blocks on a slot show no time; strip blocks do.
- Compact (narrow) and stacked (narrowest) tiers stay legible; the time column does not wrap mid-time.
- The activities panel's three-field row does not collapse at 390px.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Update the dev harness for one timetable per card"
```

---

### Task 9: Documentation and the bundle

**Files:**
- Modify: `README.md`, `docs/step-9-ha-verification.md`, `docs/superpowers/specs/2026-09-21-weekly-timetable-card-design.md`
- Modify: `dist/weekly-timetable-card.js` (rebuilt)

**Interfaces:**
- Consumes: the finished implementation.
- Produces: nothing.

- [ ] **Step 1: Rewrite the README for the card as it now is**

Write it as documentation for a card that has always worked this way. **No migration guide, no before/after comparison, and no mention of how anything used to behave** — a reader arriving at this README should not learn that multiple people or an activity `label` ever existed.

Delete the "Per person" table. Fold `slots` and `schedule` into the main options table. Update the `activities` row to `id`, `title`, `subtitle`, `color`. Rewrite the YAML example to the flat shape with `title: Sami`, two activities carrying subtitles, and no `people:`. In the features list, replace "Several people — one tab each" with a line describing the block structure: a stacked time on the left, a title and optional subtitle on the right.

The Updating section stays as it is — it is about HACS and browser caching, not about this change.

- [ ] **Step 2: Update the HA verification checklist**

In `docs/step-9-ha-verification.md`, change "all five tabs work" to "all three tabs work", and add the two-column block and the subtitle to the list of things already exercised in a browser.

- [ ] **Step 3: Mark the superseded decision in the original spec**

In `docs/superpowers/specs/2026-09-21-weekly-timetable-card-design.md`, strike through decision 5 and point at the new spec, matching how decision 12 records the drag removal:

```markdown
| 5 | ~~Multiple people as tabs~~ — removed 2026-09-22 | One card shows one timetable; two people means two cards. See [the single-person spec](2026-09-22-single-person-block-structure-design.md). |
```

- [ ] **Step 4: Rebuild the bundle**

```bash
npm run typecheck && npm test && npm run build
git diff --stat -- dist
```

Expected: `dist/weekly-timetable-card.js` changes. CI runs `git diff --exit-code -- dist` at the PR tip, so this must be committed.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "Document the single-timetable config and rebuild the bundle"
```

---

## Release

Open a pull request against `master`. The configuration change is breaking, so
label it **`major`** for v1.0.0, or `minor` for v0.2.0 if the card is still
considered pre-stable. That decision belongs at merge time; see the spec's
Release section.
