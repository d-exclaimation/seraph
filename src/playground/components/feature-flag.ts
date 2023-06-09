import { Inner, component, from, html, promise, state } from "@lib/core";

type ToastProps = {
  emoji: string;
  title: string;
  message: string;
  on: {
    dismiss: () => void;
  };
};

export const Toast = component<ToastProps>(({ emoji, message, on, title }) =>
  html.div({
    classes: [
      "px-4 py-3 bg-white rounded-md ring-1 ring-zinc-400/50 shadow",
      "flex flex-row items-start justify-start gap-4 min-w-[24rem] animate-slide-up",
    ],
    c: [
      html.span({
        classes: "text-xl mt-1",
        c: emoji,
      }),
      html.div({
        classes: "flex flex-col items-start justify-start",
        c: [
          html.span({
            classes: "font-medium text-lg",
            c: title,
          }),
          html.span({
            classes: "font-light text-black/80",
            c: message,
          }),
        ],
      }),
    ],
    on: {
      click: () => on.dismiss(),
    },
  })
);

const $toast = state([] as { emoji: string; title: string; message: string }[]);
const $hide = state(false);
let timeout: number;

function notify(data: Inner<typeof $toast>[number]) {
  if ($hide.current) {
    $hide.current = false;
    $toast.current = [data];
  } else {
    $toast.current.push(data);
    $toast.current = $toast.current;
  }
}

function clear() {
  clearTimeout(timeout);
  $hide.current = true;
  timeout = setTimeout(() => ($toast.current = []), 150);
}

promise({
  fn: async () => {
    for (let i = 1; i <= 3; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const res = await fetch(`/feature/${i}.json`);
      const data = await res.json();
      notify(data);
    }

    await new Promise((resolve) => setTimeout(resolve, 10_000));
    clear();
  },
});

export default component(() =>
  html.div({
    classes: [
      "fixed bottom-5 left-5 flex flex-col items-start justify-start gap-4",
      "transition-all duration-150 data-[hide=true]:opacity-0 data-[hide=true]:-translate-x-[30rem]",
    ],
    attr: {
      "data-hide": $hide,
    },
    c: from($toast, (toast) =>
      toast.map((props) =>
        Toast.view({
          ...props,
          on: {
            dismiss: clear,
          },
        })
      )
    ),
  })
);
