# Weekly Timetable Card — Design

**Date:** 2026-09-21
**Status:** Approved design, ready for implementation planning

## Summary

A Home Assistant Lovelace custom card that renders a weekly timetable for one or
more people, in English or Bulgarian, in either of two layouts: free-form
activity blocks (the reference design) or a classic slot grid. All data lives in
the card's own Lovelace config and is edited through a visual editor. No
entities, no calendars, no backend.

The card is inspired by `AyKay35/lovelace-timetable-card` (MIT) but is a separate
implementation. That card is German-only, hardcodes its day keys as German
abbreviations, and renders only a fixed slot grid, none of which can express the
reference design.

## Goals

- Render the reference design: day columns of stacked pastel activity blocks
  under dark navy headers.
- Support open-ended times — "до 16:00", "след 18:30" — alongside ranges and
  label-only blocks.
- Show any subset of Monday–Sunday, in the author's chosen order.
- Show multiple people as tabs within one card.
- Present all card and editor chrome in English or Bulgarian, chosen
  automatically from the viewing Home Assistant user's own language.
- Also offer a classic numbered-slot grid layout.
- Configure everything visually. YAML remains available but is never required.
- Work on phone, tablet and desktop, in light and dark themes.

## Non-goals

- Translating user content. Activity labels are authored once as plain strings
  and render identically in both languages.
- Reading schedules from Home Assistant entities or `calendar.*` entities.
- Duration-proportional timeline rendering. See "Sequence, not timeline".
- Drag-and-drop. It was built, shipped in v0.0.2 and v0.0.3, and never worked in
  a real Home Assistant editor dialog despite working in the dev harness; it was
  removed in v0.0.4 rather than iterated on further. See the Removed section.
- Languages beyond English and Bulgarian in v1. The string-table structure
  accepts more without restructuring.

## Decisions

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Two layouts, `blocks` and `grid`, over one data model | A slot grid is expressible as blocks; free-form blocks are not expressible as a grid. Storing blocks and treating grid as a second renderer avoids two config trees that drift. |
| 2 | Block time form derived from which of `start`/`end` are present | No `mode` discriminator that can contradict the times. The four cases are exhaustive by construction. |
| 3 | Data lives in card config, edited visually | Matches the reference card, backed up with HA config, no entities to maintain. |
| 4 | `days` is an ordered list, not a 5/7 toggle | Mon–Sat, weekends-only and reordering all fall out for free. |
| 5 | ~~Multiple people as tabs~~ — removed 2026-09-22 | One card shows one timetable; two people means two cards. See [the single-person spec](2026-09-22-single-person-block-structure-design.md). |
| 6 | UI chrome translated, content not; language auto-detected from `hass.language` | The chrome follows the viewer — the same dashboard renders in Bulgarian for one user and English for another, with no config change. |
| 7 | TypeScript + Lit, modular source, esbuild to one bundle | Lit's declarative rendering removes the editor focus-loss that forces the reference card to save on `blur`; HA's own frontend is Lit, so its form components integrate. |
| 8 | Narrow widths stack days vertically | Nothing is hidden behind a gesture, and it is the same blocks in one column — a simple third path. |
| 9 | Open-ended blocks render in a strip above the grid in `grid` layout | A block with no start has no position on a slot ruler; a strip keeps it visible rather than silently dropped. |
| 10 | Times honour `hass.locale.time_format` | Times are stored structured, so an English user on 12-hour sees `3:20 PM` and a Bulgarian user `15:20` from one config. |
| 11 | Distinct element name `weekly-timetable-card` | `customElements.define` throws on a duplicate name; the reference card registers `timetable-card`. |
| 12 | ~~Both the list editor and drag-and-drop in the initial build~~ — drag-and-drop removed in v0.0.4 | The list editor was always complete on its own, which is why removing drag cost no capability. See the Removed section. |
| 13 | Standalone mock dev harness, no Home Assistant in the loop | Fastest iteration on layout and language. Real HA integration is verified manually by the author. |

## Data model

