import { inject } from '@angular/core';
import { Todo } from '@angular-workshop/shared/models';
import { ResolveFn } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { TodoApi } from '../core/todo-api';
import { TodoStore } from './todo-store';

/**
 * Alimente le `TodoStore` avant l'activation des routes `/todos` et `/stats`.
 * Le router attend le resolver : côté serveur, le HTML contient déjà la liste ;
 * côté client, la réponse vient du transfer cache et le DOM hydraté correspond.
 */
export const todosResolver: ResolveFn<Todo[]> = () => {
  const store = inject(TodoStore);
  if (store.status() === 'loaded') return store.entities();

  return inject(TodoApi)
    .getAll()
    .pipe(
      tap((todos) => store.setAll(todos)),
      catchError((e: Error) => {
        store.fail(e.message);
        return of([] as Todo[]);
      }),
    );
};
