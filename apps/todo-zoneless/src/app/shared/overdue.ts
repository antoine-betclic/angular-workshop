import { Directive, computed, input } from '@angular/core';
import { Todo } from '@angular-workshop/shared/models';
import { todayIso } from './dates';

/**
 * Ajoute la classe `overdue` si la tâche n'est pas terminée et que son échéance est passée.
 * `host: {}` remplace `@HostBinding`, `input()` remplace `@Input()`.
 */
@Directive({
  selector: '[zlOverdue]',
  host: { '[class.overdue]': 'isOverdue()' },
})
export class Overdue {
  readonly todo = input.required<Todo>({ alias: 'zlOverdue' });

  protected readonly isOverdue = computed(() => {
    const todo = this.todo();
    return !todo.done && todo.dueDate < todayIso();
  });
}
