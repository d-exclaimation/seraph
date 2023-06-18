# Introduction

::: warning Beta
Seraph is still in beta, so there's still likely some bugs, and the API is still subject to change.
:::

## Overview

Seraph is a UI framework for building web apps designed to be as simple as possible, while still being powerful enough to build complex applications.
In a nutshell, Seraph is a framework for building web apps that are:
- **Simple**: No build steps, no dependencies, no configuration necessary
- **Compatible**: Built on top of web standards, can be used with plain HTML, CSS, and JS
- **Blazing Fast**: Focussed on minimal abstraction and runtime overhead
- **Interactivity**: Supports full interactivity using island based client hydration
- **Familiar**: Uses familiar syntax and conventions, with a focus on developer experience
- **Lightweight**: Small bundle size, less than 5kb gzipped


<div class="tip custom-block" style="padding-top: 8px">

Just want to try it out? Skip to the [Quickstart](/getting-started/quickstart).

</div>

## Install

```sh
npm install @d-exclaimation/seraph
# or
pnpm add @d-exclaimation/seraph
# or
yarn add @d-exclaimation/seraph
```
This will install **Seraph** as an npm dependency (with Typescript declarations). You can also use it without npm through a CDN.

::: details Using [Skypack](https://www.skypack.dev/)
```html
<script type="module">
  import { state } from 'https://cdn.skypack.dev/@d-exclaimation/seraph'

  const $counter = state(0);
</script>
```
:::

::: details Using [JSDelivr](https://www.jsdelivr.com/)
```html
<script type="module">
  import { state } from 'https://cdn.skypack.dev/@d-exclaimation/seraph'

  const $counter = state(0);
</script>
```
:::

::: details Using [JSDelivr's ESM Run](https://www.esm.run/)
```html
<script type="module">
  import { state } from 'https://esm.run/@d-exclaimation/seraph'

  const $counter = state(0);
</script>
```
:::

## Playground

You can try a live demo of Seraph in the [Seraph Playground](https://seraph-playground.netlify.app/).
The playground is a simple example of using Seraph's state management and client side routing.

You can also grab the Seraph's states using the `window.__PLAYGROUND__` variable in the console.

## The Why

Developing a web application require a good amount of interativity, and the most common way to achieve this is by using a front-end framework. However some of the most popular frameworks are not exactly lightweight, and can be quite a hassle to set up especially if used with another server-side frameworks. Most of the time, you'll need to set up a build step, install a bunch of dependencies, and configure a bunch of things especially if you're already using a server-side framework. 

Seraph aims to be a lightweight alternative to these frameworks, while still being powerful enough to build complex applications and easy to integrate regardless of the server-side framework you use.

The initial idea for Seraph was creating minimal abstraction for web standards that would allow greater developer experience and maintain compatibility with plain HTML, CSS, and JS. 