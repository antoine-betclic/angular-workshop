import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { daysUntil } from '../../../shared/date-utils';

/** Une tâche haute priorité doit être due dans cette fenêtre (en jours). */
export const URGENT_MAX_DAYS = 7;

/**
 * Validation croisée « à l'ancienne » : un validateur de GROUPE.
 * Il retrouve les contrôles par leur nom (des chaînes) et l'erreur vit sur le FormGroup,
 * pas sur l'échéance : au template d'aller la chercher dans `form.errors`.
 */
export const urgentDueDateValidator: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const priority = group.get('priority')?.value;
  const dueDate = group.get('dueDate')?.value;
  if (priority !== 'high' || !dueDate) {
    return null;
  }
  return daysUntil(dueDate) > URGENT_MAX_DAYS
    ? { urgentTooLate: { maxDays: URGENT_MAX_DAYS } }
    : null;
};
