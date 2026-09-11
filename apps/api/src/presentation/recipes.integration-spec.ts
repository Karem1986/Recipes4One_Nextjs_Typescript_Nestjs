import 'reflect-metadata';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../app.module';
import { configureApp } from '../app.setup';

/**
 * Boots the whole app and talks to it over real HTTP, the way the frontend will.
 * These go green once RecipesController exists and all three recipes are seeded.
 */
describe('Recipes API', () => {
  let app: INestApplication;
  let baseUrl: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication({ logger: false });
    configureApp(app);
    await app.listen(0, '127.0.0.1'); // 0 = any free port; loopback only
    const { port } = app.getHttpServer().address() as { port: number };
    baseUrl = `http://127.0.0.1:${port}/api/v1`;
  });

  afterAll(async () => {
    await app.close();
  });

  // `any`: these tests inspect the raw JSON exactly as the frontend will receive it.
  const get = async (path: string): Promise<{ status: number; body: any }> => {
    const response = await fetch(`${baseUrl}${path}`);
    const text = await response.text();
    try {
      return { status: response.status, body: JSON.parse(text) };
    } catch {
      return { status: response.status, body: text };
    }
  };

  it('lists the three demo recipes', async () => {
    const { status, body } = await get('/recipes');
    expect(status).toBe(200);
    expect(body.map((recipe: { id: string }) => recipe.id).sort()).toEqual([
      'chickpea-salad',
      'coconut-chickpea-curry',
      'lentil-soup',
    ]);
  });

  it('summarises each recipe for the homepage cards', async () => {
    const { body } = await get('/recipes');
    const curry = body.find((recipe: { id: string }) => recipe.id === 'coconut-chickpea-curry');
    expect(curry).toMatchObject({ title: 'Coconut chickpea curry', cans: 2 }); // chickpeas + coconut milk
    expect(curry.ingredientCount).toBeGreaterThan(0);
  });

  it('scales the curry to one person and reports the cans it rounded up', async () => {
    const { status, body } = await get('/recipes/coconut-chickpea-curry?portions=1');
    expect(status).toBe(200);
    expect(body).toMatchObject({ id: 'coconut-chickpea-curry', portions: 1, isMealPrep: false });
    expect(body.roundedUp.map((item: { name: string }) => item.name)).toEqual(
      expect.arrayContaining(['chickpeas', 'coconut milk']),
    );
  });

  it('defaults to one portion -- the whole point of the app', async () => {
    const { body } = await get('/recipes/coconut-chickpea-curry');
    expect(body.portions).toBe(1);
  });

  it('marks 8 portions as meal prep', async () => {
    const { body } = await get('/recipes/coconut-chickpea-curry?portions=8');
    expect(body.isMealPrep).toBe(true);
  });

  it('answers 400 with the rule when portions is not 1, 2, 4 or 8', async () => {
    const { status, body } = await get('/recipes/coconut-chickpea-curry?portions=3');
    expect(status).toBe(400);
    expect(body.message).toContain('1, 2, 4, 8');
  });

  it('answers 400 when portions is not a number', async () => {
    const { status } = await get('/recipes/coconut-chickpea-curry?portions=lots');
    expect(status).toBe(400);
  });

  it('answers 404 for a recipe that does not exist', async () => {
    const { status, body } = await get('/recipes/pizza');
    expect(status).toBe(404);
    // The message proves it was OUR 404 (RecipeNotFoundError), not "no such route".
    expect(body.message).toBe('No recipe with id "pizza"');
  });

  it.each(['coconut-chickpea-curry', 'lentil-soup', 'chickpea-salad'])(
    'serves %s for 1, 2, 4 and 8 people',
    async (id) => {
      for (const portions of [1, 2, 4, 8]) {
        const { status } = await get(`/recipes/${id}?portions=${portions}`);
        expect(status).toBe(200);
      }
    },
  );
});
