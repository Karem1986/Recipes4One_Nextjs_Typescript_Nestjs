/**
 * How each recipe looks on a card. A presentation concern, so it lives in the
 * website rather than the API. Keyed by recipe id; unknown recipes get a fallback.
 */
type RecipeVisual = { emoji: string; tint: string };

const VISUALS: Record<string, RecipeVisual> = {
  'coconut-chickpea-curry': { emoji: '\u{1F35B}', tint: '#E9A23B' }, // curry and rice, turmeric
  'lentil-soup': { emoji: '\u{1F372}', tint: '#C8553D' }, // pot of food, red lentil
  'chickpea-salad': { emoji: '\u{1F957}', tint: '#47A612' }, // green salad, brand green
};

const FALLBACK: RecipeVisual = { emoji: '\u{1F37D}\u{FE0F}', tint: '#8A9A8E' }; // plate and cutlery

export function visualFor(recipeId: string): RecipeVisual {
  return VISUALS[recipeId] ?? FALLBACK;
}
