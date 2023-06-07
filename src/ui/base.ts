//
//  base.ts
//  seraph
//
//  Created by d-exclaimation on 11 Apr 2023
//

import { create } from "./core";

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
