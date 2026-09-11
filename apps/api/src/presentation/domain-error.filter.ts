import { type ArgumentsHost, BadRequestException, Catch, NotFoundException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

import { RecipeNotFoundError } from '../application/errors';
import { DomainError } from '../domain';

/**
 * Turns errors from the inner layers into HTTP answers -- "whose fault was it?"
 *
 *   DomainError          the caller asked for something invalid, e.g. ?portions=3  -> 400
 *   RecipeNotFoundError  the caller asked for an id that does not exist            -> 404
 *
 * Anything else is not caught here, so Nest answers 500: that one is ours, a bug.
 */
@Catch(DomainError, RecipeNotFoundError)
export class DomainErrorFilter extends BaseExceptionFilter {
  override catch(error: DomainError | RecipeNotFoundError, host: ArgumentsHost): void {
    const http =
      error instanceof RecipeNotFoundError
        ? new NotFoundException(error.message)
        : new BadRequestException(error.message);
    super.catch(http, host);
  }
}
