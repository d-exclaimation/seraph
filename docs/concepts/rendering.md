# Rendering

Seraph comes with some built-in utilities for rendering components to the DOM. 

[[toc]]

## Component pre-built functions

By default, all components (declared with `component`) have a `mount` and `render` function that can be used to render the component to the DOM.

```ts
import { html, component } from "@d-exclaimation/seraph";

const App = component(() => {
  return html.h1({
    c: "Hello World!"
  });
});

App.mount(document.getElementById("app")!);
App.render(document.getElementById("app")!);
```

## Simple rendering

### `mount`

You can do a simple mounting where a component will just be appended to the target element.

```ts
import { html, mount } from "@d-exclaimation/seraph";

const App = html.h1({
  c: "Hello World!"
});

mount(App, document.getElementById("app")!);
```

This can be useful if you are integrating Seraph into an existing application and does not want to replace the entire element.

### `render`

You can also do a full rendering where the target element inner content will be replaced with the component.

```ts
import { html, render } from "@d-exclaimation/seraph";

const App = html.h1({
  c: "Hello World!"
});

render(App, document.getElementById("app")!);
```

## Rendering with loaded data

Seraph also comes with a utility to fetch data from a DOM element. This is useful to be used with a server-side rendered application where the server might load some data and pass it to the client.

### `props`

To load properties from a DOM element's `sr-props`, you need to explicitly call the `props` function.

This is useful if you want to load some initial properties data from the server and use it to hydrate the component.

```html
<div id="counter" sr-props='{ "count": 10 }'> // [!code ++]
  <h1>Count: 10</h1>
  <button>+1</button>
</div>
```

```ts
import { props, html, hydrate, s, derive } from "@d-exclaimation/seraph";

const $props = props<{ count: number }>("counter"); // [!code ++]

const $count = derive($props, {
  get: ({ count }) => count,
  set: (count, props) => ({ ...props, count })
});

hydrate("counter", {
  c: [
    html.h1({
      c: s`Count: ${$count}`
    }),
    html.button({
      c: "+1",
      on: {
        click: () => $count.current++
      }
    })
  ]
});
```

### `resource`

Loaded data may instead be stored a json script element. In this case, you can use the `resource` function to load the data.

This may be useful if you are using a server-side rendering framework that does not support custom attributes, when the data is too large to be stored in a custom attribute, or when you want to use the data in multiple components.

```html
<script id="server-data" type="application/json"> // [!code ++]
  {                                               // [!code ++]
    "count": 10,                                  // [!code ++]
    "item": ["apple", "apples"]                   // [!code ++]
  }                                               // [!code ++]
</script>                                         // [!code ++]

<div id="message">
  <span>Purchasing 10 apples</span>
</div>

<div id="counter">
  <h1>Count: 10</h1>
  <button>+1</button>
</div>
```

```ts
import { resource, html, hydrate, derive, from, s } from "@d-exclaimation/seraph";

type Data = {
  count: number;
  item: [string, string];
};

const $data = resource<Data>("server-data"); // [!code ++]

const [item, items] = $data.current.item;
const $count = derive($data, {
  get: ({ count }) => count,
  set: (count, data) => ({ ...data, count })
});
const $item = from($count, (count) => count <= 0 ? item : items);

hydrate("message", {
  c: s`Purchasing ${$count} ${$item}`
});


hydrate("counter", {
  c: [
    html.h1({
      c: s`Count: ${$count}`
    }),
    html.button({
      c: "+1",
      on: {
        click: () => $count.current++
      }
    })
  ]
});
```

### Selective hydration / Island based client hydration

Seraph's rendering is not limited to the root element. You can also just hydrate a specific element and its children.

In many scenarios involving some server-side rendering, you might want to grab server loaded data and hydrate only the parts of the page that needs to be interactive.  This is called selective hydration or island based client hydration.

You can combine `props` / `resouce` and `hydrate` to perform selective hydration given an some initial server loaded data.

```html
<body>
  <script id="__server_data" type="application/json">
    {
      "id": 1,
      "name": "Some product name",
      "description": "Some product description",
      "images": [
        { "id": 1, "url": "https://example.com/image1.png" },
        { "id": 2, "url": "https://example.com/image2.png" },
        { "id": 3, "url": "https://example.com/image3.png" }
      ],
      "tags": [
        { "id": 1, "name": "tag1" },
      ]
    }
  </script>
  <section id="header">
    <h1>Some product name</h1>
  </section>

  <section id="image-carousel" class="carousel">
    <img src="https://example.com/image1.png" />
    <div class="carousel-actions">
      <button class="carousel-action-prev">Prev</button>
      <button class="carousel-action-next">Next</button>
    </div>
  </section>

  <section id="product-description">
    <p>Some product description</p>
  </section>

  <section id="product-tags">
    <div class="tags">
      <span>tag1</span>
    </div>
  </section>
</body>
```

```ts
import { resource, state, from, zip, hydrate, html, reducer } from "@d-exclaimation/seraph";

type Product = {
  id: number;
  name: string;
  description: string;
  images: { id: number; url: string }[];
  tags: { id: number; name: string }[];
};

const $product = resource<Product>('__server_data');
const $index = reducer(
  (state: number, action: "inc" | "dec") => {
    if (action === "inc") {
      return Math.min($product.images.length, state + 1);
    }
    return Math.max(0, state - 1);
  },
  0
);
const $image = from(zip($product, $index), ([{ images }, i]) => images[i]);
const $src = from($image, (image) => image.url);

hydrate("image-carousel", {
  class: "carousel",
  c: [
    html.img({
      attr: { src: $src }
    }),
    html.div({
      class: "carousel-actions",
      c: [
        html.button({
          class: "carousel-action-prev",
          c: "Prev",
          on: { click: () => $index.dispatch("dec") },
        }),
        html.button({
          class: "carousel-action-next",
          c: "Next",
          on: { click: () => $index.dispatch("inc") },
        }),
      ],
    }),
  ],
});
```
In this example, we are using `hydrate` to hydrate the `image-carousel` element.  We are also using `resource` to load the server data and `state` to keep track of the current image index. By doing this, we are able to make the image carousel interactive without having to re-render the entire page.