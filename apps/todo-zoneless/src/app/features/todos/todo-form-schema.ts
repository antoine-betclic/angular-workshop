import { minLength, required, schema, validate } from '@angular/forms/signals';
import { Priority } from '@angular-workshop/shared/models';
import { daysUntil } from '../../shared/dates';

/**
 * Modèle du formulaire, distinct du `Todo` métier (pas d'`id`, pas de `tags`).
 * - Pas d'`undefined` ni de propriété optionnelle : pour Signal Forms, `undefined` = « le champ n'existe pas ».
 * - Pas de `null` sur un champ texte : la valeur « vide » d'un `<input type="text">` est `''`.
 * - `dueDate` reste la chaîne `YYYY-MM-DD` d'un `<input type="date">` : `''` = pas encore saisie.
 */
export interface TodoFormModel {
  title: string;
  description: string;
  priority: Priority;
  dueDate: string;
  done: boolean;
}

export const EMPTY_TODO_FORM: TodoFormModel = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  done: false,
};

/** Une tâche haute priorité doit être due dans cette fenêtre (en jours). */
export const URGENT_MAX_DAYS = 7;
const URGENT_MESSAGE = `Priorité haute : échéance sous ${URGENT_MAX_DAYS} jours maximum`;

/**
 * Règles du formulaire de tâche, déclarées une fois dans un `schema()` testable hors composant.
 * Chaque règle est réactive : elle se réévalue dès qu'un signal lu (`value`, `valueOf`) change.
 */
export const todoFormSchema = schema<TodoFormModel>((s) => {
  required(s.title, { message: 'Le titre est requis' });
  minLength(s.title, 3, { message: '3 caractères minimum' });
  required(s.dueDate, { message: "L'échéance est requise" });

  // Validation conditionnelle : la règle ne s'applique que lorsque `when` renvoie true.
  required(s.description, {
    when: ({ valueOf }) => valueOf(s.priority) === 'high',
    message: 'Une tâche haute priorité doit être décrite',
  });

  // Validation croisée : l'échéance est validée en lisant un autre champ, la priorité.
  validate(s.dueDate, ({ value, valueOf }) => {
    if (valueOf(s.priority) !== 'high' || value() === '') {
      return null;
    }
    return daysUntil(value()) > URGENT_MAX_DAYS
      ? { kind: 'urgentTooLate', message: URGENT_MESSAGE }
      : null;
  });
});
