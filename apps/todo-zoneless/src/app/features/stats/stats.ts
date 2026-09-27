import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TodoStore } from '../../store/todo-store';
import { PriorityBreakdown } from './priority-breakdown';

/** Les statistiques sont un `computed` du store : rien à recalculer à la main. */
@Component({
  selector: 'zl-stats',
  imports: [PriorityBreakdown],
  templateUrl: './stats.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Stats {
  private readonly store = inject(TodoStore);
  protected readonly stats = this.store.stats;
}
