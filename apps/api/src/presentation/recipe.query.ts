// For the pipes in app.setup.ts

import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

import { Portions } from '../domain';

/**
 * The query string of GET /recipes/:id, checked before the controller runs.
 *
 * The allowed numbers come from the domain (Portions.ALLOWED), so the rule is written
 * in one place. The domain still checks it as well, for any caller that isn't HTTP.
 */
export class ScaledRecipeQuery {
  @ApiPropertyOptional({
    type: Number,
    enum: [...Portions.ALLOWED],
    default: 1,
    description: 'How many people to cook for.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsIn([...Portions.ALLOWED])
  portions: number = 1;
}