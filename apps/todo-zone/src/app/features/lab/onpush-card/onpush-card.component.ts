import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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

/**
 * Carte « OnPush » : re-rendue seulement si
 *  - la référence d'un @Input change,
 *  - un événement DOM part de sa propre vue,
 *  - ou markForCheck() a été appelé avant la prochaine CD.
 */
@Component({
  selector: 'zn-onpush-card',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './onpush-card.component.html',
})
export class OnPushCardComponent {
  @Input() person!: LabPerson;
  @Output() logged = new EventEmitter<string>();

  @HostBinding('class') readonly hostClass = 'card lab-card onpush';

  local = 0;
  readonly counter: RenderCounter;

  constructor(
    host: ElementRef<HTMLElement>,
    zone: NgZone,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.counter = new RenderCounter(host, zone);
  }

  onLocalClick(): void {
    this.local++;
    this.logged.emit(
      'OnPush · événement dans l’enfant (local++) → la carte se rafraîchit',
    );
  }

  /** zone.js déclenche bien une CD après le timer, mais la carte OnPush n'est pas « dirty » : valeur affichée obsolète. */
  onTimeoutWithoutMark(): void {
    setTimeout(() => {
      this.local++;
    }, 300);
  }

  /** Même chose, mais markForCheck() marque la carte (et ses ancêtres) à vérifier au prochain tick. */
  onTimeoutWithMark(): void {
    setTimeout(() => {
      this.local++;
      this.cdr.markForCheck();
    }, 300);
  }

  reset(): void {
    this.local = 0;
    this.counter.reset();
    this.cdr.markForCheck();
  }
}
