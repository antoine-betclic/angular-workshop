import {
  isDevMode,
  NgModule,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import {
  BrowserModule,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';
import { LatencyInterceptor } from './core/latency.interceptor';
import { TagsEffects, tagsFeature, TodoEffects, todosFeature } from './store';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    StoreModule.forRoot({
      [todosFeature.name]: todosFeature.reducer,
      [tagsFeature.name]: tagsFeature.reducer,
    }),
    EffectsModule.forRoot([TodoEffects, TagsEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
  ],
  providers: [
    // v22 : zoneless est le défaut, MÊME avec bootstrapModule + zone.js chargé.
    // Sans cette ligne l'app tournerait en zoneless sans prévenir.
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners(),
    provideClientHydration(withEventReplay()),
    provideAnimations(),
    { provide: HTTP_INTERCEPTORS, useClass: LatencyInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
