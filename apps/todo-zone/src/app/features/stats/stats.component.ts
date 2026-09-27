import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Priority, TodoStats } from '@angular-workshop/shared/models';
import { PRIORITY_LABELS } from '../../shared/priority-labels';
import { selectStats, selectStatus, TodoActions } from '../../store';

@Component({
  selector: 'zn-stats',
  standalone: false,
  // v22 : OnPush est le défaut, Default (= Eager) doit être explicite
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './stats.component.html',
})
export class StatsComponent implements OnInit {
  readonly stats$: Observable<TodoStats>;
  readonly priorities: Priority[] = ['high', 'medium', 'low'];
  readonly priorityLabels = PRIORITY_LABELS;

  constructor(private readonly store: Store) {
    this.stats$ = store.select(selectStats);
  }

  ngOnInit(): void {
    // Si l'utilisateur arrive directement sur /stats, le store est vide : on charge.
    this.store
      .select(selectStatus)
      .pipe(take(1))
      .subscribe((status) => {
        if (status === 'idle') {
          this.store.dispatch(TodoActions.load());
        }
      });
  }

  percent(count: number, total: number): number {
    return total ? Math.round((count / total) * 100) : 0;
  }
}
