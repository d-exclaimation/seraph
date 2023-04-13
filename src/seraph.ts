//
//  seraph.ts
//  seraph
//
//  Created by d-exclaimation on 11 Apr 2023
//

import { load, resource } from "./ssr";
import { all, effect, from, memo, query, state, zip } from "./state";
import { html, hydrate, mount, render, use } from "./ui";

const std = {
  state,
  all,
  zip,
  memo,
  from,
  query,
  mount,
  use,
  render,
  effect,
  hydrate,
  load,
  resource,
} as const;

export const sr = new Proxy({} as typeof html & typeof std, {
  get(_, key: keyof typeof std | keyof typeof html) {
    if (key === "state") return state;
    if (key === "all") return all;
    if (key === "zip") return zip;
    if (key === "memo") return memo;
    if (key === "from") return from;
    if (key === "query") return query;
    if (key === "load") return load;
    if (key === "mount") return mount;
    if (key === "use") return use;
    if (key === "render") return render;
    if (key === "effect") return effect;
    if (key === "hydrate") return hydrate;
    if (key === "resource") return resource;

    return html[key];
  },
});

export * from "./ssr";
export * from "./state";
export * from "./ui";
