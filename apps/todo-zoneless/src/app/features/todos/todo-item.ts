import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Priority, Tag, Todo } from '@angular-workshop/shared/models';
import { Overdue } from '../../shared/overdue';
import { RelativeDue } from '../../shared/relative-due';
import { TagChip } from '../../shared/tag-chip';

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Basse',
  medium: 'Moyenne',
  high: 'Haute',
};

/**
 * Item de liste : `input()` / `output()` typés, classes d'hôte via `host: {}`,
 * directive `zlOverdue` appliquée à l'hôte via `hostDirectives` (son input est
 * alimenté par notre propre `todo`).
 */
@Component({
  selector: 'zl-todo-item',
  imports: [RouterLink, RelativeDue, TagChip],
  hostDirectives: [{ directive: Overdue, inputs: ['zlOverdue: todo'] }],
  host: {
    class: 'todo-item',
    role: 'listitem',
    '[class.done]': 'todo().done',
  },
  templateUrl: './todo-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoItem {
  readonly todo = input.required<Todo>();
  readonly tagsById = input<ReadonlyMap<string, Tag>>(new Map());

  readonly toggled = output<string>();
  readonly removed = output<string>();

  protected readonly priorityLabel = computed(
    () => PRIORITY_LABELS[this.todo().priority],
  );

  protected readonly tags = computed(() =>
    this.todo()
      .tags.map((id) => this.tagsById().get(id))
      .filter((tag): tag is Tag => tag !== undefined),
  );
}
