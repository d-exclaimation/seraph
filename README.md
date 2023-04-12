<br/>
<p align="center">
  <img height="125" src="./seraph-banner.png"/>
</p>
<br/>

<h1 align="center">Hassle-free web apps, in an instant</h1>

Seraph offers the fastest and simplest way to build web apps - regardless of the complexity of your website. Seraph is hassle-free because it can be used with or without any build tools, integrates with any server-side rendering framework, and allows fully interactive sites using partial hydration.

All features of Seraph are built with simplicity in mind and built on top of the web platform, so it does not completely abstract away the web platform, and you can incrementally adopt Seraph into your existing projects.

## Getting started

### Install

```sh
npm create @d-exclaimation/seraph
# or
pnpm create @d-exclaimation/seraph
# or
yarn create @d-exclaimation/seraph
```

### Use a CDN

```html
<script type="module">
  import { sr } from "https://cdn.skypack.dev/@d-exclaimation/seraph";

  const App = sr.div({
    c: "Hello World!",
  });

  sr.mount(App, document.getElementById("app"));
</script>
```

## Resources

- [Docs](https://qwik.builder.io/)

## Concepts

### States

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