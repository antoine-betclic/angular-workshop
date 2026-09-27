import { Routes } from '@angular/router';
import { Lab } from './features/lab/lab';
import { todosResolver } from './store/todos-resolver';

export const appRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'todos' },
  {
    path: 'todos',
    loadChildren: () => import('./features/todos/todos.routes'),
  },
  {
    path: 'stats',
    loadComponent: () => import('./features/stats/stats').then((m) => m.Stats),
    resolve: { todos: todosResolver },
  },
  { path: 'lab', component: Lab },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about').then((m) => m.About),
  },
  { path: '**', redirectTo: 'todos' },
];
