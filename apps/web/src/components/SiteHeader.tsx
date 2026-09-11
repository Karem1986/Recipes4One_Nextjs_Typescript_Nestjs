'use client';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { label: 'Recipes', href: '/' },
  { label: 'Login', href: '/login' },
  { label: 'Sign up', href: '/signup' },
  { label: 'Green businesses', href: '/green-businesses' },
];

/** Which tab to underline. Recipe pages (/recipes/...) belong to the Recipes tab. */
function activeTab(pathname: string): string | false {
  if (pathname === '/' || pathname.startsWith('/recipes')) {
    return '/';
  }
  return TABS.find((tab) => tab.href !== '/' && pathname.startsWith(tab.href))?.href ?? false;
}

/**
 * The green bar on every page: wordmark, account button and the site's tabs.
 *
 * A Client Component because it reads the current URL with usePathname() to know
 * which tab to underline. White text on #47A612 matches the design mockup; it reads
 * at 3.1:1, so a darker bar is the fix if readability ever matters more.
 */
export function SiteHeader() {
  const pathname = usePathname();

  return (
    <AppBar position="sticky" color="primary" elevation={0} sx={{ color: '#FFFFFF' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 1.5 }}>
          <Box
            component={Link}
            href="/"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, color: 'inherit', textDecoration: 'none' }}
          >
            <EnergySavingsLeafIcon />
            <Typography variant="h3" component="span" sx={{ fontSize: '1.375rem' }}>
              Recipes for One
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton component={Link} href="/login" color="inherit" edge="end" aria-label="Your account">
            <AccountCircleIcon />
          </IconButton>
        </Toolbar>
        <Tabs
          value={activeTab(pathname)}
          textColor="inherit"
          indicatorColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="Site sections"
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.href}
              label={tab.label}
              value={tab.href}
              component={Link}
              href={tab.href}
              sx={{ textTransform: 'uppercase', fontWeight: 500, minWidth: { md: 160 } }}
            />
          ))}
        </Tabs>
      </Container>
    </AppBar>
  );
}
