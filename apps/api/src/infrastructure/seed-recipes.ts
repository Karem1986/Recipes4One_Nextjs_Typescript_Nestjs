import { Ingredient, Portions, Quantity, Recipe } from '../domain';

/**
 * The demo's recipes: plant-based, gluten-free, written for 4 people.
 *
 * Counted units (can, piece, clove) round up to whole units, so nothing is left half-used;
 *  measured units (g, ml, tsp) keep the exact share. Anything concentrated such as stock, lemon juice is measured,
 * because rounding it up changes the taste, not just the amount.
 */
export const SEED_RECIPES: readonly Recipe[] = [
  Recipe.create({
    id: 'coconut-chickpea-curry',
    title: 'Coconut chickpea curry',
    basePortions: Portions.of(4),
    ingredients: [
      Ingredient.create({ name: 'basmati rice', quantity: Quantity.of(200, 'g') }),
      Ingredient.create({ name: 'chickpeas', quantity: Quantity.of(1, 'can'), gramsPerUnit: 400 }),
      // A can, not 400 ml: one person uses the whole can rather than leaving
      // three-quarters of an opened can in the fridge.
      Ingredient.create({ name: 'coconut milk', quantity: Quantity.of(1, 'can'), gramsPerUnit: 400 }),
      Ingredient.create({ name: 'onion', quantity: Quantity.of(1, 'piece') }),
      Ingredient.create({ name: 'garlic', quantity: Quantity.of(2, 'clove') }),
      Ingredient.create({ name: 'ground cumin', quantity: Quantity.of(1, 'tsp') }),
      Ingredient.create({ name: 'ground turmeric', quantity: Quantity.of(1, 'tsp') }),
      Ingredient.create({ name: 'spinach', quantity: Quantity.of(100, 'g') }),
    ],
    steps: [
      'Cook the rice.',
      'Fry the onion and garlic with the cumin and turmeric for 4 minutes.',
      'Add the chickpeas and coconut milk and simmer for 15 minutes on low-heat.',
      'Stir in the spinach until it wilts, then serve over the rice.',
    ],
  }),

    Recipe.create({
    id: 'lentil-soup',
    title: 'Lentil soup',
    basePortions: Portions.of(4),
    ingredients: [
      Ingredient.create({ name: 'red lentils', quantity: Quantity.of(200, 'g') }),
      Ingredient.create({ name: 'vegetable stock (gluten-free)', quantity: Quantity.of(20, 'ml') }),
      // A can, not 400 ml: one person uses the whole can rather than leaving half of an opened can in the fridge.
      Ingredient.create({ name: 'coconut cream', quantity: Quantity.of(1, 'can')}),
      Ingredient.create({ name: 'onion', quantity: Quantity.of(1, 'piece') }),
      Ingredient.create({ name: 'garlic', quantity: Quantity.of(2, 'clove') }),
      Ingredient.create({ name: 'ground cumin', quantity: Quantity.of(1, 'tsp') }),
      Ingredient.create({ name: 'ground turmeric', quantity: Quantity.of(1, 'tsp') }),
      Ingredient.create({ name: 'olive oil', quantity: Quantity.of(10, 'ml') }),
    ],
    steps: [
      'Fry the onion and garlic with the cumin and turmeric for 4 minutes.',
      'Cook the lentils separately and when ready add the fried onion and garlic. Stir everything well and add salt to preference',
      'Stir in coconut cream als optional and for a more creamy lentil soup dish',
    ],
  }),

    Recipe.create({
    id: 'chickpea-salad',
    title: 'Chickpea salad',
    basePortions: Portions.of(4),
    ingredients: [
      Ingredient.create({ name: 'chickpeas', quantity: Quantity.of(1, 'can'), gramsPerUnit: 400 }),
      Ingredient.create({ name: 'cucumber', quantity: Quantity.of(1, 'piece') }),
      Ingredient.create({ name: 'red onion', quantity: Quantity.of(1, 'piece') }),
      Ingredient.create({ name: 'tomatoes', quantity: Quantity.of(2, 'piece') }),
      Ingredient.create({ name: 'lemon juice', quantity: Quantity.of(3, 'tsp') }),
      Ingredient.create({ name: 'fresh parsley', quantity: Quantity.of(20, 'g') }),
    ],
    steps: [
      'Chop all ingredients.',
      'Place them in a big bowl',
      'Add the lemon juice and parsley, seasoned with salt and olive oil or another preference.',
    ],
  }),
];
