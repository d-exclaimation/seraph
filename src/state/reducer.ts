//
//  reducer.ts
//  seraph
//
//  Created by d-exclaimation on 21 May 2023
//

import { state } from "./core";

/**
 * A reducer function that takes in a state and an action to return a new state.
 * @param reducer The reducer function.
 * @param initial The initial state.
 * @returns The state object.
 */
export function reducer<T, A>(reducer: (state: T, action: A) => T, initial: T) {
  const $store = state(initial);
  return {
    __kind: "state",
    get current() {
      return $store.current;
    },
    subscribe(listener: (state: T) => void) {
      return $store.subscribe(listener);
    },
    dispatch(action: A) {
      $store.current = reducer($store.current, action);
    },
  };
}
