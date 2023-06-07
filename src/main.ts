import "./export";
import { State, from, html, memo, resource, state } from "./seraph";
import "./style.css";

export function experimental_derive<T, K>(
  state: State<T>,
  proxy: { get: (state: T) => K; set: (change: K, current: T) => T }
): State<K> {
  return {
    __kind: "state",
    get current() {
      return proxy.get(state.current);
    },
    set current(change) {
      state.current = proxy.set(change, state.current);
    },
    subscribe(fn) {
      return state.subscribe(() => fn(proxy.get(state.current)));
    },
  };
}

export function component<
  T extends { [k: string | symbol | number]: unknown } = {},
  K extends HTMLElement = HTMLElement
>(fn: (props: T) => K) {
  return {
    view: fn,
    render: (props: T, parent: HTMLElement) => {
      parent.appendChild(fn(props));
    },
  };
}

// --

type User = {
  name: string;
  email: string;
  date: string;
};

const $show = state(false);

const $user = resource<User>("user-data");

const $username = experimental_derive($user, {
  get: ({ name }) => name,
  set: (name, user) => ({ ...user, name }),
});

const $email = experimental_derive($user, {
  get: ({ email }) => email,
  set: (email, user) => ({ ...user, email }),
});

const $date = experimental_derive($user, {
  get: ({ date }) => date,
  set: (date, user) => ({ ...user, date }),
});

type TextFieldProps = {
  id: string;
  type?: "text" | "email" | "password" | "date";
  label: string;
  $value: State<string>;
  $invalid: State<boolean>;
  placeholder?: string;
  filter?: (value: string) => boolean;
};

const TextField = component<TextFieldProps>(
  ({ label, type, filter, id, $value, $invalid, placeholder }) => {
    return html.div({
      classes: "flex w-full flex-col gap-1 items-start justify-center",
      c: [
        html.label({
          classes: "text-sm font-bold",
          c: label,
          attr: {
            for: id,
          },
        }),
        html.input({
          classes: [
            "outline-none select-none px-3 py-2 border border-zinc-600/30 rounded w-full",
            "transition-all data-[invalid=true]:border-pink-500 data-[invalid=true]:border-[1.5px]",
          ],
          attr: {
            id,
            placeholder,
            value: $value,
            type,
            "data-invalid": from($invalid, (invalid) => `${invalid}`),
          },
          on: {
            input: (e) => {
              const newValue = (e.target as HTMLInputElement).value;
              $value.current =
                filter && !filter(newValue) ? $value.current : newValue;
            },
          },
        }),
      ],
    });
  }
);

const Dialog = component(() =>
  html.div({
    classes: [
      "fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center -z-10",
      "opacity-0 data-[show=true]:opacity-100 data-[show=true]:z-40",
      "transition-all duration-300",
    ],
    attr: {
      "data-show": from($show, (show) => `${show}`),
    },
    on: {
      click: () => ($show.current = false),
    },
    c: [
      html.form({
        classes: [
          "flex flex-col gap-4 py-8 px-6 w-[28rem] min-w-max bg-white shadow",
          "rounded-md scale-95 data-[show=true]:scale-100 data-[show=true]:z-40",
          "transition-all duration-500",
        ],
        attr: {
          "data-show": from($show, (show) => `${show}`),
        },
        on: {
          click: (e) => {
            e.preventDefault();
            e.stopPropagation();
          },
        },
        c: [
          // Heading
          html.div({
            classes: "flex flex-col items-center justify-center w-full gap-4",
            c: [
              html.span({
                classes: "text-xl font-bold",
                c: memo($username, (username) => `Edit ${username}`),
              }),
              html.img({
                classes: "w-24 h-24 rounded-full",
                attr: {
                  src: "https://avatar.vercel.sh/helo",
                },
              }),
            ],
          }),

          TextField.view({
            $value: $username,
            $invalid: from($username, (username) => username.length < 3),
            id: "name",
            label: "Name",
            placeholder: "Enter your name",
          }),

          TextField.view({
            $invalid: from($email, (email) => !/\S+@\S+\.\S+/.test(email)),
            $value: $email,
            id: "email",
            label: "Email",
            type: "email",
            placeholder: "Enter your email",
          }),

          TextField.view({
            $invalid: from($date, (date) => !/\d{4}-\d{2}-\d{2}/.test(date)),
            $value: $date,
            id: "date",
            label: "Date",
            type: "date",
            placeholder: "Enter your date of birth",
          }),

          html.div({
            classes: "flex items-center justify-between w-full",
            c: [
              html.button({
                classes:
                  "px-4 py-2 rounded-md bg-red-100 text-red-900 hover:bg-red-200 active:bg-red-200",
                attr: {
                  type: "button",
                },
                c: "Cancel",
                on: {
                  click: () => ($show.current = false),
                },
              }),
              html.button({
                classes:
                  "px-4 py-2 rounded-md bg-sky-100 text-sky-900 hover:bg-sky-200 active:bg-sky-200",
                c: "Submit",
                on: {
                  click: () => ($show.current = false),
                },
              }),
            ],
          }),
        ],
      }),
    ],
  })
);

const Toggle = component(() =>
  html.button({
    classes:
      "px-4 py-2 rounded-md bg-indigo-100 text-indigo-900 hover:bg-indigo-200 active:bg-indigo-200",
    c: "Edit",
    on: {
      click: () => {
        $show.current = !$show.current;
      },
    },
  })
);

Dialog.render({}, document.getElementById("app")!);
Toggle.render({}, document.getElementById("app")!);
