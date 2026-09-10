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
  describe('measured units (g, ml) -- scale linearly', () => {
    it('divides 200 g rice by 4', () => {
      const rice = Ingredient.create({ name: 'basmati rice', quantity: Quantity.of(200, 'g') });
      const scaled = rice.scaleBy(0.25);
      expect(scaled.quantity.amount).toBe(50);
      expect(scaled.quantity.unit.symbol).toBe('g');
    });

    it('rounds to something a person can measure', () => {
      const milk = Ingredient.create({ name: 'coconut milk', quantity: Quantity.of(400, 'ml') });
      // 400 / 3 = 133.333...
      expect(Number.isInteger(milk.scaleBy(1 / 3).quantity.amount)).toBe(true);
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
  });
});
