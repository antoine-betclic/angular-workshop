import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Page statique : prerendue au build (RenderMode.Prerender). */
@Component({
  selector: 'zn-about',
  standalone: false,
  // v22 : OnPush est le défaut, Default (= Eager) doit être explicite
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './about.component.html',
})
export class AboutComponent {
  readonly stack = [
    'Angular 22.1 avec le polyfill zone.js et le bootstrap par NgModule (`platformBrowser().bootstrapModule`)',
    'Change detection `Default` partout, `OnPush` sur TodoItemComponent et la carte OnPush du labo',
    'Templates historiques : `*ngIf`, `*ngFor`, `ngSwitch`, pipe `async`',
    '`@Input()` / `@Output()` décorateurs, injection par constructeur',
    'État : @ngrx/store + @ngrx/effects + @ngrx/entity (actions, reducer, sélecteurs, effets)',
    'HTTP : `HttpClientModule` + interceptor classe fourni via `HTTP_INTERCEPTORS`',
    'Formulaires : Reactive Forms typés (`FormBuilder.nonNullable`)',
    'Animations : DSL `@angular/animations` (`trigger`, `transition`, `animate`)',
    'Routing : `loadChildren` vers des NgModules, resolver et guard fonctionnels',
    'SSR : `AppServerModule` + `provideClientHydration(withEventReplay())`',
  ];

  readonly pros = [
    '« ça marche tout seul » : zone.js patche les API asynchrones, Angular se rafraîchit sans qu’on y pense',
    'Énorme écosystème et documentation, dix ans de réponses sur Stack Overflow',
    'Patterns NgRx éprouvés, prévisibles et très testables (reducers purs)',
    'Migration progressive possible : tout ce code tourne encore tel quel en Angular 22',
  ];

  readonly cons = [
    'Change detection sur toute l’arborescence à chaque événement (voir le Labo CD)',
    'Coût du polyfill zone.js (~30 ko) et du monkey-patching des API natives',
    'Debugging difficile : stack traces polluées par zone.js',
    'Boilerplate NgRx : actions / reducers / effects / sélecteurs pour chaque feature',
    'Pipe `async` et souscriptions partout (et `ngOnDestroy` pour les libérer)',
    'Incompatibilités avec les API natives modernes (async/await non patché dans certains cas, Web Workers…)',
  ];
}