```ts
type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
type Lang   = "en" | "bg";

interface Activity {
  id: string;      // stable reference, generated on creation; see "Activity ids"
  label: string;   // displayed as authored, never translated
  color: string;   // base colour; fill/border derived from it
}

interface Block {
  activity: string; // Activity.id
  start?: string;   // "HH:MM"
  end?: string;     // "HH:MM"
}

interface Slot {
  slot: number;
  start: string;    // "HH:MM"
  end: string;      // "HH:MM"
}

interface Person {
  name: string;
  emoji?: string;
  color?: string;                            // tab accent
  days?: DayKey[];                           // replaces CardConfig.days entirely
  slots?: Slot[];                            // grid layout only
  schedule: Partial<Record<DayKey, Block[]>>;
}

interface CardConfig {
  type: "custom:weekly-timetable-card";
  title?: string;
  layout?: "blocks" | "grid";   // default "blocks"
  days?: DayKey[];              // default ["mon","tue","wed","thu","fri"]
  language?: "auto" | Lang;     // default "auto"
  highlight_today?: boolean;    // default true
  header_color?: string;        // default "#1e3a5f"
  activities: Activity[];
  people: Person[];
}
```

### Block time forms

| `start` | `end` | Form | Rendered (bg / en) |
|---|---|---|---|
| set | set | range | `15:20–16:20` |
| unset | set | until | `до 16:00` / `until 16:00` |
| set | unset | after | `след 18:30` / `after 18:30` |
| unset | unset | bare | no time line, label only |

`blockForm(block): "range" | "until" | "after" | "bare"` is a pure function and is
the single place this mapping exists.

### Validation and normalisation

`config.ts` exposes `normaliseConfig(raw): CardConfig`, which:

- Throws a descriptive error if `people` is missing or empty, or if `activities`
  is not an array. HA displays a thrown message from `setConfig` in the card slot.
- Fills defaults for `layout`, `days`, `language`, `highlight_today`,
  `header_color`.
- Drops unknown day keys from `days` and from each person's `schedule`, and
  de-duplicates `days` while preserving order.
- Coerces each person's `schedule` to have an array for every day in their
  effective day list, so renderers never branch on `undefined`.
- Leaves `activity` ids that match no activity untouched. Orphans are a render
  concern, not a config error — see "Orphaned activity references".

A person's `days`, when present, **replaces** the card-level list rather than
intersecting with it. A person may therefore show days the card-level list omits,
which is the point: one child has Saturday judo and another does not. Only one
person's columns are visible at a time, so differing day sets never have to
reconcile within a single view. `effectiveDays(config, person)` is the one
function that resolves this, and every renderer goes through it.

### Activity ids

Ids are generated once, when an activity is created in the editor, and never
change afterwards — renaming an activity leaves every block that references it
intact. Generation lowercases the label, replaces any run of characters that are
neither letters nor digits with a single hyphen, and trims hyphens from both ends.
The character classes are Unicode-aware, so Cyrillic labels yield Cyrillic ids
(`Английски` → `английски`), which are valid YAML keys and valid in the config.
If the result is empty, or collides with an existing id, a numeric suffix is
appended (`activity-2`). Ids are never regenerated from labels on load, because
doing so would silently orphan every block after a rename.

`getStubConfig(hass)` builds the example config shown when the card is first
added, with a Monday–Friday week and activity labels in the resolved language.
`hass.locale.first_weekday` is not applied to the stub — a Sunday-first order over
five days would yield `[sun, mon, tue, wed, thu]` and drop Friday from a school
week. It is used instead to order the day toggle chips in the editor's Settings
panel, where the full seven days are always present.

## Configuration example

```yaml
type: custom:weekly-timetable-card
title: Седмична програма
layout: blocks
days: [mon, tue, wed, thu, fri]
language: auto
highlight_today: true
header_color: "#1e3a5f"

activities:
  - { id: english,  label: Английски,          color: "#3b82f6" }
  - { id: daycare,  label: Занималня,          color: "#64748b" }
  - { id: break,    label: Почивка и хапване,  color: "#94a3b8" }
  - { id: judo,     label: Джудо,              color: "#f97316" }
  - { id: chess,    label: Шах,                color: "#a855f7" }
  - { id: free,     label: Свободен следобед,  color: "#22c55e" }
  - { id: home,     label: Връщане вкъщи,      color: "#22c55e" }

people:
  - name: Иван
    emoji: "🥋"
    color: "#f472b6"
    schedule:
      mon:
        - { activity: english, start: "15:20", end: "16:20" }
        - { activity: break,   start: "16:20", end: "17:30" }
        - { activity: judo,    start: "17:30", end: "18:30" }
        - { activity: home,    start: "18:30" }
      tue:
        - { activity: daycare, end: "16:00" }
        - { activity: free,    start: "16:00" }
      wed:
        - { activity: english, start: "15:20", end: "16:20" }
        - { activity: break,   start: "16:20", end: "17:30" }
        - { activity: judo,    start: "17:30", end: "18:30" }
        - { activity: home,    start: "18:30" }
      thu:
        - { activity: daycare, end: "16:00" }
        - { activity: break,   start: "16:00", end: "16:30" }
        - { activity: chess,   start: "16:30", end: "17:30" }
      fri:
        - { activity: daycare, end: "16:00" }
        - { activity: break,   start: "16:00", end: "16:30" }
        - { activity: chess,   start: "16:30", end: "17:30" }
```

