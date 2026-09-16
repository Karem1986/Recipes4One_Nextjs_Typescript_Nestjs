'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useState } from 'react';

import { IngredientList } from '@/components/IngredientList';
import { PortionPicker } from '@/components/PortionPicker';
import { getScaledRecipe, type ScaledRecipe } from '@/lib/api';
import { RoundedUpNote } from '@/components/RoundedUpNote';

type RecipeScalerProps = {
  /** The recipe for one person, already fetched by the server page. */
  initialRecipe: ScaledRecipe;
};

/**
 * Everything on the recipe page that changes when you pick a portion size.
 * It holds the recipe in its memory, so the buttons and the ingredient list
 * always show the same thing.
 */
export function RecipeScaler({ initialRecipe }: RecipeScalerProps) {
  const [recipe, setRecipe] = useState(initialRecipe);
  const [isLoading, setIsLoading] = useState(false);

  async function handlePortionsChange(portions: number) {
    if (isLoading || portions === recipe.portions) {
      return; //if you're already waiting, or if you clicked the number that's already selected. That stops two requests racing each other.
    }
    setIsLoading(true);
    try {
      const scaled = await getScaledRecipe(recipe.id, portions); //Browser asks the API for the recipe at the new size. It's the same function the server page uses.
      if (scaled) {
        setRecipe(scaled); //Tells React something changed and let know so that he redraws the screen. 
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <PortionPicker value={recipe.portions} onChange={handlePortionsChange} />
      <RoundedUpNote items={recipe.roundedUp} />
      <Typography variant="h2" gutterBottom>
        Ingredients
      </Typography>
      <Box sx={{ mb: 5, opacity: isLoading ? 0.5 : 1, transition: 'opacity 150ms' }}>
        <IngredientList ingredients={recipe.ingredients} />
      </Box>
    </>
  );
}