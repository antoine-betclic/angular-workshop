import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./quiz/quiz-page').then((m) => m.QuizPage),
  },
  { path: '**', redirectTo: '' },
];
