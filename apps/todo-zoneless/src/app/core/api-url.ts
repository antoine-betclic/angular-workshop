import { InjectionToken } from '@angular/core';

/** URL de base de l'API json-server (`pnpm nx serve api`). */
export const API_URL = new InjectionToken<string>('API_URL', {
  providedIn: 'root',
  factory: () => 'http://localhost:3000',
});

/** Latence artificielle (ms) appliquée à toutes les requêtes HTTP pour rendre visibles les états de chargement. */
export const DEMO_LATENCY_MS = new InjectionToken<number>('DEMO_LATENCY_MS', {
  providedIn: 'root',
  factory: () => 400,
});
