import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideBrowserGlobalErrorListeners(),
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideAnimationsAsync(),
        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: false || 'none',
                },
            },
        }),
        provideRouter(routes),
        provideClientHydration(), // tanpa withEventReplay
    ],
};
