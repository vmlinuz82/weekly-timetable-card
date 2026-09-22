# Weekly Timetable Card — single person and block structure

**Date:** 2026-09-22
**Status:** approved 2026-09-22
**Supersedes:** parts of [`2026-09-21-weekly-timetable-card-design.md`](2026-09-21-weekly-timetable-card-design.md)

## Summary

Two changes to the card, shipping as one breaking release:

1. **A block is restructured into two columns.** The time moves to a left-hand
   column as two stacked lines; the right-hand column carries a title and an
   optional subtitle. The subtitle is new, and lives on the shared activity
   record.
2. **Multiple people per card is removed.** A card shows one timetable. Two
   people means two cards.

The original design document remains the authority for everything not named
here — the four time forms, the two layouts, grid placement, density tiers,
colour derivation, i18n structure, and the removal of drag-and-drop. This
document supersedes it only where it says so.

## What this supersedes

| Original | Now |
|---|---|
| Decision 5, "Multiple people as tabs" | Withdrawn. One timetable per card. |
| Data model: `CardConfig.people: Person[]` | `Person` is gone; `slots` and `schedule` move onto `CardConfig`. |
| Data model: `Activity.label` | Renamed `title`, with `subtitle?` added beside it. |
| Rendering: a block as a centred vertical stack | A two-column block: stacked time on the left, title + subtitle on the right. |
| Visual editor: Settings / one tab per person / ＋ / Activities | Settings / Schedule / Activities — three fixed tabs. |

Unchanged and explicitly still binding: block time forms derived from field
presence (original Decision 2), grid placement and the open-ended strip
(Decision 9), `days` as an ordered list (Decision 4), chrome-only translation
(Decision 6), time formatting from `hass.locale` (Decision 10).

## Goals

- A block reads as `time | title / subtitle`, with the time as two stacked
  lines rather than a hyphenated range.
- A subtitle is authored once per activity and appears wherever that activity
  is used.
- Configuration and the editor lose the person dimension entirely.
- The four time forms stay mutually distinguishable in the new structure.

## Non-goals

- Migrating existing `people:` configuration. The old key breaks cleanly; see
  Release.
- Per-block subtitles. A subtitle belongs to the activity, so the same activity
  cannot show different second lines on different days.
- More than one subtitle line.
- Any change to grid placement, density measurement, or colour derivation.

## Decisions

Numbering continues from the original document's 13.

| # | Decision | Rationale |
|---|----------|-----------|
| 14 | One timetable per card; `people` removed | Requested. It also deletes the editor's hardest complexity: a tab index that shifts when a person is removed, and a `personIndex` parameter threaded through every mutation. |
| 15 | `slots` and `schedule` flatten onto `CardConfig` rather than sitting under a `person:` key | With one subject, a wrapper object is a level of nesting that carries no information. |
| 16 | `name`, `emoji` and `color` are dropped rather than kept on the card | All three existed to decorate a *tab*. With no tabs they have no consumer, and `title` already provides the card's heading. An author wanting an emoji puts it in `title`. |
| 17 | Subtitle on the activity record, not on the block | Requested. It also means `Block`, `gridPlacement` and every mutation helper are untouched — the feature stays inside the activity record, the renderer and the styles. |
| 18 | The stacked time column shows the wording word on the top line for `until` and `after` | `15:20`/`16:20` fills both lines naturally, but an open-ended block has only one time. Putting `until`/`до` above `16:00` keeps both lines filled — so block heights stay even across a row — and keeps an end-only block distinguishable from a start-only one. Dropping the word would reintroduce exactly the ambiguity the one-line wording was written to prevent. |
| 19 | In `grid` layout, a block placed on a slot renders no time column | The row's slot label already states the time; printing it again immediately beside itself reads as a rendering fault. Blocks in the open-ended strip keep their time, because they have no row to take it from. |

## Data model

### Before

```ts
interface Activity { id: string; label: string; color: string; }
interface Person {
  name: string; emoji?: string; color?: string;
  days?: DayKey[]; slots?: Slot[];
  schedule: Partial<Record<DayKey, Block[]>>;
}
interface CardConfig { /* … */ activities: Activity[]; people: Person[]; }
```

### After

