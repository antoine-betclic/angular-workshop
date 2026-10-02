import { Component, Injector, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormField, form, required } from '@angular/forms/signals';

/**
 * Documentation exécutable des slides « null, undefined » : chaque affirmation est vérifiée ici,
 * sur la version d'Angular du dépôt, plutôt que devinée.
 */
describe('Signal Forms : null et undefined dans le modèle', () => {
  const injector = () => ({ injector: TestBed.inject(Injector) });

  describe('undefined = « ce champ n’existe pas »', () => {
    it("une propriété optionnelle non initialisée n'a pas de champ dans l'arbre", () => {
      const model = signal<{ title: string; notes?: string }>({ title: '' });
      const draft = form(model, injector());

      expect(draft.title).toBeDefined();
      expect(draft.notes).toBeUndefined();
    });

    it('le champ apparaît… puis disparaît si on y écrit undefined', () => {
      const model = signal<{ title: string; notes?: string }>({
        title: '',
        notes: '',
      });
      const draft = form(model, injector());
      expect(draft.notes).toBeDefined();

      model.set({ title: '', notes: undefined });
      expect(draft.notes).toBeUndefined();
    });

    it('un champ conservé après être passé à undefined devient orphelin (NG01902)', () => {
      const model = signal<{ title: string; notes?: string }>({
        title: '',
        notes: 'brouillon',
      });
      const draft = form(model, injector());
      const notes = draft.notes;

      model.set({ title: '', notes: undefined });
      expect(() => notes?.().value()).toThrow(/NG01902/);
    });
  });

  it('un modèle `null` pour un objet entier ne produit aucun sous-champ', () => {
    const model = signal<{ first: string; last: string } | null>(null);
    const person = form(model, injector()) as unknown as Record<
      string,
      unknown
    >;

    expect(person['first']).toBeUndefined();
    expect(person['last']).toBeUndefined();
  });

  it("`required()` considère vides '', null, false et NaN, mais pas 0", () => {
    const model = signal({
      text: '',
      date: null as Date | null,
      accepted: false,
      quantity: Number.NaN,
      zero: 0,
    });
    const values = form(
      model,
      (s) => {
        required(s.text);
        required(s.date);
        required(s.accepted);
        required(s.quantity);
        required(s.zero);
      },
      injector(),
    );

    expect(values.text().invalid()).toBe(true);
    expect(values.date().invalid()).toBe(true);
    expect(values.accepted().invalid()).toBe(true);
    expect(values.quantity().invalid()).toBe(true);
    expect(values.zero().valid()).toBe(true);
  });

  describe('null côté template : dépend du contrôle natif', () => {
    @Component({
      imports: [FormField],
      template: `<input type="number" [formField]="recipe.servings" />`,
    })
    class NumberHost {
      readonly model = signal<{ servings: number }>({ servings: 4 });
      readonly recipe = form(this.model);
    }

    @Component({
      imports: [FormField],
      template: `<input type="text" [formField]="recipe.name" />`,
    })
    class TextHost {
      readonly model = signal<{ name: string | null }>({ name: null });
      readonly recipe = form(this.model);
    }

    it('un <input type="number"> vidé écrit null, même si le modèle est typé `number`', async () => {
      const fixture = TestBed.createComponent(NumberHost);
      await fixture.whenStable();
      const input = (fixture.nativeElement as HTMLElement).querySelector(
        'input',
      ) as HTMLInputElement;

      input.value = '';
      input.dispatchEvent(new Event('input'));

      expect(fixture.componentInstance.model().servings).toBeNull();
    });

    it('un <input type="text"> lié à null affiche "" et avertit en dev (NG01921)', async () => {
      const warn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => undefined);
      const fixture = TestBed.createComponent(TextHost);
      await fixture.whenStable();
      const input = (fixture.nativeElement as HTMLElement).querySelector(
        'input',
      ) as HTMLInputElement;

      expect(input.value).toBe('');
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('NG01921'));
      warn.mockRestore();
    });
  });
});
