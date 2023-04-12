//
//  seraph.ts
//  seraph
//
//  Created by d-exclaimation on 11 Apr 2023
//

import { hydrate, load } from "./ssr";
import { all, from, memo, query, state, zip } from "./state";
import { html, mount, render, use } from "./ui";

const std = {
  state,
  all,
  zip,
  memo,
  from,
  query,
  hydrate,
  load,
  mount,
  use,
  render,
} as const;

export const sr = new Proxy({} as typeof html & typeof std, {
  get(_, key: keyof typeof std | keyof typeof html) {
    if (
      key === "state" ||
      key === "all" ||
      key === "zip" ||
      key === "memo" ||
      key === "from" ||
      key === "query" ||
      key === "hydrate" ||
      key === "load" ||
      key === "mount" ||
      key === "use" ||
      key === "render"
    ) {
      return std[key];
    }
    return html[key];
  },
});

export * from "./ssr";
export * from "./state";
export * from "./ui";
