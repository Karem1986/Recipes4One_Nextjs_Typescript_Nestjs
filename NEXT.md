# Start here

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
   - counted (`clove`, `piece`, `can`) → round UP to whole units, minimum 1 to avoid ending up wih half can of chickpeas in the fridge

3. `apps/api/src/domain/recipe/recipe.ts` → `Recipe.scaleTo`
   Map over ingredients. Then decide what happens when a recipe can't honestly
   serve 1 — that decision is your best interview answer, so write the reason
   in a comment.

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

- Plant-based + gluten-free by default; 3 hardcoded recipes as a START OF THE PROJECT, no external API for the demo
- Portions `1, 2, 4, 8`, powers of two divide cleanly from 4-serving recipes; 3 was
  dropped because ×0.75 gives 0.75 onion and 1.5 cloves
- Display concerns (plurals, `½ lime`) live in React; food rules live in the domain layer
- Bulk ingredients (cans, tofu blocks) always come in whole units, rounded up: a
  half used can gets usually forgotten in the fridge. Trade-off: a heavier dish at 1
  portion, which the app says in the UI as a note: "Uses 1 whole can of chickpeas. A bit more than the recipe needs, but nothing left half-open in your fridge".
- No `role` field on ingredients: whether something is counted comes from its
  unit, so the two can never disagree.
- To fix the teaspoon measure bug, I decided to use a function 'roundForKitchen' which does: 10 and up → whole number, 1 to 10 → one decimal, under 1 → two decimals meaning that 0.25 tsp of cumin stay 0.25 tsp of cumin instead of rounding down to 0 and crashing.

## Not doing for the demo

Auth, database, image upload, real recipe API, AWS. Cut order if behind: CI, Docker,
the list page. Never cut: domain tests, one recipe scaling end to end.
