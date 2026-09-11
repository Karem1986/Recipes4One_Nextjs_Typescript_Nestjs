/**
 * Base class for every rule the domain enforces.
 *
 * Domain errors know nothing about HTTP. Mapping them to status codes is the API's job.
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}

export class InvalidQuantityError extends DomainError {}
export class InvalidPortionsError extends DomainError {}
export class InvalidRecipeError extends DomainError {}

