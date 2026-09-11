import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { DM_Sans, Fraunces } from 'next/font/google';

import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import theme from './theme';

// Self-hosted by Next.js; exposed as CSS variables that the theme's typography uses.
const display = Fraunces({ subsets: ['latin'], variable: '--font-display' });
const body = DM_Sans({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: 'Recipes for 1,2, 4 or 8 people to prevent food waste!',
  description: 'Plant-based, gluten-free recipes scaled to one portion, to cut food waste. Options for 2,4, 8 people or mealprep available too',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
              <SiteHeader />
              <Box sx={{ flexGrow: 1 }}>{children}</Box>
              <SiteFooter />
            </Box>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
