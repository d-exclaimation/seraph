import { AsyncResult, promise, state, zip, type State } from "../state";

interface Cache {
  get(key: string[]): any | undefined;
  set(key: string[], value: any): void;
  delete(key: string[]): void;
}

type SWRConfig = {
  cache: () => Cache;
};

type Query<T> = State<AsyncResult<T>> & {
  /**
   * Invalidate the query, reload the data (non-awaited)
   */
  invalidate: () => void;
};

type Config<T> = {
  /**
   * The initial state of the query.
   */
  initial?: T;

  /**
   * Other state to track
   */
  track?: State<any>;

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

export function swr({ cache }: SWRConfig) {
  const store = cache();

  return {
    query: <Keys extends string[], T>(
      keys: Keys,
      fn: (keys: Keys) => Promise<T>,
      { initial, on, track }: Config<T> = {}
    ): Query<T> => {
      const $timestamp = state(Date.now());
      const $tracking = track ? zip($timestamp, track) : $timestamp;
      const $res = promise({
        fn: async () => {
          try {
            const cached = store.get(keys);
            if (cached !== undefined) {
              on?.success?.(cached);
              on?.settled?.(cached);
              return cached;
            }
            const fresh = await fn(keys);
            store.set(keys, fresh);
            on?.success?.(fresh);
            on?.settled?.(fresh);
            return fresh;
          } catch (e) {
            on?.error?.(e);
            on?.settled?.(undefined, e);
            throw e;
          }
        },
        initial,
        track: $tracking,
      });

      return {
        __kind: "state",
        get current() {
          return $res.current;
        },
        subscribe(listener) {
          return $res.subscribe(listener);
        },
        invalidate() {
          store.delete(keys);
          return ($timestamp.current = Date.now());
        },
      };
    },
  };
}
