import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import {
  PRIORITIES,
  Priority,
  Tag,
  Todo,
  TodoDraft,
} from '@angular-workshop/shared/models';
import { PRIORITY_LABELS } from '../../../shared/priority-labels';
import { selectAllTags, selectTagsLoaded, TagsActions, TodoActions } from '../../../store';

@Component({
  selector: 'zn-todo-form',
  standalone: false,
  // v22 : OnPush est le défaut, Default (= Eager) doit être explicite
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './todo-form.component.html',
})
export class TodoFormComponent implements OnInit, OnDestroy {
  readonly todo: Todo | undefined;
  readonly isEdit: boolean;
  readonly priorities = PRIORITIES;
  readonly priorityLabels = PRIORITY_LABELS;

  /** Tags disponibles, dans le même ordre que le FormArray `tags`. */
  tags: Tag[] = [];
  saved = false;

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    priority: ['medium' as Priority],
    dueDate: ['', Validators.required],
    done: [false],
    tags: this.fb.nonNullable.array<boolean>([]),
  });

  /** Boilerplate historique : on collecte les souscriptions pour les libérer dans ngOnDestroy. */
  private readonly subscription = new Subscription();

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.todo = route.snapshot.data['todo'] as Todo | undefined;
    this.isEdit = !!this.todo;
  }

  ngOnInit(): void {
    if (this.todo) {
      const { title, description, priority, dueDate, done } = this.todo;
      this.form.patchValue({ title, description, priority, dueDate, done });
    }

    this.subscription.add(
      this.store
        .select(selectTagsLoaded)
        .pipe(take(1))
        .subscribe((loaded) => {
          if (!loaded) {
            this.store.dispatch(TagsActions.load());
          }
        }),
    );

    this.subscription.add(
      this.store.select(selectAllTags).subscribe((tags) => this.buildTagControls(tags)),
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  get tagControls(): FormControl<boolean>[] {
    return this.form.controls.tags.controls;
  }

  showError(name: 'title' | 'dueDate'): boolean {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  canLeave(): boolean {
    return this.saved || !this.form.dirty;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    const draft: TodoDraft = {
      title: value.title.trim(),
      description: value.description.trim(),
      priority: value.priority,
      dueDate: value.dueDate,
      done: value.done,
      tags: this.tags.filter((_, i) => value.tags[i]).map((t) => t.id),
    };

    if (this.todo) {
      this.store.dispatch(TodoActions.update({ id: this.todo.id, changes: draft }));
    } else {
      this.store.dispatch(TodoActions.add({ draft }));
    }
    this.saved = true;
    this.router.navigate(['/todos']);
  }

  private buildTagControls(tags: Tag[]): void {
    this.tags = tags;
    const array = this.form.controls.tags;
    array.clear({ emitEvent: false });
    for (const tag of tags) {
      const checked = this.todo?.tags.includes(tag.id) ?? false;
      array.push(this.fb.nonNullable.control(checked), { emitEvent: false });
    }
  }
}
