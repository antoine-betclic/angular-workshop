import { Inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DEMO_LATENCY_MS } from './api-url.token';

/**
 * Interceptor « à l'ancienne » : une classe qui implémente HttpInterceptor,
 * fournie via le multi-provider HTTP_INTERCEPTORS.
 */
@Injectable()
export class LatencyInterceptor implements HttpInterceptor {
  constructor(@Inject(DEMO_LATENCY_MS) private readonly latency: number) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(delay(this.latency));
  }
}
