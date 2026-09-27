import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Tag, Todo } from '@angular-workshop/shared/models';
import { PRIORITY_LABELS } from '../../../shared/priority-labels';

/**
 * Seul composant OnPush de la feature : il ne se re-rend que si la référence
 * de `todo` change (le reducer produit un nouvel objet à chaque mutation).
 */
@Component({
  selector: 'zn-todo-item',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './todo-item.component.html',
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Input() tagsById: Record<string, Tag> = {};
  @Output() toggled = new EventEmitter<string>();
  @Output() removed = new EventEmitter<string>();

  readonly priorityLabels = PRIORITY_LABELS;

  tagLabel(id: string): string {
    return this.tagsById[id]?.label ?? id;
  }

  tagColor(id: string): string {
    return this.tagsById[id]?.color ?? '#64748b';
  }
}
