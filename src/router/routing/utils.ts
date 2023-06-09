//
//  utils.ts
//  seraph-router
//
//  Created by d-exclaimation on 08 Jun 2023
//

import { html, type BaseProps } from "../../ui";
import { type History } from "../history";

/**
 * Properties for the router link component
 */
export type LinkProps = BaseProps & { href: string };

/**
 * Router link component
 * @param $history - History state
 * @param props - Properties for the link
 * @returns Link component
 */
export const link = ($history: History, { attr, on, ...props }: LinkProps) =>
  html.a({
    ...props,
    attr: {
      ...attr,
      href: props.href,
    },
    on: {
      ...on,
      click: (e) => {
        e.preventDefault();
        $history.navigate(props.href);
      },
    },
  });

/**
 * Properties for the router navigate component
 * @property href - URL to navigate to
 * @property replace - Replace the current history state
 */
export type NavigateProps = {
  href: string;
  replace?: boolean;
};

/**
 * Router navigate component
 * @param $history - History state
 * @param props - Properties for the navigate
 * @returns Navigate component
 */
export const navigate = (
  $history: History,
  { href, replace }: NavigateProps
) => {
  setTimeout(() => $history.navigate(href, replace), 0);
  return html.span({});
};

/**
 * Get params from a path string
 * @param path - Path string
 * @returns Params object
 */
export type ParamsProps<
  T extends string,
  Result extends {} = {}
> = T extends `${infer Head}/${infer Tail}`
  ? Head extends `:${infer Param}`
    ? ParamsProps<Tail, Result & { [K in Param]: string }>
    : ParamsProps<Tail, Result>
  : T extends `:${infer Param}`
  ? Result & { [K in Param]: string }
  : Result;

/**
 * Route object
 * @property path - Path string
 * @property component - Component to render taking in the params if any
 */
export type Route<T extends string, P, K> = {
  path: T;
  component: (props: P) => K;
};

/**
 * Create a type-safe route for the router
 * @param path - Path string
 * @param component - Component to render taking in the params if any
 * @returns Route object
 */
export function route<T extends string, K extends HTMLElement>(
  path: T,
  component: (props: ParamsProps<T>) => K
): Route<T, ParamsProps<T>, K>;

/**
 * Create a type-safe route for the router
 * @param path - Path string
 * @param component - Component to render taking in the params if any
 * @param parser - Parser for the params
 * @returns Route object
 */
export function route<
  T extends string,
  K extends HTMLElement,
  P extends {} = ParamsProps<T>
>(
  path: T,
  component: (props: P) => K,
  parser: (props: ParamsProps<T>) => P
): Route<T, P, K>;

/**
 * Create a type-safe route for the router
 * @param path - Path string
 * @param component - Component to render taking in the params if any
 * @param parser - Parser for the params
 * @returns Route object
 */
export function route(
  path: string,
  component: (props: any) => HTMLElement,
  parser?: (props: any) => any
): Route<string, any, HTMLElement> {
  if (parser) return { path, component: (props) => component(parser(props)) };
  return {
    path,
    component,
  };
}
