<br/>
<p align="center">
  <img height="150" src="./docs/public/seraph.png"/>
</p>

<h1 align="center">
  <span>Seraph</span>
</h1>

[![Build Status](https://img.shields.io/endpoint.svg?url=https%3A%2F%2Factions-badge.atrox.dev%2Fd-exclaimation%2Fseraph%2Fbadge%3Fref%3Dmain&style=flat-square)](https://actions-badge.atrox.dev/d-exclaimation/seraph/goto?ref=main)


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
npm install @d-exclaimation/seraph
# or
pnpm add @d-exclaimation/seraph
# or
yarn add @d-exclaimation/seraph
```

### Use a CDN

```html
<script type="module">
  import { html, component } from "https://cdn.skypack.dev/@d-exclaimation/seraph";

  const App = component(() => 
    html.div({
      c: "Hello World!",
    })
  );

  App.render({}, document.getElementById("app"));
</script>
```

## Resources

- [Docs](https://seraph.dexclaimation.com)

## Feedback
If you have any feedback, feel free open an issue.
