import { createSelector } from '@ngrx/store';
import { Todo, TodoStats } from '@angular-workshop/shared/models';
import { toIsoDay } from '../shared/date-utils';
import { todoAdapter, todosFeature } from './todo.reducer';

const { selectAll, selectEntities } = todoAdapter.getSelectors();

export const selectTodosState = todosFeature.selectTodosState;
export const selectFilter = todosFeature.selectFilter;
export const selectSearch = todosFeature.selectSearch;
export const selectStatus = todosFeature.selectStatus;
export const selectError = todosFeature.selectError;

export const selectAllTodos = createSelector(selectTodosState, selectAll);
export const selectTodoEntities = createSelector(selectTodosState, selectEntities);

export const selectTodoById = (id: string) =>
  createSelector(selectTodoEntities, (entities): Todo | undefined => entities[id]);

export const selectFilteredTodos = createSelector(
  selectAllTodos,
  selectFilter,
  selectSearch,
  (todos, filter, search): Todo[] => {
    const needle = search.trim().toLowerCase();
    return todos.filter((todo) => {
      if (filter === 'active' && todo.done) return false;
      if (filter === 'done' && !todo.done) return false;
      if (!needle) return true;
      return (
        todo.title.toLowerCase().includes(needle) ||
        todo.description.toLowerCase().includes(needle)
      );
    });
  },
);

export const selectStats = createSelector(selectAllTodos, (todos): TodoStats => {
  const today = toIsoDay(new Date());
  const done = todos.filter((t) => t.done).length;
  return {
    total: todos.length,
    done,
    active: todos.length - done,
    overdue: todos.filter((t) => !t.done && t.dueDate < today).length,
    byPriority: {
      low: todos.filter((t) => t.priority === 'low').length,
      medium: todos.filter((t) => t.priority === 'medium').length,
      high: todos.filter((t) => t.priority === 'high').length,
    },
    completionRate: todos.length ? Math.round((done / todos.length) * 100) : 0,
  };
});
