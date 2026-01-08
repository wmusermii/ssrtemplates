import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration} from '@angular/platform-browser';
import MyPreset from './layouts/primengpreset/mypreset'; // path sesuaikan
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
            darkModeSelector: false || 'none'
        }
      }
    }),
    provideRouter(routes),
    provideClientHydration(),  // tanpa withEventReplay
  ]
};
