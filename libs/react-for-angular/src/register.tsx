/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import ReactDOM from 'react-dom/client';

// Parse attributes into props (with JSON support)
export function getPropsFromElement(
  el: HTMLElement,
  propNames: string[]
): Record<string, any> {
  const props: Record<string, any> = {};
  const propNamesLowerCase = propNames.map((name) => name.toLowerCase());

  if (el.hasAttributes()) {
    const attributes = Array.from(el.attributes);

    for (const attr of attributes) {
      if (attr.name.startsWith('_ng') || attr.name.startsWith('ng-')) {
        continue; // Skip Angular specific attributes
      }

      const propIndex = propNamesLowerCase.indexOf(attr.name.toLowerCase());
      if (propIndex !== -1) {
        const propName = propNames[propIndex];
        try {
          // Try to parse as JSON first (for objects, arrays, booleans, numbers)
          props[propName] = JSON.parse(attr.value);
        } catch {
          // Fallback to string if JSON parsing fails
          props[propName] = attr.value;
        }
      }
    }
  }

  return props;
}

// Generic dynamic Web Component wrapper
export function defineLazyReactComponent(
  tag: string,
  propNames: string[] = [],
  loader: () => Promise<{ default: React.FC<any> }>,
) {
  if (customElements.get(tag)) {
    console.warn(`Custom element <${tag}> is already defined.`);
    return;
  }

  class ReactWebComponent extends HTMLElement {
    private root: ReactDOM.Root | null = null;
    private Component: React.FC<any> | null = null;
    private mutationObserver: MutationObserver | null = null;

    private renderScheduled = false;

    private scheduleRender() {
      if (!this.renderScheduled) {
        this.renderScheduled = true;
        // Use setTimeout to batch multiple property changes
        setTimeout(() => {
          this.renderScheduled = false;
          if (this.root && this.Component) {
            this.render();
          }
        }, 0);
      }
    }

    async connectedCallback() {
      if (!this.Component) {
        try {
          const { default: Component } = await loader();
          this.Component = Component;
        } catch (error) {
          console.error(`Failed to load component for <${tag}>`, error);
          return;
        }
      }

      if (!this.root) {
        this.root = ReactDOM.createRoot(this);
      }

      // Set up mutation observer to watch for attribute changes
      this.mutationObserver = new MutationObserver((mutations) => {
        const hasAttributeChanges = mutations.some(
          mutation => mutation.type === 'attributes'
        );

        if (hasAttributeChanges && this.root && this.Component) {
          this.render();
        }
      });

      this.mutationObserver.observe(this, {
        attributes: true,
        attributeOldValue: true,
      });

      // Schedule the initial render to allow Angular to set initial props
      this.scheduleRender();
    }

    private render() {
      if (this.root && this.Component) {
        const props = getPropsFromElement(this, propNames);
        console.log(`Rendering <${tag}> with props:`, props);
        this.root.render(
          /* YOU CAN WRAP THIS BY ANY GLOBAL SHARED PROVIDERS, INTL, ANTD... */
          <this.Component {...props} />
        );
      }
    }

    disconnectedCallback() {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect();
        this.mutationObserver = null;
      }

      if (this.root) {
        this.root.unmount();
        this.root = null;
      }
    }
  }

  customElements.define(tag, ReactWebComponent);
}