```ts
interface Activity {
  id: string;
  title: string;        // was `label`
  subtitle?: string;    // new, one line
  color: string;
}

interface CardConfig {
  type: string;
  title?: string;
  layout: Layout;
  days: DayKey[];
  language: "auto" | Lang;
  highlight_today: boolean;
  header_color: string;
  activities: Activity[];
  slots?: Slot[];                                   // was Person.slots
  schedule: Partial<Record<DayKey, Block[]>>;       // was Person.schedule
}
```

`Person` is deleted. `Block`, `Slot`, `DayKey`, `Lang`, `Layout` and `Density`
are unchanged.

`effectiveDays(config, person)` in `src/days.ts` is deleted — with no
per-person override there is nothing to resolve, and callers read
`config.days` directly. `normaliseDays`, `todayKey`, `daysFromFirstWeekday`
and `toggleDayList` are unaffected.

### Configuration example

```yaml
type: custom:weekly-timetable-card
title: Sami
layout: blocks
days: [mon, tue, wed, thu, fri]

activities:
  - { id: english, title: English, subtitle: Room 12, color: "#3b82f6" }
  - { id: daycare, title: After-school club, color: "#64748b" }
  - { id: judo,    title: Judo, subtitle: Sports hall, color: "#f97316" }
  - { id: home,    title: Back home, color: "#22c55e" }

schedule:
  mon:
    - { activity: english, start: "15:20", end: "16:20" }
    - { activity: judo, start: "17:30", end: "18:30" }
    - { activity: home, start: "18:30" }
  tue:
    - { activity: daycare, end: "16:00" }
```

## Block rendering

A block becomes two columns. The left column holds the time as stacked lines;
the right holds the title and, when the activity has one, the subtitle.

```
range                     until                     after
┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│ 15:20 │ English     │   │ until │ After-school│   │ after │ Back home   │
│ 16:20 │ Room 12     │   │ 16:00 │ club        │   │ 18:30 │             │
└─────────────────────┘   └─────────────────────┘   └─────────────────────┘

bare                      grid, on a slot
┌─────────────────────┐   ┌─────────────────────┐
│ English             │   │ English             │
│ Room 12             │   │ Room 12             │
└─────────────────────┘   └─────────────────────┘
```

### The four forms in the stacked column

| Form | Top line | Bottom line |
|---|---|---|
| `range` (start + end) | `start` | `end` |
| `until` (end only) | `until` / `до` | `end` |
| `after` (start only) | `after` / `след` | `start` |
| `bare` (neither) | — the time column is not rendered at all | |

The form is still derived by `blockForm()` from field presence. No new
discriminator is introduced.

### Two wordings, one discriminator

`blockTimeLabel()` produces the existing single-line wording (`до 16:00`) and is
used by the editor, which has no room for two lines. The card needs the
structured two-line form. Both are added as separate functions switching on the
same `blockForm()` result.

The comment at `src/renderers/block.ts:11` warns that this mapping drifted once
before — the editor's copy dropped the until/after wording entirely, making an
end-only and a start-only block indistinguishable. The invariant that protects
against that is *the form is derived in exactly one place*, which continues to
hold. The wording is allowed to differ between the two presentations; the form
is not.

### Markup

```
.block
  .block-time            (omitted for `bare`, and in grid when placed on a slot)
    .block-time-top
    .block-time-bottom
  .block-text
    .block-title
    .block-subtitle      (omitted when the activity has no subtitle)
```

`.block-label` is renamed `.block-title`. The editor's activity preview chips
use the same class and follow the rename.

`renderBlock` takes a third argument for the grid case:

```ts
renderBlock(ctx: RenderContext, block: Block, opts?: { hideTime?: boolean }): TemplateResult
```

`renderGrid` passes `{ hideTime: true }` for blocks placed on a slot and nothing
for blocks in the strip. `renderBlocks` never passes it.

### Styles

`.block` becomes a two-column layout with the time column sized to its content
and the text column taking the remainder. The compact density tier tightens both
columns; stacked mode is unaffected structurally, because it only changes how
day columns are laid out, not what is inside a block.

Two details are **defaults, not requirements** — nothing in the request settles
them, and the reference screenshot would: the time column's text alignment
(default: right-aligned, so the two stacked times line up with each other), and
whether a divider rule separates the two columns (default: none, relying on the
gap). Both are single CSS declarations and cheap to change after seeing it
rendered.

Orphaned activity references keep the existing dashed border and show the raw
id as the title with no subtitle.

## Validation and normalisation

`normaliseConfig` remains the single trust boundary.

- `activities[].title` is required and non-empty, as `label` was.
- `activities[].subtitle` is optional: trimmed, and omitted entirely when
  empty, so an empty string never reaches the renderer.
