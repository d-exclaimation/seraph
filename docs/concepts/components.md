# Components

Seraph components are the building blocks of your application. They are used to describe the UI of your application, and are the primary way to interact with the DOM.

[[toc]]

## Understanding Components

In Seraph, components are simply functions that return an actual DOM element. They are no different from plain HTML elements, except that they are written declaratively and can integrated with Seraph's state.

```ts
import { sr } from '@d-exclaimation/seraph'

const App = () => {
  return sr.h1({
    c: "Hello World!"
  });
};

const myH1 = App(); // HTMLHeadingElement

```

This meant that you opt out of Seraph's style of writing components, you can still use plain HTML elements in your application.

```ts
import { sr } from '@d-exclaimation/seraph'

const App = () => {
  return sr.h1({
    c: "Hello World!"
  });
};

const myH1 = App(); // HTMLHeadingElement

myH1.textContent = "Hello Seraph!";

document.body.appendChild(myH1);
```

or vice versa

```ts
import { sr } from '@d-exclaimation/seraph'

const subtitleElement = document.getElementById("subtitle")!;

const App = () => {
  return sr.div({
    c: [
      sr.h1({
        c: "Hello World!"
      }),
      subtitleElement
    ]
  });
};
```

## Built-in Components

The `sr` object have feature parity with all the built-in HTML elements. All you need to do is to prefix the element name with `sr.`.

```ts 
import { sr } from '@d-exclaimation/seraph'

sr.h1({ c: "Hello World!" }); // HTMLHeadingElement
sr.div({ c: "Hello World!" }); // HTMLDivElement
sr.p({ c: "Hello World!" }); // HTMLParagraphElement
sr.span({ c: "Hello World!" }); // HTMLSpanElement
sr.a({ c: "Hello World!" }); // HTMLAnchorElement
sr.img({ c: "Hello World!" }); // HTMLImageElement
sr.input({}); // HTMLInputElement
sr.button({ c: "Hello World!" }); // HTMLButtonElement

// and so on...
```

### Using existing DOM elements as components

You can also use existing DOM elements as components using `sr.hydrate`. This is useful if you are integrating Seraph into an existing application and does not want to replace the entire element.

```html
<div id="tag">
  Hello world!
</div>
```

```ts
import { sr } from '@d-exclaimation/seraph'

const $state = sr.state("Hello world!");

sr.hydrate("tag", sr.use($state, (state) => ({
  c: state
})));

setTimeout(() => {
  $state.set("Hello Seraph!");
}, 1000);
```

## Component default props

Built-in components in Seraph can be configured using the default `props` argument.

```ts
type DefaultProps = {
  classes?: string | string[];
  style?: Partial<CSSStyleDeclaration>;
  c?: (HTMLElement | string) | (HTMLElement | string)[];
  on?: Partial<Record<keyof HTMLElementEventMap, (e: Event) => void>>;
  attr?: Record<string, any>;
};
```


### `classes`

The `classes` prop is used to add CSS classes to the component. It can be a string or an array of strings.

```ts
import { sr } from '@d-exclaimation/seraph'

const App = () => {
  return sr.h1({
    classes: ["text-2xl", "font-bold"] // [!code ++]
  });
};
```

Result in

```html
<h1 class="text-2xl font-bold">Hello World!</h1>
```

### `style`

The `style` prop is used to add inline CSS styles to the component. 

```ts
import { sr } from '@d-exclaimation/seraph'

const App = () => {
  return sr.h1({
    style: {
      color: "red", // [!code ++]
      fontSize: "2rem" // [!code ++]
    }
  });
};
```

Result in

```html
<h1 style="color: red; font-size: 2rem;">Hello World!</h1>
```

### `c`

The `c` prop is used to add children to the component. It can be a string and HTMLElements or an array of strings and HTMLElements.

```ts
import { sr } from '@d-exclaimation/seraph'

const App = () => {
  return sr.div({
    c: [
      sr.h1({ // [!code ++]
        c: "Hello World!" // [!code ++]
      }), // [!code ++]
      sr.p({ // [!code ++]
        c: "This is a paragraph" // [!code ++]
      }) // [!code ++]
    ]
  });
};
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
import { sr } from '@d-exclaimation/seraph'

const App = () => {
  return sr.div({
    on: {
      click: (ev) => { // [!code ++]
        console.log("Clicked!"); // [!code ++]
      } // [!code ++]
    }
  });
};
```

### `attr`

The `attr` prop is used to add any other attributes to the component. 

```ts
import { sr } from '@d-exclaimation/seraph'

const App = () => {
  return sr.div({
    attr: {
      id: "my-div" // [!code ++]
    }
  });
};
```

Result in

```html
<div id="my-div"></div>
```

## Binding components to state

Components can be bound to state using the `sr.use` function. This will automatically update the component properties when the state changes.

```ts
import { sr } from '@d-exclaimation/seraph'

const App = () => {
  const $count = sr.state(0);

  return sr.div({
    c: [
      sr.h1(
        sr.use($count, (count) => ({ // [!code ++]
          c: `Count: ${count}`; // [!code ++]
        })) // [!code ++]
      ),
      sr.button({
        c: "Click me!",
        on: {
          click: () => {
            $count.value++;
          }
        }
      }),
    ]
  });
}
```

`sr.use` takes in a state and a function that returns the component props. The function will be called whenever the state passed in changes.

::: details Using `sr.use` for surgical updates
This means that you smartly use `sr.use` to only update the component props that are actually changed, and even only passed certain states that you is relevant to the component.

```ts
import { sr } from '@d-exclaimation/seraph'

const App = () => {
  const $count = sr.state(0);

  return sr.div({
    c: [
      // Only component that needs to be updated
      sr.h1( // [!code ++]
        sr.use($count, (count) => ({ // [!code ++]
          c: `Count: ${count}`; // [!code ++]
        })) // [!code ++]
      ), // [!code ++]

      // None of these components need to be updated when the count changes
      sr.div({
        c: [
          sr.button({
            c: "Decrement",
            on: { click: () => ($count.value--) }
          }),
          sr.button({
            c: "Increment",
            on: { click: () => ($count.value++) }
          }), 
        ]
      })
      sr.button({
        c: "Reset",
        on: { click: () => ($count.value = 0) }
      }),
    ]
  })
}
```

In the above example, only the `h1` component will be updated when the count changes. The other components will not be updated including the parent `div` component.

:::