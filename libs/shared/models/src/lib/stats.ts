import { Priority } from './todo';

/** Statistiques dérivées de la liste des tâches (page `/stats`). */
export interface TodoStats {
  total: number;
  done: number;
  active: number;
  overdue: number;
  byPriority: Record<Priority, number>;
  completionRate: number;
}
