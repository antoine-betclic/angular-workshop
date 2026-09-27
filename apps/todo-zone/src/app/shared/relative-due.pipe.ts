import { Pipe, PipeTransform } from '@angular/core';
import { daysUntil } from './date-utils';

/** Échéance relative en français : « Aujourd'hui », « Dans 3 j », « En retard de 2 j »… */
@Pipe({
  name: 'relativeDue',
  standalone: false,
  pure: true,
})
export class RelativeDuePipe implements PipeTransform {
  transform(dueDate: string | null | undefined, now: Date = new Date()): string {
    if (!dueDate) {
      return '';
    }
    const days = daysUntil(dueDate, now);
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return 'Demain';
    if (days === -1) return 'Hier';
    if (days > 1) return `Dans ${days} j`;
    return `En retard de ${-days} j`;
  }
}
