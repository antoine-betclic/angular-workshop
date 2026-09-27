import { Pipe, PipeTransform } from '@angular/core';
import { daysUntil } from './dates';

/** Échéance relative en français : « Aujourd'hui », « Dans 3 j », « En retard de 2 j »… */
@Pipe({ name: 'relativeDue' })
export class RelativeDue implements PipeTransform {
  transform(dueDate: string, now = new Date()): string {
    const days = daysUntil(dueDate, now);
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return 'Demain';
    if (days > 1) return `Dans ${days} j`;
    if (days === -1) return 'Hier';
    return `En retard de ${-days} j`;
  }
}
