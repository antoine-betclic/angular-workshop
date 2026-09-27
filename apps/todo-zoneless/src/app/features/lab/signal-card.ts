import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  afterNextRender,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { RenderCounter } from './render-counter';

export type SignalCardMode = 'signal' | 'plain' | 'events';

/**
 * Carte du labo zoneless. Trois modes, une seule règle : Angular ne re-rend une vue
 * que si un signal lu par son template a changé (ou si un événement / markForCheck la marque dirty).
 */
@Component({
  selector: 'zl-signal-card',
  templateUrl: './signal-card.html',
  host: { class: 'card lab-card signals' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalCard {
  readonly heading = input.required<string>();
  readonly mode = input.required<SignalCardMode>();
  readonly logged = output<string>();

  private readonly cdr = inject(ChangeDetectorRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly counter = new RenderCounter(
    inject(ElementRef),
    this.isBrowser,
  );

  /** Mode « signal » : l'état est un signal, le template s'y abonne tout seul. */
  readonly count = signal(0);

  /** Mode « plain » : champ ordinaire, invisible pour la réactivité. */
  plain = 0;

  /** Mode « events » : événement déclaré dans le template vs listener DOM manuel. */
  readonly moves = signal(0);
  plainMoves = 0;

  constructor() {
    const destroyRef = inject(DestroyRef);
    // Listener posé « à la main », hors template : Angular ne le voit pas.
    afterNextRender(() => {
      const onMove = () => {
        this.plainMoves++;
      };
      document.addEventListener('mousemove', onMove);
      destroyRef.onDestroy(() => document.removeEventListener('mousemove', onMove));
    });
  }

  protected incrementSignal(): void {
    this.count.update((c) => c + 1);
    this.logged.emit(
      `[${this.heading()}] count.update() → ${this.count()} : seule cette carte se re-rend`,
    );
  }

  protected mutatePlainLater(): void {
    this.logged.emit(
      `[${this.heading()}] clic (1 rendu dû à l'événement) puis setTimeout(plain++) → aucun rendu, l'affichage reste à ${this.plain}`,
    );
    setTimeout(() => {
      this.plain++;
    });
  }

  protected mutatePlainAndMark(): void {
    this.logged.emit(
      `[${this.heading()}] setTimeout(plain++) + markForCheck() → la carte se re-rend`,
    );
    setTimeout(() => {
      this.plain++;
      this.cdr.markForCheck();
    });
  }

  protected onMove(): void {
    this.moves.update((m) => m + 1);
  }

  reset(): void {
    this.count.set(0);
    this.plain = 0;
    this.moves.set(0);
    this.plainMoves = 0;
    this.counter.reset();
    this.cdr.markForCheck();
  }
}
