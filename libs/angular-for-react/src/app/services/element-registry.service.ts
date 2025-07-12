/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable, InjectionToken, Injector, Type } from '@angular/core'
import { createCustomElement } from '@angular/elements'

/**
 * Definition of a custom element with its selector and component.
 */
export interface ElementDef {
  /**
   * The selector of the element
   */
  selector: string
  /**
   * A component ref instead of a module ref can be provided.
   */
  component: () => Promise<Type<any>>
}

export const ELEMENT_DEFS = new InjectionToken<ElementDef[]>('ELEMENT_DEFS')


@Injectable({
  providedIn: 'root',
})
export class ElementRegistryService {
  private readonly injector = inject(Injector)
  private readonly elements = inject(ELEMENT_DEFS, { optional: true }) || []


  private readonly registry = new Map<string, ElementDef>()
  private readonly defineds = new Set<string>()
  private readonly promises = new Map<string, Promise<void>>()

  constructor() {
    this.elements?.forEach((route) => {
      this.registry.set(route.selector.trim().toLowerCase(), route)
    })
  }

  listUnloadeds(): string[] {
    return Array.from(this.registry.keys()).filter((s) => !this.defineds.has(s))
  }

  /**
   * Allows to lazy load a element given it's selector (i.e. tagname).
   * If the element selector has been registered, it's according module
   * will be fetched lazily
   * @param selector selector of the element to load.
   */
  loadElement(selector: string): Promise<void> {
    if (this.promises.has(selector)) {
      return this.promises.get(selector)!
    }
    console.log(`Loading element "${selector}"`)
    const definition = this.registry.get(selector)
    if (!definition) {
      throw new Error(`Unrecognized element "${selector}". Make sure it is registered in the registry`)
    }

    const promise = new Promise<void>((resolve, reject) => {
      definition.component().then((component) => {
        if (!component) {
          throw new Error(`No component found for element "${selector}"`)
        }

        const customElement = createCustomElement(component, { injector: this.injector })
        customElements.define(selector, customElement)
        this.defineds.add(selector)
        resolve()
      }).catch(reject)
    })

    this.promises.set(selector, promise)

    return promise
  }

  loadElements(selectors: string[]): Promise<void[]> {
    if (!selectors.length) return Promise.resolve([])

    selectors = selectors.map((e) => e.trim().toLowerCase()).filter((s) => this.registry.has(s))
    return Promise.all(selectors.map((s) => this.loadElement(s)))
  }
}
