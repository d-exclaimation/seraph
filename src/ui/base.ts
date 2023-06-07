//
//  base.ts
//  seraph
//
//  Created by d-exclaimation on 11 Apr 2023
//

import { create } from "./core";
import { mount, render } from "./dom";

type HTMLComponents = {
  [K in keyof HTMLElementTagNameMap]: (
    props: Parameters<typeof create>[1]
  ) => HTMLElementTagNameMap[K];
};

/**
 * Seraph style built-in HTML components.
 *
 * @example
 * ```ts
 * import { html } from "seraph";
 *
 * const App = sr.div({
 *  c: [
 *    html.span({
 *      c: "Hello World"
 *    }),
 *  ],
 * });
 * ```
 */
export const html = new Proxy({} as HTMLComponents, {
  get<K extends keyof HTMLElementTagNameMap>(_: {}, type: K) {
    return (props: Parameters<typeof create>[1]) => create(type, props);
  },
});

/**
 * Build a component from a function.
 * @param fn The function to build the component.
 * @returns The component.
 */
export function component<
  T extends { [k: string | symbol | number]: unknown } = {},
  K extends HTMLElement = HTMLElement
>(fn: (props: T) => K) {
  return {
    view: fn,
    render: (props: T, parent: HTMLElement) => {
      render(fn(props), parent);
    },
    mount: (props: T, parent: HTMLElement) => {
      mount(fn(props), parent);
    },
  };
}
