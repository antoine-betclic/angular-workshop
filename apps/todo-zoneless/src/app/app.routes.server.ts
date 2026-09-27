import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Page statique : prerendue au build.
  { path: 'about', renderMode: RenderMode.Prerender },
  // Tout le reste dépend de l'API : rendu à la requête.
  { path: '**', renderMode: RenderMode.Server },
];
