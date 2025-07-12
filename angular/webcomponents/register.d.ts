import { default as React } from 'react';
export declare function getPropsFromElement(el: HTMLElement, propNames: string[]): Record<string, any>;
export declare function defineLazyReactComponent(tag: string, propNames: string[] | undefined, loader: () => Promise<{
    default: React.FC<any>;
}>): void;