## Rendering

### Sequence, not timeline

Blocks are laid out in configured order and sized by their content, not by
duration. In the reference design a 60-minute block and a 70-minute block render
at identical heights. This is what makes open-ended blocks expressible at all — a
duration-proportional timeline has nowhere to place a block with no start. The
`grid` layout is the timeline view; `blocks` deliberately is not.

### `blocks` layout

The card is a CSS grid of day columns, `repeat(N, minmax(0, 1fr))`. Each column is
a rounded panel: a header bar in `header_color` with the uppercase day name, and a
body with `align-content: start` holding the day's blocks. Each block is a rounded
rectangle with a small muted time line above a label line. An empty day renders an
empty panel, not a collapsed one, so columns stay aligned.

### `grid` layout

A leading ruler column lists each slot's `start`–`end`; day columns follow. A
block is placed in slot *S* when its `start` and `end` both equal *S*'s. Every
other block — any non-range form, and any range matching no slot — renders in the
open-ended strip above the grid, under its own day column so it stays visually
aligned. If a person defines no `slots`, the grid renders the strip only, with a
message prompting the author to define slots.

### `stacked` layout

Selected automatically at narrow widths, never configured. Days become stacked
sections: a full-width day header followed by that day's blocks in a single
column. Used by both `blocks` and `grid` configurations.

### Density measurement

A `ResizeObserver` on the card element measures the card's own width — not the
viewport, since a Lovelace card in a masonry dashboard can be 300px wide on a
2560px screen — and divides it by the effective day count:

| Width per column | Density | Effect |
|---|---|---|
| ≥ 150px | `full` | Full day names, normal padding, two-column blocks |
| ≥ 72px | `compact` | Short day names, tightened padding and type, blocks stacked internally |
| < 72px | `stacked` | Stacked layout |

The `full` floor was 110px while a block was a single centred column. The
two-column block gives the title only about half the block's width, so at 110px
per column titles shredded into two or three characters per line; 150px is where
the two columns start paying for themselves again.

The threshold depends on a runtime day count, so it is computed in JavaScript and
applied as a `data-density` attribute on the root; CSS keys off that attribute.

### Colour

Each activity carries one base colour. Fill and border are derived so a single
config renders as light pastels on a light theme and muted chips on a dark one:

- fill: `color-mix(in srgb, var(--activity-color) 14%, var(--card-background-color))`
- border: `color-mix(in srgb, var(--activity-color) 35%, var(--card-background-color))`
- label text: `var(--primary-text-color)`
- time text: `var(--secondary-text-color)`

`header_color` is a literal colour rather than a theme variable, because no HA
theme variable produces the reference design's navy. Header text is chosen as
white or near-black by relative luminance so a custom `header_color` stays legible.

### Today

When `highlight_today` is true and today is in the effective day list, that column
gets a tinted body and a brightened header. Today is resolved from the browser's
local date on each render.

### Orphaned activity references

A block whose `activity` matches no entry in `activities` renders as a neutral
grey block showing the raw id. Visible and recoverable rather than a crash or a
blank. The editor warns before deleting an activity that blocks still reference.

## Internationalisation

```ts
interface Strings {
  days: Record<DayKey, { full: string; short: string }>;
  until: (time: string) => string;
  after: (time: string) => string;
  today: string;
  editor: Record<EditorStringKey, string>;
}
```

`en.ts` and `bg.ts` are both declared `const x: Strings`, so a missing key is a
compile error rather than `undefined` rendered into a dashboard.

Resolution: `language: "auto"` reads `hass.language` and selects Bulgarian when it
starts with `bg`, English otherwise. `language: "en" | "bg"` forces one. Because
resolution depends on `hass`, the card re-renders on `hass` changes as well as
config changes, so a profile language switch takes effect immediately.

### Day names

