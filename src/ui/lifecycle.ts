//
//  lifecycle.ts
//  seraph
//
//  Created by d-exclaimation on 11 Apr 2023
//

import { isstate, type State } from "../state";

/**
 * Applies a state or value to a function.
 * @param state The state or value
 * @param fn The function to apply to.
 * @returns The unsubscribe function.
 */
export function into<T>(state: State<T> | T, fn: (current: T) => void) {
  if (isstate(state)) {
    return state.subscribe(fn);
  }
  fn(state);
  return () => {};
}
