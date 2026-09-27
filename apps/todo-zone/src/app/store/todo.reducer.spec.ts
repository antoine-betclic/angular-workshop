import { Todo } from '@angular-workshop/shared/models';
import { TodoActions } from './todo.actions';
import { initialTodosState, todoAdapter, todosFeature } from './todo.reducer';
import { selectFilteredTodos, selectStats } from './todo.selectors';

const todo = (overrides: Partial<Todo>): Todo => ({
  id: '1',
  title: 'Tâche',
  description: '',
  done: false,
  priority: 'medium',
  dueDate: '2099-01-01',
  tags: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('todosFeature.reducer', () => {
  const { reducer } = todosFeature;

  it('passe en « loading » sur Load', () => {
    const state = reducer(initialTodosState, TodoActions.load());
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  it('remplit les entités sur Load Success (triées par échéance)', () => {
    const todos = [
      todo({ id: 'b', dueDate: '2026-12-01' }),
      todo({ id: 'a', dueDate: '2026-01-01' }),
    ];
    const state = reducer(initialTodosState, TodoActions.loadSuccess({ todos }));
    expect(state.status).toBe('loaded');
    expect(state.ids).toEqual(['a', 'b']);
    expect(state.entities['b']?.dueDate).toBe('2026-12-01');
  });

  it('mémorise l’erreur sur Load Failure', () => {
    const state = reducer(initialTodosState, TodoActions.loadFailure({ error: 'boom' }));
    expect(state.status).toBe('error');
    expect(state.error).toBe('boom');
  });

  it('remplace l’entité sur Update Success et la retire sur Remove Success', () => {
    let state = reducer(initialTodosState, TodoActions.loadSuccess({ todos: [todo({ id: '1' })] }));
    state = reducer(state, TodoActions.updateSuccess({ todo: todo({ id: '1', done: true }) }));
    expect(state.entities['1']?.done).toBe(true);
    state = reducer(state, TodoActions.removeSuccess({ id: '1' }));
    expect(state.ids).toEqual([]);
  });

  it('change le filtre sur Set Filter et la recherche sur Set Search', () => {
    let state = reducer(initialTodosState, TodoActions.setFilter({ filter: 'done' }));
    expect(state.filter).toBe('done');
    state = reducer(state, TodoActions.setSearch({ search: 'zone' }));
    expect(state.search).toBe('zone');
  });
});

describe('sélecteurs', () => {
  const populated = todoAdapter.setAll(
    [
      todo({ id: '1', title: 'Migrer vers zoneless', done: true, priority: 'high' }),
      todo({ id: '2', title: 'Écrire les tests', description: 'Vitest', done: false, priority: 'low' }),
      todo({ id: '3', title: 'Supprimer zone.js', done: false, dueDate: '2000-01-01' }),
    ],
    { ...initialTodosState, status: 'loaded' as const },
  );

  it('selectFilteredTodos combine filtre et recherche (insensible à la casse)', () => {
    const root = { todos: { ...populated, filter: 'active' as const, search: 'ZONE' } };
    expect(selectFilteredTodos(root).map((t) => t.id)).toEqual(['3']);
    const all = { todos: { ...populated, filter: 'all' as const, search: 'vitest' } };
    expect(selectFilteredTodos(all).map((t) => t.id)).toEqual(['2']);
  });

  it('selectStats calcule les compteurs', () => {
    const stats = selectStats({ todos: populated });
    expect(stats.total).toBe(3);
    expect(stats.done).toBe(1);
    expect(stats.active).toBe(2);
    expect(stats.overdue).toBe(1);
    expect(stats.byPriority).toEqual({ low: 1, medium: 1, high: 1 });
    expect(stats.completionRate).toBe(33);
  });
});
