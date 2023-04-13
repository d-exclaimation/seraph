# Rendering

Seraph comes with some built-in utilities for rendering components to the DOM. These utilities are available in the `sr` namespace.

[[toc]]

## Simple rendering

### `sr.mount`

You can do a simple mounting where a component will just be appended to the target element.

```ts
import { sr } from '@d-exclaimation/seraph'

const App = () => {
  return sr.h1({
    c: "Hello World!"
  });
};

sr.mount(App(), document.getElementById("app")!);
```

This can be useful if you are integrating Seraph into an existing application and does not want to replace the entire element.

### `sr.render`

You can also do a full rendering where the target element inner content will be replaced with the component.

```ts
import { sr } from '@d-exclaimation/seraph'

const App = () => {
  return sr.h1({
    c: "Hello World!"
  });
};

sr.render(App(), document.getElementById("app")!);
```

## Hydration

Seraph also comes with a hydration utility that will allow you hydrate a rendered HTML DOM elements given some initial props and replace it with interactive components using the same props.

### `sr.hydrate`

To perform hydration, you need to explicitly the `sr.hydrate` function.

```html
<div id="app" sr-props='{ "count": 10 }'>
  <button>Count: 10</button>
</div>
```

```ts
import { sr } from '@d-exclaimation/seraph'

// Using props from the HTML element's `sr-props` attribute
const App = (props: { count: number }) => { 
  const $count = sr.state(props.count);    
  return sr.button(                         
    sr.use($count, (count) => ({ 
      c: `Count: ${count}`, 
      on: { 
        click: () => $count.set(count + 1),
      },
    })) 
  );                                        
};                                          

sr.hydrate({
  into: document.getElementById("app")!     
  with: App,                                // [!code ++]
});
```

Given the above example, the button will be replaced with an interactive component that will increment the count when clicked.

### Selective hydration / Island based client hydration

Seraph's hydration is not limited to the root element. You can also hydrate a specific element and its children.

This is useful if you want to do island based client hydration where you can hydrate only the parts of the page that needs to be interactive.

Using the same example above, you can hydrate only the button element.

::: tip Using `sr.hydrate` with `sr.cont`

You can also use `sr.cont` to hydrate an existing DOM element without having to replace it.

:::

```html
...
<body>
  <section>
    <h1>Some heading</h1>
  </section>
  <section>
    <h2>This is a counter</h2>
    <div id="counter-island" sr-props='{ "count": 10 }'>
      <button id="count-button">Count: 10</button>
    </div>
    <p>Press the button to increment the count</p>
  </section>
  <section>
    <div>
      <p>Some paragraph</p>
    </div>
  </section>
</body>
...
```
---

```ts
import { sr, type State } from '@d-exclaimation/seraph'

const Counter = (props: { count: number }) => { 
  const $count = sr.state(props.count);
  
  // Re-use the existing button element with id `count-button`
  return sr.cont(
    "count-button",                         
    sr.use($count, (count) => ({          
      c: `Count: ${count}`,               
      on: {                                
        click: () => $count.set(count + 1),
      },                                  
    }))                                  
  );                                        
}; 

// Only hydrate the element with id `counter-island`, everything can remain static 
sr.hydrate({
  into: document.getElementById("counter-island")!,
  with: Counter,                              
});
```
