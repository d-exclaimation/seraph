# Add to an existing project

This is a guide to add Seraph to an existing project without any build tooling.

If you are new to Seraph and want to create a new project, [Quick start](/getting-started/quickstart.md) guide might more well-suited for you.

## Existing project

Let's say you have an existing project with this HTML file that you want to add Seraph to.

```html
<!DOCTYPE html>
  <head>
    <title>My App</title>
  </head>
  <body>
    <div class="count">
      <h2 class="count-title">
        Count: <span id="count-number" class="count-number">10</span>
      </h2>
      <div class="count-buttons">
        <button id="btn-dec" class="btn btn-dec">Decrement</button>
        <button id="btn-inc" class="btn btn-inc">Increment</button>
      </div>
    </div>
  </body>

  <script type="module">
    const num = document.getElementById("count-number");

    document.getElementById("btn-dec").addEventListener("click", () => {
      num.textContent = parseInt(num.textContent) - 1;
    });

    document.getElementById("btn-inc").addEventListener("click", () => {
      num.textContent = parseInt(num.textContent) + 1;
    });
  </script>
</html>
```

## Adding Seraph without npm

You can add Seraph to your project without using npm or any other package manager. In this guide, we will be using [skypack CDN](https://www.skypack.dev/) to import Seraph directly as script.

```html
<!DOCTYPE html>
  <head>
    <title>My App</title>
  </head>
  <body>
    <div class="count">
      <h2 class="count-title">
        Count: <span id="count-number" class="count-number">10</span>
      </h2>
      <div class="count-buttons">
        <button id="btn-dec" class="btn btn-dec">Decrement</button>
        <button id="btn-inc" class="btn btn-inc">Increment</button>
      </div>
    </div>
  </body>

  <script type="module">
    import { state, hydrate, from } from "https://cdn.skypack.dev/@d-exclaimation/seraph"; // [!code ++]

    const $count = state(10);  // [!code ++]

    hydrate("count-number", {  // [!code ++]
      classes: "count-number",  // [!code ++]
      c: from($count, (count) => `${count}`), // [!code ++]
    });  // [!code ++]

    hydrate("btn-dec", {  // [!code ++]
      c: "Decrement",  // [!code ++]
      on: {  // [!code ++]
        click: () => ($count.current--),  // [!code ++]
      },  // [!code ++]
    });  // [!code ++]

    hydrate("btn-inc", {  // [!code ++]
      c: "Increment",  // [!code ++]
      on: {  // [!code ++]
        click: () => ($count.current++),  // [!code ++]
      },  // [!code ++]
    });  // [!code ++]
  </script>
</html>
```

In the code above, we are using `hydrate` to use the existing DOM element with the id `count-number` and `btn-dec` and `btn-inc` respectively, instead of creating a new element.


## Adding more logic 

At this point, it may seem like Seraph is just a wrapper around the DOM API. But Seraph is more than that. It allows you to create complex logic that is easy to read and maintain.

Let's say we want to add a feature where:
- the count number will be colored blue if it is even
- the count number will be colored green if it is odd
- the decrement button will be disabled if the count is 0

```html
<!DOCTYPE html>
  <head>
    <title>My App</title>
  </head>
  <body>
    <div class="count">
      <h2 class="count-title">
        Count: <span id="count-number" class="count-number">10</span>
      </h2>
      <div class="count-buttons">
        <button id="btn-dec" class="btn btn-dec">Decrement</button>
        <button id="btn-inc" class="btn btn-inc">Increment</button>
      </div>
    </div>
  </body>

  <script type="module">
    import { state, hydrate, from } from "https://cdn.skypack.dev/@d-exclaimation/seraph"; 

    const $count = state(10);

    hydrate("count-number", {
      classes: "count-number",
      style: {
        color: from($count, (count) => count % 2 === 0 ? "blue" : "green"), // [!code ++]
      },
      c: from($count, (count) => `${count}`),
    });

    hydrate("btn-dec", {
      c: "Decrement",
      on: {
        click: () => ($count.current--),
      },
      attr: {
        disabled: from($count, (count) => count === 0), // [!code ++]
      }
    });

    hydrate("btn-inc", {
      c: "Increment",
      on: {
        click: () => ($count.current++),
      },
    });
  </script>
</html>
```

We can immediately add those features with only a few lines of code and not sacrificing readability.

## A step further

The example above is pretty simple, but once you get used to it, you can do more complex logic.

Let's say now we want the application to be tic-tac-toe game. With Seraph, we can do that.

```html
<!DOCTYPE html>
  <head>
    <title>My Tic Tac Toe</title>
  </head>
  <body>
    <div id="tic-tac-toe">
    </div>
  </body>

  <script type="module">
    import { state, from, html, component, zip } from "https://cdn.skypack.dev/@d-exclaimation/seraph";

    const $board = state([
      ["_", "_", "_"],
      ["_", "_", "_"],
      ["_", "_", "_"],
    ]);
    const $turn = state("X");
    const $winner = from($board, (board) => {
      // Rows
      for (let i = 0; i < 3; i++) {
        if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
          if (board[i][0] === "_") continue;
          return board[i][0];
        }
      }

      // Columns
      for (let i = 0; i < 3; i++) {
        if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
          if (board[0][i] === "_") continue;
          return board[0][i];
        }
      }

      // Diagonals
      if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        if (board[0][0] !== "_") {
          return board[0][0];
        }
      }
      if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        if (board[0][2] !== "_") {
          return board[0][2];
        }
      }

      return undefined;
    });

    const clickAt = (row: number, col: number) => {
      if (!$winner.current && $board.current[row][col] === "_") {
        $board.current[row][col] = $turn.current;
        $board.current = $board.current;
        $turn.current = $turn.current === "X" ? "O" : "X";
      }
    };

    const Game = component(() => {
      return html.div({
        classes: "board",
        c: [
          html.div({
            classes: "board-status",
            c: from(zip($winner, $turn), ([winner, turn]) => 
              winner ? `Winner: ${winner}` : `Next player: ${turn}`,
            )
          }),
          html.div({
            classes: "board-grid",
            c: from($board, (board) =>
              board.map((row, i) =>
                html.div({
                  classes: "board-row",
                  c: row.map((col, j) =>
                    html.button({
                      classes: "board-square",
                      c: `${col}`,
                      on: { click: () => clickAt(i, j) },
                    })
                  ),
                })
              ),
            )
          }),
        ],
      });
    });

    Game.render(
      {},
      document.getElementById("tic-tac-toe")!
    );
  </script>
</html>
```


What if we want to go even further? Feel free to dive into the [Concepts](/concepts/states) section to learn more about Seraph.