import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { ElementLoaderService } from './services/element-loader.service';
import { ElementDef, ElementRegistryService, ELEMENT_DEFS } from './services/element-registry.service';


const registry: ElementDef[] = [
  {
    selector: 'ngx-hello-world',
    component: () => import(
      './elements/hello-world/hello-world.component'
    ).then(m => m.HelloWorldComponent)
  },
  {
    selector: 'ngx-charts',
    component: () =>
      import('./elements/ngx-charts/ngx-charts.component').then(
        (m) => m.NgxChartsComponent
      ),
  },
];


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),

    ...registry.map((def) => ({
      provide: ELEMENT_DEFS,
      useValue: def,
      multi: true
    })),

    ElementRegistryService,
    ElementLoaderService,
  ],
};
