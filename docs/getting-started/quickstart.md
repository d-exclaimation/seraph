# Quick Start

For this quick start, we'll be making a single page application and creating a brand new project.

## Creating a new project

:::tip Vite
We recommend using [Vite](https://vitejs.dev/) for creating a new project. It's a fast and lightweight development server that supports hot module replacement and is built on top of [Rollup](https://rollupjs.org/guide/en/).
:::

### Scaffold a new project

Create a new project using Vite's CLI and add Seraph to your project using npm:

```sh
npx create vite@latest my-app --template vanilla-ts
cd my-app
npm install @d-exclaimation/seraph
```

### Create a new component

Let's start simple, create a new component called `HelloWorld`:

```ts
import { sr } from '@d-exclaimation/seraph'

const App = () => {
  return sr.h1({
    c: "Hello World!"
  });
}

sr.render(App(), document.getElementById("app"));
```
This will render a simple `Hello World!` h1 element to under the `app` element in your HTML.

### Add some iteractivity

Let's spice things up a bit by adding some interactivity to our component. We'll add a button that will change the text of the h1 element when clicked.


```ts{6-20}
import { sr } from '@d-exclaimation/seraph'

const App = () => {
  const $count = sr.state(0); // [!code ++]

  return sr.div({
    c: [
      sr.h1(
        sr.use($count, count => ({ // [!code ++]
          c: `Hello World! ${count}` // [!code ++]
        })) // [!code ++]
      ),
      sr.button({
        c: "Click me!",
        on: {
          click: () => ($count.current ++) // [!code ++]
        }
      }),
    ]
  });
};

sr.render(App(), document.getElementById("app"));
```

Seraph state is a reactive variable that can be used to store data and emit update the data changes. 

::: tip State and Components
Seraph's state is not bounded the component scope. Components instead have to explicitly subscribe to the state changes using the `use` function.

This allows us to create state that can be shared across multiple components, and smartly bind only the components that need to be updated when the state changes.
:::

To change the state, we only need to reassign the state's `current` property. In this example, we're using the `click` event of the button to increment the state.

### How about if I want to run some code when the state changes?

We can use the `effect` function to run some code whenever the state changes. Let's add a `console.log` whenever the state changes:

```ts
import { sr } from '@d-exclaimation/seraph'

const App = () => {
  const $count = sr.state(0);

  sr.effect($count, count => console.log(count)); // [!code ++]

  return sr.div({
    c: [
      sr.h1(
        sr.use($count, count => ({
          c: `Hello World! ${count}`
        }))
      ),
      sr.button({
        c: "Click me!",
        on: {
          click: () => ($count.current ++)
        }
      }),
    ]
  });
};

sr.render(App(), document.getElementById("app"));
```

<div class="tip custom-block" style="padding-top: 8px">

🎉🎉 Congratulations! You've just created your first Seraph app!

</div>