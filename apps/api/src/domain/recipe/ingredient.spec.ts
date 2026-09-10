import { Quantity } from '../quantity/quantity';
import { InvalidRecipeError } from '../shared/domain-error';
import { Ingredient } from './ingredient';

describe('Ingredient.create', () => {
  it('rejects an empty name', () => {
    expect(() =>
      Ingredient.create({ name: '  ', quantity: Quantity.of(1, 'piece'), role: 'countable-aromatic' }),
    ).toThrow(InvalidRecipeError);
  });

  it('rejects countable-bulk without gramsPerUnit, because it could then only be rounded', () => {
    expect(() =>
      Ingredient.create({ name: 'chickpeas', quantity: Quantity.of(1, 'can'), role: 'countable-bulk' }),
    ).toThrow(InvalidRecipeError);
  });
});

// Remove `.skip` when you start on Ingredient.scaleBy
describe.skip('Ingredient.scaleBy', () => {
  describe('continuous -- scales linearly, no drama', () => {
    it('divides 200 g rice by 4', () => {
      const rice = Ingredient.create({
        name: 'basmati rice',
        quantity: Quantity.of(200, 'g'),
        role: 'continuous',
      });
      const scaled = rice.scaleBy(0.25);
      expect(scaled.quantity.amount).toBe(50);
      expect(scaled.quantity.unit.symbol).toBe('g');
    });

    it('rounds to something a person can measure', () => {
      const milk = Ingredient.create({
        name: 'coconut milk',
        quantity: Quantity.of(400, 'ml'),
        role: 'continuous',
      });
      // 400 / 3 = 133.333... -- decide your precision and assert it here
      expect(Number.isInteger(milk.scaleBy(1 / 3).quantity.amount)).toBe(true);
    });
  });

  describe('countable-aromatic -- rounds up, minimum one', () => {
    it('turns half a clove of garlic into a whole clove', () => {
      const garlic = Ingredient.create({
        name: 'garlic',
        quantity: Quantity.of(2, 'clove'),
        role: 'countable-aromatic',
      });
      expect(garlic.scaleBy(0.25).quantity.amount).toBe(1);
    });

    it('never drops below one', () => {
      const lime = Ingredient.create({
        name: 'lime',
        quantity: Quantity.of(1, 'piece'),
        role: 'countable-aromatic',
      });
      expect(lime.scaleBy(0.25).quantity.amount).toBe(1);
    });

    it('still scales up normally', () => {
      const garlic = Ingredient.create({
        name: 'garlic',
        quantity: Quantity.of(2, 'clove'),
        role: 'countable-aromatic',
      });
      expect(garlic.scaleBy(4).quantity.amount).toBe(8);
    });
  });

  describe('countable-bulk -- converts to weight instead of rounding', () => {
    const chickpeas = () =>
      Ingredient.create({
        name: 'chickpeas',
        quantity: Quantity.of(1, 'can'),
        role: 'countable-bulk',
        gramsPerUnit: 400,
      });

    it('becomes 100 g rather than a whole can', () => {
      const scaled = chickpeas().scaleBy(0.25);
      expect(scaled.quantity.amount).toBe(100);
      expect(scaled.quantity.unit.symbol).toBe('g');
    });

    it('this is the case that broke the naive version', () => {
      // Rounding up would give a whole 400 g can alongside 50 g of rice.
      expect(chickpeas().scaleBy(0.25).quantity.amount).not.toBe(400);
    });

    it('scales up to weight too', () => {
      expect(chickpeas().scaleBy(2).quantity.amount).toBe(800);
    });
  });
});
