import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { Todo, TodoFilter } from '@angular-workshop/shared/models';
import { TodoActions } from './todo.actions';

export type LoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

export interface TodosState extends EntityState<Todo> {
  filter: TodoFilter;
  search: string;
  status: LoadStatus;
  error: string | null;
}

export const todoAdapter = createEntityAdapter<Todo>({
  sortComparer: (a, b) => a.dueDate.localeCompare(b.dueDate),
});

export const initialTodosState: TodosState = todoAdapter.getInitialState({
  filter: 'all',
  search: '',
  status: 'idle',
  error: null,
});

const reducer = createReducer(
  initialTodosState,
  on(TodoActions.load, (state): TodosState => ({ ...state, status: 'loading', error: null })),
  on(TodoActions.loadSuccess, (state, { todos }) =>
    todoAdapter.setAll(todos, { ...state, status: 'loaded' }),
  ),
  on(TodoActions.loadFailure, (state, { error }): TodosState => ({ ...state, status: 'error', error })),
  on(TodoActions.addSuccess, (state, { todo }) => todoAdapter.addOne(todo, state)),
  on(TodoActions.updateSuccess, (state, { todo }) => todoAdapter.upsertOne(todo, state)),
  on(TodoActions.removeSuccess, (state, { id }) => todoAdapter.removeOne(id, state)),
  on(TodoActions.setFilter, (state, { filter }): TodosState => ({ ...state, filter })),
  on(TodoActions.setSearch, (state, { search }): TodosState => ({ ...state, search })),
  on(TodoActions.mutationFailure, (state, { error }): TodosState => ({ ...state, error })),
);

export const todosFeature = createFeature({ name: 'todos', reducer });
