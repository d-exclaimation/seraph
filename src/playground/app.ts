import { component, html } from "@lib/core";
import { route } from "@lib/router";
import { router } from "./_context";
import NotFound from "./pages/404";
import Counter from "./pages/counter";
import Dashboard from "./pages/dashboard";
import Index from "./pages/index";
import Profile from "./pages/profile";

const { $outlet } = router.provider([
  route("/", Index.view),
  route("/dashboard", Dashboard.view),
  route("/counter", Counter.view),
  route("/counter/**", Counter.view),
  route("/profile/:username", Profile.view),
  route("*", NotFound.view),
]);

export default component(() =>
  html.div({
    classes: "flex flex-col items-center justify-start w-screen h-screen",
    c: [
      html.nav({
        classes:
          "flex flex-row items-center justify-center text-sm w-full h-fit rounded bg-white shadow gap-2 px-4 py-2",
        c: [
          router.link({
            classes:
              "flex-shrink-0 px-3 py-2 text-zinc-800 hover:underline transition-all",
            c: "Home",
            href: "/",
          }),
          router.link({
            classes:
              "flex-shrink-0 px-3 py-2 text-zinc-800 hover:underline transition-all",
            c: "Dashboard",
            href: "/dashboard",
          }),
          router.link({
            classes:
              "flex-shrink-0 px-3 py-2 text-zinc-800 hover:underline transition-all",
            c: "Counter",
            href: "/counter",
          }),
        ],
      }),

      html.div({
        classes: "flex flex-col items-center justify-center w-full h-full",
        c: $outlet,
      }),
    ],
  })
);
