# Angular Workshop

Démo « 10 ans d'évolution d'Angular » : une même todo-list, deux moteurs.

| App | Port | Style |
| --- | --- | --- |
| `apps/todo-zone` | 4200 | zone.js, NgModules, `Default` + `OnPush`, `@ngrx/store` + effects + entity, Reactive Forms, DSL animations, SSR |
| `apps/todo-zoneless` | 4201 | zoneless, standalone, signals, `@ngrx/signals`, `httpResource`, Signal Forms, `animate.enter`, SSR + hydratation incrémentale |
| `apps/api` | 3000 | json-server (`/todos`, `/tags`, `/quiz`) |
| `apps/quiz` | 4202 | quiz QCM de la présentation (zoneless, `httpResource` sur `/api/quiz/1`, sans les réponses) |
| `apps/smart-recipe-app` | 4203 | « Smart Recipe Box » de l'[AI Tutor](https://angular.dev/ai/ai-tutor), amenée à la fin de la phase 4 (Reactive Forms + Material) : point de départ de la phase 5, Signal Forms |
| `apps/slides` | 3030 | Slidev (trame du workshop, 1 h 30, français) |

Les deux apps sont en **Angular 22.1** : `todo-zone` est écrite volontairement dans le style historique. Seuls `libs/shared/models` (types) et `libs/shared/styles` (CSS) sont partagés, pour que la comparaison porte uniquement sur le moteur.

## Prérequis

- Node ≥ 22.22 ou 24 (`mise install` lit `mise.toml`), pnpm 10.
- Le skill `angular-developer` pour la démo IA : `npx skills add angular/skills`.

## Démarrer

```bash
git clone https://github.com/antoine-betclic/angular-workshop.git
cd angular-workshop
mise install       # node 24.21.0
pnpm install
pnpm demo          # api + todo-zone + todo-zoneless (données réinitialisées)
pnpm slides        # deck Slidev sur http://localhost:3030
```

Commandes unitaires : `pnpm nx serve api|todo-zone|todo-zoneless|smart-recipe-app|slides`, `pnpm nx serve todo-zoneless -c development-ssr` (SSR en dev ; `serve` seul tourne en CSR), `pnpm nx run api:reset` (restaure `db.seed.json`), `pnpm nx run-many -t build test lint`.

SSR en production :

```bash
pnpm nx run-many -t build -p todo-zone todo-zoneless
pnpm nx serve api &
pnpm ssr:zone      # http://localhost:4000
pnpm ssr:zoneless  # http://localhost:4001
curl -s localhost:4001/todos | grep -o 'todo-item' | wc -l
```

## Déroulé de la démo

1. `/lab` sur les deux apps : compteur de rendus, `Default` vs `OnPush` vs signals.
2. `/todos`, `/todos/new`, `/stats` : même UI, code côte à côte (store, formulaire, HTTP).
3. SSR : `curl` + onglet Network sur `/stats` (bloc `@defer (hydrate on viewport)`).
4. IA : skill, MCP `angular-cli` (`onpush_zoneless_migration`), AI Tutor sur `apps/smart-recipe-app` (phase 5, Signal Forms). Script : [docs/demo-ai-tutor.md](docs/demo-ai-tutor.md).

## Documentation

- [Spec de design](docs/superpowers/specs/2026-09-22-angular-evolution-design.md)
- [Plan d'implémentation](docs/superpowers/plans/2026-09-22-angular-evolution.md)
- [Avantages / inconvénients détaillés](docs/pros-cons.md)
- [Script de la démo IA](docs/demo-ai-tutor.md)

## Point d'attention Angular 22

Depuis v22, un composant sans `changeDetection` explicite est **OnPush** ; `ChangeDetectionStrategy.Default` est un alias déprécié de `Eager`. Les composants « historiques » de `todo-zone` déclarent donc `Default` explicitement, sinon le labo de change detection ne montrerait rien.

Autres pièges v22 rencontrés (zoneless par défaut même avec `bootstrapModule`, `useDefineForClassFields`, `allowedHosts` SSR, resolver vs `onInit` pour l'hydratation) : voir la section 10 de [docs/pros-cons.md](docs/pros-cons.md).

## Licence

[MIT](LICENSE)
