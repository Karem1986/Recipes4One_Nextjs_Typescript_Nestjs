import { InvalidRecipeError } from '../shared/domain-error';
import { Ingredient } from './ingredient';
import { Portions } from './portions';
import type { UnitSymbol } from '../quantity/unit';


/** A counted ingredient the recipe rounded up to a whole unit. React turns this into the note. */
export interface RoundedUp {
  readonly name: string;
  /** The exact share for the requested portions, e.g. 0.25 of a can. */
  readonly needed: number;
  /** What the recipe tells you to use, e.g. 1 whole can. */
  readonly used: number;
  readonly unit: UnitSymbol;
}

export interface ScaledRecipe {
  readonly recipe: Recipe;
  readonly requestedPortions: Portions;
  readonly ingredients: readonly Ingredient[];
  readonly roundedUp: readonly RoundedUp[];
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
    const ingredients: Ingredient[] = [];
    const roundedUp: RoundedUp[] = [];

    for (const original of this.ingredients) {
      const scaled = original.scaleBy(factor);
      ingredients.push(scaled);

      const needed = original.quantity.scaleBy(factor).amount; // exact share, no rounding
      const used = scaled.quantity.amount; // after rounding
      // Only check for counted ingredients like a can of chickpeas, if it uses more than needed, add it to the notes list, visible in the UI React
      if (scaled.quantity.isCountable && used > needed) {
        roundedUp.push({ name: original.name, needed, used, unit: scaled.quantity.unit.symbol });
      }
    }

    return { recipe: this, requestedPortions: target, ingredients, roundedUp };
  }
}
