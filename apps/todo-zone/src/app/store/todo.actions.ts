import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Todo, TodoDraft, TodoFilter } from '@angular-workshop/shared/models';

export const TodoActions = createActionGroup({
  source: 'Todos',
  events: {
    Load: emptyProps(),
    'Load Success': props<{ todos: Todo[] }>(),
    'Load Failure': props<{ error: string }>(),
    Add: props<{ draft: TodoDraft }>(),
    'Add Success': props<{ todo: Todo }>(),
    Toggle: props<{ id: string }>(),
    Update: props<{ id: string; changes: Partial<Todo> }>(),
    'Update Success': props<{ todo: Todo }>(),
    Remove: props<{ id: string }>(),
    'Remove Success': props<{ id: string }>(),
    'Set Filter': props<{ filter: TodoFilter }>(),
    'Set Search': props<{ search: string }>(),
    'Mutation Failure': props<{ error: string }>(),
  },
});
