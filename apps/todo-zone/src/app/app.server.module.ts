import { NgModule } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { serverRoutes } from './app.routes.server';
import { API_URL } from './core/api-url.token';

@NgModule({
  imports: [AppModule],
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    // Côté serveur, on appelle l'API en IPv4 direct (évite la résolution de « localhost »).
    { provide: API_URL, useValue: 'http://127.0.0.1:3000' },
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
