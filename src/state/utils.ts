//
//  utils.ts
//  seraph
//
//  Created by d-exclaimation on 11 Apr 2023
//

import { state } from "./core";
import { type All, type State, type Zipped } from "./types";

/**
 * Creates a state object that is a combination of other state objects.
 * @param states The state objects to combine.
 * @returns The combined state object.
 */
export function all<K extends Record<string, State<unknown>>>(
  states: K
): State<All<K>> {
  return {
    get current() {
      return Object.fromEntries(
        Object.entries(states).map(([key, state]) => [key, state.current])
      ) as All<K>;
    },
    subscribe(listener) {
      const unsubscribes = Object.entries(states).map(
        ([key, state]) =>
          [
            key,
            state.subscribe((value) => {
              listener({
                ...this.current,
                [key]: value,
              });
            }),
          ] as const
      );
      return () => {
        unsubscribes.forEach(([_, unsubscribe]) => unsubscribe());
      };
    },
  };
}

/**
 * Creates a state object that is a combination of other state objects.
 * @param states The state objects to combine.
 * @returns The combined state object.
 */
export function zip<T extends State<unknown>[]>(
  ...states: T
): State<Zipped<T>> {
  return {
    get current() {
      return states.map((state) => state.current) as Zipped<T>;
    },
    subscribe(listener) {
      const unsubscribes = states.map((state) =>
        state.subscribe(() => {
          listener(states.map((state) => state.current) as Zipped<T>);
        })
      );
      return () => {
        unsubscribes.forEach((unsubscribe) => unsubscribe());
      };
    },
  };
}

/**
 * Creates a mutable state object
 *
 * @param initial The initial value of the state object.
 * @returns The mutable state object.
 */
export function mutable<T extends { [key: string | number | symbol]: unknown }>(
  initial: T
): State<T> {
  const $state = state(initial);

  const proxy = new Proxy(initial, {
    get: <K extends keyof T>(_: T, key: K) => $state.current[key],
    set: <K extends keyof T>(_: T, key: K, value: T[K]) => {
      $state.current[key] = value;
      $state.current = $state.current;
      return true;
    },
  });

  return {
    get current() {
      return proxy;
    },
    set current(value) {
      $state.current = value;
    },
    subscribe: $state.subscribe.bind($state),
  };
}

/**
 * Creates a state object that indicates whether an action is in progress.
 * @returns The transition state object.
 */
export function transition(): State<boolean> & {
  start: (action: () => Promise<void>) => void;
} {
  const $transition = state(false);

  return {
    subscribe: $transition.subscribe.bind($transition),
    get current() {
      return $transition.current;
    },
    start(action: () => Promise<void>) {
      $transition.current = true;
      action().finally(() => {
        $transition.current = false;
      });
    },
  };
}

/**
 * Creates a reducer-style state that changes its value based on an action.
 * @param fn The reducer function.
 * @param initial The initial value of the state object.
 * @returns The reducer state object.
 */
export function reduce<T, A>(
  fn: (state: T, action: A) => T,
  initial: T
): State<T> & { dispatch: (action: A) => void } {
  const $state = state<T>(initial);

  const dispatch = (action: A) => {
    $state.current = fn($state.current, action);
  };

  return {
    dispatch,
    subscribe: $state.subscribe.bind($state),
    get current() {
      return $state.current;
    },
  };
}
