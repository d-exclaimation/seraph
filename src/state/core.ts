//
//  core.ts
//  seraph
//
//  Created by d-exclaimation on 11 Apr 2023
//

import { type State } from "./types";

/**
 * Creates a state object.
 * @param state The initial state.
 * @returns The state object.
 */
export function state<T>(state: T): State<T> {
  const data = {
    current: state,
  };
  const listeners = new Set<(curr: T) => void>();

  return {
    __kind: "state",
    get current() {
      return data.current;
    },
    set current(value: T) {
      data.current = value;
      listeners.forEach((listener) => listener(value));
    },
    subscribe(listener: (curr: T) => void) {
      listener(data.current);
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

/**
 * Creates a computed state object.
 * @param state The state object to compute from.
 * @param compute The function to compute the state.
 * @returns The computed state object.
 */
export function from<T, K>(state: State<T>, compute: (curr: T) => K): State<K> {
  return {
    __kind: "state",

    get current() {
      return compute(state.current);
    },
    subscribe(listener: (curr: K) => void) {
      return state.subscribe((curr) => {
        listener(compute(curr));
      });
    },
  };
}

/**
 * Create a cached computed state object
 * @experimental Uses `Object.is` to compare state values
 *
 * @param state The state object to compute from.
 * @param compute The function to compute the state.
 * @returns The cached computed state object
 */
export function memo<T, K>(state: State<T>, compute: (curr: T) => K): State<K> {
  const memoised = {
    prev: state.current,
    current: undefined as K | undefined,
    recompute() {
      const newValue = compute(state.current);
      this.current = newValue;
      this.prev = state.current;
      return newValue;
    },
    same() {
      return Object.is(this.prev, state.current);
    },
  };

  return {
    __kind: "state",
    get current() {
      if (memoised.current !== undefined && memoised.same()) {
        return memoised.current;
      }
      return memoised.recompute();
    },
    subscribe(listener) {
      return state.subscribe((data) => {
        if (memoised.current !== undefined && Object.is(memoised.prev, data)) {
          return;
        }
        listener(memoised.recompute());
      });
    },
  };
}

/**
 * Run an effect when the state changes.
 * @param state The state object to subscribe to.
 * @param effect The effect to run.
 * @returns A function to unsubscribe.
 */
export function effect<T>(state: State<T>, effect: (curr: T) => void) {
  return state.subscribe(effect);
}
