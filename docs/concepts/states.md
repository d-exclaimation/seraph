# States

States are one of the primary building blocks of a Seraph application. States represent data that may change over time, and be used to update the UI.

[[toc]]

## Understanding States

In Seraph, states are simply an observable variable that can be used to store data and emit update the data changes. They are not bounded to any component scope, and can even be used across multiple components.

The type definition of a state is:

```ts
type State<T> = {
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

### `sr.state`

This is the basic state function that can be used to create a state. It takes an initial value and return a state object.

```ts
import { sr } from '@d-exclaimation/seraph'

const $count = sr.state(0);

```

### `sr.effect`

This is a function that can be used to run some code whenever the state changes. It takes a state and a callback function that will be called whenever the state changes.

```ts
import { sr } from '@d-exclaimation/seraph'

const $count = sr.state(0);

sr.effect($count, count => console.log(count)); // 0

$count.current = 1; // 1

$count.current = 2; // 2
```

::: details What's the difference between `subscribe` and `effect`?
None :grin:.
:::

### `sr.from`

This is a function that can be used to create a computed state from another. It takes a callback function that will be called whenever the state changes to compute the new value.

```ts
import { sr } from '@d-exclaimation/seraph'

const $count = sr.state(0);

const $double = sr.from($count, (count) => count * 2);

console.log($double.current); // 0

$count.current = 1;

console.log($double.current); // 2
```

### `sr.zip`

This is a function that can be used to create a readonly zipped state from multiple states. Useful for creating a readonly state that depends on multiple states.

```ts
import { sr } from '@d-exclaimation/seraph'

const $count = sr.state(0);
const $name = sr.state("John Doe");

const $user = sr.zip($count, $name);

console.log($user.current); // [0, "John Doe"]

$count.current = 1;

console.log($user.current); // [1, "John Doe"]

$name.current = "Jane Doe";

console.log($user.current); // [1, "Jane Doe"]
```

### `sr.all`

This is a function that can be used to create a readonly combined object state from multiple states. Similar to `sr.zip`, but instead of an array, it will return an object with the same keys as the states.

```ts
import { sr } from '@d-exclaimation/seraph'

const $count = sr.state(0);
const $name = sr.state("John Doe");

const $user = sr.all({ count: $count, name: $name });

console.log($user.current); // { count: 0, name: "John Doe" }

$count.current = 1;

console.log($user.current); // { count: 1, name: "John Doe" }

$name.current = "Jane Doe";

console.log($user.current); // { count: 1, name: "Jane Doe" }
```

### `sr.query`

::: warning Beta
This is a beta feature. The API may change in the future.
:::

This is a function that can be used to create a readonly state from a data fetched logic. This is highly insipired by [@tanstack/query](https://tanstack.com/query/).

```ts
import { sr } from '@d-exclaimation/seraph'

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

### `sr.mutable`

::: danger Experimental
This is an experimental feature. Mutable state uses `Proxy` which may have performance issues.
:::

This is a function that can be used to create a mutable object state. It takes an initial value and return a mutable state object.

```ts
import { sr } from '@d-exclaimation/seraph'

const $count = sr.mutable({ count: 0 });

console.log($count.current); // { count: 0 }

$count.current.count = 1;

console.log($count.current); // { count: 1 }
```


### `sr.memo`

::: danger Experimental
This is an experimental feature. Validating state changes is using `Object.is` which may not be enough for some cases.
:::

This is a function that can be used to create a memoized state from another. It takes a callback function that will be called whenever the state changes to compute the new value. The callback function will only be called when the state changes, and the result will be cached.


```ts
import { sr } from '@d-exclaimation/seraph'

const $count = sr.state(0);

const $double = sr.memo($count, (count) => count * 2);

console.log($double.current); // 0

$count.current = 1;

console.log($double.current); // 2 (computed)

$count.current = 1;

console.log($double.current); // 2 (use cached value)
```