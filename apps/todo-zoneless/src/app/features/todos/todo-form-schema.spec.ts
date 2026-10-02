import { Component, Injector, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormField, form } from '@angular/forms/signals';
import { todayIso } from '../../shared/dates';
import {
  EMPTY_TODO_FORM,
  TodoFormModel,
  URGENT_MAX_DAYS,
  todoFormSchema,
} from './todo-form-schema';

/** Date ISO à `days` jours d'aujourd'hui. */
function inDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return todayIso(date);
}

function createTodoForm(initial: Partial<TodoFormModel> = {}) {
  const model = signal<TodoFormModel>({
    ...EMPTY_TODO_FORM,
    title: 'Passer en OnPush',
    dueDate: inDays(3),
    ...initial,
  });
  const todoForm = form(model, todoFormSchema, {
    injector: TestBed.inject(Injector),
  });
  return { model, todoForm };
}

const errorKinds = (errors: readonly { kind: string }[]): string[] =>
  errors.map((error) => error.kind);

describe('todoFormSchema', () => {
  it('accepte une tâche valide de priorité moyenne sans description', () => {
    const { todoForm } = createTodoForm();
    expect(todoForm().valid()).toBe(true);
  });

  describe('validation conditionnelle : description requise si priorité haute', () => {
    it("n'exige pas la description tant que la priorité n'est pas haute", () => {
      const { todoForm } = createTodoForm({ priority: 'low' });
      expect(todoForm.description().required()).toBe(false);
      expect(todoForm.description().errors()).toEqual([]);
    });

    it('exige la description dès que la priorité passe à « haute », puis libère la règle', () => {
      const { todoForm } = createTodoForm();

      todoForm.priority().value.set('high');
      expect(todoForm.description().required()).toBe(true);
      expect(todoForm.description().errors()).toEqual([
        expect.objectContaining({
          kind: 'required',
          message: 'Une tâche haute priorité doit être décrite',
        }),
      ]);

      todoForm.priority().value.set('medium');
      expect(todoForm.description().required()).toBe(false);
      expect(todoForm().valid()).toBe(true);
    });

    it("synchronise l'attribut natif `required` du <textarea> via [formField]", async () => {
      @Component({
        imports: [FormField],
        template: `<textarea [formField]="todoForm.description"></textarea>`,
      })
      class DescriptionHost {
        readonly model = signal<TodoFormModel>({ ...EMPTY_TODO_FORM });
        readonly todoForm = form(this.model, todoFormSchema);
      }

      const fixture = TestBed.createComponent(DescriptionHost);
      await fixture.whenStable();
      const textarea = (fixture.nativeElement as HTMLElement).querySelector(
        'textarea',
      );
      expect(textarea?.required).toBe(false);

      fixture.componentInstance.todoForm.priority().value.set('high');
      await fixture.whenStable();
      expect(textarea?.required).toBe(true);
    });
  });

  describe("validation croisée : l'échéance dépend de la priorité", () => {
    it(`refuse une tâche haute priorité due dans plus de ${URGENT_MAX_DAYS} jours`, () => {
      const { todoForm } = createTodoForm({
        priority: 'high',
        description: 'Urgent',
        dueDate: inDays(URGENT_MAX_DAYS + 1),
      });
      expect(errorKinds(todoForm.dueDate().errors())).toEqual([
        'urgentTooLate',
      ]);
    });

    it(`accepte une échéance à ${URGENT_MAX_DAYS} jours, ou déjà dépassée`, () => {
      const { todoForm, model } = createTodoForm({
        priority: 'high',
        description: 'Urgent',
        dueDate: inDays(URGENT_MAX_DAYS),
      });
      expect(todoForm.dueDate().valid()).toBe(true);

      model.update((m) => ({ ...m, dueDate: inDays(-2) }));
      expect(todoForm.dueDate().valid()).toBe(true);
    });

    it("réévalue l'échéance quand c'est l'AUTRE champ (la priorité) qui change", () => {
      const { todoForm } = createTodoForm({
        description: 'Urgent',
        dueDate: inDays(30),
      });
      expect(todoForm.dueDate().valid()).toBe(true);

      todoForm.priority().value.set('high');
      expect(errorKinds(todoForm.dueDate().errors())).toEqual([
        'urgentTooLate',
      ]);

      todoForm.priority().value.set('low');
      expect(todoForm.dueDate().valid()).toBe(true);
    });

    it('laisse `required` seul signaler une échéance vide', () => {
      const { todoForm } = createTodoForm({
        priority: 'high',
        description: 'Urgent',
        dueDate: '',
      });
      expect(errorKinds(todoForm.dueDate().errors())).toEqual(['required']);
    });
  });
});
