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
2. Add `https://github.com/vmlinuz82/weekly-timetable-card`, category **Dashboard**
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

One consequence worth knowing: in `grid` layout the editor replaces a block's two
time fields with a single slot dropdown, so a block that sits in the strip shows
only "Not on the grid" and its actual times cannot be edited there. The times are
preserved and still render on the card — switch the card to `blocks` layout to
edit them.

Saving from the visual editor rewrites the config in normalised form, which
makes hand-curated YAML more verbose.

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
no Home Assistant instance is needed for day-to-day work. `npm run watch` writes
an unminified, unbundled `dev/bundle.js` (gitignored) that `dev/index.html`
loads; it is separate from the minified `dist/weekly-timetable-card.js` that
`npm run build` produces for release, so the harness stays empty until you run
`watch` at least once.

## Releases

Releases are cut automatically. Open a pull request against `master`; when it is
merged, `auto-version.yml` bumps the version, rebuilds the bundle, tags the
result and triggers `release.yml`, which publishes a GitHub release with
`dist/weekly-timetable-card.js` attached — the file HACS installs.

The bump size comes from the pull request's labels:

| Label | Effect |
|---|---|
| *(none)* | patch — `v1.2.3` → `v1.2.4` |
| `minor` | `v1.2.3` → `v1.3.0` |
| `major` | `v1.2.3` → `v2.0.0` |
| `no-release` | no bump, no tag, no release |

The version lives in three places that must agree: `src/version.ts` (compiled
into the bundle and printed to the console on load), `package.json`, and the git
tag. `auto-version.yml` writes all three in one commit and tags that commit, and
`release.yml` refuses to publish if the tag and the bundle's banner disagree —
Lovelace caches resources by URL, so the banner is the only quick way to tell
which build is actually running.

Pushing directly to `master` deliberately does **not** release. Nothing is
published without a merged pull request.

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
`https://github.com/vmlinuz82/weekly-timetable-card`, категория **Dashboard** →
намерете **Weekly Timetable Card** → **Download** → презаредете браузъра с
`Ctrl+Shift+R`.

**Ръчно:** копирайте `dist/weekly-timetable-card.js` в
`/config/www/weekly-timetable-card.js`, след което го добавете като ресурс
`/local/weekly-timetable-card.js?v=1` от тип **JavaScript module**.

### Настройки

Всички настройки са описани в таблиците по-горе. Добавете картата, потърсете
**Weekly Timetable** и я настройте визуално — не е нужен YAML.

Един детайл, който си струва да знаете: в изглед `grid` редакторът заменя двете
полета за час на блока с падащо меню за интервал, така че блок, който попада в
лентата отгоре, показва само „Извън мрежата“ и часовете му не могат да се
редактират там. Часовете се запазват и продължават да се показват на картата —
превключете картата на изглед `blocks`, за да ги редактирате.

Запазването от визуалния редактор пренаписва конфигурацията в нормализиран вид,
което прави ръчно писания YAML по-многословен.

Слагайте часовете в кавички. Неоградено `16:00` в YAML се разчита като числото
960; картата го преобразува обратно, но с кавички е по-ясно.
