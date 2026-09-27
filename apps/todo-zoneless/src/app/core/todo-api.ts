import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Todo, TodoDraft } from '@angular-workshop/shared/models';
import { Observable } from 'rxjs';
import { API_URL } from './api-url';

/**
 * Accès HTTP aux tâches. Retourne des Observables froids : ils sont consommés par
 * les `rxMethod` du `TodoStore` (jamais de `subscribe()` manuel dans les composants).
 */
@Injectable({ providedIn: 'root' })
export class TodoApi {
  private readonly http = inject(HttpClient);
  private readonly api = inject(API_URL);
  private readonly base = `${this.api}/todos`;

  getAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.base);
  }

  getOne(id: string): Observable<Todo> {
    return this.http.get<Todo>(`${this.base}/${id}`);
  }

  create(draft: TodoDraft): Observable<Todo> {
    return this.http.post<Todo>(this.base, {
      ...draft,
      createdAt: new Date().toISOString(),
    });
  }

  update(id: string, changes: Partial<Todo>): Observable<Todo> {
    return this.http.patch<Todo>(`${this.api}/todo/${id}`, changes);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
