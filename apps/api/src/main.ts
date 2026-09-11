import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { configureApp } from './app.setup';

/** Starts the HTTP server. Configuration only -- no business rules live here. */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  console.log('Recipes for One API is running. Try:');
  console.log(`  http://localhost:${port}/api/v1/recipes`);
  console.log(`  http://localhost:${port}/api/v1/recipes/coconut-chickpea-curry?portions=1`);
}

void bootstrap();
