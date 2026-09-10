import { Quantity } from '../quantity/quantity';
import { Ingredient } from './ingredient';
import { Portions } from './portions';
import { Recipe } from './recipe';

const curryServingFour = () =>
  Recipe.create({
    id: 'coconut-chickpea-curry',
    title: 'Coconut chickpea curry',
    basePortions: Portions.of(4),
    ingredients: [
      Ingredient.create({ name: 'basmati rice', quantity: Quantity.of(200, 'g') }),
      Ingredient.create({ name: 'coconut milk', quantity: Quantity.of(400, 'ml') }),
      Ingredient.create({ name: 'garlic', quantity: Quantity.of(2, 'clove') }),
      Ingredient.create({ name: 'onion', quantity: Quantity.of(1, 'piece') }),
      Ingredient.create({ name: 'chickpeas', quantity: Quantity.of(1, 'can'), gramsPerUnit: 400 }),
    ],
    steps: ['Fry the onion and garlic', 'Add everything else', 'Simmer'],
  });

describe('Recipe.scaleTo', () => {
  it('scales every ingredient down from 4 servings to 1', () => {
    const scaled = curryServingFour().scaleTo(Portions.single());
    const byName = new Map(scaled.ingredients.map((i) => [i.name, i.quantity]));

    expect(byName.get('basmati rice')?.amount).toBe(50);
    expect(byName.get('coconut milk')?.amount).toBe(100);
    expect(byName.get('garlic')?.amount).toBe(1);
    expect(byName.get('onion')?.amount).toBe(1);
    expect(byName.get('chickpeas')?.amount).toBe(1); // a whole can
  });

  it('uses a whole can rather than leaving a half-open one in the fridge', () => {
    const scaled = curryServingFour().scaleTo(Portions.single());
    const chickpeas = scaled.ingredients.find((i) => i.name === 'chickpeas')!;
    expect(chickpeas.quantity.unit.symbol).toBe('can');
    expect(chickpeas.quantity.amount).toBe(1);
  });

  it('records what was asked for', () => {
    const scaled = curryServingFour().scaleTo(Portions.single());
    expect(scaled.requestedPortions.value).toBe(1);
  });

  it('is a no-op at the recipe\'s own portion count', () => {
    const scaled = curryServingFour().scaleTo(Portions.of(4));
    const byName = new Map(scaled.ingredients.map((i) => [i.name, i.quantity]));
    expect(byName.get('basmati rice')?.amount).toBe(200);
    expect(byName.get('chickpeas')?.amount).toBe(1); // still one whole can
  });

  it('does not mutate the original recipe', () => {
    const recipe = curryServingFour();
    recipe.scaleTo(Portions.single());
    expect(recipe.ingredients[0]!.quantity.amount).toBe(200);
  });

  describe('roundedUp -- counted ingredients it had to round up, so the UI can tell the user', () => {
    it('lists every counted ingredient rounded up for one person, in recipe order', () => {
      const scaled = curryServingFour().scaleTo(Portions.single());
      expect(scaled.roundedUp).toEqual([
        { name: 'garlic', needed: 0.5, used: 1, unit: 'clove' },
        { name: 'onion', needed: 0.25, used: 1, unit: 'piece' },
        { name: 'chickpeas', needed: 0.25, used: 1, unit: 'can' },
      ]);
    });

    it('lists nothing when every amount divides exactly -- meal prep for 8', () => {
      expect(curryServingFour().scaleTo(Portions.of(8)).roundedUp).toEqual([]);
    });

    it('ignores measured amounts, even when rounding nudges them up (1.25 -> 1.3 tbsp)', () => {
      const dressing = Recipe.create({
        id: 'dressing',
        title: 'Dressing',
        basePortions: Portions.of(4),
        ingredients: [Ingredient.create({ name: 'olive oil', quantity: Quantity.of(5, 'tbsp') })],
        steps: ['Whisk'],
      });
      expect(dressing.scaleTo(Portions.single()).roundedUp).toEqual([]);
    });

    it('scales up for Sunday meal-prep: 4 -> 8 portions', () => {
    const scaled = curryServingFour().scaleTo(Portions.of(8));
    const byName = new Map(scaled.ingredients.map((i) => [i.name, i.quantity]));
    expect(byName.get('basmati rice')?.amount).toBe(400);
    expect(byName.get('garlic')?.amount).toBe(4);
    expect(byName.get('chickpeas')?.amount).toBe(2); // two whole cans
  });
  });
});
