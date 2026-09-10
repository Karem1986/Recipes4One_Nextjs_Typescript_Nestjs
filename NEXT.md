# Start here — day 1

Target: working demo **22 Sept**, meeting with Anthony Perez **23 Sept**.

## Run it

```bash
npm test --workspace=@recipes4one/api
npm run dev --workspace=@recipes4one/web   # http://localhost:3000
```

## Today's job: the domain layer

Three stubs, in this order. Each has the rules written in its doc comment, and a
spec file describing the behaviour before you write it.

1. `apps/api/src/domain/recipe/portions.ts` → `Portions.of`
   Warm-up. Validate against `ALLOWED = [1, 2, 4, 8]`.

2. `apps/api/src/domain/recipe/ingredient.ts` → `Ingredient.scaleBy`
   The heart of it. Two rules, and the unit decides which (no stored role):
   - measured (`g`, `ml`, `tsp`) → scale linearly, round to a measurable precision
   - counted (`clove`, `piece`, `can`) → round UP to whole units, minimum 1

3. `apps/api/src/domain/recipe/recipe.ts` → `Recipe.scaleTo`
   Map over ingredients. Then decide what happens when a recipe can't honestly
   serve 1 — that decision is your best interview answer, so write the reason
   in a comment.

Each spec file starts with `describe.skip`. Delete the `.skip`, watch it go red,
make it green.

```bash
npm run test:watch --workspace=@recipes4one/api
```

## Already done (config — don't spend time here)

- npm workspaces monorepo, `tsconfig.base.json` strict
- NestJS 12 + Jest 30, split into `unit` (domain, no framework) and `integration`
- `Quantity`, `Unit`, `DomainError` implemented, 19 tests green
- Next.js 16 + React 19 + MUI 9, Emotion SSR wired via `AppRouterCacheProvider`
- TypeScript pinned to **5.9.3**, not 7.x — the Go rewrite is too new for ts-jest/Nest

## Decided so far

- Plant-based + gluten-free by default; 3 hardcoded recipes, no external API for the demo
- Portions `1, 2, 4, 8` — powers of two divide cleanly from 4-serving recipes; 3 was
  dropped because ×0.75 gives 0.75 onion and 1.5 cloves
- Display concerns (plurals, `½ lime`) live in React; food rules live in the domain layer
- Bulk ingredients (cans, tofu blocks) always come in whole units, rounded up: a
  half used can gets usually forgotten in the fridge. Trade-off: a heavier dish at 1
  portion, which the app should say in its notes
- No `role` field on ingredients: whether something is counted comes from its
  unit, so the two can never disagree (a stored role could call a lime
  `continuous` and crash at 0.25 of a lime)

## Not doing for the demo

Auth, database, image upload, real recipe API, AWS. Cut order if behind: CI, Docker,
the list page. Never cut: domain tests, one recipe scaling end to end.
