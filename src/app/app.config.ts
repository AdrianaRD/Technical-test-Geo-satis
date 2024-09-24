import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TimezonePipe } from './pipes/timezone.pipe';
import { provideStore } from '@ngrx/store';
import { offenderReducer } from './store/offender.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    TimezonePipe,
    provideStore({ offenders: offenderReducer })
  ]
};
