import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

/**
 * A Server Component: no 'use client', so none of this ships to the browser.
 *
 * Yours to replace. The recipe list goes here; the portion selector will be a
 * separate Client Component, because it needs useState.
 */
export default function HomePage() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 8 }}>
        <Typography variant="h1" gutterBottom>
          Recipes for One
        </Typography>
        <Typography color="text.secondary">
          Scaffold is up. Replace this page with the recipe list.
        </Typography>
      </Box>
    </Container>
  );
}
