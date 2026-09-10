import { Quantity } from '../quantity/quantity';
import { InvalidRecipeError } from '../shared/domain-error';

/**
 * How an ingredient behaves when you scale it.
 *
 * This is the classification we arrived at by doing the arithmetic:
 *
 *  continuous        Measured by mass or volume. 200 g rice / 4 = 50 g rice.
 *                    Scales linearly at any factor. Never a problem.
 *
 *  countable-aromatic  Counted, but an accent rather than substance: garlic,
 *                    chilli, spring onion. 0.5 clove -> 1 clove. Rounding up
 *                    distorts the ratio by an amount cooking does not notice.
 *
 *  countable-bulk    Counted, and IS the substance: a can of chickpeas, a block
 *                    of tofu, an aubergine. Rounding these up is what broke the
 *                    naive version -- 50 g rice with a whole 400 g can of
 *                    chickpeas is not the same dish.
 */
export type IngredientRole = 'continuous' | 'countable-aromatic' | 'countable-bulk';

export interface IngredientProps {
  readonly name: string;
  readonly quantity: Quantity;
  readonly role: IngredientRole;
  /**
   * Weight of one whole unit, for countable-bulk ingredients.
   * `1 can chickpeas` -> 400. Lets you convert a count into a continuous
   * quantity instead of rounding it and wrecking the ratio.
   */
  readonly gramsPerUnit?: number;
}

export class Ingredient {
  private constructor(
    readonly name: string,
    readonly quantity: Quantity,
    readonly role: IngredientRole,
    readonly gramsPerUnit: number | undefined,
  ) {}

  static create(props: IngredientProps): Ingredient {
    const name = props.name.trim();
    if (name.length === 0) {
      throw new InvalidRecipeError('Ingredient name cannot be empty');
    }
    if (props.role === 'countable-bulk' && props.gramsPerUnit === undefined) {
      throw new InvalidRecipeError(
        `Ingredient "${name}" is countable-bulk and needs gramsPerUnit so it can be converted rather than rounded`,
      );
    }
    return new Ingredient(name, props.quantity, props.role, props.gramsPerUnit);
  }

  /**
   * TODO(karin): this is the heart of the app. Scale this ingredient by `factor`
   * and return a new Ingredient.
   *
   * The rules you decided on:
   *
   *   continuous         Scale linearly. Round to something a person can measure
   *                      (you choose the precision -- 50 g, not 50.0000001 g).
   *
   *   countable-aromatic Scale, then round UP to a whole number, minimum 1.
   *                      Half a clove of garlic becomes one clove.
   *
   *   countable-bulk     Do NOT round up. Convert to grams using gramsPerUnit,
   *                      scale that, and return a continuous quantity.
   *                      1 can (400 g) at x0.25 -> 100 g, not 1 can.
   *
   * Write the tests first -- ingredient.spec.ts has the cases listed as it.todo.
   */
  scaleBy(_factor: number): Ingredient {
    throw new Error('TODO: implement Ingredient.scaleBy');
  }
}
