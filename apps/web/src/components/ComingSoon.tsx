import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import type { ReactNode } from 'react';

type ComingSoonProps = {
  icon: ReactNode;
  title: string;
  /** One or two sentences on what this page will do. */
  children: ReactNode;
};

/**
 * An honest placeholder for a section that is not built yet: it says what is
 * coming instead of showing a form that does nothing. Reused by several pages.
 */
export function ComingSoon({ icon, title, children }: ComingSoonProps) {
  return (
    <Container component="main" maxWidth="sm" sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
      <Box
        sx={{
          display: 'inline-flex',
          p: 2,
          mb: 3,
          borderRadius: '50%',
          bgcolor: 'rgba(71, 166, 18, 0.12)',
          color: 'primary.dark',
          '& svg': { fontSize: 40 },
        }}
      >
        {icon}
      </Box>
      <Typography variant="overline" component="p" sx={{ color: 'secondary.dark' }}>
        Coming soon
      </Typography>
      <Typography variant="h1" sx={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', mb: 2 }}>
        {title}
      </Typography>
      <Typography variant="h6" component="p" color="text.secondary" sx={{ fontWeight: 400, lineHeight: 1.6, mb: 4 }}>
        {children}
      </Typography>
      <Link href="/" style={{ color: 'var(--mui-palette-primary-dark)', fontWeight: 600 }}>
        Browse the recipes
      </Link>
    </Container>
  );
}
