import { state } from "@lib/core";
import { routing } from "@lib/router";

export const $count = state(0);
export const $analytics = state(true);
export const $functional = state(false);
export const $performance = state(false);
export const router = routing.browser();

declare global {
  interface Window {
    __PLAYGROUND__: {
      $count: typeof $count;
      $analytics: typeof $analytics;
      $functional: typeof $functional;
      $performance: typeof $performance;
      router: typeof router;
    };
  }
}

if (window) {
  window.__PLAYGROUND__ = {
    $count,
    $analytics,
    $functional,
    $performance,
    router,
  };
}
