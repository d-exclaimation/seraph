# Components

Seraph components are the building blocks of your application. They are used to describe the UI of your application, and are the primary way to interact with the DOM.

[[toc]]

## Understanding Components

In Seraph, components are simply functions that return an actual DOM element. They are no different from plain HTML elements, except that they are written declaratively and can integrated with Seraph's state.

```ts
import { html, component } from "@d-exclaimation/seraph";

const App = component(() => {
  return html.h1({
    c: "Hello World!"
  });
});

const myH1 = App.view(); // HTMLHeadingElement

```

This meant that you opt out of Seraph's style of writing components, you can still use plain HTML elements in your application.

```ts
import { html } from "@d-exclaimation/seraph";

const myH1 = html.h1({
  c: "Hello World!"
});

myH1.textContent = "Hello Seraph!";

document.body.appendChild(myH1);
```

or vice versa

```ts
import { html, component } from "@d-exclaimation/seraph";

const subtitleElement = document.getElementById("subtitle")!;

const App = component(() => {
  return html.div({
    c: [
      html.h1({
        c: "Hello World!"
      }),
      subtitleElement
    ]
  });
});
```

### `component`

The `component` function is a helper function to create a Seraph component in a structured way. It is optional, and you can create components using plain functions or just as plain variables.

```ts
import { html, component } from "@d-exclaimation/seraph";

const App = component(() => {
  return html.h1({
    c: "Hello World!"
  });
});
```

Components declared this way can be inserted into other components using `view` function.

```ts
import { html, component } from "@d-exclaimation/seraph";

const Header = component(() => {
  return html.h1({
    c: "Hello World!"
  });
});

const App = component(() => {
  return html.div({
    c: [
      Header.view(),
      html.p({
        c: "This is a paragraph"
      })
    ]
  });
});
```

## Built-in Components

The `html` object have feature parity with all the built-in HTML elements. All you need to do is to prefix the element name with `html.`.

```ts 
import { html } from "@d-exclaimation/seraph";

html.h1({ c: "Hello World!" }); // HTMLHeadingElement
html.div({ c: "Hello World!" }); // HTMLDivElement
html.p({ c: "Hello World!" }); // HTMLParagraphElement
html.span({ c: "Hello World!" }); // HTMLSpanElement
html.a({ c: "Hello World!" }); // HTMLAnchorElement
html.img({ c: "Hello World!" }); // HTMLImageElement
html.input({}); // HTMLInputElement
html.button({ c: "Hello World!" }); // HTMLButtonElement

// and so on...
```

### Using existing DOM elements as components

You can also use existing DOM elements as components using `hydrate`. This is useful if you are integrating Seraph into an existing application and does not want to replace the entire element.

```html
<div id="tag">
  Hello world!
</div>
```

```ts
import { state, hydrate, use } from "@d-exclaimation/seraph";

const $state = state("Hello world!");

hydrate("tag", {
  c: state
});

setTimeout(() => {
  $state.current = "Hello Seraph!";
}, 1000);
```

## Component default props

Built-in components in Seraph can be configured using the default properties.


### `classes`

The `classes` prop is used to add CSS classes to the component. It can be a string or an array of strings.

```ts
import { html } from "@d-exclaimation/seraph";

html.h1({
  classes: ["text-2xl", "font-bold"] // [!code ++]
});
```

Result in

```html
<h1 class="text-2xl font-bold">Hello World!</h1>
```

### `style`

The `style` prop is used to add inline CSS styles to the component. 

```ts
import { html } from "@d-exclaimation/seraph";

html.h1({
  style: {
    color: "red", // [!code ++]
    fontSize: "2rem" // [!code ++]
  }
});
```

Result in

```html
<h1 style="color: red; font-size: 2rem;">Hello World!</h1>
```

### `c`

The `c` prop is used to add children to the component. It can be a string and HTMLElements or an array of strings and HTMLElements.

```ts
import { html } from "@d-exclaimation/seraph";

html.div({
  c: [
    html.h1({ // [!code ++]
      c: "Hello World!" // [!code ++]
    }), // [!code ++]
    html.p({ // [!code ++]
      c: "This is a paragraph" // [!code ++]
    }) // [!code ++]
  ]
});
```

Result in

```html
<div>
  <h1>Hello World!</h1>
  <p>This is a paragraph</p>
</div>
```

### `on`

The `on` prop is used to add event listeners to the component. All events are using the same callback type as `addEventListener`.

```ts
import { html } from "@d-exclaimation/seraph";

html.div({
  on: {
    click: (ev) => { // [!code ++]
      console.log("Clicked!"); // [!code ++]
    } // [!code ++]
  }
});
```

### `attr`

The `attr` prop is used to add any other attributes to the component. 

```ts
import { html } from "@d-exclaimation/seraph";

html.div({
  attr: {
    id: "my-div" // [!code ++]
  }
});
```

Result in

```html
<div id="my-div"></div>
```

## Binding state to components

Any state can be bound to components' properties. This means that whenever the state changes, that property will be updated.


```ts
import { html, state, component } from "@d-exclaimation/seraph";

const App = component(() => {
  const $count = state(0);

  return html.div({
    c: [
      html.h1({
        c: from($count, (count) => `Count: ${count}`); // [!code ++]
      }),
      html.button({
        c: "Click me!",
        on: {
          click: () => {
            $count.value++;
          }
        }
      }),
    ]
  });
});
```

Individual properties may takes different types of states or may even take multiple states. Take advantage of `from`, `memo`, and `derive` to create a state that matches the required types.

::: details State binding performs surgical updates 

Only the properties that are bound to a state will be updated. This means that if you have a component with 100 properties, but only 1 property is bound to a state, only that 1 property will be updated, this also meant any other components that are not bound to a state will not be re-rendered, improving performance.

```ts
import { html, state, component } from "@d-exclaimation/seraph";

const App = component(() => {
  const $count = state(0);

  return html.div({
    c: [

      // Only component that needs to be updated
      html.h1({
        // This will not be updated
        classes: "text-2xl",

        // and only the child prop will be updated
        c: from($count, (count) => `Count: ${count}`); // [!code ++]
      }),

      // This component will not be updated
      html.div({
        c: [
          html.button({
            c: "Decrement",
            on: { click: () => ($count.value--) }
          }),
          html.button({
            c: "Increment",
            on: { click: () => ($count.value++) }
          }), 
        ]
      })
      html.button({
        c: "Reset",
        on: { click: () => ($count.value = 0) }
      }),
    ]
  });
});
```

In the above example, only the `h1` component will be updated when the count changes (only it's `child` property). The other properties and other components will not be updated including the parent `div` component.

:::