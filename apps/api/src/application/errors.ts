/**
 * The caller asked for a recipe id that does not exist. Presentation maps this to 404.
 *
 * Not a DomainError: no food rule was broken, the lookup simply found nothing.
 */
export class RecipeNotFoundError extends Error {
  constructor(readonly recipeId: string) {
    super(`No recipe with id "${recipeId}"`);
    this.name = new.target.name;
  }
}
