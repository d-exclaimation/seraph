<br/>
<p align="center">
  <img height="150" src="./docs/public/seraph.png"/>
</p>

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

- [Docs](https://seraph.dexclaimation.com)

## Feedback
If you have any feedback, feel free open an issue.