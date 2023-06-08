import { component, html } from "@lib/core";

export default component(() =>
  html.div({
    classes: "flex items-center justify-center flex-col gap-3 animate-fades-in",
    c: [
      html.span({
        classes: "text-zinc-700 text-4xl font-bold",
        c: "404",
      }),

      html.span({
        classes: "bg-zinc-700/50 h-[1px] w-[10rem]",
      }),

      html.span({
        classes: "text-zinc-700 text-xl font-medium",
        c: "Page not found",
      }),
    ],
  })
);
