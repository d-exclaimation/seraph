//
//  core.ts
//  seraph
//
//  Created by d-exclaimation on 11 Apr 2023
//

import { type Arrayable } from "../common/types";

/**
 * Component properties.
 */
export type DefaultProps = {
  classes?: string | string[];
  style?: Partial<CSSStyleDeclaration>;
  c?: Arrayable<HTMLElement | string>;
  on?: Partial<Record<keyof HTMLElementEventMap, (e: Event) => void>>;
  attr?: Record<string, any>;
};

/**
 * Applies properties to a component.
 * @param elem The component.
 * @param props The properties.
 */
export function apply(
  elem: HTMLElement,
  { classes, style, c: children, on, attr }: DefaultProps
) {
  if (classes !== undefined) {
    elem.className = "";
    if (typeof classes === "string") {
      elem.className = classes;
    } else {
      elem.className = classes.join(" ");
    }
  }

  if (style !== undefined) {
    elem.style.cssText = "";
    Object.entries(style).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        return;
      }
      elem.style[key as any] = value as string;
    });
  }

  if (children !== undefined) {
    elem.innerHTML = "";
    (Array.isArray(children) ? children : [children])
      .map((child) =>
        typeof child === "string" ? document.createTextNode(child) : child
      )
      .forEach((child) => elem.appendChild(child));
  }

  if (attr !== undefined) {
    Object.entries(attr).forEach(([key, value]) => {
      elem.removeAttribute(key);
      if (value === undefined) {
        return;
      }
      if (key in elem) {
        (elem as any)[key] = value;
        return;
      }
      elem.setAttribute(key, value);
    });
  }

  if (on !== undefined) {
    Object.entries(on).forEach(([key, value]) =>
      elem.addEventListener(key, value)
    );
  }
}

/**
 * Creates a component.
 * @param __type The component type.
 * @param props The properties.
 * @returns The component.
 */
export function create<K extends keyof HTMLElementTagNameMap>(
  __type: K,
  props: DefaultProps | ((parent: HTMLElement) => DefaultProps)
): HTMLElementTagNameMap[K] {
  const elem = document.createElement(__type);
  apply(elem, typeof props === "function" ? props(elem) : props);
  return elem;
}
