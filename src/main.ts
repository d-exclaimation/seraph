import { State, sr, type DefaultProps } from "./seraph";
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

const Tag = (props: { sport: string; click: () => void }) => {
  return sr.span({
    classes: "text-sm font-normal px-3 py-1 rounded-full text-black bg-sky-100",
    c: [
      props.sport,
      sr.button({
        classes: "ml-1 text-sm",
        c: "✕",
        on: {
          click: props.click,
        },
      }),
    ],
  });
};

const Dropdown = (props: { to: HTMLElement; c?: DefaultProps["c"] }) => {
  return sr.div({
    classes: "flex flex-col w-full items-center justify-start",
    c: [
      props.to,
      sr.div({
        classes: "flex flex-col w-full",
        c: props.c,
      }),
    ],
  });
};

const RecommendedSports = (props: {
  bind: {
    $sports: State<Set<string>>;
    $search: State<string>;
  };
  click: (sport: string) => void;
}) => {
  const {
    bind: { $sports, $search },
    click,
  } = props;
  const $recommended = sr.from(sr.zip($sports, $search), ([sports, search]) => {
    if (search.trim().length < 3) return undefined;
    return SPORTS.filter(
      (sport) =>
        sport.toLowerCase().includes(search.toLowerCase()) && !sports.has(sport)
    ).slice(0, 5);
  });

  return sr.div(
    sr.use($recommended, (recommended) => ({
      classes: [
        "absolute mt-2 flex flex-col w-64 min-w-[max-content]",
        "items-start justify-start bg-white rounded gap-1 shadow-md h-max",
        recommended === undefined ? "py-[0px]" : "py-1",
      ],
      c:
        recommended === undefined // Not searching
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

const App = (props: { sports: string[] }) => {
  const $sports = sr.state(new Set(props.sports));
  const $search = sr.state("");

  return sr.div({
    classes:
      "flex flex-col max-w-xl w-[90vw] h-96 items-center justify-start rounded-md shadow-lg bg-white",
    c: [
      // Heading
      sr.div({
        classes: "flex w-full items-center py-4 justify-start px-6",
        c: sr.h3({
          classes: "text-2xl font-bold text-black",
          c: "Favourite sport",
        }),
      }),

      // Search bar
      sr.div({
        classes: "flex w-full items-center justify-start px-4 gap-1",
        c: [
          Dropdown({
            to: sr.input(
              sr.use($search, (search) => ({
                classes:
                  "px-3 py-1 text-base rounded-md w-full outline-none select-none border-2 border-black/10",
                attr: {
                  placeholder: "Add a new favourite sport",
                  value: search,
                },
                on: {
                  input: (e) =>
                    ($search.current = (e.target as HTMLInputElement).value),
                },
              }))
            ),
            c: RecommendedSports({
              bind: { $sports, $search },
              click: (sport) => {
                $sports.current.add(sport);
                $sports.current = $sports.current;
                $search.current = "";
              },
            }),
          }),
        ],
      }),

      // Tags
      sr.div(
        sr.use($sports, (sports) => ({
          classes:
            "flex flex-wrap w-full items-center justify-start px-4 my-4 gap-2",
          c: [...sports].map((sport) =>
            Tag({
              sport,
              click: () => {
                $sports.current.delete(sport);
                $sports.current = $sports.current;
              },
            })
          ),
        }))
      ),
    ],
  });
};

sr.hydrate({
  into: document.getElementById("counter-app")!,
  with: App,
});
