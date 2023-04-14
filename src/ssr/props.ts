//
//  props.ts
//  seraph
//
//  Created by d-exclaimation on 11 Apr 2023
//

import { state, type State } from "../state";

/**
 * Get the props from the `sr-props` attribute and create a state.
 * @param id The id of the element.
 * @param parser The parser function.
 * @returns The props as a state.
 */
export function load<P>(
  id: string,
  parser: (value: string) => P = JSON.parse
): State<P> {
  const target = document.getElementById(id) as HTMLElement;
  const raw = target.getAttribute("sr-props") ?? "{}";
  return state(parser(raw));
}

export function resource<R>(
  id: string,
  parser: (value: string) => R = JSON.parse
) {
  const target = document.getElementById(id) as HTMLScriptElement;
  const raw = target.innerText;
  return state(parser(raw));
}
