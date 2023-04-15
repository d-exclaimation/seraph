//
//  lifecycle.ts
//  seraph
//
//  Created by d-exclaimation on 11 Apr 2023
//

import { type State } from "../state";
import { apply, type DefaultProps } from "./core";

/**
 * Use a state to compute a component's properties
 * @param state The state.
 * @param create The function to create the properties.
 * @returns The function to create the component.
 */
export function use<T>(
  state: State<T>,
  create: (value: T) => DefaultProps
): (parent: HTMLElement) => DefaultProps {
  return (parent) => {
    const props = create(state.current);
    state.subscribe((value) => {
      const newProps = create(value);
      if (newProps.on !== undefined || props.on !== undefined) {
        Object.entries(props.on ?? {}).forEach(([key, value]) => {
          parent.removeEventListener(key, value);
        });
        props.on = newProps.on;
        console.log(newProps.on);
      }
      apply(parent, newProps);
    });

    return props;
  };
}
