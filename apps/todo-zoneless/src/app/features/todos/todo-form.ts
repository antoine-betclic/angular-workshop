import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  signal,
} from '@angular/core';
import { FormField, form, submit } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { PRIORITIES, Todo, TodoDraft } from '@angular-workshop/shared/models';
import { TagsStore } from '../../core/tags-store';
import { TodoStore } from '../../store/todo-store';
import {
  EMPTY_TODO_FORM,
  TodoFormModel,
  todoFormSchema,
} from './todo-form-schema';
import { PRIORITY_LABELS } from './todo-item';

/**
 * Signal Forms : le modèle est un `WritableSignal`, `form()` en dérive l'arbre de champs,
 * la validation est déclarée dans un schéma (`todo-form-schema.ts`), `[formField]` lie chaque contrôle.
 * En édition, la tâche résolue arrive par `input()` (withComponentInputBinding) et
 * `linkedSignal` réinitialise le modèle à partir d'elle — sans `effect`.
 */
@Component({
  selector: 'zl-todo-form',
  imports: [FormField, RouterLink],
  providers: [TagsStore],
  templateUrl: './todo-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoForm {
  private readonly store = inject(TodoStore);
  private readonly router = inject(Router);
  protected readonly tagsStore = inject(TagsStore);

  /** Tâche pré-chargée par le resolver (clé `todo` des données de route). */
  readonly todo = input<Todo>();

  protected readonly isEdit = computed(() => this.todo() !== undefined);
  protected readonly priorities = PRIORITIES;
  protected readonly priorityLabels = PRIORITY_LABELS;

  protected readonly model = linkedSignal<TodoFormModel>(() => {
    const todo = this.todo();
    return todo
      ? {
          title: todo.title,
          description: todo.description,
          priority: todo.priority,
          dueDate: todo.dueDate,
          done: todo.done,
        }
      : EMPTY_TODO_FORM;
  });

  protected readonly todoForm = form(this.model, todoFormSchema);

  /** Les tags (string[]) sont gérés hors du form : `[formField]` ne binde que des booléens sur une checkbox. */
  protected readonly selectedTags = linkedSignal<string[]>(
    () => this.todo()?.tags ?? [],
  );
  private readonly tagsDirty = computed(() => {
    const initial = this.todo()?.tags ?? [];
    const current = this.selectedTags();
    return (
      initial.length !== current.length ||
      initial.some((id) => !current.includes(id))
    );
  });

  private readonly saved = signal(false);

  protected toggleTag(id: string): void {
    this.selectedTags.update((tags) =>
      tags.includes(id) ? tags.filter((t) => t !== id) : [...tags, id],
    );
  }

  protected save(event: Event): void {
    event.preventDefault();
    submit(this.todoForm, async () => {
      const draft: TodoDraft = { ...this.model(), tags: this.selectedTags() };
      const existing = this.todo();
      if (existing) {
        this.store.update({ id: existing.id, changes: draft });
      } else {
        this.store.add(draft);
      }
      this.saved.set(true);
      await this.router.navigate(['/todos']);
    });
  }

  /** Utilisé par le guard `canDeactivate`. */
  canLeave(): boolean {
    return this.saved() || (!this.todoForm().dirty() && !this.tagsDirty());
  }
}
