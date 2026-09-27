import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Todo } from '@angular-workshop/shared/models';
import { TodoStore } from './todo-store';

const TODOS: Todo[] = [
  {
    id: '1',
    title: 'Migrer en standalone',
    description: 'Supprimer les NgModules',
    done: true,
    priority: 'high',
    dueDate: '2026-09-01',
    tags: ['migration'],
    createdAt: '2026-08-20T09:00:00.000Z',
  },
  {
    id: '2',
    title: 'Passer en OnPush',
    description: 'Pré-requis zoneless',
    done: false,
    priority: 'medium',
    dueDate: '2099-01-01',
    tags: ['perf'],
    createdAt: '2026-09-01T10:30:00.000Z',
  },
];

describe('TodoStore', () => {
  let store: InstanceType<typeof TodoStore>;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    store = TestBed.inject(TodoStore);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('load remplit les entités et passe le statut à « loaded »', () => {
    expect(store.status()).toBe('idle');

    store.load();
    expect(store.status()).toBe('loading');

    http.expectOne('http://localhost:3000/todos').flush(TODOS);

    expect(store.status()).toBe('loaded');
    expect(store.entities()).toEqual(TODOS);
    expect(store.ids()).toEqual(['1', '2']);
  });

  it('load passe en erreur si l’API échoue', () => {
    store.load();
    http
      .expectOne('http://localhost:3000/todos')
      .flush('boom', { status: 500, statusText: 'Server Error' });

    expect(store.status()).toBe('error');
    expect(store.error()).toContain('500');
  });

  it('setFilter et setSearch filtrent la liste dérivée', () => {
    store.setAll(TODOS);

    store.setFilter('done');
    expect(store.filtered().map((t) => t.id)).toEqual(['1']);

    store.setFilter('active');
    expect(store.filtered().map((t) => t.id)).toEqual(['2']);

    store.setFilter('all');
    store.setSearch('ONPUSH');
    expect(store.filtered().map((t) => t.id)).toEqual(['2']);
  });

  it('stats dérive les compteurs', () => {
    store.setAll(TODOS);
    const stats = store.stats();
    expect(stats.total).toBe(2);
    expect(stats.done).toBe(1);
    expect(stats.active).toBe(1);
    expect(stats.byPriority).toEqual({ low: 0, medium: 1, high: 1 });
    expect(stats.completionRate).toBe(50);
  });

  it('toggle est optimiste puis revient en arrière si l’API échoue', () => {
    store.setAll(TODOS);

    store.toggle('2');
    expect(store.entityMap()['2'].done).toBe(true);

    http
      .expectOne('http://localhost:3000/todo/2')
      .flush('boom', { status: 500, statusText: 'Server Error' });

    expect(store.entityMap()['2'].done).toBe(false);
    expect(store.error()).toContain('500');
  });

  it('remove supprime l’entité après confirmation de l’API', () => {
    store.setAll(TODOS);

    store.remove('1');
    http.expectOne('http://localhost:3000/todos/1').flush(null);

    expect(store.ids()).toEqual(['2']);
  });
});
