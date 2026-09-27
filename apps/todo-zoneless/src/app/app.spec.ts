import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('affiche le badge moteur « zoneless »', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const badge = (fixture.nativeElement as HTMLElement).querySelector('.engine');
    expect(badge?.classList.contains('zoneless')).toBe(true);
    expect(badge?.textContent?.trim()).toBe('zoneless');
  });

  it('affiche la navigation en français', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const links = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('nav a'),
    ).map((a) => a.textContent?.trim());
    expect(links).toEqual(['Tâches', 'Nouvelle tâche', 'Statistiques', 'Labo CD', 'À propos']);
  });
});
