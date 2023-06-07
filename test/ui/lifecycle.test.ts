//
//  lifecycle.test.ts
//  seraph
//
//  Created by d-exclaimation on 15 Apr 2023
//

// @vitest-environment jsdom

import { beforeEach, describe, it } from "vitest";
import { html, state } from "../../src/seraph";

describe("Lifecycle bindings", () => {
  const $test = state("");

  beforeEach(() => {
    $test.current = "";
  });

  it("Should set the props with initial value", ({ expect }) => {
    const divElement = html.div({
      attr: {
        "data-test": $test,
      },
    });
    expect(divElement.getAttribute("data-test")).toBe("");
  });

  it("Should update props when state changes", ({ expect }) => {
    const divElement = html.div({
      attr: {
        "data-test": $test,
      },
    });
    expect(divElement.getAttribute("data-test")).toBe("");

    $test.current = "test";

    expect(divElement.getAttribute("data-test")).toBe("test");
  });
});
