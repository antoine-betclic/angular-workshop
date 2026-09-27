import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, concatMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { TodoApiService } from '../core/todo-api.service';
import { TodoActions } from './todo.actions';
import { selectTodoEntities } from './todo.selectors';

@Injectable()
export class TodoEffects {
  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.load),
      switchMap(() =>
        this.api.getAll().pipe(
          map((todos) => TodoActions.loadSuccess({ todos })),
          catchError((err: Error) => of(TodoActions.loadFailure({ error: err.message }))),
        ),
      ),
    ),
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.add),
      concatMap(({ draft }) =>
        this.api.create(draft).pipe(
          map((todo) => TodoActions.addSuccess({ todo })),
          catchError((err: Error) => of(TodoActions.mutationFailure({ error: err.message }))),
        ),
      ),
    ),
  );

  /** Toggle ne transporte que l'id : on relit l'entité dans le store pour connaître `done`. */
  toggle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.toggle),
      withLatestFrom(this.store.select(selectTodoEntities)),
      concatMap(([{ id }, entities]) => {
        const current = entities[id];
        if (!current) {
          return of(TodoActions.mutationFailure({ error: `Tâche ${id} introuvable` }));
        }
        return this.api.update(id, { done: !current.done }).pipe(
          map((todo) => TodoActions.updateSuccess({ todo })),
          catchError((err: Error) => of(TodoActions.mutationFailure({ error: err.message }))),
        );
      }),
    ),
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.update),
      concatMap(({ id, changes }) =>
        this.api.update(id, changes).pipe(
          map((todo) => TodoActions.updateSuccess({ todo })),
          catchError((err: Error) => of(TodoActions.mutationFailure({ error: err.message }))),
        ),
      ),
    ),
  );

  remove$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.remove),
      concatMap(({ id }) =>
        this.api.remove(id).pipe(
          map(() => TodoActions.removeSuccess({ id })),
          catchError((err: Error) => of(TodoActions.mutationFailure({ error: err.message }))),
        ),
      ),
    ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly api: TodoApiService,
  ) {}
}
