import { component, effect, from, html, state } from "@lib/core";
import { client } from "../_context";

const $data = client.query(["config"], async () => {
  const users = [
    { name: "josh" },
    { name: "david" },
    { name: "james" },
    { name: "jane" },
    { name: "jessica" },
    { name: "jennifer" },
  ];
  const random = Math.floor(Math.random() * users.length);
  return new Promise<{ name: string }>((resolve) => {
    setTimeout(() => {
      resolve({ name: users[random].name });
    }, 1000);
  });
});

const $isLoading = from($data, (data) => data.status === "loading");

const $username = from($data, (data) => {
  if (data.status === "success") return data.data.name;
  return ".......";
});

const $mention = from($data, (data) => {
  if (data.status === "success") return `@${data.data.name}`;
  return ".......";
});

const $checked = state(false);

effect($data, (data) => {
  if (data.status !== "success") return;
  $checked.current = false;
});

export default component(() =>
  html.div({
    classes:
      "rounded-lg flex justify-center flex-col max-w-[90vw] w-[32rem] gap-1 bg-white p-8 animate-fades-in",
    c: [
      html.div({
        classes:
          "flex flex-row-reverse justify-end items-start w-full gap-2 md:gap-4",
        c: [
          html.div({
            classes: "flex flex-col gap-1 items-start",
            c: [
              html.h1({
                classes: [
                  "text-2xl font-bold text-slate-800 capitalize transition-all",
                  "data-[is-loading=true]:text-slate-300 data-[is-loading=true]:bg-slate-300 data-[is-loading=true]:animate-pulse",
                  "data-[is-loading=true]:min-w-[10rem] data-[is-loading=true]:rounded-md",
                ],
                c: $username,
                attr: {
                  "data-is-loading": $isLoading,
                },
              }),
              html.h3({
                classes: [
                  "text-lg font-light text-slate-800/60 transition-all",
                  "data-[is-loading=true]:text-slate-300 data-[is-loading=true]:bg-slate-300 data-[is-loading=true]:animate-pulse",
                  "data-[is-loading=true]:min-w-[6rem] data-[is-loading=true]:rounded-md",
                ],
                c: $mention,
                attr: {
                  "data-is-loading": $isLoading,
                },
              }),
            ],
          }),
          html.div({
            classes: [
              "w-16 h-16 rounded-full transition-all",
              "data-[is-loading=true]:text-slate-300 data-[is-loading=true]:bg-slate-300",
              "data-[is-loading=true]:animate-pulse group",
            ],
            c: html.img({
              classes: [
                "w-16 h-16 rounded-full transition-all",
                "group-data-[is-loading=true]:opacity-0",
              ],
              attr: {
                src: from(
                  $username,
                  (username) => `https://avatar.vercel.sh/${username}`
                ),
              },
            }),
            attr: {
              "data-is-loading": $isLoading,
            },
          }),
        ],
      }),

      html.span({
        classes: "h-[1px] w-full my-4 bg-slate-400/30",
      }),

      html.div({
        classes: "flex flex-row items-center justify-between my-2",
        c: [
          html.div({
            classes: "flex flex-col gap-1",
            c: [
              html.span({
                c: "Revalidate",
              }),
              html.span({
                classes: "text-slate-400 font-light text-sm",
                c: "Click on these to revalidate the data",
              }),
            ],
          }),
          html.button({
            classes: [
              "inline-flex h-[24px] w-[44px] flex-shrink-0 group",
              "cursor-pointer items-center rounded-full border-2 border-transparent transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2",
              "focus-visible:ring-offset-zinc-300 disabled:cursor-not-allowed disabled:opacity-50",
              "data-[checked=true]:bg-blue-600 bg-zinc-100",
            ],
            attr: {
              type: "button",
              "data-checked": from($checked, (v) => v.toString()),
            },
            c: html.span({
              classes: [
                "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0",
                "transition-transform group-data-[checked=true]:translate-x-5 translate-x-0",
              ],
            }),
            on: {
              click: () => {
                $checked.current = true;
                $data.invalidate();
              },
            },
          }),
        ],
      }),
    ],
  })
);
