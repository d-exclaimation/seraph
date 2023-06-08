import { component, from, html } from "@lib/core";
import { $count } from "../_context";

export const Preview = component(() =>
  html.div({
    classes:
      "flex flex-col items-center justify-center gap-2 w-[7rem] border border-slate-400/50 w-max rounded-2xl font-medium px-8 py-4",
    c: [
      html.span({
        classes: "text-4xl font-bold",
        c: from($count, (count) => count.toString()),
      }),
      html.span({
        classes: "text-sm font-medium text-slate-500",
        c: "Count",
      }),
    ],
  })
);

export default component(() =>
  html.div({
    classes:
      "rounded-lg flex justify-center items-center flex-col max-w-[90vw] w-[20rem] gap-1 bg-white p-8 animate-fades-in",
    c: [
      Preview.view({}),

      html.div({
        classes: "flex flex-col items-center justify-center w-full mt-2 gap-1",
        c: [
          html.button({
            classes: [
              "py-2 px-4 h-10 inline-flex items-center justify-center rounded-md text-sm font-medium",
              "transition-colors focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300",
              "focus-visible:ring-offset ring-offset-indigo-300 disabled:bg-indigo-200/50 disabled:cursor-not-allowed",
              "bg-indigo-200 text-indigo-900 hover:bg-indigo-300 w-full ",
            ],
            c: "Increment",
            attr: {
              disabled: from($count, (count) => count >= 99),
            },
            on: {
              click: () => ($count.current = Math.min($count.current + 1, 99)),
            },
          }),
          html.button({
            classes: [
              "py-2 px-4 h-10 inline-flex items-center justify-center rounded-md text-sm font-medium",
              "transition-colors focus-visible:outline-none focus-visible:ring focus-visible:ring-red-300",
              "focus-visible:ring-offset disabled:opacity-50 ring-offset-red-300 disabled:bg-red-200/50 disabled:cursor-not-allowed",
              "bg-red-200 text-red-900 hover:bg-red-300 w-full",
            ],
            c: "Decrement",
            attr: {
              disabled: from($count, (count) => count <= 0),
            },
            on: {
              click: () => ($count.current = Math.max($count.current - 1, 0)),
            },
          }),
        ],
      }),
    ],
  })
);
