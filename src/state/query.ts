//
//  query.ts
//  seraph
//
//  Created by d-exclaimation on 12 Apr 2023
//

import { state } from "./core";
import { type State } from "./types";

/**
 * An async result value.
 */
export type AsyncResult<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: unknown }
  | { status: "success"; data: T };

/**
 * A state object that represents a query.
 */
export type QueryState<T> = State<AsyncResult<T>> & {
  /**
   * Refetch the query, reload the data
   */
  refetch: () => Promise<void>;

  /**
   * Invalidate the query, reload the data (non-awaited)
   */
  invalidate: () => void;
};

type QueryArgs<T> = {
  /**
   * The initial state of the query.
   */
  initial?: T;

  /**
   * The function to fetch the data.
   * @returns A promise that resolves to the data.
   */
  queryFn: () => Promise<T>;

  /**
   * Should the query fetch the data immediately.
   */
  enabled?: boolean;

  /**
   * Should the query refetch the data when the query fails.
   */
  retry?: boolean | number;

  /**
   * Callback for each query state change.
   */
  on?: {
    /**
     * Callback when the query succeeds.
     */
    success?: (data: T) => void;

    /**
     * Callback when the query fails.
     * @param error The error.
     */
    error?: (error: unknown) => void;

    /**
     * Callback when the query settled.
     */
    settled?: (data?: T, error?: unknown) => void;
  };
};

/**
 * Creates a state object that from a query.
 * @param initial The initial state of the query.
 * @param queryFn The function to fetch the data.
 * @param enabled Should the query fetch the data immediately
 * @param retry Should the query refetch the data when the query fails.
 * @param on Callback for each query state change.
 * @returns The query state object.
 *
 * @example
 * ```ts
 * const $query = query({
 *   queryFn: () => fetch("https://jsonplaceholder.typicode.com/todos/1").then(res => res.json()),
 *   on: {
 *     success: (data) => console.log(data),
 *     error: (error) => console.error(error),
 *     resolved: (data, error) => console.log(data, error)
 *   }
 * });
 * ```
 */
export function query<T>({
  initial,
  queryFn,
  enabled,
  on,
  retry,
}: QueryArgs<T>): QueryState<T> {
  const result = state<AsyncResult<T>>(
    initial !== undefined
      ? { status: "success", data: initial }
      : { status: "idle" }
  );

  const fetcher = async () => {
    const trial = typeof retry === "number" ? retry : 0;
    for (let i = 0; i <= trial || (typeof retry === "boolean" && retry); i++) {
      try {
        result.current =
          result.current.status === "success"
            ? result.current
            : { status: "loading" };
        const data = await queryFn();
        result.current = { status: "success", data };
        on?.success?.(data);
        on?.settled?.(data);
        return;
      } catch (e: unknown) {
        result.current = { status: "error", error: e };
        on?.error?.(e);
        on?.settled?.(undefined, e);
      }
    }
  };

  setTimeout(() => {
    if (enabled) fetcher();
  }, 0);

  return {
    __kind: "state",
    get current() {
      return result.current;
    },
    subscribe(listener) {
      return result.subscribe(listener);
    },
    refetch() {
      return fetcher();
    },
    invalidate() {
      setTimeout(() => fetcher(), 0);
    },
  };
}

type AsyncArgs<T> = {
  /**
   * The function to produce a promise.
   */
  fn: () => Promise<T>;

  /**
   * The initial data of the resolve promise if any
   */
  initial?: T;

  /**
   * Other state to track
   */
  track?: State<any>;
};

export function promise<T>({
  fn,
  initial,
  track,
}: AsyncArgs<T>): State<AsyncResult<T>> {
  const result = state<AsyncResult<T>>(
    initial === undefined
      ? { status: "idle" }
      : { status: "success", data: initial }
  );
  const refs = {
    last: Date.now(),
    untrack: () => {},
  };

  const evaluate = async () => {
    const timestamp = Date.now();
    result.current = { status: "loading" };
    try {
      const data = await fn();
      if (refs.last > timestamp) {
        return;
      }
      result.current = { status: "success", data };
      refs.last = timestamp;
    } catch (e: unknown) {
      result.current = { status: "error", error: e };
    }
  };

  if (track) {
    refs.untrack = track.subscribe(() => evaluate());
  } else {
    setTimeout(() => evaluate(), 0);
  }

  return {
    __kind: "state",
    get current() {
      return result.current;
    },
    subscribe(listener) {
      const unsub = result.subscribe(listener);
      return () => {
        unsub();
        refs.untrack();
      };
    },
  };
}
