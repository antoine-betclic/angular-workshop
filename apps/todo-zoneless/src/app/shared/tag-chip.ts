import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** Chip colorée : projection de contenu + binding de style sur l'hôte. */
@Component({
  selector: 'zl-tag-chip',
  template: '<ng-content />',
  host: {
    class: 'tag',
    '[style.background]': 'color()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagChip {
  readonly color = input.required<string>();
}
