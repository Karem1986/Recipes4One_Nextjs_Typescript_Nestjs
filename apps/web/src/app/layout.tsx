import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';

import theme from './theme';

export const metadata: Metadata = {
  title: 'Recipes for One',
  description: 'Plant-based, gluten-free recipes scaled to one portion, to cut food waste.',
};

/**
 * AppRouterCacheProvider is not optional with MUI + the App Router. MUI styles with
 * Emotion, which generates CSS at render time; without this the server-rendered HTML
 * and the client render disagree and you get a flash of unstyled content.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
