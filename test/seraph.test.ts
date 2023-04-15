//
//  seraph.test.ts
//  seraph
//
//  Created by d-exclaimation on 15 Apr 2023
//

import { describe, it } from "vitest";

import { sr } from "../src/seraph";

describe("Seraph", () => {
  it("Should be able to create a state", ({ expect }) => {
    const $test = sr.state("test");
    expect($test.current).toBe("test");
  });

  it("Should be able to create a computed", ({ expect }) => {
    const $simple = sr.state("test");
    const $test = sr.from($simple, (simple) => simple + "test");
    expect($test.current).toBe("testtest");
  });

  it("Should be able to create a memo", ({ expect }) => {
    const $simple = sr.state("test");
    const $test = sr.memo($simple, (simple) => simple + "test");
    expect($test.current).toBe("testtest");
  });

  it("Should be able to create a zip", ({ expect }) => {
    const $simple = sr.state("test");
    const $test = sr.zip($simple);
    expect($test.current).toEqual(["test"]);
  });

  it("Should be able to create a all", ({ expect }) => {
    const $simple = sr.state("test");
    const $test = sr.all({ simple: $simple });
    expect($test.current).toEqual({ simple: "test" });
  });

  it("Should be able to create a query", ({ expect }) => {
    const $test = sr.query({
      queryFn: () => Promise.resolve("test"),
    });

    expect($test.current).toStrictEqual({ status: "idle" });
  });

  it("Should be have all the other functions", ({ expect }) => {
    expect(sr.load).toBeDefined();
    expect(sr.resource).toBeDefined();
    expect(sr.mount).toBeDefined();
    expect(sr.use).toBeDefined();
    expect(sr.render).toBeDefined();
    expect(sr.effect).toBeDefined();
    expect(sr.hydrate).toBeDefined();
  });

  it("Should be have function to create component", ({ expect }) => {
    expect(sr.div).toBeDefined();
    expect(sr.span).toBeDefined();
    expect(sr.p).toBeDefined();
    expect(sr.h1).toBeDefined();
    expect(sr.h2).toBeDefined();
  });
});
