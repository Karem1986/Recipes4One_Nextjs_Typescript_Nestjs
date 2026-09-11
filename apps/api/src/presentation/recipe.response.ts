import type { Recipe, RoundedUp, ScaledRecipe, UnitSymbol } from '../domain';

/**
 * The JSON the API promises the frontend. Deliberately separate from the domain
 * classes: the domain can be reshaped freely without breaking the frontend, and the
 * frontend gets `unit: 'can'` instead of the domain's internal unit object.
 */
export interface RecipeSummaryResponse {
  id: string;
  title: string;
  /** For the recipe cards: "8 ingredients". */
  ingredientCount: number;
  /** Ingredients that come in whole cans -- the anti-waste promise shown on each card. */
  cans: number;
}

export interface IngredientResponse {
  name: string;
  amount: number;
  unit: UnitSymbol;
  gramsPerUnit?: number;
}

export interface ScaledRecipeResponse {
  id: string;
  title: string;
  portions: number;
  isMealPrep: boolean;
  ingredients: IngredientResponse[];
  roundedUp: RoundedUp[];
  steps: string[];
}

export function toRecipeSummaryResponse(recipe: Recipe): RecipeSummaryResponse {
  return {
    id: recipe.id,
    title: recipe.title,
    ingredientCount: recipe.ingredients.length,
    cans: recipe.ingredients.filter((ingredient) => ingredient.quantity.unit.symbol === 'can').length,
  };
}

export function toScaledRecipeResponse(scaled: ScaledRecipe): ScaledRecipeResponse {
  return {
    id: scaled.recipe.id,
    title: scaled.recipe.title,
    portions: scaled.requestedPortions.value,
    isMealPrep: scaled.requestedPortions.isMealPrep,
    ingredients: scaled.ingredients.map((ingredient) => ({
      name: ingredient.name,
      amount: ingredient.quantity.amount,
      unit: ingredient.quantity.unit.symbol,
      gramsPerUnit: ingredient.gramsPerUnit,
    })),
    roundedUp: [...scaled.roundedUp],
    steps: [...scaled.recipe.steps],
  };
}
