import { Portions, type ScaledRecipe } from '../domain';
import { RecipeNotFoundError } from './errors';
import type { RecipeRepository } from './recipe-repository';

/**
 * Use case: "show me recipe X for N people".
 *
 * Plain TypeScript, no NestJS: the application layer stays framework-free, like the
 * domain. app.module.ts is the only place that connects it to Nest.
 */
export class GetScaledRecipe {
  constructor(private readonly recipes: RecipeRepository) {}

  async execute(recipeId: string, portions: number): Promise<ScaledRecipe> {
    const target = Portions.of(portions); // invalid portions fail fast, before any lookup
    const recipe = await this.recipes.findById(recipeId);
    if (recipe === undefined) {
      throw new RecipeNotFoundError(recipeId);
    }
    return recipe.scaleTo(target);
  }
}
