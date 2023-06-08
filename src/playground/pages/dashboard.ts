import { component, from, html } from "@lib/core";
import { $count } from "../_context";

type ChartBarProps = {
  height: number;
};
export const ChartBar = component<ChartBarProps>(({ height }) =>
  html.span({
    classes: "bg-emerald-300 rounded w-[32px] max-h-[80px] animate-inc-height",
    attr: {
      height: `${height}px`,
    },
    style: {
      height: `${height}px`,
    },
  })
);

const data = Array.from({ length: 6 })
  .fill(null)
  .map(() => Math.floor(Math.random() * 60) + 20);

export default component(() =>
  html.div({
    classes:
      "rounded-lg flex justify-between items-center flex max-w-[90vw] h-[10rem] w-[28rem] gap-1 bg-white p-8 animate-fades-in",
    c: [
      html.div({
        classes: "flex flex-col h-full items-start justify-start gap-1",
        c: [
          html.span({
            classes: "text-xl font-bold",
            c: "Your activity",
          }),
          html.span({
            classes: "text-sm font-medium text-slate-500",
            c: "The past 7 days",
          }),

          html.div({
            classes: "flex items-center justify-center mt-2 gap-1",
            c: [
              html.span({
                classes: "text-xl font-light",
                c: from($count, (count) => `${count + 1000}`),
              }),
              html.span({
                classes: "text-sm font-medium mt-1",
                c: "steps",
              }),
            ],
          }),
        ],
      }),

      html.div({
        classes: "flex h-full items-end justify-end gap-1",
        c: [
          html.span({
            classes:
              "bg-emerald-300 rounded w-[32px] max-h-[80px] animate-inc-height",
            attr: {
              height: from($count, (count) => `${count}px`),
            },
            style: {
              height: from($count, (count) => `${count}px`),
            },
          }),
          ...data.map((height) => ChartBar.view({ height })),
        ],
      }),
    ],
  })
);
