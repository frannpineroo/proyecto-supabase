import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
// He borrado la importación de 'provideClientHydration' aquí arriba

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
    // HE BORRADO LA LÍNEA DE HIDRATACIÓN AQUÍ ABAJO
  ]
};