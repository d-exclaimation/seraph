import { Arrayable } from "./common/types";
import { State, from, resource } from "./seraph";
import "./style.css";

// -- Experiments

export type experimental_State<T> = State<T> & {
  __kind: "state";
};

export type MaybeState<T> = experimental_State<T> | T;

export type Classes = MaybeState<string> | MaybeState<string[]>;

export type Styles =
  | experimental_State<Partial<CSSStyleDeclaration>>
  | {
      [key in keyof CSSStyleDeclaration]?: MaybeState<CSSStyleDeclaration[key]>;
    };

export type Children = MaybeState<Arrayable<HTMLElement | string>>;
export type Attr =
  | experimental_State<Record<string, any>>
  | Record<string, MaybeState<any>>;

export type Listener = {
  [key in keyof HTMLElementEventMap]?: (e: HTMLElementEventMap[key]) => void;
};

/**
 * Component properties.
 */
export type BaseProps = {
  classes?: Classes;
  style?: Styles;
  c?: Children;
  on?: Listener;
  attr?: Attr;
};

export function isState<T>(
  state: MaybeState<T>
): state is experimental_State<T> {
  return (
    typeof state === "object" &&
    state !== null &&
    "__kind" in state &&
    state.__kind === "state"
  );
}

export function applyProp<T>(state: MaybeState<T>, fn: (current: T) => void) {
  if (isState(state)) {
    return state.subscribe(fn);
  }
  fn(state);
  return () => {};
}

/**
 * Applies properties to a component.
 * @param elem The component.
 * @param props The properties.
 */
export function experimental_apply(
  elem: HTMLElement,
  { classes, style, c: children, on, attr }: BaseProps
) {
  const unsubs = [] as (() => void)[];
  if (classes !== undefined) {
    const unsub = applyProp(classes, (classes) => {
      elem.className = "";
      if (typeof classes === "string") {
        elem.className = classes;
      } else {
        elem.className = classes.join(" ");
      }
    });
    unsubs.push(unsub);
  }

  if (style !== undefined) {
    if (isState(style)) {
      const unsub = style.subscribe((style) => {
        elem.style.cssText = "";
        Object.entries(style).forEach(([key, value]) => {
          if (value === undefined || value === null) {
            return;
          }
          elem.style[key as any] = value as string;
        });
      });
      unsubs.push(unsub);
    } else {
      Object.entries(style).forEach(([key, value]) => {
        elem.style.cssText = "";
        const unsub = applyProp(value, (value) => {
          if (value === undefined || value === null) {
            return;
          }
          elem.style[key as any] = value as string;
        });
        unsubs.push(unsub);
      });
    }
  }

  if (children !== undefined) {
    const unsub = applyProp(children, (children) => {
      elem.innerHTML = "";
      (Array.isArray(children) ? children : [children])
        .map((child) =>
          typeof child === "string" ? document.createTextNode(child) : child
        )
        .forEach((child) => elem.appendChild(child));
    });
    unsubs.push(unsub);
  }

  if (attr !== undefined) {
    if (isState(attr)) {
      const unsub = attr.subscribe((attr) => {
        Object.entries(attr).forEach(([key, value]) => {
          elem.removeAttribute(key);
          if (value === undefined) {
            return;
          }
          if (key in elem) {
            (elem as any)[key] = value;
            return;
          }
          elem.setAttribute(key, value);
        });
      });
      unsubs.push(unsub);
    } else {
      Object.entries(attr).forEach(([key, value]) => {
        const unsub = applyProp(value, (value) => {
          elem.removeAttribute(key);
          if (value === undefined) {
            return;
          }
          if (key in elem) {
            (elem as any)[key] = value;
            return;
          }
          elem.setAttribute(key, value);
        });
        unsubs.push(unsub);
      });
    }
  }

  if (on !== undefined) {
    Object.entries(on).forEach(([key, value]) =>
      elem.addEventListener(key, value as EventListener)
    );
  }

  window.addEventListener("beforeunload", () => {
    unsubs.forEach((unsub) => unsub());
  });
}

export function experimental_create<K extends keyof HTMLElementTagNameMap>(
  __type: K,
  props: BaseProps
): HTMLElementTagNameMap[K] {
  const elem = document.createElement(__type);
  experimental_apply(elem, props);
  return elem;
}

export function experimental_wrap<T>(state: State<T>): experimental_State<T> {
  return {
    ...state,
    __kind: "state",
  };
}

// --

type User = {
  name: string;
  email: string;
  date: string;
};

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

type TextFieldProps = {
  id: string;
  label: string;
  $value: experimental_State<string>;
  placeholder?: string;
  on: {
    input: (value: string) => void;
  };
};

const TextField = component<TextFieldProps>(
  ({ label, on, id, $value, placeholder }) => {
    return experimental_create("div", {
      classes: "flex w-full flex-col gap-1 items-start justify-center",
      c: [
        experimental_create("label", {
          classes: "text-sm font-bold",
          c: label,
          attr: {
            for: id,
          },
        }),
        experimental_create("input", {
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
  experimental_create("form", {
    classes: "flex flex-col gap-4 p-4 w-full max-w-xl bg-white rounded shadow",
    c: [
      experimental_create("span", {
        c: experimental_wrap(from($user, (user) => `Hello ${user.name}`)),
      }),
      TextField.view({
        $value: experimental_wrap(from($user, (user) => user.name)),
        id: "name",
        label: "Name",
        placeholder: "Enter your name",
        on: {
          input: (value) => {
            if (value.length <= 20) {
              $user.current.name = value;
            }
            $user.current = $user.current;
          },
        },
      }),
    ],
  })
);

App.render({}, document.getElementById("app")!);
