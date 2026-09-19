import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { GetScaledRecipe } from '../application/get-scaled-recipe';
import { ListRecipes } from '../application/list-recipes';
import { ScaledRecipeQuery } from './recipe.query';
import {
  RecipeSummaryResponse,
  ScaledRecipeResponse,
  toRecipeSummaryResponse,
  toScaledRecipeResponse,
} from './recipe.response';

@ApiTags('recipes')
@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly listRecipes: ListRecipes,
    private readonly getScaledRecipe: GetScaledRecipe,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all recipes' })
  @ApiOkResponse({ type: [RecipeSummaryResponse] })
  async list(): Promise<RecipeSummaryResponse[]> {
    const recipes = await this.listRecipes.execute();
    return recipes.map(toRecipeSummaryResponse);
  }


  @Get(':id')
  @ApiOperation({
    summary: 'Get a recipe scaled to a number of portions',
    description:
      'Measured ingredients are scaled exactly. Counted ingredients (cans, cloves, pieces) are ' +
      'rounded up to whole units, and listed in `roundedUp`.',
  })
  @ApiParam({ name: 'id', example: 'coconut-chickpea-curry' })
  @ApiOkResponse({ type: ScaledRecipeResponse })
  @ApiBadRequestResponse({ description: 'portions is not 1, 2, 4 or 8, or the query has unknown fields.' })
  @ApiNotFoundResponse({ description: 'No recipe with this id.' })
  async getOne(@Param('id') id: string, @Query() query: ScaledRecipeQuery): Promise<ScaledRecipeResponse> {
    const scaled = await this.getScaledRecipe.execute(id, query.portions);
    return toScaledRecipeResponse(scaled);
  }
}