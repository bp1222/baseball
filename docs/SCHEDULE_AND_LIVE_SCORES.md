# Schedule cache and live scores on the main page

## Problem

- The main page (no team selected) loads all series via `useSchedule`, which is cached for **1 hour** (`SCHEDULE_STALE_TIME`).
- Schedule **structure** (who plays whom, when, series metadata) does not change, so a long cache is desirable.
- **In-progress scores** are rendered in `GameTile` from that same schedule response. Because the cache is long, scores on the home page do not update until the cache expires.

## Options

### Option A: Use linescore for live scores in GameTile (recommended, implemented)

**Idea:** Keep one full-season schedule query with a **long** cache (e.g. 24h). For **in-progress** games, the numeric score shown in `GameTile` comes from the existing **linescore** query instead of the schedule.

- **Already in place:** `GameStatusLine` (inside each `GameTile`) already calls `useLinescore(game.pk, isLive)` for in-progress games to show inning and status. That query has short stale time (30s) and `refetchInterval` when live.
- **Change:** In `GameTile`, when `game.gameStatus === InProgress`, use `useLinescore(game.pk, true)` and display `linescore.away.runs` / `linescore.home.runs` for the score instead of `game.away.score` / `game.home.score`. React Query dedupes by `['linescore', gamePk]`, so we do not add extra network requests.
- **Result:** Schedule can use a long stale time (e.g. 24h). Live scores on the main page update on the same interval as the linescore (30s).

**Pros:** Minimal change, no new APIs, no new requests (linescore already fetched for status line). Schedule cache can be increased.  
**Cons:** None significant.

---

### Option B: Date-scoped schedule + series cache

**Idea:** Split into two layers:

1. **Series/structure cache** – Full-season schedule (or a “series index” derived from it), cached for a long time (e.g. 24h). Used for: which series exist, date ranges, and which series span the selected date.
2. **Date schedule** – `scheduleOptions(season, teams, date?)`. When `date` is provided, call `getSchedule({ startDate: date, endDate: date, ... })` with a **short** stale time for “today” (e.g. 30s) and longer for past dates. Use this for game list and scores for the **selected date** only.

The UI would: (1) get series that span the selected date from the structure cache; (2) get games (and scores) for that date from the date-schedule query; (3) merge so tiles show up-to-date scores for the visible date.

**Pros:** One “source of truth” per date; can refresh only the visible date.  
**Cons:** More moving parts (two query shapes, merging logic), and `useFilteredSeries` / loaders must be updated to use both caches. The full-season schedule API response already includes scores, so there is no “structure only” endpoint; you either fetch by date and merge or keep the current full-season fetch and overlay live data (Option A).

---

## Recommendation

**Option A** is recommended: use linescore for in-progress scores in `GameTile` and increase the schedule cache. It solves the stale-score issue without new APIs or cache key changes, and reuses the linescore requests you already make for the status line.

If you later want “refresh only this date” or different invalidation rules, Option B can be layered on (e.g. add `scheduleOptions(season, teams, date)` and use it for the selected date while keeping the full-season query for structure).