- `slots` and `schedule` are read from the top level and validated exactly as
  they were when read from a person.
- `schedule` entries for days outside the effective `days` list are preserved,
  as before — narrowing `days` stays reversible.
- YAML 1.1 sexagesimal times (`960` for `16:00`) are still converted.

### Breaking: `people` is gone

A config carrying `people:` is not migrated. The key is unknown, `schedule` is
absent, and the card reports a configuration error.

This was chosen deliberately over a silent migration. The consequence is stated
plainly because it is the one user-visible cost of this release: **an existing
dashboard shows an error from the moment HACS updates the card until its
configuration is rewritten.** The README gets a migration section showing the
before and after shape.

### Resolved: no `label` alias

The rename is clean. `label` is not accepted as a deprecated alias.

The alias was initially specified alongside the rename, then dropped on review:
it interacts badly with the clean break on `people`. Since every existing
configuration must be rewritten by hand anyway, and anyone rewriting it will
type `title:`, the alias would have been permanent code at the trust boundary
with no consumer.

A config still using `label` therefore fails loudly — `title` is required — and
does not silently render blank titles.

## Visual editor

Three fixed tabs: **Settings**, **Schedule**, **Activities**.

Removed: the per-person tabs, the `＋` add-person tab, `addPerson`,
`removePerson`, `updatePerson`, the `personIndex` parameter on every mutation,
and the `_commit` self-heal. That self-heal existed solely because removing a
person shifted the open tab's index onto a different person; with no index there
is no such failure mode.

`_selectedActivity` (tap-to-place) stays, and its clearing logic simplifies to
the case where the armed activity is itself deleted.

`person-panel.ts` becomes `schedule-panel.ts` and loses its `personIndex`
option. The per-block row keeps its nine controls unchanged: activity, day,
start, clear-start, end, clear-end, move-up, move-down, remove.

`activities-panel.ts` gains a subtitle text input beside the title input, and
its preview chips render the new two-column block.

## Internationalisation

Added to `Strings.editor`: a label for the subtitle input.

Added at the top level: the bare words for the stacked time column —
`untilWord` (`until` / `до`) and `afterWord` (`after` / `след`). The existing
`until(time)` and `after(time)` phrase functions stay for the editor's
single-line wording.

Removed: `addPerson`, `personNamePlaceholder`, and any other person-scoped
string.

Activity titles and subtitles are author content and are never translated.

## Release

Breaking configuration change. Merged with the `major` label, producing
**v1.0.0** — the card is installable and in use, so a breaking change earning a
`0.x` minor bump would understate it. If the card is considered pre-stable
instead, `minor` gives v0.2.0; this is the release-labelling decision to make at
merge time, not a code decision.

## Risks

| Risk | Mitigation |
|---|---|
| Existing dashboard breaks on update | Accepted and chosen deliberately. README migration section; the console banner tells the user which version they are on. |
| Two-column blocks change grid row heights and compact-tier spacing | Verified in a browser in the dev harness, not by assertion — jsdom does not resolve adopted stylesheets, so `test/styles.test.ts` can only assert that a rule exists, not what it computes to. |
| The stacked time column is narrow at phone widths | The time column is content-sized, and times are fixed-width strings; the words `until`/`след` are the widest content and set the floor. Checked at 330px stacked. |
| Renaming `label` breaks the activity palette silently | `title` is required by `normaliseConfig`, so a config still using `label` fails loudly rather than rendering blank titles. |

## Testing

**Automated.** `blockForm` unchanged. The new structured time function returns
the right two lines for all four forms in both languages. `normaliseConfig`
rejects a `people:` config, requires `title`, trims and omits an empty
`subtitle`, and reads `slots`/`schedule` from the top level. The renderer emits
`.block-time` for range/until/after and omits it for bare and for on-slot grid
blocks. Mutations operate without a person index. The editor exposes exactly
three tabs.

**Manual.** The two-column block at each density tier and in both layouts;
a real Home Assistant installation, theming and the editor dialog — the parts
no harness reproduces.

## What this deletes

Roughly: the `Person` type, `effectiveDays`, `addPerson`/`removePerson`/
`updatePerson`, the `personIndex` parameter on every remaining mutation, the
editor's dynamic tab list and `_commit` self-heal, two i18n strings, and the
harness's second demo person. 22 files reference `people`/`Person` today.
