---
theme: seriph
background: https://cover.sli.dev
title: "Angular Workshop 1 : 10 ans d'évolution, de zone.js aux signals"
info: |
  ## Angular Workshop
  Une même todo-list, deux moteurs : zone.js / NgModules / NgRx classique vs zoneless / signals / signalStore.
  SSR sur les deux, exploration avec Chrome DevTools, et un détour par angular.dev/ai (MCP, skill, AI Tutor).
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
duration: 90min
---

# Angular Workshop 1

## 10 ans d'évolution, de zone.js aux signals

<div class="pt-8 text-sm opacity-75">
Nx · zone.js · zoneless · DevTools · SSR · NgRx · RxJS · IA
</div>

<div class="abs-br mx-6 mb-10 text-xs opacity-60">
Angular 22 · Nx 23 · 1er octobre 2026
</div>

<!--
Merci à tous d'être venu
Bienvenu à ce premier Workshop Angular.
Préciser temps du workshop et programme : 1h 1h30
-->

---
layout: center
class: text-center
---

# Pourquoi cette présentation ?

<img src="/why-just-why.gif" alt="Barack Obama : « Why? Just why? »" class="mx-auto mt-8 h-36 rounded-lg shadow-lg" />

---
layout: two-cols
layoutClass: gap-8
class: dense
---

# Parce que

<ul>
  <li><b>La réalité d'une application business</b> : Du code de 2017 <i>et</i> de 2026 doivent cohabiter, compiler et se déployer ensemble.</li>
  <li v-click><b>Comprendre le « pourquoi »</b> des changements, pas seulement le « comment » : signals, zoneless, Nx.</li>
  <li v-click><b>Vérifier au lieu de deviner</b> : Chrome DevTools et Angular DevTools montrent ce que fait vraiment l'app (rendus, réseau, perf, CSS).</li>
  <li v-click><b>Les IA ont appris sur 10 ans de code Angular</b> : surtout du NgModule, du <code>*ngIf</code> et du <code>subscribe()</code>, rarement les pratiques récentes. À nous de juger ce qu'elles génèrent.</li>
</ul>

::right::

<div class="mt-2">

<v-click>

### Ce que vous emporterez

- La **maîtrise de DevTools** sur une vraie app Angular : Profiler, Performance, Network (throttling, mocks), CSS.
- Deux apps **au périmètre identique**, écrites comme en 2018 et comme en 2026, à ouvrir côte à côte.
- Un **chemin de migration** incrémental, étape par étape.
- Les **outils IA** officiels d'Angular (skill, MCP, AI Tutor) pour apprendre le reste par vous-mêmes.
- **Toute la codebase et ces slides** : le monorepo complet (apps, API, docs).

</v-click>

<v-click>

<div class="mt-4 p-3 rounded bg-sky-500/10 border border-sky-500/40 text-sm">
On ne cherche pas à tout retenir. On cherche à savoir <b>où regarder</b> : dans le code, et dans le navigateur.
</div>

</v-click>

</div>

