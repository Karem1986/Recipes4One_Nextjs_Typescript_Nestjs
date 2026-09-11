import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

/** The line at the bottom of every page. */
export function SiteFooter() {
  return (
    <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', py: 4, mt: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary">
          Recipes for One &middot; Built with Next.js, NestJS, TypeScript and Material UI
        </Typography>
      </Container>
    </Box>
  );
}
