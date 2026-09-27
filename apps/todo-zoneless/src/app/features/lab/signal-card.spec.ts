import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignalCard } from './signal-card';

describe('SignalCard (zoneless)', () => {
  let fixture: ComponentFixture<SignalCard>;
  let card: SignalCard;

  async function setup(mode: 'signal' | 'plain') {
    fixture = TestBed.createComponent(SignalCard);
    fixture.componentRef.setInput('heading', 'Test');
    fixture.componentRef.setInput('mode', mode);
    card = fixture.componentInstance;
    await fixture.whenStable();
  }

  const value = () =>
    (fixture.nativeElement as HTMLElement).querySelector('strong')?.textContent;

  it('mettre à jour un signal met le DOM à jour après whenStable()', async () => {
    await setup('signal');
    expect(value()).toBe('0');

    card.count.update((c) => c + 1);
    await fixture.whenStable();

    expect(value()).toBe('1');
  });

  it("muter un champ non-signal ne rafraîchit pas le DOM", async () => {
    await setup('plain');
    expect(value()).toBe('0');

    card.plain++;
    await fixture.whenStable();

    expect(card.plain).toBe(1);
    expect(value()).toBe('0');
  });

  it('compte les rendus dans le DOM sans passer par un binding', async () => {
    await setup('signal');
    await new Promise((resolve) => queueMicrotask(() => resolve(undefined)));
    const badge = (fixture.nativeElement as HTMLElement).querySelector('.render-count');
    expect(badge?.textContent).toBe('1');
  });
});
