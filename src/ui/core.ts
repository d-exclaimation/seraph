//
//  core.ts
//  seraph
//
//  Created by d-exclaimation on 11 Apr 2023
//

import { type Arrayable } from "../common/types";
import { isstate, type State } from "../state";
import { into } from "./lifecycle";

/**
 * Maybe state type or just a value.
 */
export type MaybeState<T> = State<T> | T;

/**
 * CSS classes that can be a state or a value.
 */
export type Classes = MaybeState<string> | MaybeState<string[]>;

/**
 * CSS styles that can be a state, a value, or an object of indivudual states.
 */
export type Styles =
  | {
      [key in keyof CSSStyleDeclaration]?: MaybeState<CSSStyleDeclaration[key]>;
    }
  | State<Partial<CSSStyleDeclaration>>;

/**
 * Children that can be a state or a value.
 */
export type Children = MaybeState<Arrayable<HTMLElement | string>>;

/**
 * Attributes that can be a state, a value, or an object of indivudual states.
 */
export type Attr = State<Record<string, any>> | Record<string, MaybeState<any>>;

/**
 * Event listeners for the component
 */
export type Listener = {
  [key in keyof HTMLElementEventMap]?: (e: HTMLElementEventMap[key]) => void;
};

/**
 * Component properties.
 */
export type BaseProps = {
  classes?: Classes;
  style?: Styles;
  c?: Children;
  on?: Listener;
  attr?: Attr;
};

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
  { classes, style, c: children, on, attr }: BaseProps
) {
  const unsubs = [] as (() => void)[];
  if (classes !== undefined) {
    const unsub = into(classes, (classes) => {
      elem.className = "";
      if (typeof classes === "string") {
        elem.className = classes;
      } else {
        elem.className = classes.join(" ");
      }
    });
    unsubs.push(unsub);
  }

  if (style !== undefined) {
    if (isstate(style)) {
      const unsub = style.subscribe((style) => {
        elem.style.cssText = "";
        Object.entries(style).forEach(([key, value]) => {
          if (value === undefined || value === null) {
            return;
          }
          elem.style[key as any] = value as string;
        });
      });
      unsubs.push(unsub);
    } else {
      Object.entries(style).forEach(([key, value]) => {
        elem.style.cssText = "";
        const unsub = into(value, (value) => {
          if (value === undefined || value === null) {
            return;
          }
          elem.style[key as any] = value as string;
        });
        unsubs.push(unsub);
      });
    }
  }

  if (children !== undefined) {
    const unsub = into(children, (children) => {
      elem.innerHTML = "";
      (Array.isArray(children) ? children : [children])
        .map((child) =>
          typeof child === "string" ? document.createTextNode(child) : child
        )
        .forEach((child) => elem.appendChild(child));
    });
    unsubs.push(unsub);
  }

  if (attr !== undefined) {
    if (isstate(attr)) {
      const unsub = attr.subscribe((attr) => {
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
      });
      unsubs.push(unsub);
    } else {
      Object.entries(attr).forEach(([key, value]) => {
        const unsub = into(value, (value) => {
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
        unsubs.push(unsub);
      });
    }
  }

  if (on !== undefined) {
    Object.entries(on).forEach(([key, value]) =>
      elem.addEventListener(key, value as EventListener)
    );
  }

  window.addEventListener("beforeunload", () => {
    unsubs.forEach((unsub) => unsub());
  });
}

/**
 * Creates a component.
 * @param __type The component type.
 * @param props The properties.
 * @returns The component.
 */
export function create<K extends keyof HTMLElementTagNameMap>(
  __type: K,
  props: BaseProps
): HTMLElementTagNameMap[K] {
  const elem = document.createElement(__type);
  apply(elem, props);
  return elem;
}
