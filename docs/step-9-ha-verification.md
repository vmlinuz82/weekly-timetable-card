# Step 9 — verification in a real Home Assistant

Everything else in this project is verified automatically by the suite
(`npm test`) or was checked by eye in the `dev/` harness. This file covers the
one thing neither can reach: how the card behaves inside a real Home Assistant.

It needs a logged-in HA session, so it is a person's job rather than an agent's.
It takes about five minutes.

## Already confirmed — no need to re-check

These are our side of the boundary, verified in a browser against the built
bundle:

| Thing | Confirmed |
|---|---|
| Bundle is self-contained | No external imports; loads as a Lovelace resource with no import map |
| Version banner | Prints `WEEKLY-TIMETABLE-CARD` and the built version on module load |
| Card picker registry entry | `{ type: "weekly-timetable-card", name, description, preview: true, documentationURL }` — bare name, because HA prepends `custom:` itself |
| `getConfigElement()` | Returns a `weekly-timetable-card-editor` that has `setConfig` |
| `getStubConfig()` | Returns `type: custom:weekly-timetable-card` with one person |
| `getLayoutOptions()` | `{ grid_columns: "full", grid_rows: "auto" }` |
| `config-changed` event | Fires with `bubbles: true` and `composed: true` (asserted, and the assertion was falsified to prove it bites) |
| Both layouts, dark mode, 5/7 days, 330px stacked collapse, EN/BG chrome, 12/24-hour times, the editor | All exercised in a real browser |

## Install

```bash
# from the repo root
cp dist/weekly-timetable-card.js /path/to/homeassistant/config/www/
```

Then in HA: **Settings → Dashboards → ⋮ → Resources → Add resource**

- URL: `/local/weekly-timetable-card.js?v=1`
- Type: **JavaScript module**

Hard-refresh the browser (`Ctrl+Shift+R`). Lovelace caches resources by URL, so
bump the `?v=` number whenever you replace the file.

## The five checks

1. **Picker.** Add a card, search "Weekly Timetable". It should appear with a
   live preview tile showing the example timetable.
   *If it is missing:* the resource did not load — check the browser console for
   a 404 on `/local/weekly-timetable-card.js`.
2. **Banner.** The console shows `WEEKLY-TIMETABLE-CARD` followed by a version
   on page load, and that version matches the release you installed.
   *If absent, or if it names an older version:* Lovelace served a cached copy;
   bump `?v=`.
3. **Editor.** Click the card → Edit. The visual editor opens inside HA's
   dialog, all five tabs work, and an edit survives **Save** and a page reload.
   *This is the check most worth doing* — it is the only one that exercises HA's
   own config round-trip.
4. **Theme.** Switch your HA theme between light and dark. Blocks should stay
   legible in both; the day headers stay navy (that colour is deliberately
   literal, not themed — override it with `header_color`).
5. **Per-user language.** Log in as a second HA user whose profile language
   differs. The same dashboard should render its chrome in that user's language
   while the activity labels stay exactly as authored.

## If something fails

Record what you saw and open it as an issue rather than patching blind — the
decision log in `docs/superpowers/decision-log.md` records why each of these
mechanisms is built the way it is, including several that look wrong and are not.

## Known limitations (by design, not bugs)

- In `grid` layout the editor replaces a block's two time fields with a slot
  dropdown, so a block sitting in the open-ended strip shows "Not on the grid"
  and its times are displayed but not editable there. Switch to `blocks` layout
  to edit them.
- Saving from the visual editor rewrites the config in normalised form, which
  makes a hand-curated YAML file more verbose.
