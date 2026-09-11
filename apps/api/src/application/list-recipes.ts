import type { Recipe } from '../domain';
import type { RecipeRepository } from './recipe-repository';

/** Use case: "which recipes are there?" */
export class ListRecipes {
  constructor(private readonly recipes: RecipeRepository) {}

  execute(): Promise<readonly Recipe[]> {
    return this.recipes.findAll();
  }
}
