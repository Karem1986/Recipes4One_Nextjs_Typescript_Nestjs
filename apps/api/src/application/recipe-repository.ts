import type { Recipe } from '../domain';

/**
 * Port: what the application needs from "wherever recipes live".
 *
 * The application depends on this interface, never on a concrete source.
 * Infrastructure provides the implementation -- hardcoded recipes today, a recipe
 * website later -- and swapping one for the other changes one line in app.module.ts.
 *
 * Async on purpose: real sources (a database, an HTTP API) are, so the port is
 * shaped for them even though the in-memory adapter could answer instantly.
 */
export interface RecipeRepository {
  findAll(): Promise<readonly Recipe[]>;
  findById(id: string): Promise<Recipe | undefined>;
}

/** Interfaces vanish when TypeScript compiles, so Nest injects the port by this token. */
export const RECIPE_REPOSITORY = Symbol('RecipeRepository');
