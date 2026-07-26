import { createTheme, darken, getContrastRatio, lighten } from '@mui/material/styles'
import { getTeamColors } from './lib/teamColors'

const contrastThreshold = 4.5
const lightBg = '#f7faf5'

function ensureContrast(
  color: string,
  background: string,
  adjust: (c: string, amount: number) => string,
): string {
  let adjusted = color
  for (let i = 0; i < 10 && getContrastRatio(adjusted, background) < contrastThreshold; i++) {
    adjusted = adjust(adjusted, 0.12)
  }
  return adjusted
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const n = hex.replace('#', '')
  if (n.length !== 6) return null
  return {
    r: Number.parseInt(n.slice(0, 2), 16),
    g: Number.parseInt(n.slice(2, 4), 16),
    b: Number.parseInt(n.slice(4, 6), 16),
  }
}

function withAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
}

export function createAppTheme(
  teamId?: number,
  options?: { flatBackground?: boolean },
) {
  const colors =
    teamId != null
      ? getTeamColors(teamId)
      : { primary: '#0b3d2e', secondary: '#c45c26' }

  const primary = ensureContrast(colors.primary, lightBg, darken)
  const secondary = ensureContrast(colors.secondary, lightBg, darken)
  const primaryMid = lighten(primary, 0.12)
  const flatBackground = options?.flatBackground === true

  return createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: primary,
        contrastText: getContrastRatio(primary, '#ffffff') >= 3 ? '#ffffff' : '#14241c',
      },
      secondary: {
        main: secondary,
        contrastText: getContrastRatio(secondary, '#ffffff') >= 3 ? '#ffffff' : '#14241c',
      },
      background: {
        default: flatBackground ? lightBg : '#e8efe6',
        paper: '#f7faf5',
      },
      text: {
        primary: '#14241c',
        secondary: '#3d5448',
      },
      success: { main: '#1b7a4e' },
      error: { main: '#a33b2a' },
    },
    typography: {
      fontFamily:
        'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      h1: { fontWeight: 700, letterSpacing: '-0.02em' },
      h2: { fontWeight: 700, letterSpacing: '-0.01em' },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundImage: flatBackground
              ? 'none'
              : `radial-gradient(ellipse at top left, ${withAlpha(secondary, 0.12)}, transparent 42%), radial-gradient(ellipse 80% 55% at 85% 12%, ${withAlpha(primary, 0.18)}, transparent 55%)`,
            backgroundColor: flatBackground ? lightBg : undefined,
            minHeight: '100vh',
            transition: 'background-image 280ms ease, background-color 280ms ease',
          },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: '1px solid rgba(20, 36, 28, 0.12)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundImage: `linear-gradient(120deg, ${primary} 0%, ${primaryMid} 55%, ${primary} 100%)`,
            borderBottom: `3px solid ${secondary}`,
            transition: 'background-image 280ms ease, border-color 280ms ease',
          },
        },
      },
    },
  })
}

export const theme = createAppTheme()
