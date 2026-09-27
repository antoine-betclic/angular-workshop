import { RelativeDuePipe } from './relative-due.pipe';

describe('RelativeDuePipe', () => {
  const pipe = new RelativeDuePipe();
  const now = new Date(2026, 8, 22, 15, 30); // 22 septembre 2026, 15h30

  it("affiche « Aujourd'hui » pour la date du jour", () => {
    expect(pipe.transform('2026-09-22', now)).toBe("Aujourd'hui");
  });

  it('affiche « Demain » et « Dans N j » pour les échéances futures', () => {
    expect(pipe.transform('2026-09-23', now)).toBe('Demain');
    expect(pipe.transform('2026-09-25', now)).toBe('Dans 3 j');
  });

  it('affiche « Hier » et « En retard de N j » pour les échéances passées', () => {
    expect(pipe.transform('2026-09-21', now)).toBe('Hier');
    expect(pipe.transform('2026-09-15', now)).toBe('En retard de 7 j');
  });

  it('retourne une chaîne vide sans échéance', () => {
    expect(pipe.transform(null, now)).toBe('');
  });
});
