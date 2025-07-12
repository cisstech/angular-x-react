import { App } from './app/app';
import { appConfig } from './app/app.config';

import { createCustomElement } from '@angular/elements';
import { createApplication } from '@angular/platform-browser';

(async () => {
  const app = await createApplication(appConfig);
  const rootElement = createCustomElement(App, {
    injector: app.injector,
  });
  customElements.define('ngx-root', rootElement);
})();
