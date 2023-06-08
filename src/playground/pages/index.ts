import { derive, from, state, type State } from "../../state";
import { component, html } from "../../ui";
import { router } from "../_context";

type OAuthProps = {
  provider: "apple" | "google";
};
export const OAuth = component<OAuthProps>(({ provider }) =>
  router.link({
    href: `/profile/${provider}`,
    classes: [
      "border border-slate-400/50 w-[45%] flex items-center justify-center rounded-2xl font-medium px-4 py-2 capitalize",
      "hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-300",
    ],
    c: [
      html.img({
        classes: "w-5 h-5 mr-2",
        attr: {
          src: `/${provider}.svg`,
        },
      }),
      provider,
    ],
  })
);

type TextfieldProps = {
  label: string;
  type?: "text" | "password";
  placeholder: string;
  $value: State<string>;
};

export const Textfield = component<TextfieldProps>(
  ({ $value, label, type, placeholder }) =>
    html.div({
      classes: "flex flex-col items-start justify-center w-full gap-2 my-1",
      c: [
        html.label({
          classes: "text-slate-800 font-medium",
          c: label,
        }),
        html.input({
          classes:
            "w-full rounded-3xl select-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-300 outline-none border-2 border-slate-300/50 px-4 py-3",
          attr: {
            value: $value,
            placeholder,
            type,
          },
          on: {
            input: (e) =>
              ($value.current = (e.target as HTMLInputElement).value),
          },
        }),
      ],
    })
);

const $user = state({
  email: "",
  password: "",
});
const $email = derive($user, {
  get: ({ email }) => email,
  set: (email, user) => ({ ...user, email }),
});
const $password = derive($user, {
  get: ({ password }) => password,
  set: (password, user) => ({ ...user, password }),
});

export default component(() => {
  if ($user.current.email && $user.current.password) {
    return router.navigate({
      href: `/profile/${$user.current.email.split("@")[0]}`,
    });
  }
  return html.div({
    classes:
      "rounded-lg flex justify-center flex-col max-w-[90vw] w-[28rem] gap-1 bg-white p-8 animate-fades-in",
    c: [
      html.h1({
        classes: "text-2xl font-bold",
        c: "Create an account",
      }),
      html.span({
        classes: "text-black/60 font-light",
        c: "Enter your email below to create your account",
      }),

      html.div({
        classes: "flex flex-row items-center justify-between w-full my-3",
        c: [
          OAuth.view({ provider: "apple" }),
          OAuth.view({ provider: "google" }),
        ],
      }),

      html.div({
        classes: "flex flex-row items-center justify-between w-full my-3",
        c: [
          html.span({
            classes: "h-[1px] flex-1 bg-slate-400/50",
          }),

          html.span({
            classes:
              "text-slate-400 p-0 flex-shrink-0 flex-[2] text-center uppercase font-light text-sm",
            c: "or continue with",
          }),

          html.span({
            classes: "h-[1px] flex-1 bg-slate-400/50",
          }),
        ],
      }),

      Textfield.view({
        label: "Email",
        placeholder: "Enter your email",
        $value: $email,
      }),

      Textfield.view({
        type: "password",
        label: "Password",
        placeholder: "Enter your password",
        $value: $password,
      }),

      html.button({
        classes: [
          "w-full rounded-[1.25rem] bg-blue-600 text-white select-none outline-none py-3 mb-1 mt-4",
          "hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500",
          "disabled:bg-blue-400 disabled:cursor-not-allowed",
        ],
        c: "Create account",
        attr: {
          disabled: from($user, ({ email, password }) => !email || !password),
        },
        on: {
          click: () => {
            if ($user.current.email && $user.current.password) {
              router.goto(`/profile/${$user.current.email.split("@")[0]}`);
            }
          },
        },
      }),
    ],
  });
});
