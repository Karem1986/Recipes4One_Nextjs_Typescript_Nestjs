import { InvalidRecipeError } from '../shared/domain-error';
import { Ingredient } from './ingredient';
import { Portions } from './portions';

/**
 * The result of scaling a recipe.
 *
 * `actualPortions` exists because it does not always equal what was asked for.
 * When an ingredient cannot sensibly go below a whole unit, the honest answer is
 * not to fake a quarter of a lime -- it is to say "this one makes 2 portions,
 * eat one tonight and keep one for tomorrow". `notes` carries that message.
 */
export interface ScaledRecipe {
  readonly recipe: Recipe;
  readonly requestedPortions: Portions;
  readonly actualPortions: Portions;
  readonly ingredients: readonly Ingredient[];
  readonly notes: readonly string[];
}

export interface RecipeProps {
  readonly id: string;
  readonly title: string;
  /** Portions the ingredient amounts below are written for. Usually 4. */
  readonly basePortions: Portions;
  readonly ingredients: readonly Ingredient[];
  readonly steps: readonly string[];
}

export class Recipe {
  private constructor(
    readonly id: string,
    readonly title: string,
    readonly basePortions: Portions,
    readonly ingredients: readonly Ingredient[],
    readonly steps: readonly string[],
  ) {}

  static create(props: RecipeProps): Recipe {
    if (props.title.trim().length === 0) {
      throw new InvalidRecipeError('Recipe title cannot be empty');
    }
    if (props.ingredients.length === 0) {
      throw new InvalidRecipeError(`Recipe "${props.title}" has no ingredients`);
    }
    return Object.freeze(
      new Recipe(
        props.id,
        props.title.trim(),
        props.basePortions,
        Object.freeze([...props.ingredients]),
        Object.freeze([...props.steps]),
      ),
    );
  }

  scaleTo(target: Portions): ScaledRecipe {
    const factor = this.basePortions.factorTo(target);
    const ingredients = this.ingredients.map((ingredient) => ingredient.scaleBy(factor));

    return {
      recipe: this,
      requestedPortions: target,
      actualPortions: target,
      ingredients,
      notes: [],
    };
  }
}
