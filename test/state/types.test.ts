//
//  types.test.ts
//  seraph
//
//  Created by d-exclaimation on 15 Apr 2023
//

import { describe, it } from "vitest";
import type { All, Inner, State, Zipped } from "../../src/state";
import type { Equal, Expect, NotEqual } from "../utils/types";

describe("State related types", () => {
  it("Should be able to infer the inner type of a state", () => {
    type _ = [
      Expect<
        Equal<
          State<number>,
          {
            current: number;
            readonly subscribe: (
              listener: (curr: number) => void
            ) => () => void;
          }
        >
      >,
      Expect<Equal<Inner<State<number>>, number>>,
      Expect<
        Equal<
          Inner<State<{ name: string; age: number }>>,
          { name: string; age: number }
        >
      >
    ];
  });

  it("Should be able to infer the inner type of a zipped state", () => {
    type _ = [
      Expect<Equal<Zipped<[State<number>, State<string>]>, [number, string]>>,
      Expect<
        Equal<
          Zipped<[State<{ a: number; b: string }>, State<string>]>,
          [{ a: number; b: string }, string]
        >
      >,
      Expect<Equal<Zipped<[State<number>]>, [number]>>,
      Expect<NotEqual<Zipped<[State<number>, State<number>]>, number[]>>
    ];
  });

  it("Should be able to infer the inner type of a all state", () => {
    type _ = [
      Expect<
        Equal<
          All<{ a: State<number>; b: State<string> }>,
          { a: number; b: string }
        >
      >,
      Expect<
        Equal<
          All<{ a: State<{ a: number; b: string }>; b: State<string> }>,
          { a: { a: number; b: string }; b: string }
        >
      >,
      Expect<Equal<All<{ a: State<number> }>, { a: number }>>,
      Expect<NotEqual<All<{ a: State<number>; b: State<number> }>, number[]>>,
      Expect<
        NotEqual<All<{ a: State<number>; b: State<string> }>, [number, string]>
      >
    ];
  });
});
