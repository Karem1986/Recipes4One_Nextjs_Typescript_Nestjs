import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Portions, type Recipe, type ScaledRecipe, UNITS, type UnitSymbol } from '../domain';

/** Every unit the API can send, listed in the documentation. */
const UNIT_SYMBOLS = Object.keys(UNITS) as UnitSymbol[];

/**
 * The JSON the API promises the frontend. Deliberately separate from the domain
 * classes: the domain can be reshaped freely without breaking the frontend.
 *
 * Classes, not interfaces: Swagger reads the @ApiProperty decorators while the app
 * runs, and interfaces disappear when TypeScript compiles.
 */
export class RecipeSummaryResponse {
  @ApiProperty({ example: 'coconut-chickpea-curry' })
  id!: string;

  @ApiProperty({ example: 'Coconut chickpea curry' })
  title!: string;

  @ApiProperty({ example: 8, description: 'For the recipe cards: "8 ingredients".' })
  ingredientCount!: number;

  @ApiProperty({ example: 2, description: 'Ingredients that come in whole cans.' })
  cans!: number;
}

export class IngredientResponse {
  @ApiProperty({ example: 'chickpeas' })
  name!: string;

  @ApiProperty({ example: 1, description: 'Already scaled and rounded by the API.' })
  amount!: number;

  @ApiProperty({ enum: UNIT_SYMBOLS, example: 'can' })
  unit!: UnitSymbol;

  @ApiPropertyOptional({ example: 400, description: 'Weight of one whole unit, e.g. one can.' })
  gramsPerUnit?: number;
}

export class RoundedUpResponse {
  @ApiProperty({ example: 'chickpeas' })
  name!: string;

  @ApiProperty({ example: 0.25, description: 'The exact share the recipe needs.' })
  needed!: number;

  @ApiProperty({ example: 1, description: 'What the recipe tells you to use: whole units.' })
  used!: number;

  @ApiProperty({ enum: UNIT_SYMBOLS, example: 'can' })
  unit!: UnitSymbol;
}

export class ScaledRecipeResponse {
  @ApiProperty({ example: 'coconut-chickpea-curry' })
  id!: string;

  @ApiProperty({ example: 'Coconut chickpea curry' })
  title!: string;

  @ApiProperty({ type: Number, enum: [...Portions.ALLOWED], example: 1 })
  portions!: number;

  @ApiProperty({ example: false, description: 'True when cooking for more than one person.' })
  isMealPrep!: boolean;

  @ApiProperty({ type: [IngredientResponse] })
  ingredients!: IngredientResponse[];

  @ApiProperty({
    type: [RoundedUpResponse],
    description: 'Counted ingredients rounded up to whole units, so nothing is left half-used.',
  })
  roundedUp!: RoundedUpResponse[];

  @ApiProperty({ type: [String], example: ['Cook the rice.'] })
  steps!: string[];
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