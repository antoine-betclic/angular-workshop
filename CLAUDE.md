<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

## General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

# Angular Workshop — notes projet

- Objectif : talk « 10 ans d'évolution d'Angular ». Deux apps au périmètre identique : `apps/todo-zone` (style legacy volontaire : zone.js, NgModules, `@ngrx/store`, Reactive Forms) et `apps/todo-zoneless` (zoneless, signals, `@ngrx/signals`, `httpResource`, Signal Forms). Ne pas « moderniser » `todo-zone` : son style est le sujet de la démo.
- Angular 22 : OnPush est le défaut à l'exécution (`Default` = alias déprécié de `Eager`) et zoneless est le défaut même avec `bootstrapModule`. Les composants historiques de `todo-zone` déclarent `Default` explicitement et `AppModule` fournit `provideZoneChangeDetection()`. Autres pièges : `docs/pros-cons.md` §10.
- Commandes : `pnpm demo` (api + 2 apps), `pnpm nx run api:reset` (restaure les données ; `nx reset` = cache Nx), `pnpm nx run-many -t build test lint`, `pnpm slides`.
- Node ≥ 22.22 requis par la CLI Angular 22 : `mise.toml` pinne node 24.21.0.
- `apps/smart-recipe-app` (port 4203, `pnpm recipe`) : « Smart Recipe Box » de l'AI Tutor, figée à la fin de la phase 4 (modules 1-17) pour démarrer la démo à la phase 5 (Signal Forms). Hors session AI Tutor, ne pas y coder la phase 5 : c'est l'exercice live. En session AI Tutor (démo, `docs/demo-ai-tutor.md` §3.3) :
  - Modules 1-17 sont terminés : `RecipeService` utilise `@Service()` (v22) au lieu de `@Injectable`, et `app.html` ne contient plus que `<router-outlet />` ; ce n'est pas un écart au parcours. Commencer directement au module 18 (phase 5), sans message de fin de parcours ni auto-complétion.
  - Le curriculum du tutor date de v20/v21 : en Angular 22, la directive Signal Forms est `FormField` (import) / `[formField]` (template) ; `Field` n'est plus qu'un type. Corriger automatiquement le code du tutor (`imports: [FormField]`, `<input [formField]="recipeForm.name" />`) en le signalant en une phrase, et appliquer la même correction quand on relit le code de l'utilisateur.
  - Ne pas changer la signature existante `addRecipe(newRecipe: Omit<RecipeModel, 'id'>)` au module 19 : la réutiliser.
- Références : `docs/superpowers/specs/2026-09-22-angular-evolution-design.md`, `docs/superpowers/plans/2026-09-22-angular-evolution.md`, `docs/demo-ai-tutor.md`.
