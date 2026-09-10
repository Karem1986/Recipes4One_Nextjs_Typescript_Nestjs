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

// Remove `.skip` when you start on Recipe.scaleTo
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

  // Your design decision -- write the test once you have decided.
  it.todo('says in notes when a whole can makes the dish heavier than the original');
  it.todo('sets actualPortions above requestedPortions when it bumps the yield');
});
