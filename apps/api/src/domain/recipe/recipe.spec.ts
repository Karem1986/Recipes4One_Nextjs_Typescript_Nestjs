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
      Ingredient.create({ name: 'basmati rice', quantity: Quantity.of(200, 'g'), role: 'continuous' }),
      Ingredient.create({ name: 'coconut milk', quantity: Quantity.of(400, 'ml'), role: 'continuous' }),
      Ingredient.create({ name: 'garlic', quantity: Quantity.of(2, 'clove'), role: 'countable-aromatic' }),
      Ingredient.create({ name: 'onion', quantity: Quantity.of(1, 'piece'), role: 'countable-aromatic' }),
      Ingredient.create({
        name: 'chickpeas',
        quantity: Quantity.of(1, 'can'),
        role: 'countable-bulk',
        gramsPerUnit: 400,
      }),
    ],
    steps: ['Fry the onion and garlic', 'Add everything else', 'Simmer'],
  });

// Remove `.skip` when you start on Recipe.scaleTo
describe.skip('Recipe.scaleTo', () => {
  it('scales every ingredient down from 4 servings to 1', () => {
    const scaled = curryServingFour().scaleTo(Portions.single());
    const byName = new Map(scaled.ingredients.map((i) => [i.name, i.quantity]));

    expect(byName.get('basmati rice')?.amount).toBe(50);
    expect(byName.get('coconut milk')?.amount).toBe(100);
    expect(byName.get('garlic')?.amount).toBe(1);
    expect(byName.get('onion')?.amount).toBe(1);
    expect(byName.get('chickpeas')?.amount).toBe(100);
  });

  it('keeps the rice-to-chickpea ratio sane -- the bug that started all this', () => {
    const scaled = curryServingFour().scaleTo(Portions.single());
    const byName = new Map(scaled.ingredients.map((i) => [i.name, i.quantity]));
    const rice = byName.get('basmati rice')!.amount;
    const chickpeas = byName.get('chickpeas')!.amount;

    // Original ratio is 200:400. Ceiling the can would have made it 50:400.
    expect(chickpeas / rice).toBeCloseTo(2, 1);
  });

  it('records what was asked for', () => {
    const scaled = curryServingFour().scaleTo(Portions.single());
    expect(scaled.requestedPortions.value).toBe(1);
  });

  it('is a no-op at the recipe\'s own portion count', () => {
    const scaled = curryServingFour().scaleTo(Portions.of(4));
    const byName = new Map(scaled.ingredients.map((i) => [i.name, i.quantity]));
    expect(byName.get('basmati rice')?.amount).toBe(200);
    expect(byName.get('chickpeas')?.amount).toBe(400); // now in grams
  });

  it('does not mutate the original recipe', () => {
    const recipe = curryServingFour();
    recipe.scaleTo(Portions.single());
    expect(recipe.ingredients[0]!.quantity.amount).toBe(200);
  });

  // Your design decision -- write the test once you have decided.
  it.todo('explains itself in notes when a recipe cannot honestly serve 1');
  it.todo('sets actualPortions above requestedPortions when it bumps the yield');
});
