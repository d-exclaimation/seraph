//
//  dom.ts
//  seraph
//
//  Created by d-exclaimation on 11 Apr 2023
//

import { apply, type BaseProps } from "./core";

/**
 * Mount a component to a parent.
 * @param elem The component.
 * @param parent The parent.
 */
export function mount<
  Parent extends HTMLElement,
  Component extends HTMLElement
>(elem: Component, parent: Parent) {
  parent.appendChild(elem);
}

/**
 * Render a component to a parent.
 * @param elem The component.
 * @param parent The parent.
 */
export function render<
  Parent extends HTMLElement,
  Component extends HTMLElement
>(elem: Component, parent: Parent) {
  parent.innerHTML = "";
  parent.appendChild(elem);
}

/**
 * Hydrate an existing component by their id.
 * @param id The id of the element.
 * @param props The properties.
 * @returns The component.
 */
export function hydrate<T extends HTMLElement>(id: string, props: BaseProps) {
  const elem = document.getElementById(id) as T;
  apply(elem, props);
  return elem;
}
