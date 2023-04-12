//
//  base.ts
//  seraph
//
//  Created by d-exclaimation on 11 Apr 2023
//

import { type Arrayable } from "../common/types";
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

/**
 * Seraph built-in show components.
 *
 * @example
 * ```ts
 * import { Show, sr } from "seraph";
 *
 * const App = () => {
 *  const $shown = state(false);
 *  return sr.div(
 *    use($shown, (shown) => ({
 *      c: [
 *        Show({
 *          when: true,
 *          c: "Hello World"
 *        }),
 *        sr.button({
 *          c: "Toggle",
 *          on: {
 *            click: () => $shown.current = !$shown.current
 *          }
 *        })
 *      ],
 *    }))
 *  );
 * }
 * ```
 */
export function Show(props: {
  when: boolean;
  c: Arrayable<HTMLElement | string>;
  fallback?: Arrayable<HTMLElement | string>;
}): Arrayable<HTMLElement | string> {
  if (!props.when) {
    return props.fallback ?? "";
  }
  return props.c;
}

/**
 * Seraph built-in for loop components.
 *
 * @example
 * ```ts
 * import { sr } from "seraph";
 *
 * const App = () => {
 *  const $input = state("");
 *  const $notes = state(["Hello", "World"]);
 *  return sr.div({
 *    c: [
 *      sr.div(
 *        use($notes, (notes) => ({
 *          c: For({
 *            each: notes,
 *            c: (note) => sr.span({ c: note }),
 *          }),
 *        }))
 *      ),
 *      sr.input({
 *        on: {
 *          input: (e) => $input.current = (e.target as HTMLInputElement).value,
 *        },
 *      }),
 *      sr.button({
 *        c: "Add",
 *        on: {
 *          click: () => $notes.current = [...$notes.current, $input.current],
 *        },
 *      }),
 *    ],
 *  });
 * }
 * ```
 */
export function For<T>(props: {
  each: Array<T>;
  c: (item: T, index: number) => Arrayable<HTMLElement | string>;
}): Arrayable<HTMLElement | string> {
  return props.each.flatMap(props.c);
}
