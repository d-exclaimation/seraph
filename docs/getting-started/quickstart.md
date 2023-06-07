# Quick Start

For this quick start, we'll be making a single page application and creating a brand new project.

<div class="info custom-block" style="padding-top: 8px">

Already have a project? You can [add Seraph to your project](/getting-started/existing-project.md)

</div>

:::tip Vite
We recommend using [Vite](https://vitejs.dev/) for creating a new project. It's a fast and lightweight development server that supports hot module replacement and is built on top of [Rollup](https://rollupjs.org/guide/en/).
:::

## Scaffold a new project

Create a new project using Vite's CLI and add Seraph to your project using npm:

```sh
npx create vite@latest my-app --template vanilla-ts
cd my-app
npm install @d-exclaimation/seraph
```

## Create a new component

Let's start simple, create a new component called `HelloWorld`:

```ts
import { html, component } from "@d-exclaimation/seraph";

const App = component(() => {
  return html.h1({
    c: "Hello World!"
  });
});

App.render({}, document.getElementById("app")!);
```
This will render a simple `Hello World!` h1 element to under the `app` element in your HTML.

## Add some iteractivity

Let's spice things up a bit by adding some interactivity to our component. We'll add a button that will change the text of the h1 element when clicked.


```ts{6-20}
import { html, component, state, from } from "@d-exclaimation/seraph"; // [!code ++]

const App = component(() => {
  const $count = state(0); // [!code ++]

  return html.div({
    c: [
      html.h1({
        c: from($count, (count) => `Counting ${count}x`) // [!code ++]
      }),
      html.button({
        c: "Click me!",
        on: {
          click: () => ($count.current ++) // [!code ++]
        }
      }),
    ]
  });
});

App.render({}, document.getElementById("app")!);
```

Seraph state is a reactive variable that can be used to store data and emit update the data changes. 

::: tip State and Components
Seraph's state is not bounded the component scope. Components instead have to explicitly subscribe to the state changes by setting one of the component's property to the state.

This allows us to create state that can be shared across multiple components, and smartly bind only the components that need to be updated when the state changes.
:::

To change the state, we only need to reassign the state's `current` property. In this example, we're using the `click` event of the button to increment the state.

## How about if I want to run some code when the state changes?

We can use the `effect` function to run some code whenever the state changes. Let's add a `console.log` whenever the state changes:

```ts
import { html, component, state, from, effect } from "@d-exclaimation/seraph"; // [!code ++]

const App = component(() => {
  const $count = state(0); 

  effect($count, count => console.log(count)); // [!code ++]

  return html.div({
    c: [
      html.h1({
        c: from($count, (count) => `Counting ${count}x`) 
      }),
      html.button({
        c: "Click me!",
        on: {
          click: () => ($count.current ++) 
        }
      }),
    ]
  });
});

App.render({}, document.getElementById("app")!);
```

<div class="tip custom-block" style="padding-top: 8px">

🎉🎉 Congratulations! You've just created your first Seraph app!

</div>
