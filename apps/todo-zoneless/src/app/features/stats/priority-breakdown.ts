import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PRIORITIES, Priority } from '@angular-workshop/shared/models';

const LABELS: Record<Priority, string> = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
};

/**
 * Composant chargé dans un bloc `@defer (hydrate on viewport)` :
 * rendu côté serveur, mais son JS n'est téléchargé et hydraté que lorsqu'il devient visible.
 */
@Component({
  selector: 'zl-priority-breakdown',
  host: { class: 'card' },
  template: `
    <h3>Répartition par priorité</h3>
    @for (row of rows(); track row.priority) {
      <div class="field">
        <div>
          <span [class]="['badge', row.priority]">{{ row.label }}</span>
          {{ row.count }} tâche{{ row.count > 1 ? 's' : '' }}
        </div>
        <div class="bar"><span [style.width.%]="row.percent"></span></div>
      </div>
    }
    <p class="hint">Hydraté à l'apparition dans le viewport (<code>&#64;defer (hydrate on viewport)</code>).</p>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriorityBreakdown {
  readonly byPriority = input.required<Record<Priority, number>>();
  readonly total = input.required<number>();

  protected readonly rows = computed(() =>
    PRIORITIES.map((priority) => {
      const count = this.byPriority()[priority];
      return {
        priority,
        label: LABELS[priority],
        count,
        percent: this.total() ? Math.round((count / this.total()) * 100) : 0,
      };
    }),
  );
}
