export type TeamColors = {
  primary: string
  secondary: string
}

/** Official-ish MLB franchise colors keyed by Stats API team id. */
const TEAM_COLORS: Record<number, TeamColors> = {
  108: { primary: '#003263', secondary: '#BA0021' }, // Angels
  109: { primary: '#A71930', secondary: '#E3D4AD' }, // D-backs
  110: { primary: '#DF4601', secondary: '#000000' }, // Orioles
  111: { primary: '#BD3039', secondary: '#0C2340' }, // Red Sox
  112: { primary: '#0E3386', secondary: '#CC3433' }, // Cubs
  113: { primary: '#C6011F', secondary: '#000000' }, // Reds
  114: { primary: '#0C2340', secondary: '#E31937' }, // Guardians
  115: { primary: '#33006F', secondary: '#C4CED4' }, // Rockies
  116: { primary: '#0C2340', secondary: '#FA4616' }, // Tigers
  117: { primary: '#002D62', secondary: '#EB6E1F' }, // Astros
  118: { primary: '#004687', secondary: '#BD9B60' }, // Royals
  119: { primary: '#005A9C', secondary: '#EF3E42' }, // Dodgers
  120: { primary: '#AB0003', secondary: '#14225A' }, // Nationals
  121: { primary: '#002D72', secondary: '#FF5910' }, // Mets
  133: { primary: '#003831', secondary: '#EFB21E' }, // Athletics
  134: { primary: '#27251F', secondary: '#FDB827' }, // Pirates
  135: { primary: '#2F241D', secondary: '#FFC425' }, // Padres
  136: { primary: '#0C2C56', secondary: '#005C5C' }, // Mariners
  137: { primary: '#FD5A1E', secondary: '#27251F' }, // Giants
  138: { primary: '#C41E3A', secondary: '#0C2340' }, // Cardinals
  139: { primary: '#092C5C', secondary: '#8FBCE6' }, // Rays
  140: { primary: '#003278', secondary: '#C0111F' }, // Rangers
  141: { primary: '#134A8E', secondary: '#1D2D5C' }, // Blue Jays
  142: { primary: '#002B5C', secondary: '#D31145' }, // Twins
  143: { primary: '#E81828', secondary: '#002D72' }, // Phillies
  144: { primary: '#CE1141', secondary: '#13274F' }, // Braves
  145: { primary: '#27251F', secondary: '#C4CED4' }, // White Sox
  146: { primary: '#00A3E0', secondary: '#EF3340' }, // Marlins
  147: { primary: '#003087', secondary: '#E4002C' }, // Yankees
  158: { primary: '#FFC52F', secondary: '#12284B' }, // Brewers
}

const FALLBACK: TeamColors = {
  primary: '#0b3d2e',
  secondary: '#c45c26',
}

export function getTeamColors(teamId: number): TeamColors {
  return TEAM_COLORS[teamId] ?? FALLBACK
}

/** Prefer primary; if it's very light (e.g. Brewers gold), use secondary for line contrast. */
export function getTeamLineColor(teamId: number): string {
  const { primary, secondary } = getTeamColors(teamId)
  if (isLightColor(primary)) return secondary
  return primary
}

function isLightColor(hex: string): boolean {
  const n = hex.replace('#', '')
  if (n.length !== 6) return false
  const r = Number.parseInt(n.slice(0, 2), 16)
  const g = Number.parseInt(n.slice(2, 4), 16)
  const b = Number.parseInt(n.slice(4, 6), 16)
  // relative luminance threshold
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.65
}
