import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Todo } from '@angular-workshop/shared/models';
import { catchError, of } from 'rxjs';
import { TodoApi } from '../../core/todo-api';

/** Pré-charge la tâche de `/todos/:id` ; id inconnu → redirection vers la liste. */
export const todoResolver: ResolveFn<Todo> = (route) => {
  const router = inject(Router);
  const id = route.paramMap.get('id') ?? '';
  return inject(TodoApi)
    .getOne(id)
    .pipe(catchError(() => of(new RedirectCommand(router.parseUrl('/todos')))));
};