<!--
Poser le cadre dès la première minute :
- Ce qu'on ne trouve pas en ligne, c'est la réalité d'une base de code d'entreprise : du code de plusieurs époques, des libs tierces, une migration qui ne peut pas être un big bang, et des choix d'architecture (monorepo, frontières, SSR) qui dépassent le framework.
- D'où le dispositif : deux apps identiques fonctionnellement, écrites dans deux styles, dans un seul monorepo Nx. On compare, on mesure, on discute les compromis.
- DevTools : c'est le cœur pratique du workshop (section 3, puis la chasse aux pièges en binôme).
- Dernière puce : on y reviendra en fin de talk (« L'IA code comme en 2019 »). Savoir lire les deux styles, c'est aussi savoir relire ce que produit un agent.
-->

---
layout: two-cols
layoutClass: gap-8
class: dense
---

# Préparer son poste

On va manipuler le dépôt ensemble : autant l'installer **maintenant**.

| | Outil | ID Marketplace |
| --- | --- | --- |
| IDE | **VS Code** | |
| Extension | **Claude Code** | `anthropic.claude-code` |
| Extension | **Nx Console** | `nrwl.angular-console` |
| Extension | **Live Share** | `ms-vsliveshare.vsliveshare` |
| Navigateur | **Chrome** ou **Firefox** | |
| Navigateur | **Angular DevTools** | Chrome · Firefox |

<div class="mt-3 text-sm opacity-80">
À l'ouverture du dépôt, VS Code propose d'installer ses extensions (<code>.vscode/extensions.json</code>).
</div>

::right::

### Récupérer le projet

```bash
git clone https://github.com/antoine-betclic/angular-workshop
cd angular-workshop
mise install   # node 24.21.0 (Angular 22 : node ≥ 22.22)
pnpm install
```

<v-clicks>

- **Nx Console** : générateurs et tâches en clic droit, graphe du projet.
- **Claude Code** : l'agent qu'on utilisera avec le skill et le MCP Angular.
- **Live Share** : suivre mon écran et le code des démos directement dans votre éditeur.
- **Chrome** conseillé pour l'atelier DevTools : démos faites dans Chrome, piste Angular du panneau Performance réservée à Chromium. Angular DevTools existe aussi pour Firefox.

</v-clicks>

<!--
À afficher pendant que la salle s'installe. Le but : que tout le monde ait cloné et lancé `pnpm install` avant les démos, pour pouvoir lancer les apps (`pnpm demo`) en local.

Pas de mise ? Installer Node 24 à la main. pnpm s'installe globalement (hors mise).
-->

---
layout: two-cols
layoutClass: gap-8
class: dense
---

# Avant Angular : le web

<ul>
  <li v-click="1"><b>1995–2003</b> : des pages HTML servies par le serveur. Chaque clic recharge la page.</li>
  <li v-click="2"><b>2004–2006</b> : AJAX. La page se met à jour sans rechargement (Gmail, Google Maps). YouTube 2005 tourne encore sur Flash.</li>
  <li v-click="4"><b>2010</b> : AngularJS. Le navigateur devient une application : les SPA.</li>
  <li v-click="5"><b>2016–2026</b> : de gros bundles JS… puis le retour du HTML rendu côté serveur, <b>hydraté</b> au lieu d'être reconstruit.</li>
</ul>

<v-click at="6">

<div class="mt-4 text-sm opacity-80">
La boucle se referme : la section SSR de ce talk, c'est le web de 2000, avec l'interactivité en plus.
</div>

</v-click>

<div class="mt-4 text-xs opacity-70">
<a href="https://www.webdesignmuseum.org/" target="_blank">webdesignmuseum.org</a> ·
<a href="https://www.webdesignmuseum.org/gallery/amazon-1995" target="_blank">Amazon 1995</a> ·
<a href="https://www.webdesignmuseum.org/gallery/google-1998" target="_blank">Google 1998</a> ·
<a href="https://www.webdesignmuseum.org/gallery/facebook-2004" target="_blank">Thefacebook 2004</a> ·
<a href="https://www.webdesignmuseum.org/gallery/youtube-2005" target="_blank">YouTube 2005</a> ·
<a href="https://www.webdesignmuseum.org/gallery/youtube-2010" target="_blank">YouTube 2010</a> ·
<a href="https://www.webdesignmuseum.org/gallery/youtube-in-2026" target="_blank">YouTube 2026</a>
</div>

::right::

<div class="stack">
  <figure v-click="[1, 2]"><img src="/web-amazon-1995.png" alt="Amazon.com en 1995" /><figcaption>Amazon, 1995</figcaption></figure>
  <figure v-click="[2, 3]"><img src="/web-youtube-2005.png" alt="YouTube en 2005" /><figcaption>YouTube, 2005</figcaption></figure>
  <figure v-click="[4, 5]"><img src="/web-youtube-2010.png" alt="YouTube en 2010" /><figcaption>YouTube, 2010</figcaption></figure>
  <figure v-click="5"><img src="/web-youtube-2026.jpg" alt="YouTube en 2026" /><figcaption>YouTube, 2026</figcaption></figure>
</div>

<div v-click="[3, 4]" class="video-modal">
  <SlidevVideo v-click="[3, 4]" autoplay autoreset="slide" muted loop playsinline>
    <source src="/ajax-demo.webm" type="video/webm" />
  </SlidevVideo>
</div>

<style>
.video-modal { position: fixed; inset: 0; z-index: 20; display: flex; align-items: center; justify-content: center; padding: 1.5rem; background: rgba(0,0,0,0.85); }
.video-modal video { max-width: 100%; max-height: 100%; object-fit: contain; border-radius: 6px; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
.stack { display: grid; }
.stack > * { grid-area: 1 / 1; margin: 0; }
.stack img { width: 100%; height: 24rem; object-fit: cover; object-position: top; border-radius: 6px; box-shadow: 0 4px 16px rgba(0,0,0,0.25); }
.stack figcaption { text-align: center; font-size: 0.75rem; opacity: 0.7; margin-top: 0.4rem; }
</style>

<!--
Moment détente, 2 minutes max. Une capture par puce ; les liens en bas ouvrent les pages d'origine si besoin.

Ajax : Asyncrhonous Javascript And XML

Message : chaque génération de framework répond à une contrainte de son époque. AngularJS répondait à « faire une appli dans le navigateur » ; Angular 22 répond à « le faire sans envoyer 2 Mo de JS ».
-->

---

# D'AngularJS à Angular 22

<div class="timeline">
  <div v-click class="tl"><b>2010</b> AngularJS · dirty checking, <code>$scope.$apply</code></div>
  <div v-click class="tl"><b>2016 · v2</b> réécriture TypeScript, <b>zone.js</b>, NgModules, RxJS</div>
  <div v-click class="tl"><b>2020 · v9</b> Ivy : compilation locale, tree-shaking, <code>@Component</code> plus léger</div>
  <div v-click class="tl"><b>2022 · v14–15</b> standalone components, <code>inject()</code>, guards fonctionnels</div>
  <div v-click class="tl"><b>2023 · v16–17</b> <b>signals</b> (preview), <code>@if/@for</code>, <code>@defer</code>, SSR + hydratation, angular.dev</div>
  <div v-click class="tl"><b>2024 · v18–19</b> zoneless expérimental, standalone par défaut, <code>linkedSignal</code>, <code>resource</code></div>
  <div v-click class="tl"><b>2025 · v20–21</b> signals stables, <b>zoneless stable</b>, <code>httpResource</code>, Signal Forms (exp.), MCP</div>
  <div v-click class="tl now"><b>2026 · v22</b> Signal Forms stables, <b>OnPush par défaut</b>, resource APIs stables, Angular Aria, WebMCP</div>
</div>

<style>
.timeline { display: grid; gap: 0.45rem; margin-top: 1rem; }
.tl { border-left: 4px solid #dd0031; padding: 0.35rem 0.8rem; background: rgba(255,255,255,0.04); border-radius: 0 8px 8px 0; }
.tl.now { border-left-color: #22c55e; background: rgba(34,197,94,0.08); }
</style>

<!--
Angular sortait une version tous les 6 mois.

Point clé : deux ruptures de paradigme, 2016 (zone.js + RxJS) et 2023-2026 (signals + zoneless). Tout le reste est incrémental.

En dehors des dates et des versions, ce qu'il a a retenir c'est ce que qui est en gras : 
Avant Zone.js

Maintenant : signals, zoneless et onPush par défaut

Angular sortait une version tous les 6 mois. Ils ont annoncé récemment qu'ils allaient arrêter de faire ça.

Mauvaise nouvelle : "Si vous avez appris Angular avant 2023, la moitié de ce que vous savez sur le rendu a changé."
-->

---
layout: center
class: text-center
---

# Si vous avez appris Angular avant 2023, la moitié de ce que vous avez appris a changé.

<img src="/this-is-fine.gif" alt="This is fine : un chien boit son café dans une pièce en feu" class="mx-auto mt-8 h-64 rounded-lg shadow-lg" />

<!--
Laisser le GIF tourner deux secondes. Enchaîner : « Bonne nouvelle : tout n'a pas brûlé. »
-->

---

# Ce qui n'a jamais changé

<div class="grid grid-cols-2 gap-8 mt-2">
<div>

<!-- clics explicites : le clic 3 annote le template, le clic 6 surligne la 2e route, le clic 8 affiche le GIF sous l'erreur TS -->
<ul>
  <li v-click="1"><b>Le composant</b> comme unité : une classe, un template, des styles, un sélecteur.</li>
  <li v-click="2"><b>Templates déclaratifs</b> : le HTML décrit l'état, le framework se charge du DOM.</li>
  <li v-click="4"><b>L'injection de dépendances</b> hiérarchique, du root aux composants.</li>
  <li v-click="5"><b>Le router</b> : routes, lazy loading, guards, resolvers.</li>
  <li v-click="7"><b>TypeScript first</b> et un <b>compilateur</b> (AOT) qui vérifie les templates.</li>
  <li v-click="9"><b>Une CLI</b> qui génère, migre (<code>ng update</code>) et construit.</li>
  <li v-click="10"><b>Une plateforme complète</b> : formulaires, HTTP, i18n, SSR, tests, a11y.</li>
</ul>

</div>
<div class="stack">

<div v-click="[1, 2]">

```ts
@Component({
  selector: 'zl-todo-item',
  templateUrl: './todo-item.html',
  styleUrl: './todo-item.scss',
})
export class TodoItem {
  readonly todo = input.required<Todo>();
}
```

</div>
<div v-click="[2, 4]">

<!-- bloc HTML écrit à la main (pas Shiki) pour pouvoir annoter les bindings -->
<pre class="slidev-code bindings"><code><span class="t">&lt;li</span> <span v-mark="{ at: 3, type: 'circle', color: 'orange', padding: 10 }" class="a">[class.done]</span>=<span class="s">"todo().done"</span><span class="t">&gt;</span>
  <span v-pre>{{ todo().title }}</span>
  <span class="t">&lt;button</span> <span v-mark="{ at: 3, type: 'circle', color: 'blue', padding: 10 }" class="a">(click)</span>=<span class="s">"toggled.emit(todo().id)"</span><span class="t">&gt;</span>✓<span class="t">&lt;/button&gt;</span>
<span class="t">&lt;/li&gt;</span></code></pre>

</div>
<div v-click="[4, 5]">

```ts
@Injectable({ providedIn: 'root' }) // une instance pour l'app
export class TodoApi {}

@Component({
  providers: [FormState], // une instance par composant
})
export class TodoForm {
  private readonly api = inject(TodoApi);
}
```

</div>
<div v-click="[5, 7]">

```ts {2-3|4-6}{at:6}
export const routes: Routes = [
  { path: 'todos',
    loadChildren: () => import('./todos/todos.routes') },
  { path: 'todos/:id', component: TodoForm,
    resolve: { todo: todoResolver },
    canDeactivate: [unsavedChangesGuard] },
];
```

</div>
<div v-click="[7, 9]">

```html
<!-- todo = input.required<Todo>() -->
<p>{{ todo().titel }}</p>
```

```text
error TS2551: Property 'titel' does not exist
on type 'Todo'. Did you mean 'title'?
```

<img v-click="8" src="/think-about-it-npe.gif" alt="Roll Safe : « We can't have NPE if NPE can't exist »" class="block mx-auto mt-3 h-44 rounded shadow-lg" />

</div>
<div v-click="[9, 10]">

```bash
ng new todo-app
ng generate component todo-item
ng update @angular/core @angular/cli
ng build
```

</div>
<div v-click="[10, 11]">

```ts
import { form } from '@angular/forms/signals';
import { httpResource } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideServerRendering } from '@angular/ssr';
import { TestBed } from '@angular/core/testing';
import '@angular/localize/init';
import { LiveAnnouncer } from '@angular/cdk/a11y';
```

</div>
<div v-click="11">

Ce qui a changé, c'est le **comment** :

| Principe | 2016 | 2026 |
| --- | --- | --- |
| Composant | NgModule + déclarations | standalone, `imports` locaux |
| Template | `*ngIf`, `*ngFor` | `@if`, `@for`, `@defer` |
| DI | constructeur | `inject()` |
| Réactivité | zone.js + RxJS | signals (+ RxJS ciblé) |
| Rendu | `tick()` global | graphe de signaux |
| Formulaires | `FormGroup` | `form(signal)` |
| Données | `Observable` | `resource` / `httpResource` |

</div>

</div>
</div>

<style>
/* les exemples se superposent au lieu de s'empiler */
.stack { display: grid; }
.stack > * { grid-area: 1 / 1; }
/* annotations des bindings [ ] et ( ) */
.bindings { padding: 1em; line-height: 2.4; }
.bindings .t { color: #4d9375; }
.bindings .a { color: #bd976a; }
.bindings .s { color: #c98a7d; }
</style>

<!--
Bonne Nouvelle : Angular n'a pas changé de philosophie : framework complet, opiniâtre, orienté grandes équipes. Il a changé de moteur et de syntaxe. C'est pour ça que la migration reste incrémentale : les concepts se retrouvent d'un style à l'autre.
-->

---
layout: section
---

# Architecture : un monorepo Nx pour comparer

---
layout: two-cols
layoutClass: gap-8
class: dense
---

# Le terrain de jeu

Un monorepo **Nx 23**, **Angular 22.1** partout :

<!-- surlignage synchronisé avec les puces de droite (clics 1 à 4) -->
```text {all|2-6|10-12|2-6,10-12|7}{at:1}
apps/
  todo-zone/      zone.js · NgModules · Default/OnPush
                  @ngrx/store · Reactive Forms · SSR
  todo-zoneless/  zoneless · standalone · signals
                  @ngrx/signals · Signal Forms · httpResource
                  SSR + hydratation incrémentale
  api/            json-server (/todos, /tags, /quiz)
  quiz/           le quiz de ce talk (zoneless, httpResource)
  slides/         ce deck
libs/shared/
  models/         Todo, Tag, TodoStats
  styles/         même CSS → seul le moteur change
```

<div class="mt-3 text-sm opacity-75">
Même périmètre fonctionnel : liste + filtres, formulaire, stats, routing lazy, guard, resolver, directive, pipe, interceptor, animations, tests.
</div>

::right::

# Pourquoi Nx ici

<v-clicks>

- **Deux apps, un install** : mêmes versions d'Angular, NgRx, TypeScript. On compare le code, pas les versions.
- **Partager le strict minimum** : `shared/models` (types) et `shared/styles` (CSS). Le reste est dupliqué **volontairement**.
- **Frontières explicites** : tags `scope:*` + `@nx/enforce-module-boundaries`. L'app legacy ne peut pas importer un signalStore par accident.
- **Un backend pour deux** : `apps/api` est une tâche continue, démarrée automatiquement par `nx serve`.

</v-clicks>

<!--
Attention : Un MonoRepo n'est pas un Monolithe !!!!
-->

---
layout: center
---

<img src="/nx-monorepo-vs-polyrepo.png" alt="Nx Monorepo vs Polyrepo : Frontend, Backend et Design System dans un seul dépôt Nx, ou chacun dans son propre dépôt GitHub" class="mx-auto max-h-[28rem] rounded-lg shadow-lg" />

<!--
Monorepo : un dépôt, un graphe de dépendances connu de Nx, des changements atomiques entre front, back et design system.
Polyrepo : un dépôt par projet, les dépendances passent par des versions publiées.
-->

---
class: dense
---

# Nx en pratique dans ce dépôt

<div class="grid grid-cols-2 gap-6">
<div>

### Générer les deux apps

```bash
nx g @nx/angular:application apps/todo-zone \
   --standalone=false --zoneless=false --ssr --prefix=zn
nx g @nx/angular:application apps/todo-zoneless \
   --standalone --zoneless --ssr --prefix=zl
nx g @nx/angular:library libs/shared/models --tags=scope:shared
```

### Frontières

```js {2|3-4|5-6|7-8|all}
// eslint.config.mjs
'@nx/enforce-module-boundaries': ['error', { depConstraints: [
  { sourceTag: 'scope:shared', onlyDependOnLibsWithTags:
    ['scope:shared'] },
  { sourceTag: 'scope:zone', onlyDependOnLibsWithTags:
    ['scope:zone', 'scope:shared'] },
  { sourceTag: 'scope:zoneless', onlyDependOnLibsWithTags:
    ['scope:zoneless', 'scope:shared'] },
]}]
```

</div>
<div>

### Tâches inférées et orchestrées

```jsonc
// project.json (todo-zone)
"serve": {
  "continuous": true,
  "dependsOn": [{ "projects": ["api"], "target": "serve" }]
}
```

- `build`, `test` (Vitest via Analog), `lint` sont **inférés** par les plugins `@nx/vite`, `@nx/vitest`, `@nx/eslint`.
- **Cache** : `nx run-many -t build test lint` ne rejoue que ce qui a changé ; `nx affected` sur une PR.
- **SSR par app** : chaque app a son `server.ts` Express, son `RenderMode` par route, son port.
- Le graphe : `nx graph`.

<div class="mt-3 text-xs opacity-70">
Piège : <code>nx reset</code> vide le cache Nx. Pour la cible du projet : <code>nx run api:reset</code>.
</div>

</div>
</div>

<!--
Point à faire passer : Nx n'est pas là pour la démo, il est là parce que c'est comme ça qu'on structure une vraie base Angular multi-apps : frontières, tâches, cache. Montrer `nx graph` si le temps le permet.
-->

---
layout: two-cols
layoutClass: gap-6
class: dense
---

# Place à la pratique : Angular AI Tutor

Il est temps de passer à la pratique : allons à la rencontre d'**Angular AI Tutor**.

<v-clicks>

1. Créez une nouvelle branche :
   ```bash
   git checkout -b mysuperbranch
   ```
2. Générez une application avec **votre trigramme** :
   ```bash
   nx g @nx/angular:application apps/smart-recipe-abe \
      --standalone --zoneless --ssr --prefix=abe
   ```
3. Dans votre IA favorite (Claude Opus 5.5) :
   ```text
   lance le tuteur Angular dans <projet>
   ```
4. Choisissez votre niveau : **0 · Beginner** est le plus verbeux, mais celui qui explique le mieux. Vous pourrez l'ajuster ensuite.
5. Un commit après chaque module accompli :
   ```bash
   git commit -m "Complete Phase 1, Module 3"
   ```

</v-clicks>

::right::

<img src="/angular-tutor-mascot.png" alt="Mascotte Angular : un personnage rose en forme d'hexagone qui fait coucou" class="mx-auto mt-8 h-56" />

<v-click>

<div class="mt-6 p-3 rounded bg-pink-500/10 border border-pink-500/40 text-sm">
<b>Objectif</b> : réaliser les <b>deux premières phases</b> (fondamentaux, état et signals).<br/>
Vous pouvez lui demander de s'exprimer en français.
</div>

</v-click>

<div class="mt-4 text-xs opacity-70">
Source : <a href="https://angular.dev/ai/ai-tutor" target="_blank">angular.dev/ai/ai-tutor</a>
</div>

<!--
Le tuteur part d'un projet neuf : d'où la nouvelle app par personne. Sur un projet existant (todo-zoneless), il saute le pas-à-pas et propose directement la table des matières.

Le tuteur ne modifie pas les fichiers pendant une leçon : c'est le participant qui code, le tuteur relit.
-->

---
layout: center
---

<div class="grid grid-cols-2 gap-8 items-center">
<div>

<img src="/presentation-done.png" alt="Mème : « The presentation is done! Thanks for your attention! », un homme en costume bras écartés devant des montagnes" class="rounded-lg shadow-lg" />

</div>
<div>

# Merci à tous de votre participation !

<v-clicks>

- Avez-vous des **questions** ?
- Quelles sont vos **idées**, vos **envies**, vos **remarques** pour une prochaine session ?
- N'hésitez pas à me faire part de vos **feedbacks** par message.

</v-clicks>

<div class="text-sm opacity-70 mt-6">
Angular Workshop · Nx 23 · Angular 22.1 · Slidev
</div>

</div>
</div>

---
hide: true
---

# Une contrainte assumée pour cette démo

<v-clicks>

- Un workspace Nx = **une seule version d'Angular**.
- Les deux apps tournent donc sur **Angular 22.1**.
- `todo-zone` est écrite **volontairement à l'ancienne** : NgModules, `*ngIf`, `| async`, `@Input()`, `HTTP_INTERCEPTORS`, `FormBuilder`, actions/reducers/effects.
- Même API, même CSS, mêmes écrans : seul le moteur change.

</v-clicks>

```ts {all|4-5}
@Component({
  selector: 'zn-todo-list',
  standalone: false,
  // v22 : OnPush est le défaut, Default (= Eager) doit être explicite
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './todo-list.component.html',
})
export class TodoListComponent {}
```

<!--
Message n°1 : tout ce code compile encore en v22. Angular a changé de moteur sans casser l'existant, c'est ce qui rend la comparaison possible dans un seul workspace.

Message n°2 : depuis v22, un composant sans `changeDetection` explicite est OnPush. `Default` n'est plus qu'un alias déprécié de `Eager`. L'app legacy doit donc l'écrire noir sur blanc, sinon le labo de change detection ne montrerait rien (c'est le commentaire de la ligne 4-5).
-->

---
hide: true
class: dense
---

# Trois pièges v22 rencontrés en écrivant l'app « à l'ancienne »

<div class="text-sm opacity-70 -mt-2 mb-1">Ce qu'il a fallu ajouter pour que le « vieux » code se comporte encore comme avant.</div>

<div class="grid grid-cols-3 gap-4">
<div v-click>

### 1. zone.js chargé ≠ zone.js utilisé

```ts
// app.module.ts
providers: [
  // sinon : zoneless, même avec zone.js
  provideZoneChangeDetection(
    { eventCoalescing: true }),
]
```

`BrowserModule` ne fournit plus `NgZone`, même avec `bootstrapModule`. Idem en test : `setupTestBed({ zoneless: false })` ne suffit plus.

</div>
<div v-click>

### 2. Champs de classe

```json
// tsconfig.json
"useDefineForClassFields": false
```

Absent du template CLI. Sans lui :

```ts
load$ = createEffect(() =>
  this.actions$.pipe(/* … */));
// TypeError: … reading 'pipe'
```

Le champ est initialisé **avant** le constructeur : `this.actions$` n'existe pas encore.

</div>
<div v-click>

### 3. SSR : protection SSRF

```ts
// server.ts
new AngularNodeAppEngine({
  allowedHosts: ['localhost'],
});
// ou project.json →
// build.options.security.allowedHosts
```

Sinon : `400 Header "host" … is not allowed` sur `node server.mjs`.

</div>
</div>

<v-click>

<div class="mt-2 text-center text-sm opacity-80">
Moralité : « le vieux code compile encore » est vrai, mais le <b>défaut</b> a changé de camp. Ce qui était implicite (zone, Default) doit maintenant être dit.
</div>

</v-click>

<!--
Slide informative, à passer vite si le temps manque. L'essentiel : en v22 les défauts sont zoneless + OnPush, même pour une app bootstrapée avec un NgModule. Les trois correctifs sont dans le dépôt (app.module.ts, tsconfig.json, server.ts) et détaillés dans docs/pros-cons.md §10.

Pas besoin de tout retenir. Détail en plus pour le piège 1 : l'option `ngZoneEventCoalescing` de `bootstrapModule` n'a plus d'effet, il faut passer par `provideZoneChangeDetection({ eventCoalescing: true })`.
-->

---
hide: true
layout: section
---

# zone.js : la magie et son prix

---
hide: true
layout: two-cols
layoutClass: gap-6
---

# Comment Angular « savait » quand rafraîchir

<v-clicks>

- zone.js **monkey-patche** toutes les API asynchrones du navigateur : `setTimeout`, `Promise.then`, `addEventListener`, `XMLHttpRequest`, `fetch`…
- Angular s'exécute dans une `NgZone`. Quand une tâche asynchrone se termine → `onMicrotaskEmpty` → `ApplicationRef.tick()`.
- `tick()` parcourt **tout l'arbre de composants** de haut en bas et compare chaque binding.
- Vous n'avez rien à faire. C'est le génie de 2016.

</v-clicks>

::right::

```ts
// Ce que fait zone.js, en (très) simplifié
const originalSetTimeout = window.setTimeout;
window.setTimeout = (cb, ms) =>
  originalSetTimeout(() => {
    cb();               // votre code
    zone.onTaskDone();  // → « ça a peut-être changé »
  }, ms);
```

<v-click>

```ts
// Conséquence : ceci déclenche un tick() global…
document.addEventListener('mousemove', () => {});
// …même si le handler est vide.
```

</v-click>

<v-click>

<div class="mt-4 p-3 rounded bg-red-500/10 border border-red-500/40 text-sm">
Prix : ~30 ko de polyfill, un <code>tick()</code> sur tout l'arbre à chaque événement, des stack traces illisibles, et des API non patchables (<code>async/await</code> natif, Web Workers, certains SDK tiers).
</div>

</v-click>

<!--
« Monkey-patching » : remplacer, à l'exécution, une fonction globale du navigateur par une version enveloppée. zone.js prend `window.setTimeout`, `Promise.prototype.then`, `EventTarget.prototype.addEventListener`, `XMLHttpRequest.prototype.send`… et les réécrit pour être averti au début et à la fin de chaque tâche asynchrone. Votre code appelle toujours `setTimeout`, mais c'est la version de zone.js qui répond. C'est invisible, global (toutes les libs de la page sont concernées) et c'est pour ça qu'on l'appelle « magie » : rien à écrire, mais rien à contrôler non plus.

Analogie : un standardiste qui écoute toutes les lignes du bâtiment pour savoir quand quelqu'un a raccroché.
-->

---
hide: true
---

# `OnPush` : la première réponse (2016 déjà)

<div class="grid grid-cols-2 gap-6">
<div>

```ts
// features/lab/onpush-card.component.ts (todo-zone)
@Component({
  selector: 'zn-onpush-card',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './onpush-card.component.html',
})
export class OnPushCardComponent {
  @Input() person!: LabPerson; // { name, clicks }
  local = 0;
  constructor(private cdr: ChangeDetectorRef) {}
}
```

```html
<!-- le parent (LabComponent) -->
<zn-onpush-card [person]="person" />
```

</div>
<div>

Un composant `OnPush` n'est vérifié que si :

<v-clicks>

- une **référence** d'`@Input()` change : `person = {...person}` oui, `person.clicks++` non ;
- un **événement** est émis depuis sa propre vue : `(click)="local++"` dans son template ;
- on appelle `this.cdr.markForCheck()` (ce que fait le pipe `async`) ;
- un **signal** lu dans son template change (v16+).

</v-clicks>

</div>
</div>

<v-click>

<div class="mt-6 text-center text-lg">
OnPush = « immutabilité + je préviens Angular ». C'est exactement le contrat du zoneless. <b>Migrer vers OnPush, c'est déjà 90 % du chemin.</b>
</div>

</v-click>

---
hide: true
layout: section
---

# `Default` vs `OnPush` vs zoneless : le labo

---
hide: true
layout: two-cols
layoutClass: gap-6
class: dense
---

# Le compteur de rendus

Une fonction appelée dans le template n'est évaluée **que** quand ce template est rafraîchi. C'est notre sonde.

```ts
export class RenderCounter {
  renders = 0;
  private scheduled = false;
  constructor(private host: ElementRef<HTMLElement>,
              private zone: NgZone) {}

  /** Dans le template : {{ counter.track() }} */
  track(): string {
    if (!this.scheduled) {
      this.scheduled = true;
      this.zone.runOutsideAngular(() => queueMicrotask(() => {
        this.scheduled = false;
        this.renders++;
        // écriture DOM directe, pas de binding
        const el = this.host.nativeElement;
        el.querySelector('.render-count')!
          .textContent = String(this.renders);
        el.classList.add('flash');
      }));
    }
    return '';
  }
}
```

::right::

<div class="mt-12">

Pourquoi ces précautions ?

<v-clicks>

- En dev, Angular évalue chaque template **deux fois** (`checkNoChanges`) → on dédoublonne par microtask.
- Incrémenter une propriété **bindée** pendant le rendu lèverait `ExpressionChangedAfterItHasBeenCheckedError` → on écrit directement dans le DOM.
- `runOutsideAngular` : sinon le `queueMicrotask` serait lui-même détecté par zone.js et relancerait un `tick()`. Boucle infinie garantie.

</v-clicks>

<v-click>

<div class="mt-6 p-3 rounded bg-sky-500/10 border border-sky-500/40 text-sm">
Ce dernier point est <b>à lui seul</b> une bonne raison de quitter zone.js : le framework observe votre code à votre insu.
</div>

</v-click>

</div>

---
hide: true
layout: two-cols
layoutClass: gap-6
class: dense
---

# Et sans zone.js ?

```ts
// apps/todo-zoneless — plus de zone.js dans le bundle
export const appConfig: ApplicationConfig = {
  providers: [
    provideClientHydration(withEventReplay(),
                           withIncrementalHydration()),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(withFetch(),
                      withInterceptors([latencyInterceptor])),
    // v21+ : zoneless est le défaut. Rien à ajouter.
  ],
};
```

Angular ne devine plus. Il **est prévenu** par :

<v-clicks>

- un **signal** lu dans un template qui change ;
- un **listener de template** `(click)`, `(input)`… (marque la vue dirty) ;
- `markForCheck()` / pipe `async` / `ComponentRef.setInput()` ;
- la fin d'un `resource` / `httpResource`.

</v-clicks>

::right::

```ts
@Component({
  selector: 'zl-signal-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="render-count">0</div>{{ counter.track() }}
    <p>count = {{ count() }}</p>
    <button (click)="count.update(c => c + 1)">
      signal.update()
    </button>
    <p>plain = {{ plain }}</p>
    <button (click)="mutateLater()">
      setTimeout(() => plain++)
    </button>
  `,
})
export class SignalCard {
  count = signal(0);
  plain = 0;
  mutateLater() {
    // 🪤 rien ne se rafraîchit
    setTimeout(() => { this.plain++; });
  }
}
```

<v-click>

<div class="mt-2 text-sm opacity-80">
Le <code>setTimeout</code> mute une propriété que personne ne surveille : la valeur affichée reste périmée. Avec zone.js, ça « marchait par accident ». Sans, il faut un signal ou <code>markForCheck()</code>.
</div>

</v-click>

---
hide: true
layout: center
class: text-center
---

# On lance les applications

Tout ce qu'on vient de voir, on le constate en direct.

<div class="grid grid-cols-2 gap-6 mt-8 text-left text-sm">
<div class="p-3 rounded bg-red-500/10 border border-red-500/40">

**todo-zone** · http://localhost:4200/lab

zone.js · `Default` vs `OnPush` · `tick()` global

</div>
<div class="p-3 rounded bg-emerald-500/10 border border-emerald-500/40">

**todo-zoneless** · http://localhost:4201/lab

zoneless · signals · rendu local

</div>
</div>

```bash
pnpm demo   # api + todo-zone + todo-zoneless
```

<!--
todo-zone (:4200/lab) :
1. Bouger la souris : la carte Default flashe en continu, la carte OnPush ne bouge pas.
2. "Muter l'objet" : Default se met à jour, OnPush affiche une valeur périmée → le piège classique.
3. "Remplacer la référence" : les deux.
4. "setTimeout hors template" : Default seul (zone.js voit le timer).
5. Clic dans la carte OnPush : elle se rafraîchit (événement dans sa vue).
6. runOutsideAngular : rien. appRef.tick() : tout.

todo-zoneless (:4201/lab) :
- signal.update() → une seule carte re-rendue.
- Champ non-signal muté dans un setTimeout → rien.
- (mousemove) dans le template vs document.addEventListener.
Insister : le compteur de rendus de la carte voisine ne bouge JAMAIS. Le rendu est local, granulaire, prévisible.
-->

---
hide: true
layout: fact
---

# QUIZ
## http://localhost:4202

<div class="text-base opacity-80 mt-6">
5 questions · « De zone.js aux signals » · les réponses juste après
</div>

<!--
Lancer le quiz : pnpm quiz (port 4202). Laisser 2-3 minutes, puis passer à la slide suivante : chaque point correspond à la réponse d'une question.
-->

---
hide: true
class: dense
---

# À retenir : le rendu

<v-clicks>

1. **Deux ruptures** : 2016 (zone.js + RxJS), puis 2023–2026 (signals + zoneless). Le reste est incrémental.
2. **Nx** : les tags `scope:*` et `@nx/enforce-module-boundaries` empêchent les deux mondes de se mélanger.
3. **v22 : le défaut a changé de camp.** OnPush et zoneless par défaut ; `Default` et `provideZoneChangeDetection()` doivent être écrits.
4. **zone.js** patche toutes les API asynchrones : le moindre `mousemove` déclenche un `tick()` sur tout l'arbre.
5. **Zoneless** : Angular ne devine plus, il est prévenu. Un `setTimeout` qui mute un champ ne rafraîchit rien → signal ou `markForCheck()`.

</v-clicks>

<v-click>

<div class="mt-6 text-center text-lg">
OnPush aujourd'hui, c'est le contrat du zoneless de demain.
</div>

</v-click>

<!--
Slide des réponses du quiz : chaque point répond à une question, dans l'ordre.
-->

---
layout: section
---

# 3. État : NgRx classique vs signalStore

---
layout: two-cols
layoutClass: gap-4
class: dense
---

# NgRx « Redux » (2017)

```ts
// todo.actions.ts
export const TodoActions = createActionGroup({
  source: 'Todos',
  events: {
    'Load': emptyProps(),
    'Load Success': props<{ todos: Todo[] }>(),
    'Load Failure': props<{ error: string }>(),
    'Toggle': props<{ id: string }>(),
  },
});

// todo.reducer.ts
const adapter = createEntityAdapter<Todo>();
export const reducer = createReducer(
  adapter.getInitialState({ status: 'idle' }),
  on(TodoActions.load, s =>
    ({ ...s, status: 'loading' })),
  on(TodoActions.loadSuccess, (s, { todos }) =>
    adapter.setAll(todos, { ...s, status: 'loaded' })),
);
```

::right::

```ts
// todo.effects.ts
@Injectable()
export class TodoEffects {
  load$ = createEffect(() => this.actions$.pipe(
    ofType(TodoActions.load),
    switchMap(() => this.api.getAll().pipe(
      map(todos => TodoActions.loadSuccess({ todos })),
      catchError(e => of(TodoActions.loadFailure(
        { error: e.message }))),
    )),
  ));
  constructor(private actions$: Actions,
              private api: TodoApiService) {}
}

// todo.selectors.ts
export const selectFilteredTodos = createSelector(
  selectAllTodos, selectFilter, selectSearch,
  (todos, filter, search) => todos.filter(/* … */),
);

// todo-list.component.ts
todos$ = this.store.select(selectFilteredTodos);
// *ngFor="let t of todos$ | async; trackBy: trackById"
```

<v-click>

<div class="mt-2 text-sm p-2 rounded bg-amber-500/10 border border-amber-500/40">
4 fichiers, ~150 lignes, indirection totale : action → effect → action → reducer → selector → async pipe. Excellent pour tracer, coûteux à écrire.
</div>

</v-click>

---
layout: two-cols
layoutClass: gap-4
class: dense
---

# `@ngrx/signals` (2023)

```ts
export const TodoStore = signalStore(
  { providedIn: 'root' },
  withEntities<Todo>(),
  withState({ filter: 'all' as TodoFilter, search: '',
              status: 'idle' as Status }),
  withComputed(({ entities, filter, search }) => ({
    filtered: computed(() => entities().filter(t =>
      matches(t, filter(), search()))),
  })),
  withMethods((store, api = inject(TodoApi)) => ({
    load: rxMethod<void>(pipe(
      tap(() => patchState(store, { status: 'loading' })),
      switchMap(() => api.getAll().pipe(tapResponse({
        next: todos => patchState(store,
          setAllEntities(todos), { status: 'loaded' }),
        error: () => patchState(store, { status: 'error' }),
      }))),
    )),
    toggle: rxMethod<string>(pipe(mergeMap(id => {
      const done = !store.entityMap()[id].done; // optimiste
      patchState(store, updateEntity({ id, changes: { done } }));
      return api.update(id, { done }).pipe(tapResponse({
        next: todo => patchState(store,
          updateEntity({ id, changes: todo })),
        error: () => patchState(store, // rollback
          updateEntity({ id, changes: { done: !done } })),
      }));
    }))),
  })),
);
```

<style>
/* le store complet tient sur la colonne */
.col-left pre { font-size: 0.56em !important; }
</style>

::right::

```ts
// todo-list.ts
export class TodoList {
  readonly store = inject(TodoStore);
}
```

```html
@if (store.status() === 'loading') {
  <p class="loading">Chargement…</p>
}
@for (todo of store.filtered(); track todo.id) {
  <zl-todo-item [todo]="todo"
                (toggled)="store.toggle($event)"
                animate.enter="enter-anim"
                animate.leave="leave-anim" />
} @empty { <p class="empty">Aucune tâche</p> }
```

<v-clicks>

- **Un fichier** : état + dérivations + effets.
- Pas de souscription, pas de `async` ; `track` obligatoire dans `@for`.
- `computed` **paresseux et mémoïsés** : `filtered` ne se recalcule que si `entities`, `filter` ou `search` bougent.
- RxJS **là où c'est utile** (`rxMethod`, `switchMap`), plus nulle part ailleurs.

</v-clicks>

---
layout: section
---

# 4. Ouvrir le capot : Chrome DevTools

<div class="opacity-80">Les deux apps, un seul outil. Ce qu'aucun agent ne regardera à votre place.</div>

<!--
Section la plus pratique du workshop : tout le monde a `pnpm demo` qui tourne, on ouvre DevTools en même temps.
Fil rouge : observer → comprendre → corriger → re-mesurer. Scénario pas à pas : docs/demo-devtools.md.

Les slides zone.js / labo sont masquées (`hide: true`). Rappel en 30 s avant d'ouvrir DevTools :
- todo-zone : zone.js patche les API async ; n'importe quel événement (même un mousemove) relance la détection de changements sur tout l'arbre.
- todo-zoneless : pas de zone.js ; Angular ne rafraîchit que ce qui lit un signal modifié, ou la vue d'où part un événement de template.
Le Profiler et Paint flashing vont le montrer en direct.
-->

---
layout: two-cols
layoutClass: gap-8
class: dense
---

# Quel panneau pour quoi ?

| Question | Panneau |
| --- | --- |
| Quel état a ce composant ? | **Angular** → Components |
| Ça re-rend trop ? | **Angular** → Profiler |
| C'est lent ? | **Performance** (+ piste Angular) |
| Ça pèse combien ? | **Network** · **Coverage** |
| Et sur un mauvais réseau ? | **Network** → throttling |
| Et si l'API répondait autre chose ? | **Network** → Override content |
| Et si l'API tombait ? | **Network** → Block request URL |
| Pourquoi ce style ? | **Elements** → Styles / Computed |

::right::

### Avant de commencer

- Extension **Angular DevTools** (Chrome Web Store ou Firefox Add-ons).
- Un build **de développement** : `pnpm demo`. Sur un build de production, l'onglet Angular affiche « application built with production configuration ».
- Pas d'onglet Angular sur la page « Nouvel onglet » de Chrome : ouvrir d'abord une des apps.

### Raccourcis (macOS · Windows/Linux)

| | |
| --- | --- |
| Ouvrir DevTools | `⌘⌥I` · `F12` |
| Inspecter un élément | `⌘⇧C` · `Ctrl⇧C` |
| Menu de commandes | `⌘⇧P` · `Ctrl⇧P` |
| Ouvrir un fichier source | `⌘P` · `Ctrl+P` |

---
layout: two-cols
layoutClass: gap-6
class: dense
---

# Angular DevTools : Components

<img src="/devtools/ng-components.png" alt="Onglet Angular, vue Components : arbre des composants, OnPush affiché, bouton Show Signal Graph" class="rounded shadow" />

<div class="text-xs opacity-60 mt-1">Capture : angular.dev (CC BY 4.0)</div>

::right::

<v-clicks>

- L'**arbre** des composants et directives, avec leur stratégie (`OnPush`).
- Sélection → **inputs, propriétés, services injectés**. Double-clic sur une valeur pour la **modifier en direct**.
- `$ng0` dans la console = l'instance sélectionnée. Depuis Elements : `ng.getComponent($0)`.
- Blocs **`@defer`** : leurs déclencheurs, y compris `hydrate on viewport`.
- **Hydratation** : statut par composant, et un overlay sur la page (app en SSR).
- **Show Signal Graph** : signal → `computed` → template. Rien d'équivalent côté `todo-zone`.

</v-clicks>

<v-click>

<div class="mt-3 p-2 rounded bg-sky-500/10 border border-sky-500/40 text-sm">
Sur <code>:4201/todos</code> : sélectionner <code>zl-todo-list</code>, déplier <code>store</code>, puis cliquer un filtre. Sur <code>:4200</code>, l'état est dans le Store NgRx, pas dans le composant.
</div>

</v-click>

---
layout: two-cols
layoutClass: gap-6
class: dense
---

# Angular DevTools : Profiler

<img src="/devtools/ng-profiler-bar.png" alt="Profiler : une barre par cycle de change detection, temps passé par composant" class="rounded shadow" />

<div class="text-xs opacity-60 mt-1">Capture : angular.dev (CC BY 4.0)</div>

::right::

<v-clicks>

- **Record** : chaque barre = un cycle de change detection. Clic → temps passé par composant (bar chart ou **flame graph**).
- Case **« Change detection »** : ne garder que les composants réellement vérifiés (les `OnPush` intacts disparaissent).
- **Save Profile** : exporter en JSON, comparer avant / après une correction.

</v-clicks>

<v-click>

### Sur nos deux `/lab`

| | todo-zone | todo-zoneless |
| --- | --- | --- |
| Bouger la souris | une rafale de cycles, tout l'arbre | aucun cycle (hors `(mousemove)` de template) |
| Clic sur un bouton | tout l'arbre | la carte concernée |

<div class="text-xs opacity-70 mt-1">Mesuré dans ce dépôt : 80 mouvements de souris sur <code>:4200/lab</code> → carte <code>Default</code> : 83 rendus, carte <code>OnPush</code> : 1.</div>

</v-click>

<!--
Chaque carte de /lab affiche aussi son propre compteur de rendus : le Profiler arrive à la même conclusion, sur n'importe quelle app, sans instrumenter le code.
-->

---
layout: two-cols
layoutClass: gap-6
class: dense
---

# Injector Tree · Router Tree

<v-clicks>

- **Injector Tree** : la hiérarchie *Environment* (root, routes lazy) et *Element* (`providers` d'un composant). Répond à « pourquoi ai-je deux instances de ce service ? ».
- **Router Tree** : les routes, le lazy loading (`loadChildren`), les guards (`canDeactivate` sur `/todos/:id`).
- **Transfer State** (expérimental, à activer dans les réglages ⚙) : ce que le serveur a transmis au client. Lien direct avec la section SSR.

</v-clicks>

<v-click>

<div class="mt-4 p-2 rounded bg-amber-500/10 border border-amber-500/40 text-sm">
Comparer <code>:4200</code> et <code>:4201</code> : NgModules lazy d'un côté (un injecteur par module), <code>Routes</code> + <code>providedIn: 'root'</code> de l'autre.
</div>

</v-click>

::right::

<img src="/devtools/ng-injector-tree.png" alt="Injector Tree : hiérarchie des injecteurs Environment et Element" class="rounded shadow" />

<div class="text-xs opacity-60 mt-1">Capture : angular.dev (CC BY 4.0)</div>

---
layout: two-cols
layoutClass: gap-6
class: dense
---

# Performance : mesurer

<img src="/devtools/ng-perf-track.png" alt="Panneau Performance avec la piste Angular au-dessus du thread principal" class="rounded shadow" />

<div class="text-xs opacity-60 mt-1">Capture : angular.dev (CC BY 4.0)</div>

```js
// console, en dev uniquement
ng.enableProfiling()
```

::right::

<v-clicks>

- À l'ouverture du panneau : **LCP, CLS et INP en direct**, avec leur note (bon / à améliorer / mauvais). Rien à enregistrer.
- ⏺ **Record** pour une interaction, ↻ **Reload and record** pour le chargement.
- `ng.enableProfiling()` ajoute une piste **Angular** au-dessus du thread principal : bootstrap, change detection, composants.
- Couleurs : 🟦 votre TypeScript · 🟪 vos templates compilés · 🟩 le point d'entrée (la *raison* de l'exécution).
- À comparer : dans `todo-zone`, un événement quelconque déclenche un « Change detection » de toute l'app ; dans `todo-zoneless`, des synchronisations rares et ciblées.

</v-clicks>

---
layout: two-cols
layoutClass: gap-6
class: dense
---

# Performance : améliorer

<v-clicks>

- **CPU ×4 / ×6** (Performance → réglages) : votre MacBook n'est pas le téléphone de vos utilisateurs. Settings → Throttling → *Calibrate* pour des valeurs réalistes.
- **Insights** (barre latérale) : découpage du LCP, tâches longues, ressources bloquantes.
- **Coverage** (`⌘⇧P` → « Coverage ») : JS et CSS chargés mais jamais exécutés.
- La boucle : **mesurer → changer une seule chose → re-mesurer**.

</v-clicks>

<v-click>

| La trace montre… | Piste |
| --- | --- |
| Change detection de tout l'arbre à chaque événement | `OnPush`, signals, zoneless |
| Une liste entièrement recréée | `track` dans `@for` |
| Beaucoup de JS au démarrage | routes lazy, `@defer` |
| LCP tardif | SSR + hydratation incrémentale |
| Layout shift | réserver la place (`@placeholder`) |

</v-click>

::right::

<v-click>

### Le poids, mesuré dans ce dépôt

`nx build <app> -c production`, bundle initial transféré (gzip estimé) :

| | todo-zone | todo-zoneless |
| --- | --- | --- |
| Initial total | **134,3 ko** | **98,4 ko** |
| dont `polyfills` (zone.js) | 11,6 ko | — |
| Écart | | **−27 %** |

<div class="text-sm mt-2">
zone.js n'explique qu'une partie de l'écart : le reste, ce sont les dépendances et le style de code de chaque app. Le bloc <code>@defer</code> de <code>/stats</code> est un chunk à part (0,75 ko), chargé seulement quand il devient visible.
</div>

<div class="text-xs opacity-70 mt-2">Dans Network, filtre <b>JS</b> : <code>polyfills.js</code> n'existe que sur :4200.</div>

</v-click>

---
layout: two-cols
layoutClass: gap-6
class: dense
---

# Network : throttling

<img src="/devtools/cr-throttling-menu.png" alt="Menu de throttling du panneau Network : Fast 4G, Slow 4G, 3G, Offline, Add" class="rounded shadow w-4/5" />

<div class="text-xs opacity-60 mt-1">Capture : developer.chrome.com (CC BY 4.0)</div>

<v-clicks>

- Presets **Fast 4G, Slow 4G, 3G, Offline**. Profils perso dans Settings → Throttling (débit, latence, perte de paquets).
- Cocher **Disable cache**, sinon le 2ᵉ chargement ment.
- Le throttling ralentit **tout** (JS, CSS, polices, API). Notre `DEMO_LATENCY_MS` (400 ms) ne ralentit que l'API.
- **Offline** puis « Recharger » : que dit l'app ?

</v-clicks>

::right::

<v-click>

<img src="/devtools/throttle-zone.png" alt="todo-zone, formulaire : Chargement des tags" class="rounded shadow w-full h-44 object-cover object-bottom" />
<div class="text-xs opacity-70 mb-2"><code>todo-zone</code> : le « chargement » est déduit de <code>tags.length === 0</code></div>

<img src="/devtools/throttle-zoneless.png" alt="todo-zoneless, formulaire : Chargement des tags" class="rounded shadow w-full h-44 object-cover object-bottom" />
<div class="text-xs opacity-70"><code>todo-zoneless</code> : <code>tags.isLoading()</code>, fourni par <code>httpResource</code></div>

</v-click>

<!--
Même rendu à l'écran, mais une seule des deux apps distingue « en cours », « vide » et « en erreur ». Question à la salle : que se passe-t-il côté zone si l'API renvoie une liste de tags vide ? (réponse : « Chargement des tags… » pour toujours)
-->

---
layout: two-cols
layoutClass: gap-6
class: dense
---

# Override : moquer l'API

<img src="/devtools/cr-override-content.png" alt="Network : clic droit sur une requête, menu Override content" class="rounded shadow w-4/5" />

<div class="text-xs opacity-60 mt-1">Capture : developer.chrome.com (CC BY 4.0)</div>

<v-clicks>

1. Network → **Fetch/XHR** → clic droit sur `todos` → **Override content**.
2. La 1ʳᵉ fois : choisir un dossier local, puis **Allow**.
3. Modifier le JSON dans Sources, `⌘S`, recharger.
4. Point violet sur la requête = réponse remplacée. Sources → **Overrides** pour désactiver.

</v-clicks>

::right::

<v-click>

<img src="/devtools/mock-zoneless.png" alt="todo-zoneless affichant des tâches inventées" class="rounded shadow" />
<div class="text-xs opacity-70 mt-1">Réponse de <code>GET /todos</code> remplacée : zéro ligne de code modifiée, zéro redémarrage.</div>

</v-click>

<v-click>

- **Override headers** : tester CORS, `Cache-Control`…
- **Block request URL** : simuler une panne (slide suivante).
- Cas limites en 10 secondes : liste vide, 500 éléments, titre de 300 caractères, champ `null`.

</v-click>

---
layout: two-cols
layoutClass: gap-6
class: dense
---

# Ce que le mock a révélé

Un seul champ changé dans la réponse : `"dueDate": null`.

<img src="/devtools/mock-null-zone.png" alt="todo-zone bloquée sur Chargement…" class="rounded shadow" />

```text
TypeError: Cannot read properties of null
  (reading 'localeCompare') at sortComparer
```

<div class="text-sm"><code>todo-zone</code> : le reducer plante pendant le tri → l'état ne passe jamais à <code>loaded</code>. <b>« Chargement… » pour toujours.</b></div>

::right::

<div class="mt-12"></div>

<img src="/devtools/mock-null-zoneless.png" alt="todo-zoneless affiche la liste mais plante dans un pipe" class="rounded shadow" />

```text
TypeError: Cannot read properties of null
  (reading 'split') at daysUntil
```

<div class="text-sm"><code>todo-zoneless</code> : la liste s'affiche, mais le pipe <code>relativeDue</code> lève une erreur à chaque rendu.</div>

<v-click>

<div class="mt-3 p-2 rounded bg-red-500/10 border border-red-500/40 text-sm">
Ni le compilateur, ni les tests, ni un agent ne l'avaient vu : le type <code>Todo</code> promet une échéance. Un mock de 10 secondes, si. → typer <code>dueDate: string | null</code>, ou valider la réponse (<code>parse</code> de <code>httpResource</code>, Zod…).
</div>

</v-click>

<!--
Bugs réels, trouvés en préparant cette slide. Ils sont laissés volontairement dans les apps : c'est le défi n°2 de docs/demo-devtools.md.
-->

---
layout: two-cols
layoutClass: gap-6
class: dense
---

# Block request URL : panne d'API

Network → clic droit sur `todos` → **Block request URL**, puis recharger.

<img src="/devtools/blocked-zone.png" alt="todo-zone : Impossible de charger les tâches" class="rounded shadow w-full h-40 object-cover object-top" />
<div class="text-xs opacity-70"><code>todo-zone</code> : <code>catchError</code> dans l'effect → action <code>loadFailure</code> → message.</div>

::right::

<div class="mt-12"></div>

<img src="/devtools/blocked-zoneless.png" alt="todo-zoneless : Erreur Http failure response" class="rounded shadow w-full h-40 object-cover object-top" />
<div class="text-xs opacity-70"><code>todo-zoneless</code> : <code>tapResponse</code> → <code>status: 'error'</code> → message.</div>

<v-click>

- Les deux apps résistent. Mais le message diffère : « 0 **Unknown Error** » (XHR) contre « 0 **undefined** » (`withFetch()`, pas de `statusText`).
- Afficher `error.message` brut à l'utilisateur : à revoir dans les deux cas.
- Onglet Network, case **Blocked requests** : retrouver ce qu'on a bloqué.

</v-click>

---
class: dense
---

# Moquer : quel outil pour quel besoin ?

| Outil | Où ça vit | Idéal pour |
| --- | --- | --- |
| **Override content** (DevTools) | votre navigateur | tester vite un cas limite, reproduire un bug de prod |
| **Block request URL** (DevTools) | votre navigateur | simuler une panne |
| **json-server** (`apps/api`) | serveur local | une vraie API REST, partagée par les deux apps |
| **`HttpInterceptorFn`** | code de l'app | latence, erreurs aléatoires, auth (cf. `latencyInterceptor`) |
| **`HttpTestingController`** | tests | tests unitaires déterministes |
| **MSW** (Mock Service Worker) | navigateur + Node | mocks versionnés et partagés par l'équipe |

<v-click>

<div class="mt-6 text-center">
DevTools pour <b>explorer</b>, le code et les tests pour <b>garantir</b>. Un cas limite trouvé à la main devient un test.
</div>

</v-click>

---
layout: two-cols
layoutClass: gap-6
class: dense
---

# CSS : trouver et comprendre

<img src="/devtools/css-highlight.png" alt="Survol d'une tâche en retard : sélecteur, taille, couleur de fond, padding" class="rounded shadow" />

<div class="text-xs opacity-70 mt-1"><code>⌘⇧C</code> puis survol : sélecteur, taille, fond, padding. Ici <code>.todo-item.overdue</code> sur <code>:4201/todos</code>.</div>

::right::

<v-clicks>

- Elements, **`⌘F`** : chercher du texte, un **sélecteur CSS** (`.todo-item.overdue`) ou du XPath.
- **Styles** : la cascade de haut en bas. Barré = écrasé. Survol du sélecteur = sa **spécificité**. Le lien à droite ouvre la source (`index.scss`, via source maps).
- **`:hov`** force `:hover` / `:focus` ; **`.cls`** ajoute ou retire une classe.
- **Computed** : la valeur finale ; la flèche mène à la règle qui l'emporte. Filtre + *Group*.
- Modifier en direct, puis onglet **Changes** pour récupérer le diff.

</v-clicks>

<v-click>

<div class="mt-2 p-2 rounded bg-sky-500/10 border border-sky-500/40 text-sm">
Nos apps partagent un CSS global (<code>libs/shared/styles</code>). Avec des <code>styleUrl</code> en encapsulation <i>Emulated</i>, Angular réécrit les sélecteurs (<code>.title[_ngcontent-ng-c…]</code>) : c'est pour ça qu'un style « ne passe pas » vers un composant enfant.
</div>

</v-click>

---
layout: two-cols
layoutClass: gap-6
class: dense
---

# Rendering : ce qui est repeint

<v-clicks>

- `⌘⇧P` → « Show Rendering ».
- **Paint flashing** : chaque zone repeinte clignote en vert.
- **Layout shift regions** : les zones qui bougent (le CLS, rendu visible).
- **CSS Overview** (`⌘⇧P` → « CSS Overview ») : couleurs, polices, déclarations inutilisées, contrastes insuffisants.

</v-clicks>

<v-click>

<div class="mt-4 text-sm">
Paint flashing montre ce que le <b>navigateur</b> repeint ; le Profiler Angular, ce que le <b>framework</b> re-vérifie. Un rendu Angular qui ne change rien au DOM ne clignote pas.
</div>

</v-click>

::right::

<img src="/devtools/paint-zone.png" alt="Paint flashing sur todo-zone /lab : la carte Default repeinte à chaque mouvement de souris" class="rounded shadow" />

<div class="text-xs opacity-70 mt-1"><code>:4200/lab</code>, Paint flashing : la carte <code>Default</code> est repeinte à chaque mouvement de souris (son compteur change).</div>

---
class: dense
---

# À vous : prise en main en binôme

<v-clicks>

1. **Profiler** : combien de cycles de change detection pour **un** clic sur le bouton de réinitialisation, sur `:4200/lab` puis `:4201/lab` ?
2. **Override** : faites renvoyer `"dueDate": null` à `GET /todos`. Que se passe-t-il dans chaque app ? Trouvez la ligne fautive depuis la console.
3. **Throttling** : Slow 4G + *Disable cache*. Combien de ko transférés avant que `/todos` s'affiche, sur chaque app ?
4. **CSS** : pourquoi « Passer les composants en OnPush » a-t-elle une bordure rouge ? Quelle règle, quel fichier, quelle ligne ?

</v-clicks>

<v-click>

<div class="mt-6 text-center text-sm opacity-80">
Interdit de demander à l'IA. Autorisé : tout ce qu'il y a dans DevTools.
</div>

</v-click>

<!--
10 minutes. Réponses données à l'oral.
-->

---
layout: two-cols
layoutClass: gap-8
class: dense
---

# DevTools… pour les agents aussi

<v-clicks>

- **`chrome-devtools-mcp`** (Google) : votre agent ouvre Chrome, lit la console et le réseau, enregistre une trace de performance et en tire des *insights*.
- **AI assistance** dans DevTools : expliquer un style, une requête, une trace, directement dans le panneau.
- L'agent sait **lancer** la trace. Vous savez **quoi y chercher**, et qu'un `dueDate: null` peut tout casser.

</v-clicks>

::right::

```json
// .mcp.json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

<div class="text-xs opacity-70 mt-2">
Statistiques d'usage envoyées à Google par défaut : <code>--no-usage-statistics</code> pour les couper. L'agent voit tout ce que voit le navigateur : pas de session de prod ouverte.
</div>

---
layout: two-cols
layoutClass: gap-8
class: dense
---

# Rappel : le web en 20 ans

<div class="timeline">
  <div v-click class="tl"><b>Avant 2004</b> pages HTML rendues par le serveur, chaque clic recharge la page</div>
  <div v-click class="tl"><b>2004–2006</b> <b>AJAX</b> : la page se met à jour sans rechargement (Gmail, Google Maps)</div>
  <div v-click class="tl"><b>2010</b> <b>AngularJS</b> : le navigateur devient une application (SPA)</div>
  <div v-click class="tl"><b>2016–2020</b> SPA partout, bundles JS de plusieurs Mo</div>
  <div v-click class="tl now"><b>2023–2026</b> retour du HTML rendu serveur, <b>hydraté</b> côté client (SSR)</div>
</div>

<v-click>

<div class="mt-4 p-2 rounded bg-slate-500/10 border border-slate-500/40 text-sm flex items-center gap-3">
<img src="/logo-nx.svg" alt="Logo Nx" class="h-9 shrink-0" />
<div>Le dépôt : un <b>monorepo Nx</b>, deux apps + API, une version d'Angular, <code>libs/shared</code> minimal, frontières par tags.</div>
</div>

</v-click>

::right::

<h3 class="flex items-center gap-2"><img src="/logo-angular.gif" alt="Logo Angular" class="h-8" /> Et Angular dans tout ça</h3>

<div class="timeline">
  <div v-click class="tl"><b>2010</b> AngularJS · dirty checking, <code>$scope</code></div>
  <div v-click class="tl"><b>2016 · v2</b> réécriture TypeScript : <b>zone.js</b>, NgModules, RxJS</div>
  <div v-click class="tl"><b>2020–2022 · v9–15</b> Ivy, standalone, <code>inject()</code></div>
  <div v-click class="tl"><b>2023–2024 · v16–19</b> <b>signals</b>, <code>@if/@for/@defer</code>, SSR + hydratation</div>
  <div v-click class="tl now"><b>2025–2026 · v20–22</b> <b>zoneless</b>, <code>httpResource</code>, Signal Forms, OnPush par défaut</div>
</div>

<v-click>

<div class="mt-4 p-2 rounded bg-sky-500/10 border border-sky-500/40 text-sm">
Deux ruptures : <b>2016</b> (zone.js + RxJS) et <b>2023–2026</b> (signals + zoneless). Le reste est incrémental.
</div>

</v-click>

<style>
.timeline { display: grid; gap: 0.4rem; margin-top: 0.6rem; }
.tl { border-left: 4px solid #dd0031; padding: 0.3rem 0.7rem; background: rgba(255,255,255,0.04); border-radius: 0 8px 8px 0; }
.tl.now { border-left-color: #22c55e; background: rgba(34,197,94,0.08); }
</style>

<!--
Rappel de la session 1, 2 minutes max. Chaque génération répond à une contrainte de son époque : AngularJS = « faire une appli dans le navigateur », Angular 22 = « le faire sans envoyer 2 Mo de JS ».
-->

---
layout: two-cols
layoutClass: gap-8
class: dense
---

# RxJS et NgRx : optionnels

On peut écrire une app Angular complète **sans écrire une ligne de RxJS ni installer NgRx**.

<h3 class="flex items-center gap-2"><img src="/logo-rxjs.png" alt="Logo RxJS" class="h-8" /> RxJS</h3>

<v-clicks>

- Une librairie de **flux asynchrones** (`Observable`) : réponses HTTP, événements utilisateur, WebSocket, timers.
- Sa force : **composer et annuler** (`switchMap`, `debounceTime`, `combineLatest`). Ex. : une recherche qui annule la requête précédente à chaque frappe.
- Encore présente **sous le capot** (`HttpClient`, router, Reactive Forms), mais en 2026 `signal`, `computed` et `httpResource` couvrent la majorité des besoins.

</v-clicks>

::right::

<div class="mt-27"></div>

<h3 class="flex items-center gap-2"><img src="/logo-ngrx.svg" alt="Logo NgRx" class="h-8" /> NgRx</h3>

<v-clicks>

- Une librairie **tierce** (pas l'équipe Angular) de gestion d'**état global**, inspirée de Redux.
- Utile quand **beaucoup de composants** partagent et modifient le même état, et qu'on veut **tracer** chaque changement (Redux DevTools).
- Sinon, un **service + des signals** suffit. `@ngrx/signals` est l'entre-deux : même idée de store, sans actions ni reducers.

</v-clicks>

<v-click>

<div class="mt-4 p-2 rounded bg-amber-500/10 border border-amber-500/40 text-sm">
RxJS répond à « <b>comment</b> enchaîner de l'asynchrone ? », NgRx à « <b>où</b> vit l'état partagé ? ». Deux questions différentes, deux outils optionnels.
</div>

</v-click>

<!--
Idée reçue fréquente : « Angular = RxJS + NgRx ». Faux : RxJS est une dépendance d'Angular (HttpClient renvoie un Observable), mais on n'est pas obligé d'en écrire ; NgRx n'a jamais fait partie d'Angular.

Bonne règle : commencer avec des signals dans un service, passer à un store quand l'état partagé devient difficile à suivre. Garder RxJS pour les flux d'événements (recherche, websocket, polling).
-->

---
layout: section
---

# 5. Formulaires

---
layout: two-cols
layoutClass: gap-8
class: code-lg
---

# Le fil rouge : « Ajouter une recette »

Le formulaire de la **Smart Recipe Box** (phase 5 de l'AI Tutor), écrit deux fois : Reactive Forms, puis Signal Forms.

<v-clicks>

- **Nom** : requis.
- **Description** : libre.
- **Email de l'auteur** : requis, au format email.
- **Soumission** : `RecipeService.addRecipe()`, puis remise à zéro.

</v-clicks>

::right::

<div class="mt-16">

```ts {all|2|3|4|all}{at:1}
interface RecipeDraft {
  name: string;
  description: string;
  authorEmail: string;
}
```

</div>

<div v-click="5" class="mt-6 text-sm opacity-80">
Version Reactive Forms complète : <code>apps/smart-recipe-app/src/app/recipe-form</code>.<br/>
Version Signal Forms : c'est l'exercice des modules 18 à 21 du tuteur.
</div>

<!--
Un seul exemple pour toute la section : trois champs, deux validateurs, une soumission. Assez petit pour tenir sur une slide, assez riche pour montrer toutes les différences.
-->

---
layout: two-cols
layoutClass: gap-6 !grid-cols-[3fr_2fr]
class: dense code-lg
---

# Reactive Forms ① : le `FormGroup`

<!-- surlignage synchronisé avec les puces de droite (clics 1 à 5) -->
```ts {all|1-3|7|11|13-17|14,16}{at:1}
import {
  FormBuilder, ReactiveFormsModule, Validators,
} from '@angular/forms';

@Component({
  selector: 'app-recipe-form',
  imports: [ReactiveFormsModule],
  templateUrl: './recipe-form.html',
})
export class RecipeForm {
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly recipeForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    authorEmail: ['', [Validators.required, Validators.email]],
  });
}
```

::right::

<div class="mt-12">

<v-clicks>

- Tout vient de `@angular/forms` : constructeur, directives, validateurs.
- `ReactiveFormsModule` apporte les directives `formGroup`, `formControlName`, `ngSubmit`.
- `nonNullable` : sans lui, `reset()` remet les champs à `null`. Typage strict seulement depuis la v14.
- Le **modèle vit dans le `FormGroup`** : une copie de vos données, pas vos données.
- Les validateurs sont **attachés à chaque contrôle** : `[valeurInitiale, validateurs]`.

</v-clicks>

</div>

<!--
Point clé à faire passer : le FormGroup est un objet à part, qui possède sa propre copie de la valeur. Toute la suite (patchValue, getRawValue, reset) découle de cette double source de vérité.
-->

---
class: dense
---

# Reactive Forms ② : lier le template

<!-- bloc HTML écrit à la main (pas Shiki) pour pouvoir entourer les attributs avec v-mark -->
<pre class="slidev-code anno"><code><span class="t">&lt;form</span> <span v-mark="{ at: 1, type: 'circle', color: '#e11d48', padding: 8 }" class="a">[formGroup]</span>=<span class="s">"recipeForm"</span> <span v-mark="{ at: 3, type: 'box', color: '#2563eb', padding: 4 }" class="a">(ngSubmit)</span>=<span class="s">"save()"</span><span class="t">&gt;</span>
  <span class="t">&lt;input</span> <span v-mark="{ at: 2, type: 'underline', color: '#f59e0b', strokeWidth: 3 }" class="a">formControlName</span>=<span v-mark="{ at: 2, type: 'circle', color: '#f59e0b', padding: 4 }" class="s">"name"</span> <span class="t">/&gt;</span>
  <span class="t">&lt;textarea</span> <span v-mark="{ at: 2, type: 'underline', color: '#f59e0b', strokeWidth: 3 }" class="a">formControlName</span>=<span class="s">"description"</span><span class="t">&gt;&lt;/textarea&gt;</span>
  <span class="t">&lt;input</span> <span class="a">type</span>=<span class="s">"email"</span> <span v-mark="{ at: 2, type: 'underline', color: '#f59e0b', strokeWidth: 3 }" class="a">formControlName</span>=<span class="s">"authorEmail"</span> <span class="t">/&gt;</span>
  <span class="t">&lt;button</span> <span class="a">type</span>=<span class="s">"submit"</span><span class="t">&gt;</span>Ajouter<span class="t">&lt;/button&gt;</span>
<span class="t">&lt;/form&gt;</span></code></pre>

<div class="grid grid-cols-3 gap-4 mt-4 text-sm">
  <div v-click="1" class="p-3 rounded border-l-4 border-rose-600 bg-rose-500/10">
    <code>[formGroup]</code> relie la balise <code>&lt;form&gt;</code> à l'objet <code>FormGroup</code> de la classe.
  </div>
  <div v-click="2" class="p-3 rounded border-l-4 border-amber-500 bg-amber-500/10">
    <code>formControlName</code> attend une <b>chaîne</b> : <code>"nmae"</code> compile… puis plante à l'exécution (<i>Cannot find control with name</i>).
  </div>
  <div v-click="3" class="p-3 rounded border-l-4 border-blue-600 bg-blue-500/10">
    <code>(ngSubmit)</code> : la directive intercepte le <code>submit</code> natif, pas de rechargement de page.
  </div>
</div>

<!--
Clic 1 : le lien form ↔ FormGroup. Clic 2 : le maillon faible, des chaînes de caractères que le compilateur ne vérifie pas, même avec strictTemplates. Clic 3 : ngSubmit.
-->

---
class: dense
---

# Reactive Forms ③ : afficher les erreurs

<pre class="slidev-code anno"><code><span class="k">@if</span> (recipeForm.controls.name<span v-mark="{ at: 1, type: 'underline', color: '#e11d48', strokeWidth: 3 }">.touched</span>
     &amp;&amp; recipeForm.controls.name.<span v-mark="{ at: 2, type: 'circle', color: '#f59e0b', padding: 6 }">hasError('required')</span>) {
  <span class="t">&lt;p</span> <span class="a">class</span>=<span class="s">"error"</span><span class="t">&gt;</span><span v-mark="{ at: 3, type: 'highlight', color: '#93c5fd' }">Le nom est requis</span><span class="t">&lt;/p&gt;</span>
}
<span class="k">@if</span> (recipeForm.controls.authorEmail.hasError(<span v-mark="{ at: 2, type: 'circle', color: '#f59e0b', padding: 6 }">'email'</span>)) {
  <span class="t">&lt;p</span> <span class="a">class</span>=<span class="s">"error"</span><span class="t">&gt;</span><span v-mark="{ at: 3, type: 'highlight', color: '#93c5fd' }">Email invalide</span><span class="t">&lt;/p&gt;</span>
}</code></pre>

<div class="grid grid-cols-3 gap-4 mt-4 text-sm">
  <div v-click="1" class="p-3 rounded border-l-4 border-rose-600 bg-rose-500/10">
    <code>touched</code>, <code>invalid</code>, <code>errors</code> : de <b>simples propriétés</b>, pas des signals. Pour un <code>computed()</code>, il faut passer par <code>valueChanges</code> + <code>toSignal()</code>.
  </div>
  <div v-click="2" class="p-3 rounded border-l-4 border-amber-500 bg-amber-500/10">
    Les erreurs sont identifiées par une <b>clé chaîne</b> (<code>'required'</code>, <code>'email'</code>) : aucune vérification à la compilation.
  </div>
  <div v-click="3" class="p-3 rounded border-l-4 border-blue-600 bg-blue-500/10">
    Le <b>message</b> vit dans le template, loin du validateur : à réécrire dans chaque formulaire.
  </div>
</div>

<!--
Le « touched && hasError » est le motif que tout le monde a copié-collé pendant dix ans. Retenir les trois défauts : pas réactif au sens signal, clés en chaînes, message séparé de la règle.
-->

---
layout: two-cols
layoutClass: gap-6 !grid-cols-[3fr_2fr]
class: dense code-lg
---

# Reactive Forms ④ : soumettre

```ts {all|2-5|3|6|7-9|10}{at:1}
protected save(): void {
  if (this.recipeForm.invalid) {
    this.recipeForm.markAllAsTouched();
    return;
  }
  const draft = this.recipeForm.getRawValue();
  this.recipes.addRecipe({
    ...draft, imgUrl: '', isFavorite: false, ingredients: [],
  });
  this.recipeForm.reset();
}
```

::right::

<div class="mt-12">

<v-clicks>

- La garde de validité est **manuelle**.
- `markAllAsTouched()` : sinon les erreurs, conditionnées par `touched`, restent invisibles.
- `getRawValue()` : on **recopie** la valeur hors du formulaire (`value` omettrait les champs désactivés).
- Le service reçoit un objet métier reconstruit à la main.
- `reset()` revient aux valeurs initiales… grâce à `nonNullable`.

</v-clicks>

</div>

<!--
Cinq lignes de plomberie avant d'arriver au métier. Rien de faux, mais tout est à la charge du développeur : c'est ce que Signal Forms va absorber.
-->

---
layout: center
class: text-center
---

# Et si le formulaire n'était qu'une **vue sur un signal** ?

<div v-click class="mt-6 text-lg opacity-80">
<code>@angular/forms/signals</code> : expérimental en v21, <b>stable en v22</b>.
</div>

---
layout: two-cols
layoutClass: gap-6 !grid-cols-[3fr_2fr]
class: dense code-lg
---

# Signal Forms ① : le modèle est un signal

<!-- surlignage synchronisé avec les puces de droite (clics 1 à 4) -->
```ts {all|3-7|10-12|13|11,13}{at:1}
import { form } from '@angular/forms/signals';

interface RecipeDraft {
  name: string;
  description: string;
  authorEmail: string;
}

export class AddRecipe {
  protected readonly model = signal<RecipeDraft>({
    name: '', description: '', authorEmail: '',
  });
  protected readonly recipeForm = form(this.model);
}
```

::right::

<div class="mt-12">

<v-clicks>

- On type **ses données**, pas son formulaire. Tout est initialisé : `''`, `0`, `false` (on reparle de `null` plus loin).
- `model` : un `WritableSignal` ordinaire, **unique source de vérité**.
- `form(model)` renvoie un **arbre de champs** de même forme : `recipeForm.name`, `recipeForm.authorEmail`… typé de bout en bout.
- Aucune copie : saisir écrit dans `model`, `model.set()` met à jour les inputs. Adieu `patchValue` et `getRawValue`.

</v-clicks>

</div>

<!--
Le renversement : en Reactive Forms le formulaire possède la valeur ; ici c'est le signal qui la possède et le formulaire n'est qu'une vue dessus.
-->

---
layout: two-cols
layoutClass: gap-6 !grid-cols-[3fr_2fr]
class: dense code-lg
---

# Signal Forms ② : le schéma

<!-- chaque étape de magic-move consomme un clic (clics 1 à 3), les puces suivent -->
````md magic-move {lines: true}
```ts
import { form } from '@angular/forms/signals';

protected readonly recipeForm = form(this.model);
```

```ts
import { form } from '@angular/forms/signals';

protected readonly recipeForm = form(this.model, (s) => {
});
```

```ts
import {
  form, required,
} from '@angular/forms/signals';

protected readonly recipeForm = form(this.model, (s) => {
  required(s.name, { message: 'Le nom est requis' });
});
```

```ts
import {
  email, form, required,
} from '@angular/forms/signals';

protected readonly recipeForm = form(this.model, (s) => {
  required(s.name, { message: 'Le nom est requis' });
  required(s.authorEmail, { message: "L'email est requis" });
  email(s.authorEmail, { message: 'Email invalide' });
});
```
````

::right::

<div class="mt-12">

<div v-click="1">

- 2ᵉ argument : une **fonction de schéma**, exécutée une seule fois. Elle *déclare* des règles, elle ne lit pas de valeurs.

</div>
<div v-click="2">

- `s` est un **chemin** dans le modèle (`s.name`) : la règle et son **message** vivent ensemble.

</div>
<div v-click="3">

- Les validateurs sont des **fonctions** importées : `required`, `email`, `minLength`, `pattern`… composables, réutilisables avec `schema()`.

</div>

<div v-click="4" class="mt-4 p-3 rounded bg-pink-500/10 border border-pink-500/40 text-sm">
Au-delà : <code>validate()</code> (règle maison), <code>applyWhen()</code> (conditionnel), <code>validateHttp()</code> (asynchrone), <code>disabled()</code> / <code>hidden()</code> (état des champs).
</div>

</div>

<!--
Magic-move : on part de form(this.model) et on ajoute le schéma ligne par ligne. Insister sur « s n'est pas une valeur » : c'est un chemin, la fonction ne s'exécute qu'une fois à la création du formulaire.
-->

---
class: dense
---

# Signal Forms ③ : lier le template

<pre class="slidev-code anno"><code><span class="t">&lt;form</span> <span v-mark="{ at: 3, type: 'box', color: '#2563eb', padding: 4 }" class="a">(submit)</span>=<span class="s">"save($event)"</span><span class="t">&gt;</span>
  <span class="t">&lt;input</span> <span v-mark="{ at: 1, type: 'circle', color: '#e11d48', padding: 8 }" class="a">[formField]</span>=<span class="s">"<span v-mark="{ at: 2, type: 'underline', color: '#f59e0b', strokeWidth: 3 }">recipeForm.name</span>"</span> <span class="t">/&gt;</span>
  <span class="t">&lt;textarea</span> <span v-mark="{ at: 1, type: 'circle', color: '#e11d48', padding: 8 }" class="a">[formField]</span>=<span class="s">"<span v-mark="{ at: 2, type: 'underline', color: '#f59e0b', strokeWidth: 3 }">recipeForm.description</span>"</span><span class="t">&gt;&lt;/textarea&gt;</span>
  <span class="t">&lt;input</span> <span class="a">type</span>=<span class="s">"email"</span> <span v-mark="{ at: 1, type: 'circle', color: '#e11d48', padding: 8 }" class="a">[formField]</span>=<span class="s">"<span v-mark="{ at: 2, type: 'underline', color: '#f59e0b', strokeWidth: 3 }">recipeForm.authorEmail</span>"</span> <span class="t">/&gt;</span>
  <span class="t">&lt;button</span> <span class="a">type</span>=<span class="s">"submit"</span><span class="t">&gt;</span>Ajouter<span class="t">&lt;/button&gt;</span>
<span class="t">&lt;/form&gt;</span></code></pre>

<div class="grid grid-cols-3 gap-4 mt-3 text-sm">
  <div v-click="1" class="p-3 rounded border-l-4 border-rose-600 bg-rose-500/10">
    <code>[formField]</code> (<code>imports: [FormField]</code>) : <b>une seule directive</b> pour tous les contrôles. Elle synchronise aussi <code>required</code>, <code>disabled</code>, <code>readonly</code> et marque <code>touched</code> au blur.
  </div>
  <div v-click="2" class="p-3 rounded border-l-4 border-amber-500 bg-amber-500/10">
    On passe une <b>référence typée</b>, pas une chaîne : <code>recipeForm.nmae</code> ne compile pas.
  </div>
  <div v-click="3" class="p-3 rounded border-l-4 border-blue-600 bg-blue-500/10">
    Pas de directive de formulaire obligatoire : un <code>(submit)</code> natif suffit (ou <code>[formRoot]</code>, plus loin).
  </div>
</div>

<div v-click="4" class="mt-3 p-2 rounded bg-red-500/10 border border-red-500/40 text-sm">
⚠️ L'AI Tutor, écrit pour la v21 expérimentale, enseigne <code>Field</code> + <code>[field]</code>. En v22, <code>Field</code> n'est plus qu'un <b>type</b> : <code>TS2693: 'Field' only refers to a type</code>. Directive : <code>FormField</code>, attribut : <code>[formField]</code>.
</div>

<!--
Clic 1 : une directive unique au lieu de formControlName/formControl/ngModel. Clic 2 : le gain du typage, comparer avec le "nmae" de la slide Reactive. Clic 3 : (submit) natif. Clic 4 : piège vérifié sur le dépôt, le code du tuteur ne compile pas en v22.
-->

---
class: dense
---

# Signal Forms ④ : l'état des champs

<pre class="slidev-code anno"><code><span class="k">@if</span> (<span v-mark="{ at: 1, type: 'circle', color: '#e11d48', padding: 6 }">recipeForm.name()</span>.<span v-mark="{ at: 2, type: 'underline', color: '#f59e0b', strokeWidth: 3 }">touched()</span> &amp;&amp; recipeForm.name().<span v-mark="{ at: 2, type: 'underline', color: '#f59e0b', strokeWidth: 3 }">invalid()</span>) {
  <span class="k">@for</span> (error <span class="k">of</span> recipeForm.name().<span v-mark="{ at: 3, type: 'box', color: '#2563eb', padding: 4 }">errors()</span>; <span class="k">track</span> error.kind) {
    <span class="t">&lt;p</span> <span class="a">class</span>=<span class="s">"error"</span><span class="t">&gt;</span><span v-mark="{ at: 4, type: 'highlight', color: '#93c5fd' }"><span v-pre>{{ error.message }}</span></span><span class="t">&lt;/p&gt;</span>
  }
}
<span class="t">&lt;button</span> <span class="a">type</span>=<span class="s">"submit"</span> <span class="a">[disabled]</span>=<span class="s">"<span v-mark="{ at: 5, type: 'circle', color: '#16a34a', padding: 6 }">recipeForm()</span>.submitting()"</span><span class="t">&gt;</span>Ajouter<span class="t">&lt;/button&gt;</span></code></pre>

<div class="grid grid-cols-3 gap-3 mt-3 text-sm">
  <div v-click="1" class="p-2 rounded border-l-4 border-rose-600 bg-rose-500/10">
    <b>Appeler</b> le champ donne son état : <code>recipeForm.name</code> = structure, <code>recipeForm.name()</code> = état.
  </div>
  <div v-click="2" class="p-2 rounded border-l-4 border-amber-500 bg-amber-500/10">
    <code>touched()</code>, <code>dirty()</code>, <code>invalid()</code>, <code>pending()</code> : des <b>signals</b>. Utilisables dans un <code>computed()</code>, zéro souscription.
  </div>
  <div v-click="3" class="p-2 rounded border-l-4 border-blue-600 bg-blue-500/10">
    <code>errors()</code> : un tableau d'objets typés. <code>error.kind</code> sert de clé de <code>track</code>.
  </div>
  <div v-click="4" class="p-2 rounded border-l-4 border-sky-400 bg-sky-400/10">
    <code>error.message</code> : le message déclaré <b>dans le schéma</b>, pas recopié dans le template.
  </div>
  <div v-click="5" class="p-2 rounded border-l-4 border-green-600 bg-green-500/10">
    <code>recipeForm()</code> : l'état <b>racine</b>. <code>invalid()</code>, <code>dirty()</code>, <code>submitting()</code>…
  </div>
</div>

<!--
Règle mnémotechnique : sans parenthèses on navigue dans la structure, avec parenthèses on lit l'état. On oublie les parenthèses une fois, puis plus jamais.
-->

---
layout: two-cols
layoutClass: gap-6 !grid-cols-[3fr_2fr]
class: dense code-lg
---

# Signal Forms ⑤ : soumettre

```ts {all|2|3|4-7|8}{at:1}
protected async save(event: Event): Promise<void> {
  event.preventDefault();
  await submit(this.recipeForm, async () => {
    this.recipes.addRecipe({
      ...this.model(),
      imgUrl: '', isFavorite: false, ingredients: [],
    });
    this.recipeForm().reset(EMPTY_DRAFT);
  });
}
```

::right::

<div class="mt-12">

<v-clicks>

- `preventDefault()` : sans directive de formulaire, on bloque soi-même le rechargement de la page.
- `submit()` marque tous les champs `touched`, n'exécute l'action **que si le formulaire est valide** et expose `submitting()` pendant l'`await`.
- `this.model()` : la valeur **est déjà là**, typée. Rien à recopier.
- `reset(valeur)` (v22) efface `touched`/`dirty` **et** remet les valeurs. Le tuteur fait `reset()` + `model.set(…)` : même effet.

</v-clicks>

</div>

<!--
Comparer avec la slide Reactive ④ : la garde de validité et markAllAsTouched ont disparu, absorbées par submit().
-->

---
layout: two-cols
layoutClass: gap-6 !grid-cols-[3fr_2fr]
class: dense code-lg
---

# Bonus v22 : `[formRoot]`

```ts {all|4-9|5-8|6-7}{at:1}
protected readonly recipeForm = form(
  this.model,
  (s) => { /* required, email… */ },
  { submission: {
    action: async (recipe) => {
      this.recipes.addRecipe(toRecipe(recipe().value()));
      recipe().reset(EMPTY_DRAFT);
    },
  } },
);
```

<pre v-click="4" class="slidev-code anno"><code><span class="t">&lt;form</span> <span v-mark="{ at: 4, type: 'circle', color: '#e11d48', padding: 8 }" class="a">[formRoot]</span>=<span class="s">"recipeForm"</span><span class="t">&gt;</span> <span class="c">&lt;!-- plus de (submit) ni de save() --&gt;</span></code></pre>

::right::

<div class="mt-12">

<v-clicks>

- Soumission **déclarée avec le formulaire**, plus dans une méthode.
- `action` : seulement si valide, `submitting()` vrai pendant ; `onInvalid` en option.
- Reçoit l'arbre soumis : `recipe().value()`, `recipe().reset()`.
- `FormRoot` = `novalidate` + `preventDefault()` + `submit()`.

</v-clicks>

</div>

<!--
Stable depuis la v22 (@publicApi 22.0). Pratique pour les formulaires réutilisables : la logique de soumission voyage avec le formulaire. toRecipe() est un simple helper qui complète imgUrl, isFavorite et ingredients.
-->

---
layout: center
class: text-center
---

# Trois questions du terrain

<v-clicks>

<div class="text-xl mt-6">Pourquoi éviter <code>null</code> et <code>undefined</code> dans le modèle ?</div>
<div class="text-xl mt-4">Une règle qui ne s'applique que <b>sous condition</b> ?</div>
<div class="text-xl mt-4">Une règle qui dépend d'<b>un autre champ</b> ?</div>

</v-clicks>

<div v-click class="mt-10 text-sm opacity-70">
Exemples tirés du dépôt : <code>todo-zoneless/…/todo-form-schema.ts</code> et son équivalent Reactive dans <code>todo-zone</code>, chacun avec ses tests.
</div>

<!--
On quitte le fil rouge « recette » pour le code réel des deux apps todo : les règles ajoutées sont testées des deux côtés et visibles en démo (/todos/new).
-->

---
layout: two-cols
layoutClass: gap-6 !grid-cols-[3fr_2fr]
class: dense
---

# `undefined` : le modèle **est** la structure

<!-- bloc écrit à la main (pas Shiki) pour entourer le `?`, le `| null` et le `undefined` -->
<pre class="slidev-code anno tight"><code><span class="k">interface</span> RecipeDraft {
  name: <span class="t">string</span>;
  notes<span v-mark="{ at: 1, type: 'circle', color: '#e11d48', padding: 6 }" class="a">?</span>: <span class="t">string</span>;
  author: <span class="t">Author</span> <span v-mark="{ at: 2, type: 'circle', color: '#f59e0b', padding: 6 }" class="a">| null</span>;
}
<span class="k">const</span> model = signal&lt;RecipeDraft&gt;({ name: <span class="s">''</span>, author: <span class="k">null</span> });
<span class="k">const</span> recipeForm = form(model);
<span v-mark="{ at: 1, type: 'underline', color: '#e11d48', strokeWidth: 3 }">recipeForm.notes</span>          <span class="c">// undefined : aucun champ</span>
<span v-mark="{ at: 2, type: 'underline', color: '#f59e0b', strokeWidth: 3 }">recipeForm.author.name</span>    <span class="c">// undefined : aucun sous-champ</span>
<span class="c">// même initialisé, écrire undefined supprime le champ</span>
<span class="k">const</span> notesField = recipeForm.notes!;
model.update(m =&gt; ({ ...m, notes: <span v-mark="{ at: 3, type: 'circle', color: '#2563eb', padding: 6 }" class="k">undefined</span> }));
<span v-mark="{ at: 3, type: 'underline', color: '#2563eb', strokeWidth: 3 }">notesField().value()</span>      <span class="c">// 💥 NG01902 : champ orphelin</span></code></pre>

::right::

<div class="mt-12">

<div v-click="1">

- `?` = « peut être `undefined` » = **le champ n'existe pas** : la structure du formulaire est *dérivée* du modèle, rien à binder.

</div>
<div v-click="2">

- `null` pour un **objet entier** : pas de sous-champs non plus.

</div>
<div v-click="3">

- Écrire `undefined` plus tard : le champ disparaît, une référence conservée lève **NG01902**.

</div>

<div v-click="4" class="mt-4 p-3 rounded bg-green-500/10 border border-green-500/40 text-sm">
<b>Règle : tout initialiser.</b><br/>
<code>{ name: '', notes: '', author: { name: '', email: '' } }</code><br/>
<span class="opacity-75">Chaque point est vérifié dans <code>signal-forms-model.spec.ts</code>.</span>
</div>

</div>

<!--
Clic 1 : une propriété optionnelle. Pour Signal Forms, undefined ne veut pas dire « vide » mais « absent » : pas de recipeForm.notes, donc pas de [formField].
Clic 2 : même chose pour un objet entier à null : la tentation de form<Draft | null>(signal(null)) pour un formulaire de création. Réponse de la doc : un objet aux feuilles vides (EMPTY_DRAFT).
Clic 3 : écrire undefined après coup orpheline le champ (erreur NG01902, documentée sur angular.dev/errors/NG01902).
Clic 4 : les tests du dépôt prouvent chaque ligne de cette slide sur Angular 22.1 : « vérifier au lieu de deviner ».
-->

---
class: dense
---

# `null` : seulement si le contrôle le comprend

<div class="text-sm opacity-75 -mt-2 mb-2">La valeur « vide » du modèle est celle que le contrôle sait afficher et produire.</div>

<table style="font-size: 0.85em">
  <thead>
    <tr><th>Contrôle</th><th>Vide =</th><th>Type du modèle</th><th>Ce qui se passe sinon</th></tr>
  </thead>
  <tbody>
    <tr v-click="1"><td><code>&lt;input type="text"&gt;</code>, <code>&lt;textarea&gt;</code></td><td><code>''</code></td><td><code>string</code></td><td><code>null</code> → affiché <code>''</code> + avertissement <b>NG01921</b></td></tr>
    <tr v-click="2"><td><code>&lt;input type="number"&gt;</code></td><td><code>null</code></td><td><code>number | null</code></td><td>vidé → <code>null</code>, <b>même si le modèle est typé <code>number</code></b></td></tr>
    <tr v-click="3"><td><code>&lt;input type="date"&gt;</code></td><td><code>null</code> ou <code>''</code></td><td><code>Date | null</code> ou chaîne ISO</td><td><code>TodoFormModel.dueDate</code> reste la chaîne de l'input</td></tr>
    <tr v-click="4"><td><code>&lt;input type="checkbox"&gt;</code></td><td><code>false</code></td><td><code>boolean</code></td><td>—</td></tr>
    <tr v-click="5"><td>contrôle custom « atomique »</td><td><code>null</code></td><td><code>Location | null</code></td><td>OK si le contrôle ne lit jamais <code>lat</code> / <code>lng</code> séparément</td></tr>
  </tbody>
</table>

<div class="grid grid-cols-2 gap-4 mt-3 text-sm">
  <div v-click="6" class="p-3 rounded border-l-4 border-amber-500 bg-amber-500/10">
    <code>required()</code> juge vides <code>''</code>, <code>null</code>, <code>undefined</code>, <code>false</code> et <code>NaN</code>, <b>pas <code>0</code></b> : une case requise doit être cochée, une quantité à 0 est valide.
  </div>
  <div v-click="7" class="p-3 rounded border-l-4 border-blue-600 bg-blue-500/10">
    <b>Modèle de formulaire ≠ modèle métier</b> : <code>EMPTY_TODO_FORM</code> pour créer, <code>linkedSignal</code> pour éditer, conversion vers <code>TodoDraft</code> à la soumission.
  </div>
</div>

<!--
Les lignes 1 et 2 viennent du code source de FormField (signals.mjs) et sont vérifiées par signal-forms-model.spec.ts : un input number vidé écrit null même dans un modèle typé number, donc le type honnête est number | null.
Date : en v22, [formField] sait lier un Date | null (valueAsDate) ou une chaîne. Le dépôt garde la chaîne YYYY-MM-DD, comme le modèle métier.
Clic 6 : la fonction isEmpty du framework. Clic 7 : recommandation de la doc « Designing your form model ».
-->

---
layout: two-cols
layoutClass: gap-6 !grid-cols-[3fr_2fr]
class: dense code-lg
---

# Validation conditionnelle : `when`

```ts {all|1|5-8|6|5-8}{at:1}
export const todoFormSchema = schema<TodoFormModel>((s) => {
  required(s.title, { message: 'Le titre est requis' });
  required(s.dueDate, { message: "L'échéance est requise" });

  required(s.description, {
    when: ({ valueOf }) => valueOf(s.priority) === 'high',
    message: 'Une tâche haute priorité doit être décrite',
  });
});
```

<pre class="slidev-code anno"><code><span class="t">&lt;label&gt;</span>Description
  <span class="k">@if</span> (todoForm.description().<span v-mark="{ at: 4, type: 'circle', color: '#e11d48', padding: 6 }">required()</span>) { <span class="t">&lt;span&gt;</span>*<span class="t">&lt;/span&gt;</span> }
<span class="t">&lt;/label&gt;</span>
<span class="t">&lt;textarea</span> <span v-mark="{ at: 4, type: 'underline', color: '#e11d48', strokeWidth: 3 }" class="a">[formField]</span>=<span class="s">"todoForm.description"</span><span class="t">&gt;&lt;/textarea&gt;</span></code></pre>

::right::

<div class="mt-12">

<v-clicks>

- `schema()` sort les règles du composant : testables seules (`todo-form-schema.spec.ts`).
- Même `required()`, plus une option `when` : la règle ne s'applique que si elle renvoie `true`.
- `valueOf(s.priority)` lit **un autre champ**, comme un signal : repasser en priorité basse retire la règle **et** son erreur, sans code.
- `required` reste une **métadonnée** : `description().required()` affiche l'astérisque et `[formField]` met à jour l'attribut `required` du `<textarea>` (testé).

</v-clicks>

</div>

<!--
Code réel : apps/todo-zoneless/src/app/features/todos/todo-form-schema.ts.
Démo : /todos/new sur le port 4201, passer la priorité à « Haute » → l'astérisque apparaît, le bouton Enregistrer se désactive.
Préférer required({ when }) à un validate() maison : on garde la métadonnée required, utile pour l'accessibilité.
-->

---
layout: two-cols
layoutClass: gap-6 !grid-cols-[3fr_2fr]
class: dense code-lg
---

# Conditionnel : trois outils

<!-- deux étapes de magic-move (clics 1 et 2), les blocs de droite suivent -->
````md magic-move {lines: true}
```ts
// Une règle, une condition
required(s.description, {
  when: ({ valueOf }) => valueOf(s.priority) === 'high',
});
```

```ts
// Un bloc de règles, une condition
const urgent = schema<TodoFormModel>((t) => {
  required(t.description, { message: 'Décrivez la tâche' });
  maxLength(t.title, 40, { message: '40 caractères max.' });
});

applyWhen(
  s,
  ({ value }) => value().priority === 'high',
  urgent,
);
```

```ts
// Le champ sort de la validation
hidden(s.card, {
  when: ({ valueOf }) => valueOf(s.method) !== 'card',
});
hidden(s.bank, {
  when: ({ valueOf }) => valueOf(s.method) !== 'bank',
});
disabled(s.coupon, {
  when: ({ valueOf }) => valueOf(s.total) < 50,
});
```
````

::right::

<div class="mt-12">

- `when` : **une** règle, **une** condition. Accepté par tous les validateurs.

<div v-click="1">

- `applyWhen` : **un bloc** de règles sous une condition. Le bloc est un `schema()` réutilisable.

</div>
<div v-click="2">

- `hidden` / `disabled` : le champ **ne compte plus** dans la validité, `dirty` et `touched` du parent. Template : `@if (!checkout.card().hidden())`.

</div>

<div v-click="3" class="mt-4 p-3 rounded bg-pink-500/10 border border-pink-500/40 text-sm">
Modèle <b>stable</b> : <code>card</code> et <code>bank</code> existent toujours. Changer de moyen de paiement ne perd pas la saisie, une union discriminée si.
</div>

</div>

<!--
v22 : hidden et disabled prennent un objet { when }, la forme « fonction directe » est dépréciée.
Le dernier encadré reprend la doc « Designing your form model » : plutôt que de changer la forme du modèle selon le choix de l'utilisateur, on garde tous les champs et on masque ceux qui ne s'appliquent pas.
Tous ces extraits ont été compilés et exécutés contre Angular 22.1 avant d'arriver sur la slide.
-->

---
layout: two-cols
layoutClass: gap-6 !grid-cols-[3fr_2fr]
class: dense code-lg
---

# Le même besoin en Reactive Forms

```ts {all|3-4|7-11|12|2|all}{at:1}
ngOnInit(): void {
  this.subscription.add(
    this.form.controls.priority.valueChanges
      .pipe(startWith(this.form.controls.priority.value))
      .subscribe((priority) => {
        const description = this.form.controls.description;
        if (priority === 'high') {
          description.setValidators(Validators.required);
        } else {
          description.clearValidators();
        }
        description.updateValueAndValidity();
      }),
  );
}
```

::right::

<div class="mt-12">

<v-clicks>

- On **écoute un flux** de la priorité. Sans `startWith`, l'état initial (en édition) est faux.
- On **branche / débranche** à la main. `setValidators` **remplace** tous les validateurs du contrôle (`addValidators` / `removeValidators` depuis la v12.2).
- Oublier `updateValueAndValidity()` : l'erreur reste périmée jusqu'à la prochaine frappe.
- Une souscription de plus à libérer dans `ngOnDestroy`.
- L'astérisque et `aria-required` : `hasValidator(Validators.required)` et un binding manuel.

</v-clicks>

</div>

<!--
Code réel : apps/todo-zone/src/app/features/todos/todo-form/todo-form.component.ts, testé par todo-form.component.spec.ts.
Comparer avec la slide précédente : en Signal Forms, la condition est déclarée une fois et le framework recalcule. Ici, c'est de la synchronisation impérative, avec quatre façons de se tromper.
Piège bonus : un [required] dans le template ajoute un second validateur (directive RequiredValidator). D'où le [attr.aria-required] dans le dépôt.
-->

---
layout: two-cols
layoutClass: gap-6 !grid-cols-[3fr_2fr]
class: dense code-lg
---

# Validation croisée : `valueOf`

```ts {all|1|2|5-7|3|all}{at:1}
validate(s.dueDate, ({ value, valueOf }) => {
  if (valueOf(s.priority) !== 'high' || value() === '') {
    return null;
  }
  return daysUntil(value()) > URGENT_MAX_DAYS
    ? { kind: 'urgentTooLate', message: URGENT_MESSAGE }
    : null;
});
```

::right::

<div class="mt-12">

<v-clicks>

- La règle est posée **là où l'utilisateur corrigera** : l'échéance, pas la priorité.
- `value()` lit ce champ, `valueOf(s.priority)` **un autre** : changer la priorité réévalue l'échéance (testé).
- Une erreur = `{ kind, message }` : `kind` sert de `track`, `message` s'affiche tel quel.
- `null` = valide. L'échéance vide reste l'affaire de `required` : une erreur à la fois.

</v-clicks>

<div v-click="5" class="mt-4 p-3 rounded bg-pink-500/10 border border-pink-500/40 text-sm">
<code>stateOf(s.password).touched()</code> lit l'<b>état</b> d'un autre champ (confirmation de mot de passe). Ne jamais lire la validité du parent : boucle infinie.
</div>

</div>

<!--
Code réel : todo-form-schema.ts, règle « priorité haute → échéance sous 7 jours ».
Démo : /todos/new, échéance dans un mois, priorité moyenne → valide ; passer en « Haute » → l'erreur apparaît sur l'échéance alors qu'on n'y a pas touché. C'est le test « réévalue l'échéance quand c'est l'AUTRE champ qui change ».
-->

---
layout: two-cols
layoutClass: gap-6 !grid-cols-[3fr_2fr]
class: dense code-lg
---

# Validation croisée en Reactive Forms

```ts {all|1-3|4-5|9-11|all}{at:1}
export const urgentDueDateValidator: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const priority = group.get('priority')?.value;
  const dueDate = group.get('dueDate')?.value;
  if (priority !== 'high' || !dueDate) {
    return null;
  }
  return daysUntil(dueDate) > URGENT_MAX_DAYS
    ? { urgentTooLate: { maxDays: URGENT_MAX_DAYS } }
    : null;
};
```

<pre class="slidev-code anno"><code><span class="t">&lt;span</span> <span class="a">*ngIf</span>=<span class="s">"<span v-mark="{ at: 3, type: 'underline', color: '#e11d48', strokeWidth: 3 }">form.hasError('urgentTooLate')</span> &amp;&amp; …"</span><span class="t">&gt;</span></code></pre>

::right::

<div class="mt-12">

<v-clicks>

- Un validateur de **groupe**, enregistré sur le `FormGroup` : `fb.group({ … }, { validators: … })`.
- Contrôles retrouvés **par leur nom** : `group.get('priority')` renvoie un `any`, une faute de frappe compile.
- L'erreur vit sur le **groupe** : `dueDate.errors` reste `null` (testé). Le template doit aller la chercher.
- La poser sur le contrôle ? `setErrors()` à la main, écrasé à la validation suivante.

</v-clicks>

</div>

<!--
Code réel : apps/todo-zone/src/app/features/todos/todo-form/todo-form.validators.ts (+ spec).
Le getter showUrgentError du composant rattache l'erreur du groupe à l'échéance pour l'affichage : c'est exactement le travail que Signal Forms fait pour nous en posant la règle sur s.dueDate.
-->

---
layout: two-cols
layoutClass: gap-6 !grid-cols-[3fr_2fr]
class: dense code-lg
---

# Plusieurs champs : `validateTree`

```ts {all|1|2|6-11|all}{at:1}
validateTree(s, ({ value, fieldTreeOf }) => {
  const { start, end } = value();
  if (!start || !end || start <= end) {
    return null;
  }
  return [
    { kind: 'range', fieldTree: fieldTreeOf(s.start),
      message: 'Début après la fin' },
    { kind: 'range', fieldTree: fieldTreeOf(s.end),
      message: 'Fin avant le début' },
  ];
});
```

::right::

<div class="mt-12">

<v-clicks>

- Posé sur le **parent** (ici la racine `s`) : la règle porte sur un groupe de champs.
- `value()` = tout le groupe : on raisonne sur l'ensemble.
- **Plusieurs** erreurs, chacune routée vers un enfant par `fieldTree` : `start` et `end` passent en erreur, le parent reste propre.

</v-clicks>

<div v-click="4" class="mt-4 p-3 rounded bg-pink-500/10 border border-pink-500/40 text-sm">
<b>Règle de choix</b> (doc Angular) : <code>validate</code> + <code>valueOf</code> si l'erreur appartient à un champ ; <code>validateTree</code> si la logique porte sur un groupe <b>et</b> cible plusieurs enfants.
</div>

</div>

<!--
Exemple générique (séjour : date d'arrivée / de départ), compilé et exécuté contre Angular 22.1 : les erreurs arrivent bien sur start et end, et stay().errors() reste vide.
La doc Angular illustre le même principe avec une ligne de Sudoku : un seul validateur, une erreur par case en double.
-->

---
class: code-xl
---

# La traduction, en un clic

````md magic-move {lines: true}
```html
<form [formGroup]="recipeForm" (ngSubmit)="save()">
  <input formControlName="name" />
  @if (recipeForm.controls.name.touched
       && recipeForm.controls.name.hasError('required')) {
    <p class="error">Le nom est requis</p>
  }
  <input type="email" formControlName="authorEmail" />
  <button type="submit">Ajouter</button>
</form>
```

```html
<form [formRoot]="recipeForm">
  <input [formField]="recipeForm.name" />
  @if (recipeForm.name().touched()) {
    @for (error of recipeForm.name().errors(); track error.kind) {
      <p class="error">{{ error.message }}</p>
    }
  }
  <input type="email" [formField]="recipeForm.authorEmail" />
  <button type="submit">Ajouter</button>
</form>
```
````

<!--
Un clic : le template Reactive se transforme en template Signal (magic-move). Les lignes qui bougent sont exactement celles de la table suivante.
-->

---
class: dense
---

# Table de correspondance

| Reactive Forms | Signal Forms |
| --- | --- |
| `fb.group({ … })` | `form(signal({ … }))` |
| `Validators.required` sur le contrôle | `required(s.name, { message })` dans le schéma |
| `formControlName="name"` (chaîne) | `[formField]="recipeForm.name"` (typé) |
| `control.touched` | `field().touched()` (signal) |
| `hasError('required')` + message dans le template | `field().errors()` → `error.message` |
| garde `invalid` + `markAllAsTouched()` | `submit()` ou `[formRoot]` |
| `getRawValue()` | `model()` |
| `reset()` | `form().reset(valeur)` |
| `valueChanges` + `setValidators` + `updateValueAndValidity()` | `required(…, { when })`, `applyWhen`, `hidden` |
| validateur de groupe + `form.hasError()` | `validate` + `valueOf`, `validateTree` |
| `ControlValueAccessor` | `FormValueControl` (un `model()` suffit) |

<div v-click class="mt-4 text-sm opacity-80">
Migration au cas par cas : <code>@angular/forms/signals/compat</code> (<code>compatForm</code>, <code>SignalFormControl</code>) fait cohabiter les deux le temps de la transition.
</div>

<!--
À garder sous la main pour migrer un formulaire existant. Le gain principal n'est pas la syntaxe : c'est la disparition de la double source de vérité.
-->

---
layout: two-cols
layoutClass: gap-4
class: dense
---

# Reactive Forms (2016)

```ts
export class TodoFormComponent implements OnInit, OnDestroy {
  form = this.fb.nonNullable.group({
    title: ['', [Validators.required,
                 Validators.minLength(3)]],
    dueDate: ['', Validators.required],
    done: [false],
  });
  private sub = new Subscription();

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private store: Store) {}

  ngOnInit() {
    const todo = this.route.snapshot.data['todo'];
    if (todo) this.form.patchValue(todo);
    this.sub.add(this.form.valueChanges.subscribe(/* … */));
  }
  ngOnDestroy() { this.sub.unsubscribe(); }
}
```

```html
<form [formGroup]="form" (ngSubmit)="save()">
  <input formControlName="title" />
  <p class="error" *ngIf="form.controls.title.touched
      && form.controls.title.hasError('minlength')">…</p>
```

::right::

# Signal Forms (v22, stable)

```ts
export class TodoForm {
  readonly todo = input<Todo>(); // résolu par la route
  // linkedSignal : le modèle se réinitialise si la tâche change
  readonly model = linkedSignal(() => this.todo()
    ? pick(this.todo()!)
    : { title: '', dueDate: '', done: false });
  readonly todoForm = form(this.model, s => {
    required(s.title, { message: 'Le titre est requis' });
    minLength(s.title, 3, { message: '3 caractères min.' });
    required(s.dueDate, { message: 'Échéance requise' });
  });

  save() {
    submit(this.todoForm, async () => { // seulement si valide
      this.store.add(this.model());
      await this.router.navigate(['/todos']);
    });
  }
}
```

```html
<form (submit)="$event.preventDefault(); save()">
  <input [formField]="todoForm.title" />
  @if (todoForm.title().touched()) {
    @for (e of todoForm.title().errors(); track e.kind) {
      <p class="error">{{ e.message }}</p> }
  }
  <button [disabled]="todoForm().invalid()">Enregistrer</button>
```

---
class: dense
---

# Ce que Signal Forms change vraiment

<div class="grid grid-cols-2 gap-8 mt-4">
<div>

### Avant

<v-clicks>

- Le **modèle** vit dans le `FormGroup` ; le vrai objet métier est reconstruit à la soumission.
- Typage arrivé tard (v14), `nonNullable` optionnel, `null` partout.
- Validation = décorateurs de contrôles, logique conditionnelle en `valueChanges` + `setValidators`.
- Souscriptions à nettoyer, `patchValue`, `markAllAsTouched`…
- Sous zoneless, `setValue()` **ne déclenche pas** de rendu.

</v-clicks>

</div>
<div>

### Après

<v-clicks>

- Le **signal est le modèle** : `form(model)`. Pas de double source de vérité.
- Structure et types **dérivés** du modèle : pas d'`undefined`, `null` seulement si le contrôle le comprend.
- Le schéma est une fonction : `required(s.x, { when })`, `applyWhen`, `validateAsync` avec `resource`.
- `field().touched()`, `field().errors()`, `form().invalid()` : tout est signal, tout est réactif, zéro souscription.
- Pas de `ControlValueAccessor` pour les composants custom.

</v-clicks>

</div>
</div>

<v-click>

<div class="mt-6 text-center text-sm opacity-80">
Règle mnémotechnique : <code>form.title</code> = <i>structure</i> ; <code>form.title()</code> = <i>état</i>. On oublie les parenthèses une fois, puis plus jamais.
</div>

</v-click>

---
layout: section
---

# 6. HTTP

---
layout: two-cols
layoutClass: gap-4
class: dense
---

# `HttpClient` + interceptor classe

```ts
@Injectable()
export class LatencyInterceptor implements HttpInterceptor {
  constructor(@Inject(DEMO_LATENCY_MS) private ms: number) {}
  intercept(req: HttpRequest<unknown>, next: HttpHandler) {
    return next.handle(req).pipe(delay(this.ms));
  }
}

@NgModule({
  imports: [HttpClientModule],
  providers: [{ provide: HTTP_INTERCEPTORS,
                useClass: LatencyInterceptor, multi: true }],
})
export class AppModule {}
```

```ts
@Injectable({ providedIn: 'root' })
export class TagsApiService {
  constructor(private http: HttpClient,
              @Inject(API_URL) private api: string) {}
  getAll(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.api}/tags`);
  }
}
// puis : effect NgRx, tags$ | async, ou subscribe/unsubscribe
```

::right::

# `httpResource` + interceptor fonction

```ts
export const latencyInterceptor: HttpInterceptorFn =
  (req, next) => next(req).pipe(delay(inject(DEMO_LATENCY_MS)));

provideHttpClient(withFetch(),
                  withInterceptors([latencyInterceptor]));
```

```ts
@Injectable({ providedIn: 'root' })
export class TagsStore {
  private readonly api = inject(API_URL);
  readonly tags = httpResource<Tag[]>(
    () => `${this.api}/tags`, { defaultValue: [] });
  readonly byId = computed(() =>
    new Map(this.tags.value().map(t => [t.id, t])));
}
```

```html
@if (tags.tags.isLoading()) {
  <p class="loading">Chargement…</p>
}
@for (tag of tags.tags.value(); track tag.id) { … }
```

---

# Ce que `httpResource` change

<v-clicks>

- **Déclaratif** : la requête est une *dérivation* de signaux. Si l'URL dépend d'un `input()`, changer l'input **annule** la requête en cours et relance la suivante.
- `value()`, `isLoading()`, `error()`, `status()`, `reload()` : l'état de chargement est fourni. Plus de `loading = true` à la main.
- Toujours `HttpClient` en dessous : intercepteurs, transfer cache SSR, tests avec `HttpTestingController`.
- `parse` pour valider la réponse avec un schéma (Zod, Valibot…) au lieu de faire confiance au générique.
- Règle : `httpResource` pour **lire**, `HttpClient` pour **muter** (POST/PATCH/DELETE).
- Cousins : `resource()` (loader `async` quelconque), `rxResource()` (loader Observable).

</v-clicks>

---
layout: fact
---

# DÉMO 1
## localhost:4200/todos/new vs localhost:4201/todos/new

<div class="text-base opacity-80 mt-6">
Même formulaire, deux moteurs : titre de 2 lettres → erreur · priorité « Haute » → description requise et échéance sous 7 jours · bouton désactivé tant que c'est invalide · « Chargement des tags… » (400 ms de latence) · quitter sans enregistrer → guard
</div>

<!--
Ouvrir les deux apps côte à côte sur /todos/new, puis le code côte à côte :
- todo-zone : todo-form.component.ts (FormBuilder, Validators, souscriptions) ; le « chargement » des tags est déduit de `tags.length === 0`.
- todo-zoneless : todo-form.ts (`form(model)`) + todo-form-schema.ts (règles conditionnelle et croisée) ; le template lit `tagsStore.tags.isLoading()`, l'état vient de `httpResource`.
- todo-zone : mêmes règles en `valueChanges` + `setValidators` et validateur de groupe (todo-form.validators.ts).
Le comportement est identique à l'écran : c'est tout l'intérêt. La différence est dans la quantité de code et dans ce qu'on n'a plus à gérer.
-->

---
layout: section
---

# 7. SSR et hydratation

---
layout: two-cols
layoutClass: gap-6
class: dense
---

# Deux apps, deux niveaux de SSR

```ts
// todo-zone : NgModule côté serveur
@NgModule({
  imports: [AppModule],
  providers: [provideServerRendering(withRoutes(serverRoutes))],
  bootstrap: [AppComponent],
})
export class AppServerModule {}

// app.module.ts
provideClientHydration(withEventReplay())
```

```ts
// todo-zoneless : fonctions partout
const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(App, config, context);

// app.config.ts
provideClientHydration(withEventReplay(),
                       withIncrementalHydration())
```

```ts
// commun : app.routes.server.ts
export const serverRoutes: ServerRoute[] = [
  { path: 'about', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Server },
];
```

::right::

<v-clicks>

- **SSR** : le HTML de `/todos` arrive rempli depuis le serveur Node (Express + `AngularNodeAppEngine`). Visible dans `curl`.
- **Hydratation** (v16) : Angular réutilise le DOM serveur au lieu de le recréer (attributs `ngh`).
- **Event replay** : les clics faits avant que le JS arrive sont rejoués.
- **Transfer cache** : la réponse HTTP du serveur est sérialisée dans la page ; le client ne refait pas la requête.
- **Hydratation incrémentale** (v19 → stable v20) : un bloc `@defer (hydrate on viewport)` n'embarque son JS **que** quand il devient visible.
- **Leçon apprise** : charger les todos via un **resolver**, pas dans `onInit` du store, sinon l'hydratation clignote.

</v-clicks>

<v-click>

<div class="mt-2 text-sm p-2 rounded bg-emerald-500/10 border border-emerald-500/40">
Pourquoi zoneless aide le SSR : sans zone.js, Angular sait <b>exactement</b> quand l'app est stable (<code>PendingTasks</code>) au lieu d'attendre que la zone se vide.
</div>

</v-click>

<!--
SSR : dans `curl`, les `<li class="todo-item">` sont là.
Hydratation incrémentale : -40 à -50 % de LCP mesuré par l'équipe Angular.
Leçon apprise : charger les todos dans `onInit` du store fait repartir le client en `loading` pendant l'hydratation. Le resolver fait attendre le router côté serveur et rejoue la même réponse depuis le transfer cache côté client. Même DOM, zéro flicker.
-->

---
layout: two-cols
layoutClass: gap-6
class: dense
---

# Ce que le serveur écrit dans la page

```html {all|1|2-4|5-7|8-10|11}
<zl-todo-item class="todo-item" ngh="1">
  <input type="checkbox" jsaction="change:;">
<script>__jsaction_bootstrap(document.body, "ng",
  ["click", "input", "change"], [])</script>
<script id="ng-state" type="application/json">{
  "e480af…": { "u": "http://localhost:3000/todos", "b": [ … ] },
  "99dcee…": { "u": "http://localhost:3000/tags",  "b": [ … ] },
  "__nghData__": { "0": { … }, "1": { … } },
  "__nghDeferData__": { "d0": { … } }
}</script>
<zl-priority-breakdown class="card" ngh="0">
```

<div class="text-xs opacity-70 mt-2">Extrait de la source de <code>/todos</code> et <code>/stats</code> (todo-zoneless, SSR).</div>

::right::

<div class="mt-12">

| Dans le HTML | Notion |
| --- | --- |
| `ngh="1"` | **Hydratation** : index vers `__nghData__`, la structure du DOM à réutiliser |
| `jsaction="change:;"` | **Event replay** : cet élément a un listener, l'événement est capturé |
| `__jsaction_bootstrap(…)` | le petit script inline qui enregistre les clics **avant** le JS d'Angular |
| `ng-state` → `u` / `b` | **Transfer cache** : URL et corps des réponses faites côté serveur |
| les deux clés `/todos` et `/tags` | resolver (`HttpClient`) **et** `httpResource` : même cache |
| `__nghDeferData__` | **Hydratation incrémentale** : état du bloc `@defer` pas encore hydraté |

</div>

<!--
Slide de lecture avant la démo : c'est ce que le public va voir en ouvrant "Afficher la source". Chaque clic surligne un marqueur.

Réseau : au premier chargement, onglet Fetch/XHR vide, les réponses viennent de ng-state. Cliquer "Recharger" → la requête apparaît : le cache ne sert que pendant l'hydratation.
-->

---
layout: two-cols
layoutClass: gap-8
---

# Hydratation incrémentale

```html
<!-- stats.html (todo-zoneless) -->
@defer (hydrate on viewport) {
  <zl-priority-breakdown
    [byPriority]="stats().byPriority"
    [total]="stats().total" />
} @placeholder {
  <div class="card">Répartition par priorité…</div>
}
```

::right::

<div class="mt-12">

<v-clicks>

- Le serveur rend le bloc **complet** (SEO, LCP).
- Le client ne télécharge et n'exécute son JS qu'au déclencheur : `on viewport`, `on interaction`, `on hover`, `on idle`, `on timer(…)`, `when cond`.
- Avant ça, le DOM serveur reste tel quel, et les événements sont **rejoués** après hydratation.

</v-clicks>

</div>

---
layout: fact
---

# DÉMO 2
## http://localhost:4201/stats

<div class="text-left text-sm mt-6 mx-auto max-w-2xl">

```bash
pnpm nx serve todo-zoneless -c development-ssr   # :4201
curl -s localhost:4201/todos | grep -o 'todo-item' | wc -l
```

</div>

<div class="text-base opacity-80 mt-4">
« Afficher la source » : <code>ngh</code>, <code>ng-state</code> · Network en « Slow 3G » : le chunk du bloc <code>@defer</code> n'arrive qu'au scroll · <code>todo-zone</code> (:4200) : même HTML, mais tout le JS d'un bloc
</div>

<!--
Sans `-c development-ssr`, `serve` tourne en CSR (confort de dev : appels visibles dans Network).
Sur /stats, descendre jusqu'au bloc « Répartition par priorité » : le chunk séparé apparaît dans l'onglet Network à ce moment-là seulement.
-->

---
layout: section
---

# Angular + IA

---
class: dense
---

# angular.dev/ai : la boîte à outils

<div class="grid grid-cols-2 gap-6 mt-2">
<div>

<v-clicks>

- **`llms.txt` / `llms-full.txt`** : la doc compilée pour un LLM.
- **Best practices** : un fichier de règles à coller dans `CLAUDE.md`, `.cursorrules`, `GEMINI.md`.
- **Skill `angular-developer`** ([angular/skills](https://github.com/angular/skills)) : `SKILL.md` + 40 fiches de référence (signals, Signal Forms, `httpResource`, SSR, tests, a11y…). Installé chez vous : `npx skills add angular/skills`.
- **Serveur MCP `angular-cli`** : la CLI parle à votre agent.
- **AI Tutor** : un cours interactif de 21 modules piloté par le MCP.
- **WebMCP** (v22, expérimental) : exposer votre app et ses Signal Forms à un agent **dans le navigateur**.

</v-clicks>

</div>
<div>

```json
// .mcp.json · .cursor/mcp.json · .gemini/settings.json
{
  "mcpServers": {
    "angular-cli": {
      "command": "npx",
      "args": ["-y", "@angular/cli", "mcp"]
    }
  }
}
```

| Outil MCP | Rôle |
| --- | --- |
| `get_best_practices` | les règles officielles |
| `search_documentation` | recherche sur angular.dev |
| `list_projects` | lit `angular.json` |
| `onpush_zoneless_migration` | **plan de migration** OnPush → zoneless |
| `run_target`, `devserver.*` | build / test / serve |
| `ai_tutor` | lance le tutoriel |

<div class="text-xs opacity-70 mt-2">Options : <code>--read-only</code>, <code>--local-only</code></div>

</div>
</div>

<!--
Le framework se met à documenter pour les machines : la DX inclut maintenant l'agent.
- Skill et MCP servent d'abord à empêcher l'agent d'utiliser des API obsolètes, et à lui donner les nouvelles (Signal Forms n'existe pas dans ses données d'entraînement).
- `onpush_zoneless_migration` est exactement l'outil qu'on aurait utilisé pour passer de `todo-zone` à `todo-zoneless`.
- Le tutor enseigne le nouveau Angular : signals, `resource`, Signal Forms. Pas de NgModule dans les 21 modules.
Le « pourquoi c'est notre responsabilité » vient en fin de talk (slide « L'IA code comme en 2019 »).
-->

---
layout: fact
---

# DÉMO 3
## Skill · MCP · AI Tutor

<div class="text-left text-sm mt-6 mx-auto max-w-2xl">

```text
/angular-developer différence entre resource(), httpResource() et rxResource() ?
```

```text
Utilise onpush_zoneless_migration du MCP angular-cli
sur apps/todo-zone/src/app/features/todos
et propose un plan. Ne modifie aucun fichier.
```

```text
pnpm nx g @nx/angular:application apps/smart-recipe --prefix=sra
claude
> launch the Angular AI tutor
> Set my experience level to advanced · Jump to the Signal Forms lesson
```

</div>

<!--
Script complet et plan B dans docs/demo-ai-tutor.md
-->

---
layout: section
---

# Pourquoi Angular a tout changé

---
class: dense
---

# Avantages / inconvénients

| | zone.js · NgModules · NgRx classique | zoneless · signals · signalStore |
| --- | --- | --- |
| **Rendu** | ✅ automatique, « ça marche tout seul »<br>❌ `tick()` global à chaque événement | ✅ granulaire, prévisible, plus rapide<br>❌ il faut *prévenir* Angular (signal, `markForCheck`) |
| **Bundle** | ❌ +~30 ko de zone.js, monkey-patching | ✅ pas de polyfill, meilleurs Core Web Vitals |
| **Debug** | ❌ stack traces zone, `ExpressionChanged…` mystérieux | ✅ stack traces natives, graphe de dépendances explicite |
| **État** | ✅ traçable, DevTools, patterns éprouvés<br>❌ boilerplate, indirection | ✅ concis, dérivations mémoïsées<br>❌ moins de « time travel », discipline requise |
| **Formulaires** | ✅ mûr, énorme écosystème<br>❌ `null`, souscriptions, CVA | ✅ modèle = signal, typé, sans souscription<br>❌ jeune (stable v22), écosystème tiers en cours |
| **HTTP** | ✅ `HttpClient` universel<br>❌ gestion du loading à la main | ✅ `httpResource` : état fourni, annulation auto<br>❌ lecture seule, mutations toujours impératives |
| **SSR** | ✅ possible (NgModule serveur)<br>❌ stabilité = « zone vide », fragile | ✅ `PendingTasks`, hydratation incrémentale, event replay |
| **Écosystème** | ✅ 10 ans de libs et de réponses StackOverflow | ❌ libs tierces à vérifier (compat zoneless / OnPush) |
| **Courbe** | ✅ connu de toutes les équipes | ❌ réactivité fine à apprendre, mais **une seule** primitive |

---
class: dense
---

# Pourquoi, en une phrase par changement

<v-clicks>

- **Standalone** (v14→19) : les NgModules dupliquaient l'information déjà présente dans les imports TypeScript. Le compilateur Ivy n'en avait plus besoin.
- **`inject()`** : la DI par constructeur empêchait l'héritage propre et les fonctions (guards, resolvers, interceptors).
- **Signals** (v16→20) : Angular ne savait pas *quoi* avait changé, seulement *que* quelque chose avait peut-être changé. Les signals donnent le graphe de dépendances exact.
- **Zoneless** (v18→20.2) : une fois le graphe connu, le monkey-patching devient un coût pur. Et zone.js ne peut pas patcher `async/await` natif.
- **`@if/@for/@defer`** (v17) : les directives structurelles étaient des composants déguisés ; les blocs sont compilés, plus rapides, et `@defer` était impossible avant.
- **Signal Forms** (v21→22) : les Reactive Forms ont été conçues pour RxJS et zone.js ; sous zoneless, `setValue()` ne rafraîchissait plus rien.
- **OnPush par défaut** (v22) : le framework aligne enfin le défaut sur ce qu'il recommandait depuis 2016.

</v-clicks>

---
layout: section
---

# Par où commencer

---
class: dense
---

# Un chemin de migration incrémental

<v-clicks>

1. **Mettre à jour** : `ng update` jusqu'à la dernière LTS. Chaque version a ses migrations automatiques (`ng g @angular/core:standalone`, `:control-flow`, `:inject`, `:signal-inputs`, `:cleanup-unused-imports`).
2. **Standalone + `inject()`** : migrations automatiques, aucun risque fonctionnel.
3. **`@if/@for`** : migration automatique, `track` obligatoire → on découvre les listes sans `trackBy`.
4. **OnPush partout** : demander un plan à `onpush_zoneless_migration`. Commencer par les feuilles. Les bugs qui apparaissent sont de **vrais** bugs (mutation d'inputs) qui existaient déjà.
5. **Signals dans les composants** : `input()`, `output()`, `viewChild()`, `toSignal()` sur les Observables existants. Les `BehaviorSubject` d'état deviennent des `signal()`.
6. **Store** : `@ngrx/store` et `@ngrx/signals` **cohabitent**. Nouvelle feature → `signalStore`. `store.selectSignal()` fait le pont.
7. **Zoneless** : `provideZonelessChangeDetection()` (v20) ou rien (v21+). Retirer `zone.js` des `polyfills`. Les tests passent à `await fixture.whenStable()`.
8. **Signal Forms** pour les nouveaux formulaires seulement. Les anciens continuent de marcher.

</v-clicks>

<v-click>

<div class="mt-4 text-center text-sm opacity-80">
Chaque étape compile, se déploie, et se mesure. C'est le vrai exploit d'Angular : dix ans de changements sans « big bang ».
</div>

</v-click>

---
layout: two-cols
layoutClass: gap-8
class: dense
---

# L'IA code comme en 2019

<v-clicks>

- Les LLM ont appris sur **dix ans** de NgModules, `*ngIf`, `@Input()`, `subscribe()`. Statistiquement, « du code Angular », c'est ça.
- Signal Forms, `httpResource`, zoneless par défaut : **absents** ou très minoritaires dans leurs données d'entraînement.
- Résultat : du code qui compile, qui marche… et qui ressemble à `todo-zone`.

</v-clicks>

<v-click>

```ts
// « Fais-moi un composant qui liste les todos »
@Component({ selector: 'app-todos', template: `
  <li *ngFor="let t of todos">{{ t.title }}</li>` })
export class TodosComponent implements OnInit {
  @Input() filter = 'all';
  todos: Todo[] = [];
  constructor(private http: HttpClient) {}
  ngOnInit() { this.http.get<Todo[]>('/api/todos')
    .subscribe(t => this.todos = t); }
}
```

</v-click>

::right::

### Notre responsabilité

<v-clicks>

1. **Relire** : reconnaître dans quel « Angular » est écrit le code généré. C'est la grille de lecture de ce talk.
2. **Outiller l'agent** : skill `angular-developer`, MCP `angular-cli`, best practices dans `AGENTS.md` / `CLAUDE.md`.
3. **Verrouiller** : lint, `@nx/enforce-module-boundaries`, tests, build en CI. Ce que la CI refuse, l'agent ne le merge pas.

</v-clicks>

<v-click>

<div class="mt-6 p-3 rounded bg-sky-500/10 border border-sky-500/40">
L'agent écrit le code. <b>Vous restez responsable de ce qu'il vaut.</b>
</div>

</v-click>

<!--
Le message le plus important du talk. Tout ce qu'on a vu (zone.js vs signals, NgRx vs signalStore, Reactive vs Signal Forms) sert à ça : savoir juger du code qu'on n'a pas écrit.
Faire compter dans l'extrait : *ngFor, @Input(), constructor injection, subscribe sans unsubscribe, champ muté hors signal → en zoneless (défaut v22), la liste reste vide tant que rien d'autre ne déclenche un rendu.
-->

---
layout: two-cols
layoutClass: gap-8
---

# À retenir

<v-clicks>

- zone.js a rendu Angular **facile** en 2016 et **coûteux** en 2024.
- `OnPush` était déjà le contrat du zoneless. Migrer vers `OnPush`, c'est 90 % du travail.
- Les signals ne sont pas « un state manager de plus » : c'est le **moteur de rendu** qui change.
- Signal Forms, `httpResource`, `signalStore` : la même idée appliquée aux formulaires, au réseau, à l'état.
- SSR + hydratation incrémentale : la promesse « pas de JS tant qu'on n'en a pas besoin ».
- L'IA code comme en 2019 : **relire, outiller** (skill, MCP), **verrouiller** (lint, CI). C'est vous qui jugez.

</v-clicks>

::right::

# Pour aller plus loin

- Le dépôt de cette démo : `angular-workshop/` (README, `docs/pros-cons.md`, `docs/demo-ai-tutor.md`, `docs/demo-devtools.md`)
- https://angular.dev/guide/zoneless
- https://angular.dev/guide/signals
- https://angular.dev/guide/forms/signals
- https://angular.dev/guide/hydration
- https://angular.dev/ai · https://angular.dev/ai/mcp · https://angular.dev/ai/ai-tutor
- https://angular.dev/tools/devtools · https://angular.dev/best-practices/profiling-with-chrome-devtools
- https://developer.chrome.com/docs/devtools/overrides · https://github.com/ChromeDevTools/chrome-devtools-mcp
- https://ngrx.io/guide/signals
- https://github.com/angular/skills

<div class="mt-8 text-sm opacity-70">
Questions ?
</div>

---
layout: two-cols
layoutClass: gap-8
class: dense
---

# À vous : la chasse aux pièges

<div class="p-3 rounded bg-amber-500/10 border border-amber-500/40">
Une IA a ouvert une PR sur <code>main</code>. Elle compile, le lint passe, les tests sont verts.<br/>
<b>Et pourtant, les deux apps sont piégées.</b>
</div>

<v-clicks>

- **10 pièges** dans `todo-zone`, `todo-zoneless` et l'API : 4 🟢 · 5 🟡 · 1 🔴.
- **2 bonus SSR** 🔴, visibles seulement avec `pnpm nx serve todo-zone -c development-ssr`.
- En binôme, 45 minutes.

</v-clicks>

::right::

<v-click>

### Pour chaque piège, notez

1. le **symptôme** à l'écran ;
2. l'**outil DevTools** qui l'a révélé ;
3. le **fichier** fautif ;
4. le **correctif**.

</v-click>

<v-click>

### Barème

🟢 1 pt · 🟡 2 pts · 🔴 3 pts · +1 si vous expliquez **pourquoi** un agent a pu l'écrire.

</v-click>

<v-click>

<div class="mt-4 text-sm opacity-80">
DevTools d'abord, le code ensuite. Interdit de demander à une IA de lire le code à votre place.
</div>

</v-click>