| Key | English | Short | Bulgarian | Short |
|---|---|---|---|---|
| mon | Monday | Mon | понеделник | пн |
| tue | Tuesday | Tue | вторник | вт |
| wed | Wednesday | Wed | сряда | ср |
| thu | Thursday | Thu | четвъртък | чт |
| fri | Friday | Fri | петък | пт |
| sat | Saturday | Sat | събота | сб |
| sun | Sunday | Sun | неделя | нд |

Bulgarian short forms are authored, not derived: `неделя` → `нд` and
`четвъртък` → `чт` are two letters, so any three-character truncation produces
wrong Bulgarian. Uppercase display is CSS `text-transform`, which handles Cyrillic
correctly, so the table stores natural case.

### Time phrases

| | English | Bulgarian |
|---|---|---|
| until | `until {time}` | `до {time}` |
| after | `after {time}` | `след {time}` |
| range | `{start}–{end}` | `{start}–{end}` |

### Time formatting

`time.ts` parses `"HH:MM"` and formats via `Intl.DateTimeFormat`, resolving
`hour12` from `hass.locale.time_format`:

- `"12"` → 12-hour; `"24"` → 24-hour
- `"language"` → the convention of the resolved HA language
- `"system"` → the convention of the browser locale

A value that fails to parse renders verbatim, so a hand-edited config degrades to
showing what was typed rather than `Invalid Date`.

## Visual editor

`weekly-timetable-card-editor`, returned from `static getConfigElement()`. A tab
strip: **Settings** · one tab per person · **＋** · **Activities**.

- **Settings** — title, layout, `days` as toggle chips, language,
  highlight-today, header colour. Toggling a day inserts it at its natural
  position without re-sorting the others, so a hand-ordered `days` list in YAML
  survives editing; changing the order itself stays a YAML-level edit.
- **Person** — name, emoji, colour; optional `days` override; the slot ruler
  (grid layout only); and the schedule, one panel per day.
- **Activities** — label, colour swatch, add, remove, with a live chip preview.

### Editing the schedule

Each day panel lists its blocks as rows: activity dropdown, start field, end
field, a day dropdown, move-up and move-down buttons and a remove button; plus an
**＋ Add block** control. Clearing a time field produces the `until` or `after`
form; clearing both produces the bare form. In `grid` layout the two time fields
are replaced by a single slot dropdown, which writes that slot's `start` and
`end` into the block — the same data, a different input.

The list editor is complete on its own: every operation — add, edit, reorder,
move to another day, remove — has a button or field. That was originally a
constraint so drag-and-drop could be layered on as a faster route without ever
being the only route; when drag was removed it meant no capability was lost.

### Removed: drag and drop

Drag-and-drop was specified, built, and shipped in v0.0.2 and v0.0.3. It worked
in the dev harness and under synthetic pointer events in a real browser, and it
never worked in Home Assistant's card-config dialog. Two rounds of fixes
addressed real defects found from screencasts — a 12px grip as the only drag
source, and no scrolling so off-screen days were unreachable — and it still did
not work in the target environment. It was removed in v0.0.4.

What the attempt cost and what it teaches: the pointer logic was verifiable and
verified, and that verification never touched the thing that mattered. The drag
ran inside three nested shadow roots and a dialog whose scroll container belongs
to Home Assistant, and none of that is reproducible from a harness. A feature
whose correctness depends on the host's DOM cannot be validated against a
substitute for that host.

The list editor was deliberately built to be complete without dragging, so
removing it cost no capability: reordering uses the move-up and move-down
buttons, moving between days uses the day dropdown on each row, and adding uses
tap-to-place (tap an activity, then tap a day) or the Add block control.

### Config-changed contract

Every mutation builds a **new** config object and fires
`fireEvent(this, "config-changed", { config })`. Mutating the existing object and
firing causes HA to compare references, see no change, and silently discard the
edit — which presents as "my edits don't save" rather than as an error. All
mutations go through a small set of pure helpers in `editor/mutations.ts` so this
cannot be bypassed by a new panel.

### Home Assistant component use

`ha-textfield`, `ha-select`, `ha-switch` and similar are internal, undocumented HA
components with no cross-version API guarantee, and they cannot be instantiated
outside Home Assistant — which would leave the editor both coupled to HA's
internals and impossible to unit-test. The editor therefore uses native
`<input>`, `<select>` and `<button>` styled with Home Assistant's CSS variables,
so it follows the active theme without depending on HA's component internals. HA
always offers "Show code editor" as a further fallback.

## Project structure

