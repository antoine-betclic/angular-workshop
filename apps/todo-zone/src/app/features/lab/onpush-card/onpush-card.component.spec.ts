import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LabPerson } from '../lab-person';
import { OnPushCardComponent } from './onpush-card.component';

@Component({
  selector: 'zn-host',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
  template: '<zn-onpush-card [person]="person"></zn-onpush-card>',
})
class HostComponent {
  person: LabPerson = { name: 'Ada', clicks: 0 };
}

/** Laisse passer la microtâche de RenderCounter (queueMicrotask hors zone). */
const flushMicrotasks = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe('OnPushCardComponent', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;
  let el: HTMLElement;

  const clicksText = () => el.querySelector('p')?.textContent?.replace(/\s+/g, ' ') ?? '';
  const renderCount = () => el.querySelector('.render-count')?.textContent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent, OnPushCardComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    el = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
    await flushMicrotasks();
  });

  it('rend la valeur initiale et compte 1 rendu (les 2 passes du mode dev sont dédoublonnées)', () => {
    expect(clicksText()).toContain('clicks : 0');
    expect(renderCount()).toBe('1');
  });

  it('muter l’input (même référence) ne re-rend PAS la carte OnPush', async () => {
    host.person.clicks = 5;
    fixture.detectChanges();
    await flushMicrotasks();
    expect(clicksText()).toContain('clicks : 0');
    expect(renderCount()).toBe('1');
  });

  it('remplacer la référence de l’input re-rend la carte OnPush', async () => {
    host.person = { ...host.person, clicks: 5 };
    fixture.detectChanges();
    await flushMicrotasks();
    expect(clicksText()).toContain('clicks : 5');
    expect(renderCount()).toBe('2');
  });

  it('un événement DOM dans sa propre vue re-rend la carte OnPush', async () => {
    const button = el.querySelector<HTMLButtonElement>('button');
    button?.click();
    fixture.detectChanges();
    await flushMicrotasks();
    expect(clicksText()).toContain('local : 1');
    expect(renderCount()).toBe('2');
  });
});
