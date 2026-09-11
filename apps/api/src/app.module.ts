import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

import { GetScaledRecipe } from './application/get-scaled-recipe';
import { ListRecipes } from './application/list-recipes';
import { RECIPE_REPOSITORY, type RecipeRepository } from './application/recipe-repository';
import { InMemoryRecipeRepository } from './infrastructure/in-memory-recipe-repository';
import { SEED_RECIPES } from './infrastructure/seed-recipes';
import { DomainErrorFilter } from './presentation/domain-error.filter';
import { HealthController } from './presentation/health.controller';
import { RecipesController } from './presentation/recipes.controller';


/**
 * The root module: the one place that knows which concrete pieces fill which roles.
 *
 * The use cases are plain classes, so they are built here with `useFactory` instead
 * of being decorated with Nest annotations. Swapping the in-memory recipes for a real
 * source means changing the RECIPE_REPOSITORY line and nothing else.
 */
@Module({
  controllers: [HealthController, RecipesController],
  providers: [
    { provide: RECIPE_REPOSITORY, useFactory: () => new InMemoryRecipeRepository(SEED_RECIPES) },
    {
      provide: ListRecipes,
      useFactory: (recipes: RecipeRepository) => new ListRecipes(recipes),
      inject: [RECIPE_REPOSITORY],
    },
    {
      provide: GetScaledRecipe,
      useFactory: (recipes: RecipeRepository) => new GetScaledRecipe(recipes),
      inject: [RECIPE_REPOSITORY],
    },
    { provide: APP_FILTER, useClass: DomainErrorFilter },
  ],
})
export class AppModule {}
