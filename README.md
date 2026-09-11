# Recipes for One

Cooking for one person is where most household food waste starts. Recipes are written for two or four,
so you buy for four, cook for four, and throw away three portions. 
**Recipes for One** 
serves every recipe scaled to a single portion by default, and scales up  when you
switch on *meal-prep* mode and pick 2, 4, 6, 8 or 10 portions as most of us singles do for meal-prep on Sundays!

> **Status: in active development.** The sections below describe the target design.
> See [Roadmap](#roadmap) for what is actually built today.

## Stack

| Layer | Technology | Why |
|---|---|---|
| API | **NestJS** (TypeScript) | Modular, DI-first server framework; enforces boundaries between layers |
| Frontend | **Next.js** (App Router) + **React** | Server components for recipe pages, client components for the portion selector |
| Language | **TypeScript**, strict mode | Interfaces, generics and OOP throughout — no `any` |
| Styling | **Tailwind CSS** | Responsive, utility-first, no stylesheet drift |
| Database | **PostgreSQL** | Relational data: recipes, ingredients, units, users |
| Testing | **Jest** (API) + **Vitest** / Testing Library (web) | Domain logic unit-tested without a database |
| Containers | **Docker** + Compose | One command to run API, web and database locally |
| CI/CD | **GitHub Actions** | Lint, type-check, test and build on every push |
| Cloud | **AWS** (S3, Lambda, EC2) | Recipe images on S3, scaling jobs on Lambda, API on EC2 |

## Architecture

Clean Architecture, with dependencies pointing inwards only, it can be tested with plain Jest and no test container.

```
apps/
  api/                      NestJS
    src/
      domain/               Entities, value objects, domain services. Zero dependencies.
        recipe/
        ingredient/
        quantity/           Unit conversion + scaling rules live here
      application/          Use cases, ports (interfaces), DTOs
        use-cases/
        ports/
      infrastructure/       Adapters: Postgres repositories, S3 client, auth
      presentation/         Controllers, request/response mapping, validation
  web/                      Next.js
    app/                    App Router routes
    components/             Reusable React components
    lib/                    Typed API client
packages/
  shared/                   Types shared between api and web
```

**SOLID in practice:** use cases depend on a `RecipeRepository` *interface* defined in the
application layer (dependency inversion); the Postgres implementation lives in infrastructure and is
bound in a Nest module. Swapping Postgres for anything else touches one file and no tests.

## API

RESTful, versioned under `/api/v1`, documented with OpenAPI (Swagger UI at `/api/docs`).

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/v1/recipes` | List recipes, filterable and paginated |
| `GET` | `/api/v1/recipes/:id?portions=4` | A recipe with all quantities scaled to `portions` |
| `POST` | `/api/v1/recipes` | Create a recipe (authenticated) |
| `PATCH` | `/api/v1/recipes/:id` | Update a recipe (owner only) |
| `DELETE` | `/api/v1/recipes/:id` | Delete a recipe (owner only) |
| `POST` | `/api/v1/auth/register` | Create an account |
| `POST` | `/api/v1/auth/login` | Exchange credentials for a JWT |

Authentication is JWT-based; authorisation is role- and ownership-based via Nest guards. Every
request body is validated at the edge with `class-validator` DTOs, so invalid data never reaches a
use case.

## Running locally

docker compose up --build

| Web | http://localhost:3000 |
| API | http://localhost:4000/api/v1 |
| API docs | http://localhost:4000/api/docs |
| Postgres | localhost:5432 |

Without Docker:

npm install
npm run dev --workspace=@recipes4one/api
npm run dev --workspace=@recipes4one/web

Copy `.env.example` to `.env` first — the app will not start with missing configuration, by design.

## Testing

npm run test:watch --workspace=@recipes4one/api

Domain logic:  unit conversion, portion scaling, rounding is covered by unit tests that need no
database and no HTTP server. That speed is the payoff for keeping the domain layer pure.

## CI/CD --Not yet built.

GitHub Actions runs on every push and pull request:

1. Install with a cached lockfile
2. Lint (ESLint) and type-check (`tsc --noEmit`)
3. Unit tests, then e2e tests against a Postgres service container
4. Build both apps and the Docker images

## Roadmap

- [x] Monorepo scaffold with claude (npm workspaces, shared TypeScript config)
- [x] Domain layer: `Quantity`, `Unit`, `Ingredient`, `Recipe` + scaling rules, fully unit-tested
- [ ] Next.js frontend: recipe list, recipe detail, portion selector
- [ ] Application layer: the frontend in react and nest js
- [ ] Infrastructure: Postgres repositories, migrations, seed data
- [ ] REST API with validation, JWT auth and Swagger docs
- [ ] Docker Compose for local development
- [ ] GitHub Actions pipeline
- [ ] Deploy to cloud provider

## History

This repository began as a Docker Compose experiment with a Python prototype. The domain idea
survived; the stack was rebuilt in TypeScript. The original prototype remains in the git history.
