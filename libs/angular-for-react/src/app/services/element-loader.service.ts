import { inject, Injectable } from '@angular/core';
import { ElementRegistryService } from './element-registry.service';

@Injectable({
  providedIn: 'root'
})
export class ElementLoaderService {
  private readonly registryService = inject(ElementRegistryService)
  private observer?: MutationObserver;

  connect(): void {
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            this.checkAndRegisterElements(element);
          }
        });
      });
    });

    // Start observing the document body for changes
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Check for existing elements on initialization
    this.checkAndRegisterElements(document.body);
  }

  disconnect(): void {
    this.observer?.disconnect();
  }

  private checkAndRegisterElements(root: Element): void {
    const query = this.registryService.listUnloadeds().join(',');
    if (!query) return;

    const elements = root.querySelectorAll(query);
    const selectors = Array.from(new Set(Array.from(elements).map(el => el.tagName.toLowerCase())));
    if (!selectors.length) return

    this.registryService.loadElements(selectors).then(() => {
      console.log('Elements registered:', selectors);
    }).catch(err => {
      console.error('Error registering elements:', err);
    });
  }
}
