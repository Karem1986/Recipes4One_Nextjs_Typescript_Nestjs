import { type INestApplication, VersioningType } from '@nestjs/common';

/**
 * Shared by main.ts and the integration tests, so the tests hit exactly the URLs
 * real users do.
 *
 *   /api   global prefix, so every route lives under /api
 *   /v1    URI versioning: a breaking change later becomes /v2 while /v1 keeps working
 *   CORS   lets the Next.js app on localhost:3000 call this API from the browser
 */
export function configureApp(app: INestApplication): void {
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableCors({ origin: process.env.WEB_ORIGIN ?? 'http://localhost:3000' });
}
