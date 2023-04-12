//
//  dom.ts
//  seraph
//
//  Created by d-exclaimation on 11 Apr 2023
//

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
 * @returns The component.
 */
export function render<
  Parent extends HTMLElement,
  Component extends HTMLElement
>(elem: Component, parent: Parent) {
  parent.innerHTML = "";
  parent.appendChild(elem);
}
