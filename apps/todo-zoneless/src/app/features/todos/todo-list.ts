import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TodoFilter } from '@angular-workshop/shared/models';
import { TagsStore } from '../../core/tags-store';
import { TodoStore } from '../../store/todo-store';
import { TodoItem } from './todo-item';

const FILTERS: readonly { value: TodoFilter; label: string }[] = [
  { value: 'all', label: 'Toutes' },
  { value: 'active', label: 'À faire' },
  { value: 'done', label: 'Terminées' },
];

/**
 * Liste : aucun subscribe, aucun `async` pipe. Le template lit directement
 * les signals du store (`status()`, `filtered()`) et du `httpResource` des tags.
 */
@Component({
  selector: 'zl-todo-list',
  imports: [RouterLink, TodoItem],
  templateUrl: './todo-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoList {
  protected readonly store = inject(TodoStore);
  protected readonly tags = inject(TagsStore);
  protected readonly filters = FILTERS;
  protected reloaded = false;

  protected onSearch(event: Event): void {
    this.store.setSearch((event.target as HTMLInputElement).value);
  }

  protected reload(): void {
    this.store.load();
    this.reloaded = true;
    setTimeout(() => (this.reloaded = false), 2000);
  }
}
