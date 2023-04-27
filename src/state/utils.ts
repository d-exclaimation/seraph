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
export function mutable<T extends { [key: string | symbol]: unknown }>(
  initial: T
): State<T> {
  const $state = state(initial);

  return {
    get current() {
      return new Proxy($state.current, {
        get: (_: T, key: keyof T) => {
          return $state.current[key];
        },
        set: (_: T, key: keyof T, value: T[keyof T]) => {
          $state.current[key] = value;
          $state.current = $state.current;
          return true;
        },
      });
    },
    set current(value) {
      $state.current = value;
    },
    subscribe: $state.subscribe.bind($state),
  };
}
