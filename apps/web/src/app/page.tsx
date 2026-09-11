import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import KitchenIcon from '@mui/icons-material/Kitchen';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlineOutlined';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

import { RecipeCard } from '@/components/RecipeCard';
import { getRecipes } from '@/lib/api';

type Pillar = { icon: ReactNode; title: string; text: string };

const PILLARS: Pillar[] = [
  { icon: <PersonOutlineIcon />, title: 'Starts at one portion', text: 'Scale to 2, 4 or 8 when you meal-prep.' },
  { icon: <KitchenIcon />, title: 'Nothing left half-used', text: 'Cans and onions round up to whole ones.' },
  { icon: <EnergySavingsLeafIcon />, title: 'Plant-based & gluten-free', text: 'Every recipe, by default.' },
];

/**
 * The homepage: a Server Component. It runs on the Next.js server, so it
 * awaits the API, the green header and the footer come from layout.tsx, so every page shares them.
 */
export default async function HomePage() {
  const recipes = await getRecipes();

  return (
    <Container component="main" maxWidth="lg">
      <Box component="section" sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 5, md: 6 }, maxWidth: 760 }}>
        <Typography variant="overline" component="p" sx={{ color: 'secondary.dark' }}>
          Cooking for one, without the leftovers
        </Typography>
        <Typography variant="h1" sx={{ mt: 1, mb: 3 }}>
          Preventing Food Waste Every Day
        </Typography>
        <Typography variant="h6" component="p" color="text.secondary" sx={{ fontWeight: 400, lineHeight: 1.6 }}>
          Every recipe starts at one portion. Cooking for more? Scale to 2, 4 or 8 for Sunday meal
          prep&nbsp;&mdash; and cans and onions are rounded up to whole ones, so nothing sits half-used
          in your fridge.
        </Typography>
      </Box>

      <Box
        component="ul"
        sx={{
          listStyle: 'none',
          p: 0,
          m: 0,
          mb: { xs: 8, md: 10 },
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        }}
      >
        {PILLARS.map((pillar) => (
          <Box
            component="li"
            key={pillar.title}
            sx={{ display: 'flex', gap: 2, p: 2.5, borderRadius: '16px', bgcolor: 'background.paper', border: 1, borderColor: 'divider' }}
          >
            <Box sx={{ color: 'primary.dark', display: 'flex', mt: 0.25 }}>{pillar.icon}</Box>
            <div>
              <Typography sx={{ fontWeight: 600 }}>{pillar.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                {pillar.text}
              </Typography>
            </div>
          </Box>
        ))}
      </Box>

      <Box component="section" aria-labelledby="recipes-heading">
        <Typography id="recipes-heading" variant="h2" gutterBottom>
          This week&rsquo;s recipes
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          Plant-based and gluten-free, written for one.
        </Typography>
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </Box>
      </Box>
    </Container>
  );
}
