export type State<T> = {
  /**
   * The current state.
   */
  current: T;

  /**
   * Subscribes to state changes.
   * @param listener The listener to call when the state changes.
   * @returns A function to unsubscribe.
   */
  readonly subscribe: (listener: (curr: T) => void) => () => void;
};

/**
 * Combine a record of state objects of 1 big state object.
 * @param K The state object.
 * @returns The inner type.
 */
export type All<K extends Record<string, State<unknown>>> = {
  [P in keyof K]: K[P] extends State<infer T> ? T : never;
};

/**
 * Zips a tuple of state objects into a state object.
 * @param T The tuple of state objects.
 * @returns The state object.
 */
export type Zipped<T extends unknown[]> = T extends [State<infer A>, ...infer B]
  ? [A, ...Zipped<B>]
  : [];

/**
 * Extracts the inner type of a state object.
 * @param T The state object.
 * @returns The inner type.
 */
export type Inner<T extends State<unknown>> = T extends State<infer U>
  ? U
  : never;
