# MLB Series Tracker

Track Major League Baseball by **series**, not just individual games.

## Stack

- Vite + React + TypeScript
- Material UI
- TanStack Query + TanStack Router
- [`@bp1222/stats-api`](https://github.com/bp1222/stats-api) (MLB Stats API client)

## Features

- **Landing (`/`)**: unfinished series that have started, split into *Playing today* and *Mid-series off day*
- **Season (`/season/$year`)**: MLB teams for that season
- **Team (`/season/$year/teams/$teamId`)**: series columns, series record, division + league standings, games-behind chart

Data is limited to MLB (`sportId=1`) competitive games: regular season, postseason, and All-Star (no exhibition or spring training).

## Develop

```bash
unset NPM_CONFIG_USERCONFIG PNPM_CONFIG_USERCONFIG
npm install
npm run dev
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Oxlint |
