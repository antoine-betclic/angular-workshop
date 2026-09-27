import { ElementRef, NgZone } from '@angular/core';

/**
 * Compte les évaluations du template d'une carte du labo.
 *
 * - Appelé depuis le template : `{{ counter.track() }}` (retourne '' pour ne rien afficher).
 * - Dédoublonne les 2 passes du mode dev (checkNoChanges) via queueMicrotask.
 * - Tourne hors zone pour ne pas relancer une change detection.
 * - Écrit directement dans le DOM (pas de binding) pour éviter ExpressionChangedAfterItHasBeenChecked.
 */
export class RenderCounter {
  renders = 0;
  private scheduled = false;

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private readonly zone: NgZone,
  ) {}

  track(): string {
    if (!this.scheduled) {
      this.scheduled = true;
      this.zone.runOutsideAngular(() =>
        queueMicrotask(() => {
          this.scheduled = false;
          this.renders++;
          const el = this.host.nativeElement;
          const badge = el.querySelector<HTMLElement>('.render-count');
          if (badge) badge.textContent = String(this.renders);
          el.classList.remove('flash');
          void el.offsetWidth; // force le reflow pour relancer l'animation CSS
          el.classList.add('flash');
        }),
      );
    }
    return '';
  }

  /** Le badge sera repeint au prochain rendu de la carte. */
  reset(): void {
    this.renders = 0;
  }
}
