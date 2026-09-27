import { CanDeactivateFn } from '@angular/router';
import { TodoForm } from './todo-form';

/** Guard fonctionnel : bloque la sortie si le formulaire est modifié et non enregistré. */
export const unsavedChangesGuard: CanDeactivateFn<TodoForm> = (component) =>
  component.canLeave() || confirm('Modifications non enregistrées. Quitter ?');
