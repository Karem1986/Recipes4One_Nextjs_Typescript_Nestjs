'use client';

import { createTheme } from '@mui/material/styles';

/**
 * 'use client' is required: createTheme produces functions, and functions cannot
 * cross the server/client boundary. The theme is imported by ThemeProvider in
 * layout.tsx, which is itself a client boundary.
 */
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2e7d32' },
    secondary: { main: '#ed6c02' },
    background: { default: '#fbfaf7' },
  },
  typography: {
    fontFamily: 'var(--font-system, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif)',
    h1: { fontSize: '2rem', fontWeight: 600 },
    h2: { fontSize: '1.5rem', fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
});

export default theme;
