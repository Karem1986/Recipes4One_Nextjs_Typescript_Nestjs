import { Controller, Get, Param, Query } from '@nestjs/common';

import { GetScaledRecipe } from '../application/get-scaled-recipe';
import { ListRecipes } from '../application/list-recipes';
import {
  type RecipeSummaryResponse,
  type ScaledRecipeResponse,
  toRecipeSummaryResponse,
  toScaledRecipeResponse,
} from './recipe.response';

@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly listRecipes: ListRecipes,
    private readonly getScaledRecipe: GetScaledRecipe,
  ) {}

  @Get()
  async list(): Promise<RecipeSummaryResponse[]> {
    const recipes = await this.listRecipes.execute();
    return recipes.map(toRecipeSummaryResponse);
  }

  @Get(':id')
  async getOne(
    @Param('id') id: string,
    @Query('portions') portions?: string,
  ): Promise<ScaledRecipeResponse> {
    const count = portions === undefined ? 1 : Number(portions);
    const scaled = await this.getScaledRecipe.execute(id, count);
    return toScaledRecipeResponse(scaled);
  }
}