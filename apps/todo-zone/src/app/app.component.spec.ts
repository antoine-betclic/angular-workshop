import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [AppComponent],
    }).compileComponents();
  });

  it('affiche le badge moteur « zone.js »', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const badge = (fixture.nativeElement as HTMLElement).querySelector('.engine');
    expect(badge?.classList.contains('zone')).toBe(true);
    expect(badge?.textContent?.trim()).toBe('zone.js');
  });

  it('affiche la navigation en français', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const links = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('nav a'),
    ).map((a) => a.textContent?.trim());
    expect(links).toEqual(['Tâches', 'Nouvelle tâche', 'Statistiques', 'Labo CD', 'À propos']);
  });
});
