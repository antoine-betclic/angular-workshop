import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { TodoFormComponent } from './todo-form/todo-form.component';

export const unsavedChangesGuard: CanDeactivateFn<TodoFormComponent> = (component) => {
  if (component.canLeave()) {
    return true;
  }
  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return true;
  }
  return window.confirm('Modifications non enregistrées. Quitter ?');
};
