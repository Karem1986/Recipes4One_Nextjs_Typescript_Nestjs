'use client';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

import type { RecipeSummary } from '@/lib/api';
import { visualFor } from '@/lib/recipe-visuals';

/**
 * One recipe on the homepage.
 *
 * A Client Component for one reason: `component={Link}` hands MUI a component as a
 * prop, and functions cannot be sent from the server to the browser. What the page
 * passes in -- `recipe` -- is plain data, which can.
 */
export function RecipeCard({ recipe }: { recipe: RecipeSummary }) {
  const { emoji, tint } = visualFor(recipe.id);

  return (
    <Card>
      <CardActionArea
        component={Link}
        href={`/recipes/${recipe.id}`}
        sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
      >
        <Box
          aria-hidden
          sx={{ height: 148, display: 'grid', placeItems: 'center', bgcolor: alpha(tint, 0.16), fontSize: 64, lineHeight: 1 }}
        >
          {emoji}
        </Box>
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1.5, p: 3 }}>
          <Typography variant="h3" component="h3">
            {recipe.title}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            <Chip size="small" label={`${recipe.ingredientCount} ingredients`} />
            {recipe.cans > 0 && (
              <Chip size="small" color="primary" label={`${recipe.cans} whole ${recipe.cans === 1 ? 'can' : 'cans'}`} />
            )}
          </Box>
          <Typography
            sx={{ mt: 'auto', pt: 1, color: 'primary.dark', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
          >
            Cook for one
            <ArrowForwardIcon fontSize="small" />
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
