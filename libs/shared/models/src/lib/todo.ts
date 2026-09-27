/** Priorité d'une tâche. */
export type Priority = 'low' | 'medium' | 'high';

export const PRIORITIES: readonly Priority[] = ['low', 'medium', 'high'];

/** Une tâche telle que renvoyée par l'API json-server (`/todos`). */
export interface Todo {
  id: string;
  title: string;
  description: string;
  done: boolean;
  priority: Priority;
  /** Date d'échéance ISO (YYYY-MM-DD). */
  dueDate: string;
  /** Identifiants de tags (`Tag.id`). */
  tags: string[];
  /** Date de création ISO complète. */
  createdAt: string;
}

/** Données saisies dans le formulaire, avant attribution d'un id par l'API. */
export type TodoDraft = Omit<Todo, 'id' | 'createdAt'>;

/** Filtre de statut de la liste. */
export type TodoFilter = 'all' | 'active' | 'done';

export const TODO_FILTERS: readonly TodoFilter[] = ['all', 'active', 'done'];
