# Rendering

Seraph comes with some built-in utilities for rendering components to the DOM. 

[[toc]]

## Simple rendering

### `mount`

You can do a simple mounting where a component will just be appended to the target element.

```ts
import { html, mount } from "@d-exclaimation/seraph";

const App = () => {
  return html.h1({
    c: "Hello World!"
  });
};

mount(App(), document.getElementById("app")!);
```

This can be useful if you are integrating Seraph into an existing application and does not want to replace the entire element.

### `render`

You can also do a full rendering where the target element inner content will be replaced with the component.

```ts
import { html, render } from "@d-exclaimation/seraph";

const App = () => {
  return html.h1({
    c: "Hello World!"
  });
};

render(App(), document.getElementById("app")!);
```

## Rendering with loaded data

Seraph also comes with a utility to fetch data from a DOM element. This is useful to be used with a server-side rendered application where the server might load some data and pass it to the client.

### `load`

To load data from a DOM element's `sr-props`, you need to explicitly call the `load` function.

```html
<div id="count-data" sr-props='{ "count": 10 }'></div>
```

```ts
import { load, html, use } from "@d-exclaimation/seraph";

const $props = load<{ count: number }>('count-data');

const App = () => {
  return html.h1(
    use($props, ({ count }) => ({ c: `Count: ${count}`}))
  );
};
```

### `resource`

Loaded data may instead be stored a json script element. In this case, you can use the `resource` function to load the data.

```html
<script id="count-data" type="application/json">
  { "count": 10 }
</script>
```

```ts
import { resource } from "@d-exclaimation/seraph";

const $props = resource<{ count: number }>('count-data');
```

### Selective hydration / Island based client hydration

Seraph's rendering is not limited to the root element. You can also just hydrate a specific element and its children.

In many scenarios involving some server-side rendering, you might want to grab server loaded data and hydrate only the parts of the page that needs to be interactive.  This is called selective hydration or island based client hydration.

You can combine `load` / `resouce` and `hydrate` to perform selective hydration given an some initial server loaded data.

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
import { resource, state, from, zip, hydrate, html, use } from "@d-exclaimation/seraph";

type Product = {
  id: number;
  name: string;
  description: string;
  images: { id: number; url: string }[];
  tags: { id: number; name: string }[];
};

const $product = resource<Product>('__server_data');
const $index = state(0);
const $image = from(zip($product, $index), ({ images }, i) => images[i]);

hydrate("image-carousel", {
  class: "carousel",
  c: [
    html.img(
      use($image, (image) => ({
        src: image.url,
      }))
    }),
    html.div({
      class: "carousel-actions",
      c: [
        html.button({
          class: "carousel-action-prev",
          c: "Prev",
          on: { click: () => ($index.current = Math.max($index.current - 1, 0)) },
        }),
        html.button({
          class: "carousel-action-next",
          c: "Next",
          on: { click: () => ($index.current = Math.min($index.current + 1, $product.current.images.length - 1)) },
        }),
      ],
    }),
  ],
});
```
In this example, we are using `hydrate` to hydrate the `image-carousel` element.  We are also using `resource` to load the server data and `state` to keep track of the current image index. By doing this, we are able to make the image carousel interactive without having to re-render the entire page.