import { ElementRef } from '@angular/core';

/**
 * Compte les évaluations du template d'une carte.
 * Appelé depuis le template : `{{ counter.track() }}` (retourne '' pour ne rien afficher).
 * - Dédoublonne les 2 passes du mode dev (checkNoChanges) via `queueMicrotask`.
 * - Écrit **directement dans le DOM** (pas via binding) pour ne pas déclencher
 *   d'`ExpressionChangedAfterItHasBeenChecked` ni de nouveau cycle de CD.
 * - Pas de `NgZone` ici : l'app est zoneless, rien à sortir de la zone.
 */
export class RenderCounter {
  renders = 0;
  private scheduled = false;

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    /** `false` côté serveur : pas de DOM à animer pendant le SSR. */
    private readonly enabled = true,
  ) {}

  track(): string {
    if (this.enabled && !this.scheduled) {
      this.scheduled = true;
      queueMicrotask(() => {
        this.scheduled = false;
        this.renders++;
        this.paint();
      });
    }
    return '';
  }

  reset(): void {
    this.renders = 0;
    if (this.enabled) this.paint(false);
  }

  private paint(flash = true): void {
    const el = this.host.nativeElement;
    const badge = el.querySelector<HTMLElement>('.render-count');
    if (badge) badge.textContent = String(this.renders);
    if (flash) {
      el.classList.remove('flash');
      void el.offsetWidth;
      el.classList.add('flash');
    }
  }
}
