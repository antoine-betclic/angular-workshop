import { computed, inject } from '@angular/core';
import {
  Todo,
  TodoDraft,
  TodoFilter,
  TodoStats,
} from '@angular-workshop/shared/models';
import { tapResponse } from '@ngrx/operators';
import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import {
  addEntity,
  removeEntity,
  setAllEntities,
  updateEntity,
  withEntities,
} from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { EMPTY, concatMap, mergeMap, pipe, switchMap, tap } from 'rxjs';
import { TodoApi } from '../core/todo-api';
import { todayIso } from '../shared/dates';

export type TodoStatus = 'idle' | 'loading' | 'loaded' | 'error';

interface TodoState {
  filter: TodoFilter;
  search: string;
  status: TodoStatus;
  error: string | null;
}

const initialState: TodoState = {
  filter: 'all',
  search: '',
  status: 'idle',
  error: null,
};

/**
 * Équivalent moderne de actions + reducer + effects + selectors + @ngrx/entity :
 * un seul `signalStore`. L'état est protégé (lecture via signals, écriture via méthodes).
 */
export const TodoStore = signalStore(
  { providedIn: 'root' },
  withEntities<Todo>(),
  withState(initialState),
  withComputed(({ entities, filter, search }) => {
    const filtered = computed(() => {
      const term = search().trim().toLowerCase();
      return entities().filter((todo) => {
        if (filter() === 'active' && todo.done) return false;
        if (filter() === 'done' && !todo.done) return false;
        return (
          !term ||
          todo.title.toLowerCase().includes(term) ||
          todo.description.toLowerCase().includes(term)
        );
      });
    });

    const stats = computed((): TodoStats => {
      const all = entities();
      const today = todayIso();
      const done = all.filter((t) => t.done).length;
      const byPriority = { low: 0, medium: 0, high: 0 };
      for (const t of all) byPriority[t.priority]++;
      return {
        total: all.length,
        done,
        active: all.length - done,
        overdue: all.filter((t) => !t.done && t.dueDate < today).length,
        byPriority,
        completionRate: all.length ? Math.round((done / all.length) * 100) : 0,
      };
    });

    return { filtered, stats };
  }),
  withMethods((store, api = inject(TodoApi)) => ({
    setFilter(filter: TodoFilter): void {
      patchState(store, { filter });
    },

    setSearch(search: string): void {
      patchState(store, { search });
    },

    /** Alimentation synchrone (resolver SSR-friendly). */
    setAll(todos: Todo[]): void {
      patchState(store, setAllEntities(todos), { status: 'loaded', error: null });
    },

    fail(error: string): void {
      patchState(store, { status: 'error', error });
    },

    /** Rechargement explicite : montre l'état `loading`. */
    load: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { status: 'loading', error: null })),
        switchMap(() =>
          api.getAll().pipe(
            tapResponse({
              next: (todos) =>
                patchState(store, setAllEntities(todos), { status: 'loaded' }),
              error: (e: Error) =>
                patchState(store, { status: 'error', error: e.message }),
            }),
          ),
        ),
      ),
    ),

    add: rxMethod<TodoDraft>(
      pipe(
        concatMap((draft) =>
          api.create(draft).pipe(
            tapResponse({
              next: (todo) => patchState(store, addEntity(todo)),
              error: (e: Error) => patchState(store, { error: e.message }),
            }),
          ),
        ),
      ),
    ),

    /** Mise à jour optimiste : on bascule tout de suite, rollback si l'API échoue. */
    toggle: rxMethod<string>(
      pipe(
        mergeMap((id) => {
          const before = store.entityMap()[id];
          if (!before) return EMPTY;
          const done = !before.done;
          patchState(store, updateEntity({ id, changes: { done } }));
          return api.update(id, { done }).pipe(
            tapResponse({
              next: (todo) => patchState(store, updateEntity({ id, changes: todo })),
              error: (e: Error) =>
                patchState(
                  store,
                  updateEntity({ id, changes: { done: before.done } }),
                  { error: e.message },
                ),
            }),
          );
        }),
      ),
    ),

    update: rxMethod<{ id: string; changes: Partial<Todo> }>(
      pipe(
        concatMap(({ id, changes }) =>
          api.update(id, changes).pipe(
            tapResponse({
              next: (todo) => patchState(store, updateEntity({ id, changes: todo })),
              error: (e: Error) => patchState(store, { error: e.message }),
            }),
          ),
        ),
      ),
    ),

    remove: rxMethod<string>(
      pipe(
        mergeMap((id) =>
          api.remove(id).pipe(
            tapResponse({
              next: () => patchState(store, removeEntity(id)),
              error: (e: Error) => patchState(store, { error: e.message }),
            }),
          ),
        ),
      ),
    ),
  })),
);
