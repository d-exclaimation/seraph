import { effect, html, reduce, render, resource, use } from "./seraph";
import "./style.css";

type User = {
  name: string;
  email: string;
  date: string;
};

type Event = {
  name: string;
  start: Date;
  end?: Date;
};

type EventAction =
  | { for: "name"; value: string }
  | { for: "start"; value: Date }
  | { for: "end"; value: Date };

const $user = resource("user-data", (raw) => {
  const data = JSON.parse(raw);
  if (typeof data !== "object") {
    throw new Error("Invalid data");
  }
  if ("name" in data && "email" in data && "date" in data) {
    return data as User;
  }
  throw new Error("Invalid data");
});

const $form = reduce<Event, EventAction>(
  (state, action) => {
    switch (action.for) {
      case "name":
        return { ...state, name: action.value };
      case "start":
        if (state.end && action.value > state.end) {
          return state;
        }
        return { ...state, start: action.value };
      case "end":
        if (state.start > action.value) {
          return state;
        }
        return { ...state, end: action.value };
    }
  },
  {
    name: "",
    start: new Date(),
    end: new Date(),
  }
);

effect($user, (user) => {
  console.log(user);
});

export function component<
  T extends { [k: string | symbol | number]: unknown } = {},
  K extends HTMLElement = HTMLElement
>(fn: (props: T) => K) {
  return {
    view: fn,
  };
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  oninput: (value: string) => void;
};

const TextField = component<TextFieldProps>(
  ({ label, oninput, id, ...inputProps }) => {
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
            ...inputProps,
          },
          on: {
            input: (e) => {
              oninput((e.target as HTMLInputElement).value);
            },
          },
        }),
      ],
    });
  }
);

const App = () => {
  return html.form(
    use($form, ({ name, start, end }) => ({
      classes:
        "flex items-center justify-center h-max flex-col gap-2 min-w-[32rem] bg-white rounded shadow p-4",
      c: [
        html.h3({
          classes: "text-xl font-bold",
          c: `Create an event${name ? ` '${name}'` : ""}`,
        }),

        TextField.view({
          id: "name",
          label: "Event name",
          value: name,
          oninput: (value) =>
            $form.dispatch({
              for: "name",
              value,
            }),
        }),

        html.input({
          classes:
            "outline-none select-none px-3 py-2 border border-zinc-600/30 rounded w-full",
          attr: {
            type: "datetime-local",
            value: start.toISOString().slice(0, 16),
          },
          on: {
            input: (e) => {
              $form.dispatch({
                for: "start",
                value: new Date((e.target as HTMLInputElement).value),
              });
            },
          },
        }),
        html.input({
          classes:
            "outline-none select-none px-3 py-2 border border-zinc-600/30 rounded w-full",
          attr: {
            type: "datetime-local",
            value: end?.toISOString().slice(0, 16),
          },
          on: {
            input: (e) => {
              $form.dispatch({
                for: "end",
                value: new Date((e.target as HTMLInputElement).value),
              });
            },
          },
        }),
      ],
    }))
  );
};

render(App(), document.getElementById("app")!);
