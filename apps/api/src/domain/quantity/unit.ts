/**
 * Units of measure. Reference data — no business rules live here.
 *
 * Every unit converts to a base unit of its kind, so two quantities of the same
 * kind can always be compared or summed:
 *   mass   -> grams
 *   volume -> millilitres
 *   count  -> the thing itself (1)
 */

export type UnitKind = 'mass' | 'volume' | 'count';

export type UnitSymbol =
  // mass
  | 'g'
  | 'kg'
  // volume
  | 'ml'
  | 'l'
  | 'tsp'
  | 'tbsp'
  // count
  | 'piece'
  | 'clove'
  | 'can';

export interface UnitDefinition {
  readonly symbol: UnitSymbol;
  readonly kind: UnitKind;
  /** How many base units one of this unit represents. */
  readonly inBaseUnits: number;
}

export const UNITS: Readonly<Record<UnitSymbol, UnitDefinition>> = {
  g: { symbol: 'g', kind: 'mass', inBaseUnits: 1 },
  kg: { symbol: 'kg', kind: 'mass', inBaseUnits: 1000 },

  ml: { symbol: 'ml', kind: 'volume', inBaseUnits: 1 },
  l: { symbol: 'l', kind: 'volume', inBaseUnits: 1000 },
  tsp: { symbol: 'tsp', kind: 'volume', inBaseUnits: 5 },
  tbsp: { symbol: 'tbsp', kind: 'volume', inBaseUnits: 15 },

  piece: { symbol: 'piece', kind: 'count', inBaseUnits: 1 },
  clove: { symbol: 'clove', kind: 'count', inBaseUnits: 1 },
  can: { symbol: 'can', kind: 'count', inBaseUnits: 1 },
} as const;

export function unitOf(symbol: UnitSymbol): UnitDefinition {
  return UNITS[symbol];
}

/** True for units you cannot meaningfully subdivide by measuring. */
export function isCountable(symbol: UnitSymbol): boolean {
  return UNITS[symbol].kind === 'count';
}
