//
//  core.ts
//  seraph
//
//  Created by d-exclaimation on 08 Jun 2023
//

import { from, type State } from "../../state";
import { html } from "../../ui";
import { history, type History } from "../history";
import { match, Path, path } from "./matcher";
import { link, navigate, NavigateProps, type LinkProps } from "./utils";

/**
 * Base router config
 */
export type BaseRouterConfig = {
  path: string;
  component: (props: any) => HTMLElement;
}[];

/**
 * Router provider that returns components to be rendered
 * @property $outlet - Current component to be rendered
 * @property $page - Current page component to be rendered (if matched)
 * @property $params - Current params state
 * @property $selected - Current selected route state
 * @property config - Parsed router config
 */
export type Provider = {
  $outlet: State<HTMLElement>;
  $page: State<HTMLElement | undefined>;
  $params: State<Record<string, string>>;
  config: {
    path: Path;
    component: (props: any) => HTMLElement;
  }[];
};

/**
 * Base SPA-style Router
 * @property $path - Current path state
 * @property link - Router link component using this router
 * @property navigate - Router navigate component using this router
 * @property provider - Router provider component using this router
 */
export type Router = {
  /**
   * Current path state
   */
  $path: State<string>;

  /**
   * Navigate to a new path
   */
  goto: (target: string, replace?: boolean) => void;

  /**
   * Router link component using this router
   */
  link: (props: LinkProps) => HTMLAnchorElement;

  /**
   * Router navigate component using this router
   */
  navigate: (props: NavigateProps) => HTMLSpanElement;

  /**
   * Router provider component using this router
   * @param opts - Router config
   * @returns Router provider component
   */
  provider: <T extends BaseRouterConfig>(opts: T) => Provider;
};

/**
 * A router outlet and other state provider
 * @param param0 The router instance
 * @param opts Router config with all the routes and components
 * @returns A collection of component states that reflects the current router state
 */
export function provider<T extends BaseRouterConfig>(
  { $path }: Pick<Router, "$path">,
  opts: T
): Provider {
  const config = opts.map(({ path: href, ...rest }) => ({
    path: path(href),
    ...rest,
  }));

  const $selected = from($path, (href) => {
    for (const { path, component } of config) {
      const result = match(path, href);
      if (result.matched) {
        return { component, params: result.params };
      }
    }
    return undefined;
  });

  const $params = from($selected, (selected) => {
    if (selected) {
      return selected.params;
    }
    return {};
  });

  const $page = from($selected, (selected) => {
    if (selected) {
      const { component, params } = selected;
      return component(params as {});
    }
    return undefined;
  });

  const notFound = config
    .find((r) => r.path.length === 1 && r.path[0].__kind === "wildcard")
    ?.component({});

  const $outlet = from($page, (selected) => {
    const route = selected ?? notFound;

    return route ? route : html.div({ c: "Not found..." });
  });

  return {
    $outlet,
    $page,
    $params,
    config,
  };
}

/**
 * Browser SPA-style Router
 * @property $history - History state
 * @property $href - Current href state
 * @property $search - Current search params state
 * @property $path - Current path state
 * @property link - Router link component using this router
 * @property navigate - Router navigate component using this router
 * @property provider - Router provider component using this router
 */
export type BrowserRouter = Router & {
  /**
   * History state
   */
  $history: History;
  /**
   * Current href state
   */
  $href: State<string>;
  /**
   * Current search params state
   */
  $search: State<URLSearchParams>;
};

export function browser(): BrowserRouter {
  const $history = history();
  const $href = from($history, (history) => history.url.href);
  const $search = from($history, (history) => history.url.searchParams);
  const $path = from($history, (history) => history.url.pathname);

  return {
    $history,
    $href,
    $search,
    $path,
    goto: (target: string, replace?: boolean) =>
      $history.navigate(target, replace),
    link: (props: LinkProps) => link($history, props),
    navigate: (props: NavigateProps) => navigate($history, props),
    provider: <T extends BaseRouterConfig>(config: T) =>
      provider({ $path }, config),
  };
}

export const routing = {
  browser,
} as const;
