# Angular Evolution — design de la démo

Date : 2026-09-22. Statut : validé par A. Beauregard (architecture, emplacement, démo IA, slides).

## 1. Objectif

Démontrer l'évolution d'Angular en comparant, à périmètre fonctionnel identique (une todo list), une
application écrite « à l'ancienne » (zone.js, NgModules, RxJS/NgRx classique, Reactive Forms) et une
application moderne (zoneless, standalone, signals, signalStore, httpResource, Signal Forms), toutes deux
en SSR, dans un même monorepo Nx. Une présentation Slidev (français, ~45 min) fournit la trame et intègre
la partie IA d'angular.dev (MCP, skill `angular-developer`, AI Tutor).

## 2. Contrainte structurante

Un workspace Nx = une seule version d'Angular. Les deux apps tournent sur **Angular 22.1** ; l'app legacy
imite le style historique. Message pédagogique : la rétrocompatibilité d'Angular permet une migration
progressive. Option rejetée : projet Angular 16 séparé hors Nx (double maintenance, casse l'objectif Nx).

## 3. Stack (versions vérifiées le 2026-09-22)

| Outil | Version |
| --- | --- |
| Node / pnpm | 22.14 / 10.24 |
| Nx, @nx/angular | 23.2.x |
| Angular | 22.1.x |
| NgRx (store, effects, entity, signals) | 22.0.x |
| json-server | 1.0.0-beta.15 |
| Slidev | 53.x, thème seriph |
| Tests unitaires | Vitest (défaut Nx pour Angular 20+) |

## 4. Structure

```
angular-evolution/
  apps/
    todo-zone/       legacy : zone.js, NgModules, Default + OnPush, @ngrx/store+effects+entity, Reactive Forms, SSR
    todo-zoneless/   moderne : zoneless, standalone, signals, @ngrx/signals, httpResource, Signal Forms, SSR + hydratation incrémentale
    api/             json-server (db.json : todos, tags), target `nx serve api` sur :3000
    slides/          Slidev, target `nx serve slides`
  libs/shared/models/  types Todo, Tag, Priority (unique lib partagée)
  playground/        projet `ng new` minimal hors Nx pour la démo AI Tutor
  .mcp.json          serveur MCP angular-cli
  docs/              spec, plan, script de démo IA, pros/cons
```

## 5. Périmètre fonctionnel commun

- Modèle `Todo` : `id`, `title`, `description`, `done`, `priority` (`low|medium|high`), `dueDate` (ISO),
  `tags: string[]`, `createdAt` (ISO). `Tag` : `id`, `label`, `color`.
- Routes (toutes lazy) : `/todos` (liste, filtres statut + recherche), `/todos/new`, `/todos/:id` (édition,
  resolver), `/stats` (compteurs dérivés), `/lab` (labo de change detection), `/about`. Guard
  « formulaire non sauvegardé » sur `/todos/new` et `/todos/:id`.
- API json-server : `GET/POST/PATCH/DELETE /todos`, `GET /tags`. Interceptor HTTP ajoutant une latence
  artificielle (query `?delay=` ou InjectionToken) pour rendre visibles loading states et SSR.
- Store NgRx : legacy = actions / reducer / effects / selectors / `@ngrx/entity` ; moderne =
  `signalStore` + `withEntities` + `withMethods` (`rxMethod`) + `withComputed`.
- Formulaire : legacy = `FormBuilder` Reactive Forms typés ; moderne = Signal Forms (`form()`, `FormField`,
  `required`, `minLength`, `validate`, `submit`).
- SSR : legacy = `AppServerModule` + `provideClientHydration()` ; moderne =
  `provideClientHydration(withIncrementalHydration(), withEventReplay())` + `@defer (hydrate on viewport)`.

## 6. Labo de change detection (`/lab`)

todo-zone : deux cartes identiques côte à côte (`Default` vs `OnPush`). Chaque carte affiche un compteur
« évaluations du template » (fonction appelée dans le template) et flashe en CSS à chaque rendu. Boutons :
muter l'objet d'entrée, remplacer la référence, `setTimeout` hors template, `markForCheck()`, événement DOM
dans l'enfant, `runOutsideAngular`. Un `mousemove` global fait exploser le compteur de la carte Default.

todo-zoneless : même page en signals. CD ne s'exécute que si un signal lu par le template change. Piège
montré : un `setTimeout` qui mute une propriété non-signal ne rafraîchit rien.

## 7. Notions de base Angular couvertes dans les deux apps (revue skill angular-developer)

Composants (inputs/outputs décorateurs vs `input()`/`output()`), templates (`*ngIf/*ngFor` vs `@if/@for`),
directive custom (todo en retard), pipe custom (échéance relative), DI + `InjectionToken` (URL API),
interceptor HTTP, routing lazy + guard + resolver, projection de contenu, cycle de vie (hooks vs
`effect`/`afterRenderEffect`), animations (DSL `@angular/animations` vs `animate.enter/leave`), `@defer`
(moderne), tests Vitest ciblés (reducer vs signalStore, une carte du labo). Pas de E2E.

## 8. Partie IA

- `.mcp.json` racine : `{"mcpServers":{"angular-cli":{"command":"npx","args":["-y","@angular/cli","mcp"]}}}`.
- Slides : angular.dev/ai, `llms.txt`, skill `angular-developer` (installé depuis `angular/skills`), MCP
  (outils `ai_tutor`, `get_best_practices`, `onpush_zoneless_migration`, `search_documentation`…),
  AI Tutor (« Smart Recipe Box », 5 phases, 21 modules).
- Démo : `playground/` (ng new) + `docs/demo-ai-tutor.md` (script pas à pas : lancer le tutor depuis
  Claude Code, puis `onpush_zoneless_migration` sur `todo-zone`).

## 9. Présentation Slidev (français, ~45 min)

1. Histoire : AngularJS → Angular 2 → Ivy → standalone → signals → zoneless (frise).
2. Pourquoi zone.js, comment ça marche, ses coûts.
3. Default vs OnPush vs zoneless (démo live `/lab`).
4. RxJS/NgRx classique vs signals/signalStore (code côte à côte).
5. Reactive Forms vs Signal Forms. 6. HttpClient vs httpResource.
7. SSR, hydratation, hydratation incrémentale. 8. IA : MCP, skill, AI Tutor (démo).
9. Tableau pros/cons de chaque approche, pourquoi Angular a changé. 10. Conclusion : chemin de migration.

## 10. Hors périmètre

E2E, i18n, PWA, déploiement, Angular Material, authentification.
