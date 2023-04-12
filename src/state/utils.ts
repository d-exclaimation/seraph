//
//  utils.ts
//  seraph
//
//  Created by d-exclaimation on 11 Apr 2023
//

import { type All, type State } from "./types";

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
