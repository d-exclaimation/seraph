import {
  effect,
  from,
  html,
  hydrate,
  query,
  resource,
  state,
  use,
  zip,
  type DefaultProps,
} from "./seraph";
import "./style.css";

const $allSportsQuery = query({
  async queryFn() {
    const res = await fetch("/sports.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const raw = await res.json();
    if (!Array.isArray(raw)) throw new Error("Invalid sports data");
    return raw as string[];
  },
  initial: [],
  enabled: true,
});

const $allSports = from($allSportsQuery, (sports) =>
  sports.status === "success" ? sports.data : []
);
const $data = resource<{ sports: string[] }>("sr-sports-data");
const $sports = state(new Set($data.current.sports));
const $search = state("");

const $recommended = from(zip($sports, $search), ([sports, search]) => {
  if (search.trim().length < 3) return undefined;
  return $allSports.current
    .map((sport) => sport.trim())
    .filter((sport) => !sports.has(sport))
    .filter((sport) => sport.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 5);
});

effect($allSports, (sports) => {
  console.log("sports", sports);
});

const Tag = (sport: string, click: () => void) => {
  return html.span({
    classes: [
      "flex justify-between text-sm font-normal",
      "px-3 py-1 w-full md:w-fit rounded-sm",
      "text-black bg-amber-100 md:rounded-full",
    ],
    c: [
      sport,
      html.button({
        classes: "ml-1 text-sm",
        c: "✕",
        on: { click },
      }),
    ],
  });
};

const Dropdown = (to: HTMLElement, c: DefaultProps["c"]) => {
  return html.div({
    classes: "flex flex-col w-full items-center justify-start",
    c: [
      to,
      html.div({
        classes: "flex flex-col w-full",
        c,
      }),
    ],
  });
};

const RecommendedSports = (click: (sport: string) => void) => {
  return html.div(
    use($recommended, (recommended) => ({
      classes: [
        "absolute mt-2 flex flex-col w-64 min-w-[max-content]",
        "items-start justify-start bg-white rounded gap-1 shadow-md h-max",
        !recommended ? "py-[0px]" : "py-1",
      ],
      c: !recommended
        ? []
        : [
            ...recommended.map((sport) =>
              html.button({
                classes:
                  "text-base text-start px-3 py-1 text-sm text-black/60 hover:bg-slate-50 w-full",
                c: sport,
                on: {
                  click: () => click(sport),
                },
              })
            ),
            html.button({
              classes:
                "text-base text-start px-3 py-1 text-sm text-black/40 hover:bg-slate-50 w-full",
              c: `Add custom sport "${$search.current}"`,
              on: {
                click: () => click($search.current),
              },
            }),
          ],
    }))
  );
};

const SearchBar = () => {
  return html.input(
    use($search, (search) => ({
      classes: [
        "px-3 py-1 text-sm md:text-base rounded-md w-full",
        "outline-none select-none border-2 border-black/10",
      ],
      attr: {
        placeholder: "Add a new favourite sport",
        value: search,
      },
      on: {
        input: (e) => ($search.current = (e.target as HTMLInputElement).value),
      },
    }))
  );
};

const App = () => {
  return hydrate("counter-app", {
    classes: [
      "flex flex-col items-center justify-start shadow-lg bg-white",
      "max-w-xl w-[90vw] h-[90vh] md:h-96 rounded-lg",
    ],
    c: [
      // Heading
      html.div({
        classes: "flex w-full items-center py-4 justify-start px-6",
        c: html.h2({
          classes: "text-2xl font-bold text-black",
          c: "Favourite sport",
        }),
      }),

      // Search bar
      html.div({
        classes: "flex w-full items-center justify-start px-4 gap-1",
        c: [
          Dropdown(
            SearchBar(),
            RecommendedSports((sport) => {
              $sports.current.add(sport);
              $sports.current = $sports.current;
              $search.current = "";
            })
          ),
        ],
      }),

      // Tags
      html.div(
        use($sports, (sports) => ({
          classes: [
            "flex flex-col sm:flex-row sm:flex-wrap w-full max-h-full overflow-y-auto",
            "items-start sm:items-center justify-start px-4 my-4 gap-2",
          ],
          c: [...sports].map((sport) =>
            Tag(sport, () => {
              $sports.current.delete(sport);
              $sports.current = $sports.current;
            })
          ),
        }))
      ),
    ],
  });
};

App();
