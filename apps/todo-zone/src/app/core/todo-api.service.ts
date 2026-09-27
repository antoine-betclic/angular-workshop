import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo, TodoDraft } from '@angular-workshop/shared/models';
import { API_URL } from './api-url.token';

@Injectable({ providedIn: 'root' })
export class TodoApiService {
  private readonly url: string;

  constructor(
    private readonly http: HttpClient,
    @Inject(API_URL) apiUrl: string,
  ) {
    this.url = `${apiUrl}/todos`;
  }

  getAll(): Observable<Todo[]> {
    return this.http.get<Todo[]>(this.url);
  }

  getOne(id: string): Observable<Todo> {
    return this.http.get<Todo>(`${this.url}/${id}`);
  }

  create(draft: TodoDraft): Observable<Todo> {
    return this.http.post<Todo>(this.url, {
      ...draft,
      createdAt: new Date().toISOString(),
    });
  }

  update(id: string, changes: Partial<Todo>): Observable<Todo> {
    return this.http.patch<Todo>(`${this.url}/${id}`, changes);
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
