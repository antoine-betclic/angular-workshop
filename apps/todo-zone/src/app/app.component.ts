import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';

@Component({
  selector: 'zn-root',
  standalone: false,
  // v22 : OnPush est le défaut, Default (= Eager) doit être explicite
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  readonly year = new Date().getFullYear();
  now = new Date();

  constructor(@Inject(PLATFORM_ID) private readonly platformId: object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setInterval(() => (this.now = new Date()), 1000);
    }
  }
}
