import '@angular/compiler';
// Charge zone.js (+ plugins de test). Sans lui, Angular 22 démarre en zoneless même avec `zoneless: false`.
import '@analogjs/vitest-angular/setup-zone';
import { provideZoneChangeDetection } from '@angular/core';
import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';

// `zoneless: false` ne suffit plus : le TestBed d'Angular 22 est zoneless par défaut (ZONELESS_ENABLED = true),
// il faut fournir explicitement la CD basée sur NgZone.
setupTestBed({ zoneless: false, providers: [provideZoneChangeDetection()] });
