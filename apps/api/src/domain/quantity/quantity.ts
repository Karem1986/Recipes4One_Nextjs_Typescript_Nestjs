import { InvalidQuantityError } from '../shared/domain-error';
import { UnitDefinition, UnitSymbol, unitOf } from './unit';

/**
 * An amount paired with its unit. Immutable value object: every operation
 * returns a new Quantity rather than mutating this one.
 *
 * This class deliberately knows nothing about food. It will happily give you
 * 0.25 of a can — deciding that 0.25 of a can is unusable is a rule about
 * ingredients, and it lives in Ingredient.
 */
export class Quantity {
  private constructor(
    readonly amount: number,
    readonly unit: UnitDefinition,
  ) {}

  static of(amount: number, symbol: UnitSymbol): Quantity {
    if (!Number.isFinite(amount)) {
      throw new InvalidQuantityError(`Amount must be a finite number, got ${amount}`);
    }
    if (amount <= 0) {
      throw new InvalidQuantityError(`Amount must be greater than zero, got ${amount}`);
    }
    return new Quantity(amount, unitOf(symbol));
  }

  /** Linear scaling. No rounding, no opinions — see Ingredient for those. */
  scaleBy(factor: number): Quantity {
    if (!Number.isFinite(factor) || factor <= 0) {
      throw new InvalidQuantityError(`Factor must be a positive number, got ${factor}`);
    }
    return new Quantity(this.amount * factor, this.unit);
  }

  withAmount(amount: number): Quantity {
    return Quantity.of(amount, this.unit.symbol);
  }

  toBaseUnits(): number {
    return this.amount * this.unit.inBaseUnits;
  }

  get isCountable(): boolean {
    return this.unit.kind === 'count';
  }

  equals(other: Quantity): boolean {
    return this.unit.symbol === other.unit.symbol && this.amount === other.amount;
  }

  toString(): string {
    return `${this.amount} ${this.unit.symbol}`;
  }
}
