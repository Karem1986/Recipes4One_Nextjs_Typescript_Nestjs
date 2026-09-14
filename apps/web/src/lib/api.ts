/**
 * Typed client for the Recipes for One API. The shapes mirror the API's response
 * types; later they can move to packages/shared so the two can never drift apart.
 *
 * Server-side only: it is called from Server Components, which run on the Next.js
 * server, so this request goes server-to-server and CORS is not involved.
 */
export type RecipeSummary = {
  id: string;
  title: string;
  ingredientCount: number;
  cans: number;
};

const API_URL = process.env.API_URL ?? 'http://localhost:4000/api/v1';

export async function getRecipes(): Promise<RecipeSummary[]> {
  const response = await fetch(`${API_URL}/recipes`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`The API answered ${response.status}`);
  }
  return response.json();
}

/** One ingredient, already scaled by the API. */
export type ScaledIngredient = {
  name: string;
  amount: number;
  unit: string;
  gramsPerUnit?: number;
};

/** A counted ingredient the API rounded up, e.g. 0.25 can needed, 1 can used. */
export type RoundedUp = {
  name: string;
  needed: number;
  used: number;
  unit: string;
};

/** What GET /recipes/:id?portions=N returns. */
export type ScaledRecipe = {
  id: string;
  title: string;
  portions: number;
  isMealPrep: boolean;
  ingredients: ScaledIngredient[];
  roundedUp: RoundedUp[];
  steps: string[];
};

/** Feching each recipe or providing null when the recipe does not exist, it gets shown by the page.tsx file in app/recipes/[id] */
export async function getScaledRecipe(id: string, portions = 1): Promise<ScaledRecipe | null> {
  const response = await fetch(`${API_URL}/recipes/${encodeURIComponent(id)}?portions=${portions}`, {
    cache: 'no-store',
  });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`The API answered ${response.status}`);
  }
  return response.json();
}
