import { InvalidPortionsError } from '../shared/domain-error';

/**
 * How many people a recipe is being cooked for.
 *
 * A value object rather than a bare number, so an invalid portion count cannot
 * exist anywhere in the system. If it compiles and you hold a Portions, it is valid.
 *
 * Powers of two divide most cleanly from the 4-serving recipes the outside world
 * publishes. 3 was considered and dropped: from a 4-serving source it means x0.75,
 * which turns 1 onion into 0.75 of an onion and 2 cloves into 1.5.
 */
export class Portions {
  static readonly ALLOWED = [1, 2, 4, 8] as const;

  private constructor(readonly value: number) {}

  /**
   * TODO(karin): build a valid Portions or throw InvalidPortionsError.
   *
   * Reject: anything not in ALLOWED, non-integers, zero, negatives, NaN, Infinity.
   * The error message ends up in an API response, so make it say what was allowed.
   *
   * See portions.spec.ts — the tests describe the behaviour before you write it.
   */
  static of(value: number): Portions {
    throw new InvalidPortionsError(
      `TODO: implement Portions.of -- received ${value}, allowed are ${Portions.ALLOWED.join(', ')}`,
    );
  }

  static single(): Portions {
    return Portions.of(1);
  }

  /** The multiplier to get from this many portions to `target`. */
  factorTo(target: Portions): number {
    return target.value / this.value;
  }

  get isMealPrep(): boolean {
    return this.value > 1;
  }

  equals(other: Portions): boolean {
    return this.value === other.value;
  }
}
