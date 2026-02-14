# Baseball Series

This application displays Major League Baseball records in a layout of series across the season. Records of 87–54 don’t tell you much about how a team has done over that span—did they get hot for a few series or hit a long lull? (Source: 2024 Phillies, woof, that post–All-Star break.)

## Tech stack

- **React** + **TypeScript** + **Vite**
- **TanStack Router** (type-safe routes, loaders, code-splitting)
- **TanStack Query** (server state, caching)
- **MUI** (Material UI) for layout and components
- **@bp1222/stats-api** for MLB data

## Project structure

- **`src/features/`** — Feature-based UI: `schedule` (day view, series list, game tiles), `game` (boxscore), `team` (team stats, series record), `standings` (division/league tables).
- **`src/domain/`** — Pure business logic (no React/I/O): e.g. `series/stats.ts` (streak, last-10), `series/generator.ts` (build series from MLB schedule).
- **`src/shared/`** — Shared components (e.g. `LabelPaper`, `GetTeamImage`).
- **`src/context/`** — React context: interested team, modal state.
- **`src/queries/`** — TanStack Query options and hooks.
- **`src/routes/`** — TanStack Router route tree and loaders.

See **`architecture-plan.md`** for the full refactoring plan and implementation history.