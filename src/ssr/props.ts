//
//  props.ts
//  seraph
//
//  Created by d-exclaimation on 11 Apr 2023
//

import { state, type State } from "../state";

/**
 * Get the props from the data attribute.
 * @param target The target element.
 * @param parser The parser function.
 * @returns The props.
 */
export function load<P>(
  target: HTMLElement,
  parser: (value: string) => P = JSON.parse
) {
  const raw = target.getAttribute("data-seraph-ssr");
  if (raw === null || raw === undefined) {
    throw new Error("No props found");
  }
  return parser(raw);
}

/**
 * Get the props from the data attribute and create a state.
 * @param target The target element.
 * @param parser The parser function.
 * @returns The props as a state.
 */
export function loaded<P>(
  target: HTMLElement,
  parser: (value: string) => P = JSON.parse
): State<P> {
  const initial = load(target, parser);
  return state(initial);
}
