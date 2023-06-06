import "./export";
import { State, from, html, memo, resource } from "./seraph";
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

const $user = resource<User>("user-data");

const $username = experimental_derive($user, {
  get: ({ name }) => name,
  set: (name, user) => ({ ...user, name }),
});

type TextFieldProps = {
  id: string;
  label: string;
  $value: State<string>;
  placeholder?: string;
  on: {
    input: (value: string) => void;
  };
};

const TextField = component<TextFieldProps>(
  ({ label, on, id, $value, placeholder }) => {
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
          classes:
            "outline-none select-none px-3 py-2 border border-zinc-600/30 rounded w-full",
          attr: {
            id,
            placeholder,
            value: $value,
          },
          on: {
            input: (e) => {
              on.input((e.target as HTMLInputElement).value);
            },
          },
        }),
      ],
    });
  }
);

const App = component(() =>
  html.div({
    c: [
      html.form({
        classes:
          "flex flex-col gap-4 p-4 w-full max-w-xl min-w-[40rem] bg-white rounded shadow",
        c: [
          // Heading
          html.span({
            c: memo($username, (username) => `Hello ${username}`),
            attr: from($user, ({ name, date, email }) => ({
              "data-name": name,
              "data-date": date,
              "data-email": email,
            })),
          }),

          // Text field with label
          TextField.view({
            $value: $username,
            id: "name",
            label: "Name",
            placeholder: "Enter your name",
            on: {
              input: (value) => {
                $username.current = value.substring(0, 20);
              },
            },
          }),
        ],
      }),
    ],
  })
);

App.render({}, document.getElementById("app")!);
