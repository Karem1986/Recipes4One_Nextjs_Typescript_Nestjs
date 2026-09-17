import { type INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Shared by main.ts and the integration tests, so the tests hit exactly the URLs
 * real users do.
 *
 *   /api        global prefix, so every route lives under /api
 *   /v1         URI versioning: a breaking change later becomes /v2 while /v1 keeps working
 *   CORS        lets the Next.js app on localhost:3000 call this API from the browser
 *   validation  every request is checked against its DTO class before a controller runs
 *   /api/docs   Swagger: interactive documentation generated from the code
 */
export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableCors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:3000' });

  // a pipe in nest js is like a checkpoint that every request passes through before it reaches the controller, 
  // like a security gate control at an airport, first passport, then another gate for ticket. 
  // "Global" means every endpoint gets it. The checkpoint compares the request against a DTO (Data Transfer Object), a class describing what a request is allowed to contain.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strip fields the DTO does not declare
      forbidNonWhitelisted: true, // ...and answer 400 instead of silently ignoring them
      transform: true, // turn "2" from the URL into the number 2, as the DTO says
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Recipes for One API')
    .setDescription(
      'Plant-based, gluten-free recipes scaled to 1, 2, 4 or 8 portions, ' +
        'rounding counted ingredients up so nothing is left half-used.',
    )
    .setVersion('1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}