```
weekly-timetable-card/
├── src/
│   ├── card.ts                    # element, density observer, layout dispatch
│   ├── types.ts
│   ├── config.ts                  # normaliseConfig, defaults, getStubConfig
│   ├── time.ts                    # parse + format against hass.locale
│   ├── color.ts                   # fill/border derivation, contrast choice
│   ├── days.ts                    # day order, today resolution, effective days
│   ├── i18n/{types,index,en,bg}.ts
│   ├── renderers/{blocks,grid,stacked}.ts
│   ├── editor/{editor,settings-panel,person-panel,activities-panel,
│   │            mutations,dnd}.ts
│   └── styles.ts
├── dev/                           # standalone harness: index.html + mock hass
├── dist/weekly-timetable-card.js  # committed build output
├── test/
├── hacs.json
├── package.json
├── tsconfig.json
├── esbuild.config.mjs
├── .github/workflows/{ci,release}.yml
└── README.md                      # English and Bulgarian
```

## Build and distribution

esbuild bundles `src/card.ts` to a single minified ES module at
`dist/weekly-timetable-card.js`, Lit included, targeting es2021. The repository
name, the bundle filename and the registered element name all agree on
`weekly-timetable-card`; HACS resolves the served file from the repository name,
and a mismatch produces a card that installs cleanly and then 404s its own
JavaScript.

`dist/` is committed so HACS can install from the default branch. The release
workflow builds on a tag and attaches the bundle to a GitHub release. CI
type-checks, tests and builds on every push.

The card prints a `console.info` version banner on load. Lovelace caches resources
by URL aggressively, and the banner is the quickest way to confirm the deployed
file is the one actually running. `window.customCards.push({ type, name,
description, preview: true, documentationURL })` registers the card in HA's "Add
card" picker with a preview tile.

## Development harness

`dev/index.html` loads the built bundle and renders the card against a mock `hass`
object exposing `language`, `locale.time_format`, `locale.first_weekday` and
`themes`. Controls on the page switch language, 12/24-hour, light/dark and
container width, so every language and density combination is reachable without
Home Assistant. Served by `esbuild --watch` with a local dev server.

Real Home Assistant integration — resource registration, theming, the visual
editor inside HA's dialog — is verified manually by the author against their own
instance before a release.

## Testing

Written test-first, under Vitest.

**Unit, no DOM.** `blockForm` across all four combinations; `normaliseConfig`
defaults, unknown-day dropping, day de-duplication, thrown errors on missing
`people`; effective day resolution including per-person override; today
resolution; grid slot matching including a range that matches no slot; time
parsing and formatting across `"12"`, `"24"`, `"language"` and `"system"`, and the
unparseable-input fallback; language resolution from `hass.language` and explicit
override; colour contrast selection for light and dark `header_color`.

**Render, shadow DOM.** Each of the four block forms renders the right time line
in both languages; an orphaned activity id renders the grey fallback; `grid`
places range blocks on slots and everything else in the strip; a person with no
`slots` in grid layout renders the prompt; each density produces the expected
layout; `highlight_today` marks exactly one column.

**Editor.** Every mutation helper returns a new object and never mutates its
input; deleting a referenced activity raises the warning; a slot dropdown change
writes both `start` and `end`; reorder helpers are correct at both ends of a list
and moving a block to another day removes it from the source day exactly once.

**Manual.** Real Home Assistant installation, theming and the editor dialog —
the parts no harness reproduces. This is where drag-and-drop was lost: it passed
every check the harness could make and still failed in HA, because the harness
had one shadow root and owned its own scrolling while HA has three nested shadow
roots inside a dialog it scrolls itself. See the Removed section.

## Risks

| Risk | Mitigation |
|---|---|
| HA internal form components change across releases | Avoided outright: the editor uses native form elements themed with HA CSS variables, so there is no dependency on HA's internal components. "Show code editor" remains as a fallback |
| Seven columns are dense on a tablet | Density tiers with authored short day names; stacked layout below 72px per column |
| ~~Drag-and-drop on touch is fragile~~ | Realised, and worse than predicted: it failed on desktop too, inside HA's dialog. Mitigation held — the buttons and the day dropdown were always the primary route, so removing drag in v0.0.4 lost nothing |
| Lovelace resource caching hides a deployment | Version banner on load; versioned resource URL documented in the README |
| HACS filename / repo name mismatch | All three names fixed to `weekly-timetable-card`, asserted in CI |
| `color-mix` support | Baseline in all browsers HA supports; a solid-colour fallback is declared before the `color-mix` rule |
