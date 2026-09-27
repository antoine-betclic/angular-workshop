import { RelativeDue } from './relative-due';

describe('RelativeDue', () => {
  const pipe = new RelativeDue();
  const now = new Date(2026, 8, 22, 15, 30); // 22 septembre 2026, 15h30

  it("affiche « Aujourd'hui » pour la date du jour", () => {
    expect(pipe.transform('2026-09-22', now)).toBe("Aujourd'hui");
  });

  it('affiche « Demain » puis « Dans N j »', () => {
    expect(pipe.transform('2026-09-23', now)).toBe('Demain');
    expect(pipe.transform('2026-09-25', now)).toBe('Dans 3 j');
  });

  it('affiche « Hier » puis « En retard de N j »', () => {
    expect(pipe.transform('2026-09-21', now)).toBe('Hier');
    expect(pipe.transform('2026-09-15', now)).toBe('En retard de 7 j');
  });
});
