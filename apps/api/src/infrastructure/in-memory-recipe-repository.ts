import type { RecipeRepository } from '../application/recipe-repository';
import type { Recipe } from '../domain';

/**
 * Adapter: recipes held in memory. Right for the demo; a database or recipe-website
 * adapter would implement the same RecipeRepository port and nothing else would change.
 */
export class InMemoryRecipeRepository implements RecipeRepository {
  private readonly byId: ReadonlyMap<string, Recipe>;

  constructor(recipes: readonly Recipe[]) {
    this.byId = new Map(recipes.map((recipe) => [recipe.id, recipe]));
  }

  async findAll(): Promise<readonly Recipe[]> {
    return [...this.byId.values()];
  }

  async findById(id: string): Promise<Recipe | undefined> {
    return this.byId.get(id);
  }
}
