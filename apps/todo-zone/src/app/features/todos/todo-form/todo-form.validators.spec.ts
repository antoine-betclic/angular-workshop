import { FormControl, FormGroup } from '@angular/forms';
import { toIsoDay } from '../../../shared/date-utils';
import {
  URGENT_MAX_DAYS,
  urgentDueDateValidator,
} from './todo-form.validators';

function inDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toIsoDay(date);
}

function group(priority: string, dueDate: string): FormGroup {
  return new FormGroup(
    { priority: new FormControl(priority), dueDate: new FormControl(dueDate) },
    { validators: urgentDueDateValidator },
  );
}

describe('urgentDueDateValidator (validateur de groupe)', () => {
  it(`refuse une tâche haute priorité due dans plus de ${URGENT_MAX_DAYS} jours`, () => {
    const form = group('high', inDays(URGENT_MAX_DAYS + 1));
    expect(form.errors).toEqual({
      urgentTooLate: { maxDays: URGENT_MAX_DAYS },
    });
  });

  it("porte l'erreur sur le groupe, pas sur le contrôle d'échéance", () => {
    const form = group('high', inDays(30));
    expect(form.hasError('urgentTooLate')).toBe(true);
    expect(form.controls['dueDate'].errors).toBeNull();
  });

  it('accepte les autres priorités, une échéance proche ou vide', () => {
    expect(group('medium', inDays(30)).errors).toBeNull();
    expect(group('high', inDays(URGENT_MAX_DAYS)).errors).toBeNull();
    expect(group('high', '').errors).toBeNull();
  });
});
