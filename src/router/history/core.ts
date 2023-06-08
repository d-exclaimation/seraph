//
//  core.ts
//  seraph
//
//  Created by d-exclaimation on 08 Jun 2023
//

import { from, state, type State } from "../../state";

/**
 * Location object
 * @property url - Current URL
 * @property previous - Previous URLs
 */
export type Location = {
  url: URL;
  previous: URL[];
};

/**
 * History state object
 * @property current - Current location state
 * @property subscribe - Subscribe to changes in location state
 * @property navigate - Navigate to a new URL
 * @property back - Go back to previous URL
 * @property reload - Reload the current URL
 */
export type History = State<Location> & {
  readonly navigate: (url: string, replace?: boolean) => void;
  readonly back: () => void;
  readonly reload: () => void;
};

/**
 * Create a new history state object
 * @returns a history state object
 */
export function history(): History {
  const $urls = state<URL[]>([new URL(window.location.href)]);
  const $history = from($urls, (urls) => ({
    url: urls[urls.length - 1],
    previous: urls.slice(0, -1),
  }));

  return {
    __kind: "state",
    get current() {
      return $history.current;
    },
    subscribe: $history.subscribe.bind($history),
    navigate: (url, replace) => {
      const newUrl = new URL(url, window.location.origin);
      const state = {
        url: newUrl.href,
        title: url,
      };
      if (replace) {
        window.history.replaceState(state, url, newUrl.href);
        $urls.current.pop();
      } else {
        window.history.pushState(state, url, newUrl.href);
      }
      $urls.current.push(newUrl);
      $urls.current = $urls.current;
    },
    back: () => {
      window.history.back();
      $urls.current.pop();
      $urls.current = $urls.current;
    },
    reload: () => {
      $urls.current = $urls.current;
    },
  };
}
