import { Quantity } from '../quantity/quantity';
import { InvalidRecipeError } from '../shared/domain-error';
import { Ingredient } from './ingredient';

describe('Ingredient.create', () => {
  it('rejects an empty name', () => {
    expect(() => Ingredient.create({ name: '  ', quantity: Quantity.of(1, 'piece') })).toThrow(
      InvalidRecipeError,
    );
  });
});

describe('Ingredient.scaleBy', () => {
  describe('measured units (g, ml, tsp) scale, then round by size', () => {
    it('divides 200 g rice by 4', () => {
      const rice = Ingredient.create({ name: 'basmati rice', quantity: Quantity.of(200, 'g') });
      const scaled = rice.scaleBy(0.25);
      expect(scaled.quantity.amount).toBe(50);
      expect(scaled.quantity.unit.symbol).toBe('g');
    });

    it('never rounds a small amount down to nothing -- 1 tsp cumin for one person', () => {
      // A recipe for 4 with 1 tsp cumin needs 0.25 tsp for 1. Math.round(0.25) is 0,
      // and Quantity refuses 0 so measured amounds go through roundForKitchen do this instead
      const cumin = Ingredient.create({ name: 'ground cumin', quantity: Quantity.of(1, 'tsp') });
      expect(cumin.scaleBy(0.25).quantity.amount).toBeGreaterThan(0);
    });

    // Pins the precision rule: 10 and up -> whole, 1 to 10 -> one decimal, under 1 -> two.
    it.each([
      ['400 ml / 3 -> whole number', 400, 'ml', 1 / 3, 133],
      ['5 tbsp / 4 -> one decimal', 5, 'tbsp', 0.25, 1.3],
      ['1 tsp / 4 -> two decimals, not rounded to 0.3', 1, 'tsp', 0.25, 0.25],
      ['1 tsp / 8 -> two decimals', 1, 'tsp', 0.125, 0.13],
    ] as const)('%s', (_label, amount, unit, factor, expected) => {
      const spice = Ingredient.create({ name: 'spice', quantity: Quantity.of(amount, unit) });
      expect(spice.scaleBy(factor).quantity.amount).toBe(expected);
    });
  });

  describe('counted units (clove, piece, can) -- whole units, rounded up, nothing left half-used', () => {
    it('turns half a clove of garlic into a whole clove', () => {
      const garlic = Ingredient.create({ name: 'garlic', quantity: Quantity.of(2, 'clove') });
      expect(garlic.scaleBy(0.25).quantity.amount).toBe(1);
    });

    it('never drops below one', () => {
      const lime = Ingredient.create({ name: 'lime', quantity: Quantity.of(1, 'piece') });
      expect(lime.scaleBy(0.25).quantity.amount).toBe(1);
    });

    it('still scales up normally', () => {
      const garlic = Ingredient.create({ name: 'garlic', quantity: Quantity.of(2, 'clove') });
      expect(garlic.scaleBy(4).quantity.amount).toBe(8);
    });

    const chickpeas = (cans = 1) =>
      Ingredient.create({ name: 'chickpeas', quantity: Quantity.of(cans, 'can'), gramsPerUnit: 400 });

    it.each([
      [0.25, 1], // 1 person, from a recipe for 4
      [0.5, 1], // 2 people
      [1, 1], // 4 people
      [2, 2], // 8 people
    ])('scales a can by %p to %p whole can(s)', (factor, expectedCans) => {
      const scaled = chickpeas().scaleBy(factor);
      expect(scaled.quantity.unit.symbol).toBe('can');
      expect(scaled.quantity.amount).toBe(expectedCans);
    });

    it('rounds up across several cans too: 2 cans for 4 people -> 1 can for 1', () => {
      const scaled = chickpeas(2).scaleBy(0.25);
      expect(scaled.quantity.unit.symbol).toBe('can');
      expect(scaled.quantity.amount).toBe(1);
    });

    it('keeps gramsPerUnit, so the UI can still show "1 can of chickpeas(400 g)"', () => {
      expect(chickpeas().scaleBy(0.25).gramsPerUnit).toBe(400);
    });
  });
});
