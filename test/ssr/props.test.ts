//
//  props.test.ts
//  seraph
//
//  Created by d-exclaimation on 15 Apr 2023
//

// @vitest-environment jsdom

import { afterEach, describe, it } from "vitest";
import { props, resource } from "../../src/export";

describe("Load SSR props", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("Should load state from `sr-props` attribute", ({ expect }) => {
    document.body.innerHTML = `
      <div id="target" sr-props='{"a": 1, "b": 2}'></div>
    `;

    const $a = props<{ a: number; b: number }>("target");
    expect($a.current).toEqual({ a: 1, b: 2 });
  });

  it("Should default to empty object", ({ expect }) => {
    document.body.innerHTML = `
      <div id="target"></div>
    `;

    const $a = props<{}>("target");
    expect($a.current).toEqual({});
  });
});

describe("Resource SSR props", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("Should load state from text content attribute", ({ expect }) => {
    document.body.innerHTML = `
      <script id="target" type="application/json">
        {"a": 1, "b": 2}
      </script>
    `;

    const $a = resource<{ a: number; b: number }>("target");
    expect($a.current).toEqual({ a: 1, b: 2 });
  });

  it("Should default to empty object", ({ expect }) => {
    document.body.innerHTML = `
      <script id="target" type="application/json"></script>
    `;

    const $a = resource<{}>("target");
    expect($a.current).toEqual({});
  });
});
