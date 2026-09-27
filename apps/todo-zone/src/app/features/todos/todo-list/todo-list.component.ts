import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { Tag, Todo, TodoFilter } from '@angular-workshop/shared/models';
import {
  selectAllTags,
  selectError,
  selectFilter,
  selectFilteredTodos,
  selectSearch,
  selectStatus,
  selectTagsById,
  selectTagsLoaded,
  TagsActions,
  TodoActions,
} from '../../../store';
import { LoadStatus } from '../../../store/todo.reducer';

@Component({
  selector: 'zn-todo-list',
  standalone: false,
  // v22 : OnPush est le défaut, Default (= Eager) doit être explicite
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './todo-list.component.html',
  animations: [
    trigger('itemAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'none' })),
      ]),
      transition(':leave', [
        animate('250ms ease-in', style({ opacity: 0, transform: 'translateX(12px)' })),
      ]),
    ]),
  ],
})
export class TodoListComponent implements OnInit {
  readonly todos$: Observable<Todo[]>;
  readonly status$: Observable<LoadStatus>;
  readonly error$: Observable<string | null>;
  readonly filter$: Observable<TodoFilter>;
  readonly search$: Observable<string>;
  readonly tagsById$: Observable<Record<string, Tag>>;
  readonly tags$: Observable<Tag[]>;

  readonly filters: { value: TodoFilter; label: string }[] = [
    { value: 'all', label: 'Toutes' },
    { value: 'active', label: 'À faire' },
    { value: 'done', label: 'Terminées' },
  ];

  constructor(private readonly store: Store) {
    this.todos$ = store.select(selectFilteredTodos);
    this.status$ = store.select(selectStatus);
    this.error$ = store.select(selectError);
    this.filter$ = store.select(selectFilter);
    this.search$ = store.select(selectSearch);
    this.tagsById$ = store.select(selectTagsById);
    this.tags$ = store.select(selectAllTags);
  }

  ngOnInit(): void {
    this.store.dispatch(TodoActions.load());
    this.store
      .select(selectTagsLoaded)
      .pipe(take(1))
      .subscribe((loaded) => {
        if (!loaded) {
          this.store.dispatch(TagsActions.load());
        }
      });
  }

  trackById(_index: number, todo: Todo): string {
    return todo.id;
  }

  onSearch(event: Event): void {
    const search = (event.target as HTMLInputElement).value;
    this.store.dispatch(TodoActions.setSearch({ search }));
  }

  setFilter(filter: TodoFilter): void {
    this.store.dispatch(TodoActions.setFilter({ filter }));
  }

  reload(): void {
    this.store.dispatch(TodoActions.load());
  }

  toggle(id: string): void {
    this.store.dispatch(TodoActions.toggle({ id }));
  }

  remove(id: string): void {
    this.store.dispatch(TodoActions.remove({ id }));
  }
}
