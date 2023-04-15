import { sr, type DefaultProps } from "./seraph";
import "./style.css";

const SPORTS = [
  "Basketball",
  "Baseball",
  "Football",
  "Soccer",
  "Tennis",
  "Volleyball",
  "Badminton",
  "Table Tennis",
  "Golf",
  "Swimming",
  "Diving",
  "Hockey",
  "Rugby",
  "Cricket",
  "Boxing",
  "Wrestling",
  "Fencing",
  "Archery",
  "Gymnastics",
  "Skating",
  "Skiing",
  "Snowboarding",
  "Cycling",
  "Equestrian",
  "Weightlifting",
  "Judo",
  "Taekwondo",
  "Karate",
  "Shooting",
  "Softball",
  "Lacrosse",
  "Water Polo",
  "Rowing",
  "Canoeing",
  "Kayaking",
  "Surfing",
  "Diving",
  "Sailing",
  "Triathlon",
  "Polo",
  "Racquetball",
  "Handball",
  "Beach Volleyball",
  "Beach Soccer",
  "Beach Handball",
  "Field Hockey",
  "Cheerleading",
  "Netball",
  "Gaelic Football",
  "Dodgeball",
  "Croquet",
  "Bandy",
  "E-Sports",
  "Futsal",
  "Kabaddi",
  "Korfball",
  "Pickleball",
  "Squash",
  "Handgliding",
  "Cliff Diving",
  "Skateboarding",
  "BMX",
  "Roller Skating",
  "Roller Hockey",
  "Roller Derby",
  "Ice Hockey",
  "Ice Skating",
  "Ice Dancing",
  "Ice Curling",
  "Ice Sledge Hockey",
  "Ice Figure Skating",
  "Ice Speed Skating",
  "Ice Short Track Speed Skating",
  "Ice Synchronized Skating",
  "Ice Team Skating",
  "Ice Bobsleigh",
  "Ice Skeleton",
  "Ice Luge",
  "North Korean Basketball",
];

const $data = sr.resource<{ sports: string[] }>("sr-sports-data");
const $sports = sr.state(new Set($data.current.sports));
const $search = sr.state("");

const $recommended = sr.from(sr.zip($sports, $search), ([sports, search]) => {
  if (search.trim().length < 3) return undefined;
  return SPORTS.map((sport) => sport.trim())
    .filter((sport) => !sports.has(sport))
    .filter((sport) => sport.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 5);
});

const Tag = (sport: string, click: () => void) => {
  return sr.span({
    classes: [
      "flex justify-between text-sm font-normal",
      "px-3 py-1 w-full md:w-fit rounded-sm",
      "text-black bg-amber-100 md:rounded-full",
    ],
    c: [
      sport,
      sr.button({
        classes: "ml-1 text-sm",
        c: "✕",
        on: { click },
      }),
    ],
  });
};

const Dropdown = (to: HTMLElement, c: DefaultProps["c"]) => {
  return sr.div({
    classes: "flex flex-col w-full items-center justify-start",
    c: [
      to,
      sr.div({
        classes: "flex flex-col w-full",
        c,
      }),
    ],
  });
};

const RecommendedSports = (click: (sport: string) => void) => {
  return sr.div(
    sr.use($recommended, (recommended) => ({
      classes: [
        "absolute mt-2 flex flex-col w-64 min-w-[max-content]",
        "items-start justify-start bg-white rounded gap-1 shadow-md h-max",
        !recommended ? "py-[0px]" : "py-1",
      ],
      c: !recommended
        ? []
        : [
            ...recommended.map((sport) =>
              sr.button({
                classes:
                  "text-base text-start px-3 py-1 text-sm text-black/60 hover:bg-slate-50 w-full",
                c: sport,
                on: {
                  click: () => click(sport),
                },
              })
            ),
            sr.button({
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
  return sr.input(
    sr.use($search, (search) => ({
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
  return sr.hydrate("counter-app", {
    classes: [
      "flex flex-col items-center justify-start shadow-lg bg-white",
      "max-w-xl w-[90vw] h-[90vh] md:h-96 rounded-lg",
    ],
    c: [
      // Heading
      sr.div({
        classes: "flex w-full items-center py-4 justify-start px-6",
        c: sr.hydrate("reuse", {
          classes: "text-2xl font-bold text-black",
          c: "Favourite sport",
        }),
      }),

      // Search bar
      sr.div({
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
      sr.div(
        sr.use($sports, (sports) => ({
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
