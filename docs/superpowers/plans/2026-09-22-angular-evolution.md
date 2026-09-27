# Angular Evolution — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deux todo-apps Angular 22 au périmètre identique (legacy zone.js/NgModules vs moderne zoneless/signals), SSR, dans un monorepo Nx, plus une présentation Slidev et une démo IA.

**Architecture:** Un workspace Nx 23 (pnpm). `apps/api` = json-server. `apps/todo-zone` (port 4200) écrit en style historique ; `apps/todo-zoneless` (port 4201) en style moderne. `libs/shared/models` (types) et `libs/shared/styles` (CSS commun) sont les seuls éléments partagés, pour que la comparaison porte uniquement sur le moteur.

**Tech Stack:** Angular 22.1.4, @angular/ssr 22.1.6, Nx 23.2, NgRx 22 (store/effects/entity pour legacy, signals pour moderne), Vitest via @analogjs/vitest-angular, json-server 1.0.0-beta.15, Slidev 53.

**Spec:** `docs/superpowers/specs/2026-09-22-angular-evolution-design.md`

## Global Constraints

- Angular 22.1.4 pour les deux apps ; ne pas changer les versions du `package.json` racine.
- Toutes les commandes passent par `pnpm nx …` depuis la racine du workspace.
- UI en **français**. Mêmes libellés dans les deux apps : nav = « Tâches », « Nouvelle tâche », « Statistiques », « Labo CD », « À propos ».
- Mêmes routes dans les deux apps : `''`→`todos`, `todos`, `todos/new`, `todos/:id`, `stats`, `lab`, `about`, `**`→`todos`. Tout en lazy loading.
- Les deux apps consomment `http://localhost:3000` (json-server) via un `InjectionToken<string>` nommé `API_URL`.
- Interceptor de latence artificielle : `DEMO_LATENCY_MS` (`InjectionToken<number>`, défaut `400`) appliqué à toutes les requêtes HTTP.
- Header : marque « Angular Evolution », nav, badge moteur à droite (`<span class="engine zone">zone.js</span>` ou `<span class="engine zoneless">zoneless</span>`).
- Styles : uniquement les classes de `libs/shared/styles/index.scss` (déjà câblé dans `project.json`). Pas de nouveau CSS global ; les styles composant restent minimes.
- `app.routes.server.ts` : `about` en `RenderMode.Prerender`, tout le reste (`**`) en `RenderMode.Server` (les données viennent de l'API, pas de prerender au build).
- `serve` des apps dépend du `serve` de l'api (tâche continue Nx) : `"dependsOn": [{ "projects": ["api"], "target": "serve" }]`.
- Chaque tâche se termine par `pnpm nx build <app>` + `pnpm nx test <app>` + `pnpm nx lint <app>` verts, puis un commit (`Co-authored-by: Claude <claude@anthropic.com>`).
- Fichier `nx-welcome.ts` généré : à supprimer dans les deux apps.
- Pas de E2E, pas d'Angular Material, pas d'i18n.

---

## Comportement fonctionnel commun (référence pour les deux apps)

### Modèle (déjà dans `libs/shared/models`, import `@angular-evolution/shared/models`)

```ts
export type Priority = 'low' | 'medium' | 'high';
export interface Todo { id: string; title: string; description: string; done: boolean; priority: Priority; dueDate: string; tags: string[]; createdAt: string; }
export type TodoDraft = Omit<Todo, 'id' | 'createdAt'>;
export type TodoFilter = 'all' | 'active' | 'done';
export interface Tag { id: string; label: string; color: string; }
export interface TodoStats { total: number; done: number; active: number; overdue: number; byPriority: Record<Priority, number>; completionRate: number; }
```

### API json-server (`pnpm nx serve api`, port 3000)

- `GET /todos`, `GET /todos/:id`, `POST /todos` (body `TodoDraft & { createdAt }`, l'API génère `id`), `PATCH /todos/:id`, `DELETE /todos/:id`, `GET /tags`.
- `pnpm nx run api:reset` restaure les données de démo.

### Page `/todos` (liste)

- Toolbar : champ recherche (`input type=search`, placeholder « Rechercher… »), segmented control « Toutes / À faire / Terminées », bouton « Nouvelle tâche » (lien vers `/todos/new`), bouton « Recharger ».
- Liste `.todo-list` de `.todo-item` : checkbox `done`, titre, meta (badge priorité `.badge.low|medium|high` libellé « Basse / Moyenne / Haute », échéance via pipe `relativeDue`, chips de tags colorées via `TagChip`), actions « Éditer » (lien `/todos/:id`) et « Supprimer ».
- Directive `overdue` sur chaque item : ajoute la classe `overdue` si `dueDate < aujourd'hui && !done`.
- États : `.loading` « Chargement… », `.alert` en erreur, `.empty` « Aucune tâche » si liste vide.
- Animation d'entrée/sortie des items (legacy : DSL `@angular/animations` ; moderne : `animate.enter="enter-anim"` / `animate.leave="leave-anim"`).

### Pages `/todos/new` et `/todos/:id` (formulaire)

- Champs : titre (requis, min 3), description (textarea), priorité (select), échéance (`input type=date`, requis), tags (cases à cocher construites depuis `GET /tags`), terminé (checkbox, édition uniquement).
- Erreurs affichées sous le champ après `touched`. Bouton « Enregistrer » désactivé si invalide. Bouton « Annuler » → `/todos`.
- Guard « Modifications non enregistrées. Quitter ? » (`window.confirm`) si le formulaire est dirty et non soumis.
- `/todos/:id` : la tâche est pré-chargée par un resolver ; id inconnu → redirection `/todos`.
- Après enregistrement : retour à `/todos`.

### Page `/stats`

- 4 tuiles `.stat` : Total, Terminées, À faire, En retard. Barre `.bar` du taux de complétion. Répartition par priorité (3 barres).

### Page `/lab` (labo de change detection) — voir détail par app plus bas.

### Page `/about`

- Prerendue. Décrit la stack de l'app (liste) et un tableau « Avantages / Inconvénients » de son approche (contenu ci-dessous, à reprendre tel quel).

Legacy (todo-zone) :
- Avantages : « ça marche tout seul » (zone.js patch les API async), énorme écosystème/documentation, patterns NgRx éprouvés et testables, migration progressive possible.
- Inconvénients : CD sur toute l'arborescence à chaque événement, coût du polyfill zone.js (~30 ko) et du monkey-patching, debugging difficile (stack traces zone), boilerplate NgRx (actions/reducers/effects/selectors), `async` pipe et souscriptions partout, incompatibilités avec les API natives modernes (async/await non patché dans certains cas, Web Workers…).

Moderne (todo-zoneless) :
- Avantages : rendu uniquement là où un signal a changé, pas de zone.js (bundle plus léger, meilleurs Core Web Vitals), stack traces lisibles, moins de boilerplate (signalStore, httpResource, Signal Forms), compatible SSR/hydratation incrémentale, code plus déclaratif.
- Inconvénients : il faut « prévenir » Angular (signals, `markForCheck`, `AsyncPipe`) sinon rien ne se rafraîchit, migration des libs tierces non compatibles, Signal Forms encore jeune (v22), apprentissage de la réactivité fine.

---

## Task A: `apps/todo-zone` — app legacy (zone.js, NgModules)

Style de code **historique volontaire** : fichiers suffixés (`*.component.ts`, `*.service.ts`, `*.module.ts`), classes suffixées (`TodoListComponent`), `@Input()/@Output()` décorateurs, `*ngIf/*ngFor` (importer `CommonModule`), `| async`, `constructor(private store: Store)` injection par constructeur, `HttpClientModule` + interceptor classe via `HTTP_INTERCEPTORS`, `RouterModule.forChild`, `loadChildren` vers des NgModules, Reactive Forms via `FormBuilder`, DSL `@angular/animations`. Le `Default` change detection partout **sauf** `TodoItemComponent` et `OnPushCardComponent` qui sont `OnPush`.

**Files (à créer sous `apps/todo-zone/src/app/`) :**

- Renommer `app.ts`→`app.component.ts` (classe `AppComponent`, template `app.component.html` : shell + header + `<router-outlet>` + footer), `app-module.ts`→`app.module.ts`, `app.server.module.ts` conservé ; mettre à jour `main.ts`, `main.server.ts`, `app.spec.ts`.
- `core/api-url.token.ts` : `export const API_URL = new InjectionToken<string>('API_URL', { providedIn: 'root', factory: () => 'http://localhost:3000' });` et `DEMO_LATENCY_MS` (défaut 400).
- `core/latency.interceptor.ts` : `@Injectable() export class LatencyInterceptor implements HttpInterceptor` → `next.handle(req).pipe(delay(this.latency))`. Fourni via `{ provide: HTTP_INTERCEPTORS, useClass: LatencyInterceptor, multi: true }`.
- `core/todo-api.service.ts` : `@Injectable({ providedIn: 'root' }) TodoApiService` avec `getAll(): Observable<Todo[]>`, `getOne(id): Observable<Todo>`, `create(draft: TodoDraft): Observable<Todo>` (ajoute `createdAt: new Date().toISOString()`), `update(id, changes: Partial<Todo>): Observable<Todo>`, `remove(id): Observable<void>`.
- `core/tags-api.service.ts` : `getAll(): Observable<Tag[]>`.
- `store/todo.actions.ts` : `createActionGroup({ source: 'Todos', events: { 'Load': emptyProps(), 'Load Success': props<{ todos: Todo[] }>(), 'Load Failure': props<{ error: string }>(), 'Add': props<{ draft: TodoDraft }>(), 'Add Success': props<{ todo: Todo }>(), 'Toggle': props<{ id: string }>(), 'Update': props<{ id: string; changes: Partial<Todo> }>(), 'Update Success': props<{ todo: Todo }>(), 'Remove': props<{ id: string }>(), 'Remove Success': props<{ id: string }>(), 'Set Filter': props<{ filter: TodoFilter }>(), 'Set Search': props<{ search: string }>(), 'Mutation Failure': props<{ error: string }>() } })`.
- `store/todo.reducer.ts` : `EntityState<Todo>` via `createEntityAdapter<Todo>()` + `filter`, `search`, `status: 'idle'|'loading'|'loaded'|'error'`, `error: string | null`. `export const todosFeature = createFeature({ name: 'todos', reducer })`.
- `store/todo.selectors.ts` : `selectAllTodos`, `selectFilteredTodos` (filtre + recherche insensible à la casse sur titre/description), `selectStats(): TodoStats`, `selectStatus`, `selectError`, `selectTodoById(id)`.
- `store/todo.effects.ts` : `TodoEffects` avec `load$` (switchMap → api.getAll → Load Success / catchError → Load Failure), `add$`, `toggle$` (lit l'entité courante via `concatLatestFrom(() => store.select(selectTodoById))`... plus simple : `Toggle` transporte l'id, l'effect lit `store.select(selectTodoEntities)` pour connaître `done` puis appelle `api.update(id, { done: !done })` → `Update Success`), `update$`, `remove$`. Les erreurs → `Mutation Failure`.
- `store/tags.*` : store minimal `tags` (Load / Load Success) avec `selectAllTags`, `selectTagsById`.
- `app.module.ts` : `BrowserModule`, `HttpClientModule`, `RouterModule.forRoot(appRoutes)`, `StoreModule.forRoot({ [todosFeature.name]: todosFeature.reducer, tags: tagsReducer })`, `EffectsModule.forRoot([TodoEffects, TagsEffects])`, `StoreDevtoolsModule.instrument({ maxAge: 25 })`, `provideAnimations()`, `provideClientHydration(withEventReplay())`, interceptor.
- `app.routes.ts` : redirections + `loadChildren: () => import('./features/todos/todos.module').then(m => m.TodosModule)` etc.
- `features/todos/todos.module.ts`, `todos-routing.module.ts` (`''`→liste, `new`→form, `:id`→form avec `resolve: { todo: todoResolver }` et `canDeactivate: [unsavedChangesGuard]`).
- `features/todos/todo-list/todo-list.component.ts|html` : `Default` CD, `todos$ = store.select(selectFilteredTodos)`, `status$`, `*ngFor="let todo of todos$ | async; trackBy: trackById"`, `[@listAnim]` (trigger avec `transition(':enter'…)`/`:leave`), dispatch `Load` dans `ngOnInit`.
- `features/todos/todo-item/todo-item.component.ts|html` : **`ChangeDetectionStrategy.OnPush`**, `@Input() todo!: Todo`, `@Input() tags: Tag[] = []`, `@Output() toggled = new EventEmitter<string>()`, `@Output() removed = new EventEmitter<string>()`. Utilise `znOverdue`, `relativeDue`, `<zn-tag-chip [color]>`.
- `features/todos/todo-form/todo-form.component.ts|html` : `FormBuilder.nonNullable.group({ title: ['', [Validators.required, Validators.minLength(3)]], description: [''], priority: ['medium' as Priority], dueDate: ['', Validators.required], done: [false], tags: fb.array<FormControl<boolean>>([]) })`. Mode édition si `route.snapshot.data['todo']`. `ngOnDestroy` → `subscription.unsubscribe()` (montre le boilerplate).
- `features/todos/todo.resolver.ts` : `ResolveFn<Todo>` → `api.getOne(id)` avec `catchError` → `router.navigate(['/todos'])` + `EMPTY`.
- `features/todos/unsaved-changes.guard.ts` : `CanDeactivateFn<TodoFormComponent>` → `component.canLeave() || confirm(...)`.
- `features/stats/stats.module.ts`, `stats.component.ts|html` : `stats$ = store.select(selectStats)`, `| async as stats`.
- `features/lab/lab.module.ts`, `lab.component.ts|html`, `default-card/default-card.component.ts`, `onpush-card/onpush-card.component.ts`, `render-counter.ts` (classe utilitaire).
- `features/about/about.module.ts`, `about.component.ts|html`.
- `shared/shared.module.ts` exportant `OverdueDirective` (`[znOverdue]`, `@Input('znOverdue') todo`, `@HostBinding('class.overdue')`), `RelativeDuePipe` (`relativeDue`, pure), `TagChipComponent` (`zn-tag-chip`, `@Input() color`, `<ng-content>`).
- `app.routes.server.ts` : `about` Prerender, `**` Server.
- Tests (`*.spec.ts`) : `todo.reducer.spec.ts` (Load Success remplit les entités ; Set Filter), `relative-due.pipe.spec.ts` (aujourd'hui / dans N j / en retard), `onpush-card.component.spec.ts` (muter l'input ne re-rend pas ; remplacer la référence re-rend), `app.component.spec.ts` (rend le badge `zone.js`).

**Labo CD (todo-zone) :**

`RenderCounter` : utilitaire partagé par les deux cartes.

```ts
export class RenderCounter {
  renders = 0;
  private scheduled = false;
  constructor(private host: ElementRef<HTMLElement>, private zone: NgZone) {}
  /** Appelé depuis le template : {{ counter.track() }}. Retourne '' pour ne rien afficher.
   * Dédoublonne les 2 passes du mode dev (checkNoChanges) via queueMicrotask, hors zone pour ne pas relancer CD. */
  track(): string {
    if (!this.scheduled) {
      this.scheduled = true;
      this.zone.runOutsideAngular(() => queueMicrotask(() => {
        this.scheduled = false;
        this.renders++;
        const el = this.host.nativeElement;
        const badge = el.querySelector<HTMLElement>('.render-count');
        if (badge) badge.textContent = String(this.renders);
        el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
      }));
    }
    return '';
  }
}
```

Le compteur est écrit **directement dans le DOM** (pas via binding) pour éviter `ExpressionChangedAfterItHasBeenChecked`.

`LabComponent` (page, `Default`) : possède `person = { name: 'Ada', clicks: 0 }`, `tick = 0`, et un `@HostListener('document:mousemove')` **vide** (juste pour prouver qu'un événement quelconque déclenche CD dans toute l'app). Affiche côte à côte `<zn-default-card [person]="person">` et `<zn-onpush-card [person]="person">`. Boutons de la page (`.lab-actions`) :

1. « Muter l'objet (person.clicks++) » → seul Default se rafraîchit.
2. « Remplacer la référence ({...person}) » → les deux.
3. « setTimeout hors template (tick++) » → Default seul (zone.js détecte le timer).
4. « Événement dans l'enfant » (bouton **à l'intérieur** de chaque carte, incrémente un champ local) → la carte cliquée se rafraîchit (OnPush aussi, car l'événement vient de sa vue).
5. « runOutsideAngular + tick++ » → rien ne bouge ; bouton « Détecter maintenant (appRef.tick()) » pour rattraper.
6. « markForCheck() sur OnPush » (bouton dans la carte OnPush) → la carte OnPush se rafraîchit au prochain CD.

Chaque carte : `.lab-card.default|onpush`, `<div class="render-count">0</div>`, `.render-label` « rendus du template », affiche `person.name`, `person.clicks`, `local`, `{{ counter.track() }}`, et un `.lab-log` (les 10 derniers événements, tenu par le `LabComponent` et passé en `@Input() log: string[]`).

**Steps :**

- [ ] A1 Renommages + shell (header/nav/badge/footer), routes lazy vides, suppression de `nx-welcome`, `serve.dependsOn` api. Build + commit.
- [ ] A2 `core/` (token, interceptor classe, services API) + `shared/` (directive, pipe + spec, chip). Test + commit.
- [ ] A3 `store/` (actions, reducer + spec, selectors, effects, tags) branché dans `AppModule` avec devtools. Test + commit.
- [ ] A4 Feature `todos` : liste (Default, async pipe, animations DSL), item (OnPush), formulaire Reactive Forms, resolver, guard. Build + commit.
- [ ] A5 Features `stats` et `about`. Build + commit.
- [ ] A6 Feature `lab` (RenderCounter, deux cartes, page) + spec OnPush. Build + test + lint + commit.
- [ ] A7 Vérification SSR : `pnpm nx build todo-zone` puis `PORT=4000 node dist/apps/todo-zone/server/server.mjs` avec l'api lancée ; `curl -s localhost:4000/todos | grep -c todo-item` > 0. Corriger si besoin (ex. `window`/`document` protégés par `isPlatformBrowser`). Commit.

---

## Task B: `apps/todo-zoneless` — app moderne (zoneless, signals)

Style de code **moderne** : fichiers sans suffixe de rôle (`todo-list.ts`, `todo-store.ts`, `todo-api.ts`), classes sans suffixe (`TodoList`, `TodoStore`), `inject()`, `input()/output()/model()`, `@if/@for/@switch/@defer`, `computed`, `linkedSignal`, `httpResource`, `signalStore`, Signal Forms (`@angular/forms/signals`), `animate.enter/leave`, `ChangeDetectionStrategy.OnPush` partout, `host: {}` au lieu de `@HostBinding`. Aucune souscription manuelle, aucun `async` pipe.

**Files (à créer sous `apps/todo-zoneless/src/app/`) :**

- `app.ts|html` : shell + header + `<router-outlet />` + footer ; badge `zoneless`. Supprimer `nx-welcome.ts`.
- `app.config.ts` : `provideClientHydration(withEventReplay(), withIncrementalHydration())`, `provideBrowserGlobalErrorListeners()`, `provideRouter(appRoutes, withComponentInputBinding(), withViewTransitions())`, `provideHttpClient(withFetch(), withInterceptors([latencyInterceptor]))`.
- `core/api-url.ts` : `API_URL`, `DEMO_LATENCY_MS` (mêmes noms que legacy).
- `core/latency-interceptor.ts` : `export const latencyInterceptor: HttpInterceptorFn = (req, next) => next(req).pipe(delay(inject(DEMO_LATENCY_MS)));`
- `core/todo-api.ts` : `@Injectable({ providedIn: 'root' }) TodoApi` — mutations uniquement (`create`, `update`, `remove`) via `HttpClient` (Observables consommés par `rxMethod`) ; `getAll()` aussi (utilisé par le store).
- `core/tags-store.ts` : `@Injectable({ providedIn: 'root' }) TagsStore { readonly tags = httpResource<Tag[]>(() => \`${this.api}/tags\`, { defaultValue: [] }); readonly byId = computed(() => new Map(this.tags.value().map(t => [t.id, t]))); }` — montre `httpResource`.
- `store/todo-store.ts` : `export const TodoStore = signalStore({ providedIn: 'root' }, withEntities<Todo>(), withState<{ filter: TodoFilter; search: string; status: 'idle'|'loading'|'loaded'|'error'; error: string | null }>({...}), withComputed(({ entities, filter, search }) => ({ filtered: computed(...), stats: computed((): TodoStats => ...) })), withMethods((store, api = inject(TodoApi)) => ({ setFilter(f), setSearch(s), load: rxMethod<void>(pipe(tap(() => patchState(store, { status: 'loading' })), switchMap(() => api.getAll().pipe(tapResponse({ next: todos => patchState(store, setAllEntities(todos), { status: 'loaded' }), error: (e: Error) => patchState(store, { status: 'error', error: e.message }) }))))), add: rxMethod<TodoDraft>(...) → addEntity, toggle: rxMethod<string>(…) → mise à jour **optimiste** via updateEntity puis rollback en cas d'erreur, update: rxMethod<{ id; changes }>(…), remove: rxMethod<string>(…) → removeEntity })), withHooks({ onInit(store) { store.load(); } }))`. `tapResponse` vient de `@ngrx/operators`.
- `app.routes.ts` : `loadChildren: () => import('./features/todos/todos.routes')` (export default), `loadComponent` pour `stats`, `lab`, `about`.
- `features/todos/todos.routes.ts` : `''`→`TodoList`, `new`→`TodoForm`, `:id`→`TodoForm` avec `resolve: { todo: todoResolver }` et `canDeactivate: [unsavedChangesGuard]`.
- `features/todos/todo-list.ts|html` : `store = inject(TodoStore)`, `tags = inject(TagsStore)`, `@switch (store.status())`, `@for (todo of store.filtered(); track todo.id) { <zl-todo-item animate.enter="enter-anim" animate.leave="leave-anim" … /> } @empty { … }`. Recherche via `(input)` → `store.setSearch`.
- `features/todos/todo-item.ts|html` : `todo = input.required<Todo>()`, `tagsById = input<Map<string, Tag>>(new Map())`, `toggled = output<string>()`, `removed = output<string>()`, `host: { '[class.done]': 'todo().done' }`, directive `zlOverdue`.
- `features/todos/todo-form.ts|html` : Signal Forms. `model = signal<TodoFormModel>({ title: '', description: '', priority: 'medium', dueDate: '', done: false, tags: [] as string[] })`, `todoForm = form(this.model, s => { required(s.title, { message: 'Le titre est requis' }); minLength(s.title, 3, { message: '3 caractères minimum' }); required(s.dueDate, { message: "L'échéance est requise" }); })`. Tags : cases à cocher gérées **hors** du form (signal `selectedTags` + `toggleTag(id)`) car `[formField]` ne binde pas un `string[]` sur des checkboxes. Pré-remplissage en édition depuis `todo = input<Todo>()` (route data via `withComponentInputBinding`) dans le constructeur (`if (todo) this.model.set(...)`) — **pas** dans un `effect`. Soumission : `submit(this.todoForm, async () => { …store.add / store.update…; this.saved = true; await this.router.navigate(['/todos']); })`. `canLeave = () => this.saved || !this.todoForm().dirty()`.
- `features/todos/todo-resolver.ts` : `ResolveFn<Todo>` via `HttpClient` + `catchError` → `RedirectCommand(router.parseUrl('/todos'))`.
- `features/todos/unsaved-changes-guard.ts` : `CanDeactivateFn<TodoForm>`.
- `features/stats/stats.ts|html` : `stats = computed(() => this.store.stats())`; bloc `@defer (hydrate on viewport) { <zl-priority-breakdown /> } @placeholder { … }` pour montrer l'hydratation incrémentale.
- `features/lab/lab.ts|html`, `features/lab/signal-card.ts|html`, `features/lab/render-counter.ts`.
- `features/about/about.ts|html`.
- `shared/overdue.ts` : `@Directive({ selector: '[zlOverdue]', host: { '[class.overdue]': 'isOverdue()' } }) export class Overdue { todo = input.required<Todo>({ alias: 'zlOverdue' }); isOverdue = computed(...) }`.
- `shared/relative-due.ts` : `@Pipe({ name: 'relativeDue' }) export class RelativeDue`.
- `shared/tag-chip.ts` : `zl-tag-chip`, `color = input.required<string>()`, `host: { '[style.background]': 'color()', class: 'tag' }`, `<ng-content />`.
- `app.routes.server.ts` : `about` Prerender, `**` Server.
- Tests : `todo-store.spec.ts` (avec `provideHttpClient()` + `provideHttpClientTesting()` : `load` remplit `entities()`, `setFilter('done')` filtre), `relative-due.spec.ts`, `signal-card.spec.ts` (mise à jour d'un signal → DOM mis à jour après `await fixture.whenStable()` ; mutation d'un champ non-signal → pas de mise à jour), `app.spec.ts` (badge `zoneless`).

**Labo CD (todo-zoneless) :**

Même `RenderCounter` que legacy mais sans `NgZone` (queueMicrotask direct). Page `Lab` avec trois cartes `.lab-card.signals` et un `.lab-log` :

1. Carte « Signal » : `count = signal(0)` ; bouton « count.update(c => c + 1) » → seule cette carte se rafraîchit.
2. Carte « Piège : champ non-signal » : `plain = 0` ; bouton « setTimeout(() => plain++) » → **rien** ne change (le compteur de rendu ne bouge pas, la valeur affichée reste) ; bouton « idem + markForCheck() » → se rafraîchit ; texte explicatif.
3. Carte « Événements » : `moves = signal(0)` ; `(mousemove)` **dans le template** de la carte incrémente le signal → rafraîchit ; un `document.addEventListener('mousemove')` posé manuellement dans `afterNextRender` qui incrémente un champ plain → n'a aucun effet visible.

Chaque bouton loggue une ligne (« signal.update → 1 carte re-rendue ») dans le `.lab-log`. Un bouton « Tout réinitialiser ».

**Steps :**

- [ ] B1 Shell + config (hydratation incrémentale, HttpClient, router features), routes lazy vides, suppression `nx-welcome`, `serve.dependsOn` api. Build + commit.
- [ ] B2 `core/` (token, interceptor fonctionnel, `TodoApi`, `TagsStore` httpResource) + `shared/` (directive, pipe + spec, chip). Test + commit.
- [ ] B3 `store/todo-store.ts` + spec. Test + commit.
- [ ] B4 Feature `todos` : liste, item, formulaire Signal Forms, resolver, guard. Build + commit.
- [ ] B5 Features `stats` (avec `@defer hydrate`) et `about`. Build + commit.
- [ ] B6 Feature `lab` + spec. Build + test + lint + commit.
- [ ] B7 Vérification SSR : `pnpm nx build todo-zoneless` puis `PORT=4001 node dist/apps/todo-zoneless/server/server.mjs` avec l'api lancée ; `curl -s localhost:4001/todos | grep -c todo-item` > 0 et présence de `ngh` (hydratation) dans le HTML. Commit.

---

## Task C: Partie IA (`.mcp.json`, `playground/`, `docs/demo-ai-tutor.md`)

- [ ] C1 `.mcp.json` racine : serveur `angular-cli` (`npx -y @angular/cli mcp`).
- [ ] C2 `playground/` : `pnpm dlx @angular/cli@22 new playground --skip-git --skip-install --style=scss --ssr=false` puis `pnpm install` dedans (hors workspace pnpm : ajouter `playground` à `.gitignore` sauf `README.md` ? Non : versionner le projet sans `node_modules`).
- [ ] C3 `docs/demo-ai-tutor.md` : script de démo (pré-requis, lancement du tutor, commandes « Set my experience level… », `onpush_zoneless_migration` sur `apps/todo-zone`, `get_best_practices`, plan B si le live échoue).

## Task D: Slides (`apps/slides/slides.md`)

- [ ] D1 Deck Slidev thème seriph, français, ~45 min, sections 1→10 de la spec, blocs de code côte à côte (legacy vs moderne) extraits des vraies apps, slides « DÉMO » pointant vers `localhost:4200/lab`, `localhost:4201/lab`, etc., tableau pros/cons, frise chronologique.
- [ ] D2 `pnpm nx build slides` vert.

## Task E: Documentation racine

- [ ] E1 `README.md` : objectif, prérequis, `pnpm install`, `pnpm demo`, ports, structure, commandes utiles, déroulé de la démo, lien vers la spec et les pros/cons.
- [ ] E2 `docs/pros-cons.md` : tableau comparatif complet (moteur CD, état, formulaires, HTTP, SSR, tests, DX).
