import { Quantity } from '../quantity/quantity';
import { InvalidRecipeError } from '../shared/domain-error';

export interface IngredientProps {
  readonly name: string;
  readonly quantity: Quantity;
  /**
   * Weight of one whole unit, e.g. 400 for a can of chickpeas. Optional, and not
   * used for scaling -- bulk ingredients stay in whole units -- but it lets the
   * UI show "1 can (400 g)".
   */
  readonly gramsPerUnit?: number;
}

// 0.25 tsp cumin now stays 0.25 instead of rounding down to 0 and crashing. 
// 0.25 grams of chickpeas becomes 1 can to avoid the can ending up in the fridge forgotten. */
function roundForKitchen(amount: number): number {
  // round down to whole number
  if (amount >= 10) return Math.round(amount);
  // round down to 1 decimal
  if (amount >= 1) return Math.round(amount * 10) / 10;  
  return Math.round(amount * 100) / 100;
}

export class Ingredient {
  private constructor(
    readonly name: string,
    readonly quantity: Quantity,
    readonly gramsPerUnit: number | undefined,
  ) {}

  static create(props: IngredientProps): Ingredient {
    const name = props.name.trim();
    if (name.length === 0) {
      throw new InvalidRecipeError('Ingredient name cannot be empty');
    }
    return new Ingredient(name, props.quantity, props.gramsPerUnit);
  }

  scaleBy(factor: number): Ingredient {
    const scaled = this.quantity.scaleBy(factor);

    const amount = scaled.isCountable ? Math.ceil(scaled.amount) : roundForKitchen(scaled.amount);
  roundForKitchen(scaled.amount)
    return new Ingredient(this.name, scaled.withAmount(amount), this.gramsPerUnit);
  }
}
