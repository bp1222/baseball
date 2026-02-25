import { createTheme, type Theme } from '@mui/material'
import { darken, getContrastRatio,lighten } from '@mui/material/styles'

interface TeamColors {
  primary: string
  secondary: string
}

const teamColorMap: Record<number, TeamColors> = {
  108: { primary: '#BA0021', secondary: '#003263' }, // Angels
  109: { primary: '#A71930', secondary: '#E3D4AD' }, // Diamondbacks
  110: { primary: '#DF4601', secondary: '#000000' }, // Orioles
  111: { primary: '#BD3039', secondary: '#0D2B56' }, // Red Sox
  112: { primary: '#0E3386', secondary: '#CC3433' }, // Cubs
  113: { primary: '#C6011F', secondary: '#000000' }, // Reds
  114: { primary: '#E31937', secondary: '#0C2340' }, // Guardians
  115: { primary: '#33006F', secondary: '#C4CED4' }, // Rockies
  116: { primary: '#0C2340', secondary: '#FA4616' }, // Tigers
  117: { primary: '#002D62', secondary: '#EB6E1F' }, // Astros
  118: { primary: '#004687', secondary: '#BD9B60' }, // Royals
  119: { primary: '#005A9C', secondary: '#FFFFFF' }, // Dodgers
  120: { primary: '#AB0003', secondary: '#14225A' }, // Nationals
  121: { primary: '#002D72', secondary: '#FF5910' }, // Mets
  133: { primary: '#003831', secondary: '#EFB21E' }, // Athletics
  134: { primary: '#FDB827', secondary: '#27251F' }, // Pirates
  135: { primary: '#2F241D', secondary: '#FEC325' }, // Padres
  136: { primary: '#0C2C56', secondary: '#6bace4' }, // Mariners
  137: { primary: '#FD5A1E', secondary: '#27251F' }, // Giants
  138: { primary: '#C41E3A', secondary: '#0C2340' }, // Cardinals
  139: { primary: '#092C5C', secondary: '#8FBCE6' }, // Rays
  140: { primary: '#003278', secondary: '#C0111F' }, // Rangers
  141: { primary: '#134A8E', secondary: '#E8291C' }, // Blue Jays
  142: { primary: '#002B5C', secondary: '#D31145' }, // Twins
  143: { primary: '#6f263d', secondary: '#6bace4' }, // Phillies
  144: { primary: '#13274F', secondary: '#CE1141' }, // Braves
  145: { primary: '#27251F', secondary: '#C4CED4' }, // White Sox
  146: { primary: '#00A3E0', secondary: '#EF3340' }, // Marlins
  147: { primary: '#0C2340', secondary: '#FFFFFF' }, // Yankees
  158: { primary: '#0A2351', secondary: '#B6922C' }, // Brewers
}

const defaultColors: TeamColors = {
  primary: '#041e42',
  secondary: '#bf0d3f',
}

const darkBackground = '#121212'
const lightBackground = '#fff'
const contrastThreshold = 4.5

function ensureContrast(color: string, background: string, adjust: (c: string, amount: number) => string): string {
  let adjusted = color
  for (let i = 0; i < 10 && getContrastRatio(adjusted, background) < contrastThreshold; i++) {
    adjusted = adjust(adjusted, 0.1)
  }
  return adjusted
}

export const getTheme = (teamId: number | undefined): Theme => {
  const colors = (teamId && teamColorMap[teamId]) || defaultColors

  return createTheme({
    cssVariables: {
      colorSchemeSelector: 'data',
    },
    colorSchemes: {
      light: {
        palette: {
          primary: { main: ensureContrast(colors.primary, lightBackground, darken) },
          secondary: { main: ensureContrast(colors.secondary, lightBackground, darken) },
        },
      },
      dark: {
        palette: {
          primary: { main: ensureContrast(colors.primary, darkBackground, lighten) },
          secondary: { main: ensureContrast(colors.secondary, darkBackground, lighten) },
        },
      },
    },
  })
}
