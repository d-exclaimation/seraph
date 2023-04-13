//
//  hydrate.ts
//  seraph
//
//  Created by d-exclaimation on 11 Apr 2023
//

import { render } from "../ui";
import { load } from "./props";

type HydrateArgs<P> = {
  into: HTMLElement;
  with: (props: P) => HTMLElement;
  using?: (value: string) => P;
};

/**
 * Hydrate a component into a parent element with props loaded from the `sr-props` attribute.
 * @param into The parent element.
 * @param with The component.
 * @param using The parser function.
 */
export function hydrate<P = {}>({
  into: parent,
  with: component,
  using: parser,
}: HydrateArgs<P>) {
  const props = load(parent, parser);
  const child = component(props);
  render(child, parent);
}
