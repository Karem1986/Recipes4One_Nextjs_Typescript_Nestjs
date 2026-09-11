'use client';

import { createTheme } from '@mui/material/styles';

const DISPLAY_FONT = 'var(--font-display), Georgia, "Times New Roman", serif';

/**
 * Design tokens for Recipes for One. Palette chosen by Karin; set up following
 * MUI's v9 theming guidance: CSS variables on, component defaults set once here.
 *
 * Readability: #47A612 is bright, so white text on it is hard to read (3.1:1).
 * Filled green elements therefore get dark text (6.7:1), and green *text* uses
 * `primary.dark`, a deeper shade of the same green (6.2:1 on white).
 *
 * 'use client' is required: createTheme produces functions, and functions cannot
 * cross the server/client boundary.
 */
const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: '#47A612',
      dark: '#2F6F0B', // readable green for text and hover
      contrastText: '#0F1F05', // dark text on green buttons and chips
    },
    secondary: {
      main: '#F50057',
    },
    background: { default: '#FAF6EF', paper: '#FFFFFF' }, // cream page, white cards
    text: { primary: '#1E2A22', secondary: '#5B6A60' },
    divider: 'rgba(30, 42, 34, 0.12)',
  },
  typography: {
    fontFamily: 'var(--font-body), system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontFamily: DISPLAY_FONT,
      fontWeight: 600,
      fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
      lineHeight: 1.05,
      letterSpacing: '-0.02em',
    },
    h2: { fontFamily: DISPLAY_FONT, fontWeight: 600, fontSize: '1.875rem', letterSpacing: '-0.01em' },
    h3: { fontFamily: DISPLAY_FONT, fontWeight: 600, fontSize: '1.375rem', lineHeight: 1.25 },
    overline: { fontWeight: 700, letterSpacing: '0.12em' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 999 } },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600 } },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: ({ theme }) => ({
          height: '100%',
          borderRadius: 20,
          border: `1px solid ${(theme.vars || theme).palette.divider}`,
          transition: 'transform 160ms ease, box-shadow 160ms ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 32px rgba(30, 42, 34, 0.12)',
          },
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
            '&:hover': { transform: 'none' },
          },
        }),
      },
    },
  },
});

export default theme;
