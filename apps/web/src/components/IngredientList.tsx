import Box from '@mui/material/Box';

import type { ScaledIngredient } from '@/lib/api';
import { formatName, formatQuantity } from '../lib/format-ingredients';

type IngredientListProps = {
  ingredients: ScaledIngredient[];
};

/**
 * The ingredients of a recipe, written the way a cook reads them.
 * It only decides how amounts LOOK, the amounts themselves come from the API, rules at apps\web\src\lib\format-ingredients.ts
 */
export function IngredientList({ ingredients }: IngredientListProps) {
  return (
    <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
      {ingredients.map((ingredient) => (
        <Box
          component="li"
          key={ingredient.name}
          sx={{ display: 'flex', gap: 2, py: 1.25, borderBottom: 1, borderColor: 'divider' }}
        >
          <Box component="span" sx={{ minWidth: 88, fontWeight: 600 }}>
            {formatQuantity(ingredient)}
          </Box>
          <span>{formatName(ingredient)}</span>
        </Box>
      ))}
    </Box>
  );
}