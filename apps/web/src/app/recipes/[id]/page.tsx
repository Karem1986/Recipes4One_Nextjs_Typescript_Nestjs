// Shows each recipe individually by id
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getScaledRecipe } from '@/lib/api';
import { RecipeScaler } from '@/components/RecipeScaler';

type RecipePageProps = {
  params: Promise<{ id: string }>;
};

/**
 * One recipe, for one person. it runs on the Next.js server,
 * asks the API for the recipe, and sends finished HTML to the browser.
 */
export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;
  const recipe = await getScaledRecipe(id);

  if (recipe === null) {
    notFound();
  }

  return (
    <Container component="main" maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Link href="/" style={{ color: 'var(--mui-palette-primary-dark)', fontWeight: 600 }}>
        &larr; All recipes
      </Link>

      <Typography variant="h1" sx={{ mt: 3, mb: 1 }}>
        {recipe.title}
      </Typography>

      <RecipeScaler initialRecipe={recipe} />
      
      <Typography variant="h2" gutterBottom>
        Steps
      </Typography>
      <Box component="ol">
        {recipe.steps.map((step) => (
          <Typography component="li" key={step} sx={{ mb: 1.5 }}>
            {step}
          </Typography>
        ))}
      </Box>
    </Container>
  );
}