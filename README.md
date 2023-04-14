<br/>
<p align="center">
  <img height="150" src="./docs/public/seraph.png"/>
</p>

<h1 align="center">
  <span>Seraph</span>
</h1>

Hassle-free web apps, in an instant. 

- No build steps, no dependencies, no configuration necessary
- Built on top of web standards, can be used with plain HTML, CSS, and JS
- Focussed on minimal abstraction and runtime overhead
- Supports full interactivity with capabilities selective hydration
- Uses familiar syntax and conventions, with a focus on developer experience
- Small bundle size, less than 5kb gzipped

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

- [Docs](https://seraph.dexclaimation.com)

## Feedback
If you have any feedback, feel free open an issue.