import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  NgZone,
  Output,
} from '@angular/core';
import { LabPerson } from '../lab-person';
import { RenderCounter } from '../render-counter';

/** Carte « Default » : re-rendue à CHAQUE change detection de l'application. */
@Component({
  selector: 'zn-default-card',
  standalone: false,
  // v22 : OnPush est le défaut, Default (= Eager) doit être explicite
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './default-card.component.html',
})
export class DefaultCardComponent {
  @Input() person!: LabPerson;
  @Output() logged = new EventEmitter<string>();

  @HostBinding('class') readonly hostClass = 'card lab-card default';

  local = 0;
  readonly counter: RenderCounter;

  constructor(host: ElementRef<HTMLElement>, zone: NgZone) {
    this.counter = new RenderCounter(host, zone);
  }

  onLocalClick(): void {
    this.local++;
    this.logged.emit(
      'Default · événement dans l’enfant (local++) → la carte se rafraîchit',
    );
  }

  reset(): void {
    this.local = 0;
    this.counter.reset();
  }
}
