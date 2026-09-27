import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay } from 'rxjs';
import { DEMO_LATENCY_MS } from './api-url';

/** Interceptor fonctionnel : retarde chaque réponse de `DEMO_LATENCY_MS`. */
export const latencyInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(delay(inject(DEMO_LATENCY_MS)));
