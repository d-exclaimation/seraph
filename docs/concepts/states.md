# States

States are one of the primary building blocks of a Seraph application. States represent data that may change over time, and be used to update the UI.

[[toc]]

## Understanding States

In Seraph, states are simply an observable variable that can be used to store data and emit update the data changes. They are not bounded to any component scope, and can even be used across multiple components.

The type definition of a state is:

```ts
type State<T> = {
  /**
   * This is an internal property that is used to identify a state.
   */
  __kind: "state";

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
```

State objects have 2 properties and they are:

- **`current`** - This is the current value of the state. You can use this to get the current value of the state, or to update the state by reassigning it.

```ts
// - Get the current state
console.log($user.current); // { name: "John Doe", age: 20 }

// - Update the state
$user.current = { name: "Jane Doe", age: 21 };
console.log($user.current); // { name: "Jane Doe", age: 21 }

```

- **`subscribe`** - This is a function that can be used to subscribe to state changes. It takes a callback function that will be called whenever the state changes.

```ts
// - Subscribe to state changes
$user.subscribe((state) => {
  console.log(state); // { name: "Jane Doe", age: 21 }
});
```

## State primitives

### `state`

This is the basic state function that can be used to create a state. It takes an initial value and return a state object.

```ts
import { state } from "@d-exclaimation/seraph";

const $count = state(0);

```

### `effect`

This is a function that can be used to run some code whenever the state changes. It takes a state and a callback function that will be called whenever the state changes.

```ts
import { state, effect } from "@d-exclaimation/seraph";

const $count = state(0);

effect($count, count => console.log(count)); // 0

$count.current = 1; // 1

$count.current = 2; // 2
```

::: details What's the difference between `subscribe` and `effect`?
None :grin:.
:::

### `from`

This is a function that can be used to create a computed state from another. It takes a callback function that will be called whenever the state changes to compute the new value.

```ts
import { state, from } from "@d-exclaimation/seraph";

const $count = state(0);

const $double = from($count, (count) => count * 2);

console.log($double.current); // 0

$count.current = 1;

console.log($double.current); // 2
```

### `zip`

This is a function that can be used to create a readonly zipped state from multiple states. Useful for creating a readonly state that depends on multiple states.

```ts
import { state, zip } from "@d-exclaimation/seraph";

const $count = state(0);
const $name = state("John Doe");

const $user = zip($count, $name);

console.log($user.current); // [0, "John Doe"]

$count.current = 1;

console.log($user.current); // [1, "John Doe"]

$name.current = "Jane Doe";

console.log($user.current); // [1, "Jane Doe"]
```

### `all`

This is a function that can be used to create a readonly combined object state from multiple states. Similar to `zip`, but instead of an array, it will return an object with the same keys as the states.

```ts
import { state, all } from "@d-exclaimation/seraph";

const $count = state(0);
const $name = state("John Doe");

const $user = all({ count: $count, name: $name });

console.log($user.current); // { count: 0, name: "John Doe" }

$count.current = 1;

console.log($user.current); // { count: 1, name: "John Doe" }

$name.current = "Jane Doe";

console.log($user.current); // { count: 1, name: "Jane Doe" }
```

### `reducer`

This is a function that can be used to create a reducer state. It takes a reducer function and an initial value.

```ts
import { reducer } from "@d-exclaimation/seraph";

const $count = reducer((state, action) => {
  switch (action.type) {
    case "increment":
      return state + 1;
    case "decrement":
      return state - 1;
    default:
      return state;
  }
}, 0);

console.log($count.current); // 0

$count.dispatch({ type: "increment" });

console.log($count.current); // 1

$count.dispatch({ type: "decrement" });

console.log($count.current); // 0
```

### `derive`

Similar to `from`, but instead of a readonly state, it will return a mutable state.

```ts
import { state, derive } from "@d-exclaimation/seraph";

const $user = state({
  name: "John Doe",
  age: 20,
});

const $name = derive($user, {
  get: (user) => user.name,
  set: (name, user) => ({ ...user, name }),
});

console.log($name.current); // "John Doe"

$name.current = "Jane Doe";

console.log($name.current); // "Jane Doe"
console.log($user.current); // { name: "Jane Doe", age: 20 }
```

### `query`

This is a function that can be used to create a readonly state from a data fetched logic. This is highly insipired by [@tanstack/query](https://tanstack.com/query/).

```ts
import { query } from "@d-exclaimation/seraph";

const $query = query({
  queryFn: async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    return res.json();
  },
  enabled: true,
  retry: 3,
  on: {
    success: (data) => console.log(data),
    error: (error) => console.error(error),
    resolved: (data, error) => console.log(data, error)
  }
});
```

### `transition`

This is a function that can be used to determine the progress of an action.

```ts
import { transition, query, effect } from "@d-exclaimation/seraph";

const $mutation = transition();

const $data = query({ ... });

console.log($mutation.current); // false

$mutation.start(async () => {
  const res = await fetch("..."):

  if (!res.ok) {
    return;
  }

  $data.invalidate();
});

console.log($mutation.current); // true

// - After the fetch resolves

console.log($mutation.current); // false

```

### `mutable`

This is a function that can be used to create a mutable object state. It takes an initial value and return a mutable state object.

```ts
import { mutable } from "@d-exclaimation/seraph";

const $count = mutable({ count: 0 });

console.log($count.current); // { count: 0 }

$count.current.count = 1;

console.log($count.current); // { count: 1 }
```


### `memo`

::: danger Beta
This feature is currently still being heavily developed. Validating state changes is using `Object.is` which may not be enough for some cases and API may change in the future.
:::

This is a function that can be used to create a memoized state from another. It takes a callback function that will be called whenever the state changes to compute the new value. The callback function will only be called when the state changes, and the result will be cached.


```ts
import { sr } from "@d-exclaimation/seraph";

const $count = state(0);

const $double = memo($count, (count) => count * 2);

console.log($double.current); // 0

$count.current = 1;

console.log($double.current); // 2 (computed)

$count.current = 1;

console.log($double.current); // 2 (use cached value)
```