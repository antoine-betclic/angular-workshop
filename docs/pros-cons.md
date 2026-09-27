# Avantages / inconvénients : zone.js vs zoneless, ancien vs moderne

Comparatif détaillé des deux apps du dépôt. Chaque ligne se vérifie dans le code : `apps/todo-zone` (legacy) et `apps/todo-zoneless` (moderne).

## 1. Moteur de rendu

| | zone.js + `Default` | zone.js + `OnPush` | zoneless + signals |
| --- | --- | --- | --- |
| Déclencheur | toute tâche asynchrone patchée par zone.js | idem, mais la vue n'est rafraîchie que si input changé / événement / `markForCheck` / signal | signal lu par le template, listener de template, `markForCheck`, `setInput`, fin de `resource` |
| Portée d'un rafraîchissement | tout l'arbre | sous-arbre des vues marquées dirty | vues marquées dirty uniquement |
| Coût par événement | O(taille de l'arbre) | O(vues dirty) | O(vues dirty) |
| Bundle | zone.js (~30 ko min+gz ≈ 12 ko) | idem | 0 |
| Pièges | `ExpressionChangedAfterItHasBeenChecked`, `mousemove` qui rend tout | inputs mutés en place « oubliés » | propriété non-signal mutée dans un `setTimeout` jamais rendue |
| Debug | stack traces zone, `ngZone.run` | idem | stack traces natives |
| API non patchables | `async/await` natif, Web Workers, certains SDK | idem | n/a |
| Depuis v22 | `Default` = alias déprécié de `Eager` | **défaut à l'exécution** | défaut de `ng new` depuis v21 |

Preuve dans le code : `apps/todo-zone/src/app/features/lab` (deux cartes, `RenderCounter`) et `apps/todo-zoneless/src/app/features/lab`.

## 2. Architecture des composants

| | Legacy | Moderne |
| --- | --- | --- |
| Découpage | NgModules (`declarations`, `imports`, `exports`), `SharedModule` | standalone, `imports` au niveau du composant |
| DI | `constructor(private store: Store)` | `inject(TodoStore)` |
| Inputs / outputs | `@Input()` mutable, `@Output() = new EventEmitter()` | `input.required<Todo>()` (signal, readonly), `output<string>()` |
| Host | `@HostBinding`, `@HostListener` | `host: { '[class.done]': 'todo().done' }` |
| Templates | `*ngIf`, `*ngFor` + `trackBy`, `ngClass`, `| async` | `@if`, `@for (…; track id)`, `@switch`, `@defer` |
| Lazy loading | `loadChildren` → NgModule + `RouterModule.forChild` | `loadChildren` → `Routes` (export default), `loadComponent` |
| Guards / resolvers | classes (dépréciées) ou fonctions | `CanDeactivateFn`, `ResolveFn`, `RedirectCommand` |
| Animations | DSL `@angular/animations` (`trigger`, `transition`, `provideAnimations()`) | `animate.enter` / `animate.leave` + CSS |
| Nommage | `todo-list.component.ts` / `TodoListComponent` | `todo-list.ts` / `TodoList` (style guide v20) |

## 3. État

| | `@ngrx/store` + effects + entity | `@ngrx/signals` |
| --- | --- | --- |
| Fichiers | actions, reducer, effects, selectors (+ feature) | un `signalStore` |
| Lecture dans un composant | `store.select(sel)` → `Observable` → `| async` | `store.filtered()` → signal |
| Dérivations | `createSelector` (mémoïsé) | `withComputed` (mémoïsé, paresseux) |
| Effets asynchrones | `createEffect` + `ofType` + `switchMap` | `rxMethod` (RxJS) ou `resource` |
| Mise à jour optimiste | action + reducer + action de rollback | `patchState(updateEntity(...))` puis rollback |
| Traçabilité | Redux DevTools, time travel | DevTools NgRx (lecture), pas de time travel |
| Boilerplate | élevé | faible |
| Compatibilité zoneless | via `async` pipe (`markForCheck`) | native |
| Cohabitation | `store.selectSignal()` fait le pont | idem |

## 4. Formulaires

| | Reactive Forms | Signal Forms (`@angular/forms/signals`, stable v22) |
| --- | --- | --- |
| Source de vérité | le `FormGroup` | le `signal` du modèle |
| Typage | `nonNullable.group`, `null` par défaut sinon | dérivé du modèle, `null` interdit |
| Validation | `Validators.*` sur les contrôles | schéma : `required(s.title, { message })`, `validate`, `validateAsync`, `applyWhen` |
| État des champs | `control.touched`, `control.errors` (objets) | `field().touched()`, `field().errors()` (signals) |
| Soumission | `(ngSubmit)`, `markAllAsTouched()` à la main | `submit(form, async () => …)` |
| Composants custom | `ControlValueAccessor` | pas nécessaire |
| Zoneless | `setValue()` ne déclenche pas de rendu | natif |
| Maturité | 10 ans, écosystème complet | jeune, libs tierces en cours |

## 5. HTTP

| | `HttpClient` seul | `httpResource` |
| --- | --- | --- |
| Lecture | `Observable` froid, `subscribe` / `async` / effect | signal `value()`, `isLoading()`, `error()`, `status()` |
| Dépendances réactives | `switchMap` sur un `Observable` d'input | URL calculée depuis des signaux, annulation auto |
| Loading state | à la main | fourni |
| Interceptors | classes `HTTP_INTERCEPTORS` (multi) | fonctions `withInterceptors([...])` (les classes restent possibles via `withInterceptorsFromDi`) |
| Mutations | `HttpClient` | `HttpClient` (inchangé) |
| SSR | transfer cache via `provideClientHydration` | idem |

## 6. SSR et hydratation

| | Legacy | Moderne |
| --- | --- | --- |
| Bootstrap serveur | `AppServerModule` | `bootstrapApplication(App, config, context)` |
| Stabilité | attendre que la zone soit vide | `PendingTasks` explicites |
| Hydratation | complète + event replay | complète + event replay + **incrémentale** (`@defer (hydrate on viewport)`) |
| Rendu par route | `RenderMode.Server` / `Prerender` | idem |

## 7. Tests

| | Legacy | Moderne |
| --- | --- | --- |
| Runner | Vitest (Analog) avec zone | Vitest (Analog) zoneless |
| Rendu | `fixture.detectChanges()` | `await fixture.whenStable()` |
| Store | reducer pur, effects avec `provideMockActions` | `signalStore` avec `HttpTestingController`, `unprotected()` |

## 8. Pourquoi Angular a changé (résumé)

1. **Précision** : zone.js dit « quelque chose a peut-être changé » ; un signal dit « ceci a changé ». Le rendu granulaire exige la seconde information.
2. **Coût** : le monkey-patching et le `tick()` global pèsent sur les Core Web Vitals, en particulier sur mobile.
3. **Compatibilité** : zone.js ne peut pas patcher `async/await` natif ; l'écosystème JS moderne s'éloigne des API patchables.
4. **Cohérence** : une seule primitive réactive (signal) pour l'état, les formulaires, le réseau, le rendu.
5. **Migration douce** : chaque étape (standalone, `@if`, OnPush, signals, zoneless) compile et se déploie seule. `OnPush` était déjà, depuis 2016, le contrat du zoneless.

## 9. Quand rester (temporairement) sur l'ancien modèle

- Dépendance à une lib tierce non compatible OnPush/zoneless (vérifier avec `onpush_zoneless_migration`).
- Formulaires très complexes avec `ControlValueAccessor` maison : garder Reactive Forms, migrer les nouveaux formulaires seulement.
- Besoin de time travel / audit Redux strict : `@ngrx/store` reste supporté et cohabite avec `@ngrx/signals`.
