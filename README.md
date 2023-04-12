<div align="center">
    <p align="center">
      <img width="125" src="./seraph-icon.png"/>
    </p>
    <h1><code>seraph</code></h1>
    <h6>A simple, lightweight, and fast web framework for building web applications</h6>

</div>

<br/>

## Getting started

### Install

```bash
npm install @d-exclaimation/seraph
```

### Import through CDN

```html
<script type="module">
  import { sr } from "https://cdn.jsdelivr.net/npm/@d-exclaimation/seraph/+esm";

  // Your code here
</script>
```

## Concepts

### States

<details>

<summary>
  <small>What is a state?</small>
</summary>

> States are the core concept of Seraph. States are the representation of the current state of the application. States are immutable, meaning that they cannot be changed. Instead, a new state is created when a state is updated. This is done to ensure that the application is predictable and easy to debug.

</details>


```ts
import { sr } from "@d-exclaimation/seraph";

const $user = sr.state({
  name: "John Doe",
  age: 20,
});


// - Get the current state
console.log($user.current); // { name: "John Doe", age: 20 }

// - Update the state
$user.current = { name: "Jane Doe", age: 21 };
console.log($user.current); // { name: "Jane Doe", age: 21 }

// - Subscribe to state changes
$user.subscribe((state) => {
  console.log(state); // { name: "Jane Doe", age: 21 }
});
```

#### Other types of states

- **`sr.from`** - Creates a read-only computed state from another state
- **`sr.all`** - Creates a read-only combined state object from other states
- **`sr.zip`** - Creates a read-only zipped state from other states
- **`sr.memo`** - Creates a read-only memoised computed state from another state 
  - _(**Experimental**, uses `Object.is` to validate state changes)_
- **`sr.query`** - Creates a read-only data fetched state _(**Experimental**)_

### UI Components

<details>
<summary>
  <small>What is a UI component?</small>
</summary>

> UI components are the building blocks of Seraph. UI components are the representation of the UI of the application. Seraph UI components are just plain HTML DOM Elements. This means that you can use any HTML DOM Element as a UI component. 

> The only difference is that Seraph UI components can be reactive (using `sr.use`), meaning that they can update their UI when the state changes.

</details>

```ts
import { sr, mount } from "@d-exclaimation/seraph";

const $count = sr.state(0);

const App = sr.div({
  classes: ["container"],
  c: [
    sr.h1(
      sr.use($count, (count) => ({
        c: `Count: ${count}`,
      }))
    ),
    sr.button({
      c: "Increment",
      on: {
        click: () => {
          $count.current++;
        },
      },
    }),
  ],
  ]
})

sr.mount(App, document.getElementById("app"));
```

### Hydration

<details>
<summary>
  <small>What is hydration?</small>
</summary>

> Hydration is the process of making a rendered HTML DOM element(s) into interactive UI components.

> In Seraph, hydration is done by calling the `sr.hydrate` function. This function takes a HTML DOM Element as a target for hydration, and render a hydrated UI component. This will also fetch any inherited rendered data from the server as long that data is stored in the target HTML DOM Element's `data-seraph-ssr` attribute.

</details>

```html
<div id="app" data-seraph-ssr='{ "count": 10 }'>
  <div class="app">
    <h1>Count: 10</h1>
    <button>Increment</button>
  </div>
</div>
```

```ts
import { sr } from "@d-exclaimation/seraph";

const App = (props: { count: number }) => {
  const $count = sr.state(props.count);

  return sr.div({
    classes: ["app"],
    c: [
      sr.h1(
        sr.use($count, (count) => ({
          c: `Count: ${count}`,
        }))
      ),
      sr.button({
        c: "Increment",
        on: {
          click: () => {
            $count.current++;
          },
        },
      }),
    ],
  });
}

sr.hydrate({
  into: document.getElementById("app"), 
  with: App,
});
```

## Feedback
If you have any feedback, feel free open an issue.