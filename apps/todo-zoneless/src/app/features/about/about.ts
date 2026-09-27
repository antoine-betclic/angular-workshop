import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'zl-about',
  templateUrl: './about.html',
  styles: `
    ::ng-deep .card {
      border-left: 4px solid var(--accent);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class About {
  protected readonly stack = [
    'Angular 22.1 — standalone, zoneless (pas de zone.js), OnPush partout',
    'Signals : signal(), computed(), linkedSignal(), input()/output(), viewChildren()',
    '@ngrx/signals : signalStore + withEntities + rxMethod (tapResponse de @ngrx/operators)',
    'httpResource pour les lectures, HttpClient (withFetch) + interceptor fonctionnel pour les mutations',
    'Signal Forms (@angular/forms/signals) : form(), [formField], required/minLength, submit()',
    'Routing : loadChildren/loadComponent, resolver fonctionnel, guard canDeactivate, withComponentInputBinding',
    'Templates : @if/@for/@switch/@defer, animate.enter / animate.leave, hostDirectives, host: {}',
    'SSR @angular/ssr : RenderMode.Server + Prerender, hydratation incrémentale (@defer hydrate on viewport), event replay',
    'Tests Vitest zoneless : await fixture.whenStable(), pas de detectChanges()',
  ];

  protected readonly pros = [
    'Rendu uniquement là où un signal a changé',
    'Pas de zone.js : bundle plus léger, meilleurs Core Web Vitals',
    'Stack traces lisibles',
    'Moins de boilerplate (signalStore, httpResource, Signal Forms)',
    'Compatible SSR / hydratation incrémentale',
    'Code plus déclaratif',
  ];

  protected readonly cons = [
    'Il faut « prévenir » Angular (signals, markForCheck, AsyncPipe) sinon rien ne se rafraîchit',
    'Migration des libs tierces non compatibles',
    'Signal Forms encore jeune (v22)',
    'Apprentissage de la réactivité fine',
  ];
}
