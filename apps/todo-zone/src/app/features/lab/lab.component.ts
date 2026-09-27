import {
  ApplicationRef,
  ChangeDetectionStrategy,
  Component,
  HostListener,
  NgZone,
  ViewChild,
} from '@angular/core';
import { DefaultCardComponent } from './default-card/default-card.component';
import { LabPerson } from './lab-person';
import { OnPushCardComponent } from './onpush-card/onpush-card.component';

/**
 * Page du labo (Default). Elle possède l'état passé aux deux cartes et le journal.
 * Chaque bouton illustre une façon de (ne pas) déclencher la change detection avec zone.js.
 */
@Component({
  selector: 'zn-lab',
  standalone: false,
  // v22 : OnPush est le défaut, Default (= Eager) doit être explicite
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './lab.component.html',
})
export class LabComponent {
  person: LabPerson = { name: 'Ada', clicks: 0 };
  tick = 0;
  log: string[] = [];

  @ViewChild(DefaultCardComponent) defaultCard!: DefaultCardComponent;
  @ViewChild(OnPushCardComponent) onPushCard!: OnPushCardComponent;

  constructor(
    private readonly zone: NgZone,
    private readonly appRef: ApplicationRef,
  ) {}

  /** Volontairement vide : un événement DOM quelconque suffit à relancer la CD de toute l'app. */
  @HostListener('document:mousemove')
  onMouseMove(): void {
    // rien
  }

  mutate(): void {
    this.person.clicks++;
    this.addLog('person.clicks++ (mutation, même référence) → Default seul');
  }

  replace(): void {
    this.person = { ...this.person, clicks: this.person.clicks + 1 };
    this.addLog(
      'person = { ...person } (nouvelle référence) → Default ET OnPush',
    );
  }

  timeout(): void {
    this.addLog(
      'setTimeout(tick++) hors template → dans 300 ms, zone.js détecte le timer → Default seul',
    );
    setTimeout(() => {
      this.tick++;
    }, 300);
  }

  outsideZone(): void {
    this.addLog(
      'runOutsideAngular + tick++ → rien ne bouge (jusqu’au prochain événement ou appRef.tick())',
    );
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.tick++;
      }, 300);
    });
  }

  detectNow(): void {
    this.addLog('appRef.tick() → Angular rattrape ce qui a changé hors zone');
    this.appRef.tick();
  }

  timeoutWithoutMark(card: OnPushCardComponent): void {
    this.addLog(
      'OnPush · setTimeout(local++) sans markForCheck → rien ne bouge (valeur obsolète)',
    );
    card.onTimeoutWithoutMark();
  }

  timeoutWithMark(card: OnPushCardComponent): void {
    this.addLog(
      'OnPush · setTimeout(local++) + markForCheck() → la carte se rafraîchit',
    );
    card.onTimeoutWithMark();
  }

  reset(): void {
    this.person = { name: 'Ada', clicks: 0 };
    this.tick = 0;
    this.log = [];
    this.defaultCard.reset();
    this.onPushCard.reset();
  }

  addLog(line: string): void {
    const time = new Date().toLocaleTimeString('fr-FR');
    this.log = [`${time} — ${line}`, ...this.log].slice(0, 10);
  }
}
