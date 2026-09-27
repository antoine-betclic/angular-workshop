import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'todos' },
  {
    path: 'todos',
    loadChildren: () =>
      import('./features/todos/todos.module').then((m) => m.TodosModule),
  },
  {
    path: 'stats',
    loadChildren: () =>
      import('./features/stats/stats.module').then((m) => m.StatsModule),
  },
  {
    path: 'lab',
    loadChildren: () =>
      import('./features/lab/lab.module').then((m) => m.LabModule),
  },
  {
    path: 'about',
    loadChildren: () =>
      import('./features/about/about.module').then((m) => m.AboutModule),
  },
  { path: '**', redirectTo: 'todos' },
];
