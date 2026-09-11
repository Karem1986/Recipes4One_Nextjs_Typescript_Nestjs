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
