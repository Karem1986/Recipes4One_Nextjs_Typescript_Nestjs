import { Ingredient, InvalidPortionsError, Portions, Quantity, Recipe } from '../domain';
import { RecipeNotFoundError } from './errors';
import { GetScaledRecipe } from './get-scaled-recipe';
import type { RecipeRepository } from './recipe-repository';

const soup = Recipe.create({
  id: 'soup',
  title: 'Soup',
  basePortions: Portions.of(4),
  ingredients: [Ingredient.create({ name: 'lentils', quantity: Quantity.of(200, 'g') })],
  steps: ['Simmer'],
});

// Anything with these two methods IS a RecipeRepository -- no Nest, no database needed.
const repositoryOf = (recipes: Recipe[]): RecipeRepository => ({
  findAll: async () => recipes,
  findById: async (id) => recipes.find((recipe) => recipe.id === id),
});

describe('GetScaledRecipe', () => {
  const useCase = new GetScaledRecipe(repositoryOf([soup]));

  it('scales the recipe it finds', async () => {
    const scaled = await useCase.execute('soup', 1);
    expect(scaled.requestedPortions.value).toBe(1);
    expect(scaled.ingredients[0]!.quantity.amount).toBe(50);
  });

  it('throws RecipeNotFoundError for an id that does not exist', async () => {
    await expect(useCase.execute('pizza', 1)).rejects.toThrow(RecipeNotFoundError);
  });

  it('rejects invalid portions with the domain error, before looking anything up', async () => {
    await expect(useCase.execute('pizza', 3)).rejects.toThrow(InvalidPortionsError);
  });
});
