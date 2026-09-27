import {
  ChangeDetectionStrategy,
  Component,
  signal,
  viewChildren,
} from '@angular/core';
import { SignalCard } from './signal-card';

const MAX_LOG = 10;

@Component({
  selector: 'zl-lab',
  imports: [SignalCard],
  templateUrl: './lab.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Lab {
  private readonly cards = viewChildren(SignalCard);

  protected readonly log = signal<string[]>([]);

  protected addLog(line: string): void {
    const time = new Date().toLocaleTimeString('fr-FR');
    this.log.update((lines) => [`${time} ${line}`, ...lines].slice(0, MAX_LOG));
  }

  protected resetAll(): void {
    for (const card of this.cards()) card.reset();
    this.log.set([]);
  }
}
