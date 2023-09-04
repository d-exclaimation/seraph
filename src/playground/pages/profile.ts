import { component, html, s, type State } from "@lib/core";
import { $analytics, $functional, $performance } from "../_context";

type SwitchProps = {
  $checked: State<boolean>;
};

export const Switch = component<SwitchProps>(({ $checked }) =>
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
      "data-checked": s`${$checked}`,
    },
    c: html.span({
      classes: [
        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0",
        "transition-transform group-data-[checked=true]:translate-x-5 translate-x-0",
      ],
    }),
    on: {
      click: () => ($checked.current = !$checked.current),
    },
  })
);

type SettingProps = {
  title: string;
  description: string;
  $checked: State<boolean>;
};
export const Setting = component<SettingProps>(
  ({ title, description, $checked }) =>
    html.div({
      classes: "flex flex-row items-center justify-between my-2",
      c: [
        html.div({
          classes: "flex flex-col gap-1",
          c: [
            html.span({
              c: title,
            }),
            html.span({
              classes: "text-slate-400 font-light text-sm",
              c: description,
            }),
          ],
        }),
        Switch.view({ $checked }),
      ],
    })
);

export default component<{ username: string }>(({ username }) =>
  html.div({
    classes:
      "rounded-lg flex justify-center flex-col max-w-[90vw] w-[32rem] gap-1 bg-white p-8 animate-fades-in",
    c: [
      html.div({
        classes: "flex justify-between items-start w-full",
        c: [
          html.div({
            classes: "flex flex-col gap-1 items-start",
            c: [
              html.h1({
                classes: "text-2xl font-bold text-slate-800",
                c: username,
              }),
              html.h3({
                classes: "text-lg font-light text-slate-800/60",
                c: `@${username}`,
              }),
            ],
          }),
          html.img({
            classes: "w-16 h-16 rounded-full",
            attr: {
              src: `https://avatar.vercel.sh/${username}`,
            },
          }),
        ],
      }),

      html.span({
        classes: "h-[1px] w-full my-4 bg-slate-400/30",
      }),

      html.h1({
        classes: "text-2xl font-bold",
        c: "Cookie Settings",
      }),
      html.span({
        classes: "text-slate-400 font-light mb-4",
        c: "Manage your cookie settings here",
      }),

      Setting.view({
        title: "Analytics Cookies",
        description: "These cookies helps us to improve our website.",
        $checked: $analytics,
      }),

      Setting.view({
        title: "Functional Cookies",
        description:
          "These cookies allow the website to provide personalized functionality.",
        $checked: $functional,
      }),

      Setting.view({
        title: "Performance Cookies",
        description:
          "These cookies help us to monitor the performance of our website.",
        $checked: $performance,
      }),
    ],
  })
);
