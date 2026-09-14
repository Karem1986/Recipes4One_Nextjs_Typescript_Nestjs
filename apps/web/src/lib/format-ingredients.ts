import type { ScaledIngredient } from '@/lib/api';

/**
 * Display rules for ingredients: how an amount LOOKS, never what it is.
 * The API has already scaled and rounded every amount; these functions only
 * decide how to write it and display in the Page visually for the user.
 */

const SPOON_UNITS = new Set(['tsp', 'tbsp']);

const FRACTIONS: [number, string][] = [
  [1 / 8, '⅛'],
  [1 / 4, '¼'],
  [1 / 3, '⅓'],
  [1 / 2, '½'],
  [2 / 3, '⅔'],
  [3 / 4, '¾'],
];

/** 0.25 -> "¼", 1.5 -> "1½", 0.13 -> "⅛" (the API sends ⅛ as 0.13). Anything else stays a number. */
export function formatSpoonAmount(amount: number): string {
  const whole = Math.floor(amount);
  const rest = amount - whole;
  if (rest < 0.01) {
    return String(whole);
  }
  const match = FRACTIONS.find(([value]) => Math.abs(rest - value) < 0.02);
  if (!match) {
    return String(amount);
  }
  return whole === 0 ? match[1] : `${whole}${match[1]}`;
}

/** English plural for the words our recipes use: onion -> onions, tomato -> tomatoes. */
export function plural(word: string, count: number): string {
  if (count <= 1) {
    return word;
  }
  return word.endsWith('o') ? `${word}es` : `${word}s`;
}

/** The amount column: "¼ tsp", "2 cloves", "1 can", "50 g" or just "2" for pieces. */
export function formatQuantity({ amount, unit }: ScaledIngredient): string {
  if (unit === 'piece') {
    return String(amount);
  }
  if (SPOON_UNITS.has(unit)) {
    return `${formatSpoonAmount(amount)} ${unit}`;
  }
  if (unit === 'clove' || unit === 'can') {
    return `${amount} ${plural(unit, amount)}`;
  }
  return `${amount} ${unit}`;
}

/** The name column: "onions", "chickpeas (400 g per can)". */
export function formatName(ingredient: ScaledIngredient): string {
  const name = ingredient.unit === 'piece' ? plural(ingredient.name, ingredient.amount) : ingredient.name;
  return ingredient.gramsPerUnit ? `${name} (${ingredient.gramsPerUnit} g per ${ingredient.unit})` : name;
}