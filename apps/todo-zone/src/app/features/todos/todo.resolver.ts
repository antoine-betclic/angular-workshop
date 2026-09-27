import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Todo } from '@angular-workshop/shared/models';
import { TodoApiService } from '../../core/todo-api.service';

/** Pré-charge la tâche de `/todos/:id` ; id inconnu → retour à la liste. */
export const todoResolver: ResolveFn<Todo> = (route) => {
  const api = inject(TodoApiService);
  const router = inject(Router);
  const id = route.paramMap.get('id') ?? '';
  return api.getOne(id).pipe(
    catchError(() => {
      router.navigate(['/todos']);
      return EMPTY;
    }),
  );
};
