import { Directive, HostBinding, Input } from '@angular/core';
import { Todo } from '@angular-workshop/shared/models';
import { toIsoDay } from './date-utils';

/** Ajoute la classe `overdue` si la tâche n'est pas terminée et que son échéance est passée. */
@Directive({
  selector: '[znOverdue]',
  standalone: false,
})
export class OverdueDirective {
  @Input('znOverdue') todo!: Todo;

  @HostBinding('class.overdue')
  get isOverdue(): boolean {
    return !!this.todo && !this.todo.done && this.todo.dueDate < toIsoDay(new Date());
  }
}
