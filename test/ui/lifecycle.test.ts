//
//  lifecycle.test.ts
//  seraph
//
//  Created by d-exclaimation on 15 Apr 2023
//

// @vitest-environment jsdom

import { beforeEach, describe, it, vi } from "vitest";
import { html, state, use } from "../../src/seraph";

describe("Lifecycle bindings", () => {
  const $test = state("");

  beforeEach(() => {
    $test.current = "";
  });

  it("Should set the props with initial value", ({ expect }) => {
    const divElement = html.div(
      use($test, (value) => ({
        attr: {
          "data-test": value,
        },
      }))
    );
    expect(divElement.getAttribute("data-test")).toBe("");
  });

  it("Should update props when state changes", ({ expect }) => {
    const divElement = html.div(
      use($test, (value) => ({
        attr: {
          "data-test": value,
        },
      }))
    );
    expect(divElement.getAttribute("data-test")).toBe("");

    $test.current = "test";

    expect(divElement.getAttribute("data-test")).toBe("test");
  });

  it("Should properly remove and add listener", ({ expect }) => {
    const clickListener = vi.fn<[Event]>();
    const divElement = html.div(
      use($test, (value) => ({
        on: value
          ? {
              click: value === "click" ? clickListener : undefined,
            }
          : undefined,
      }))
    );

    divElement.click();

    expect(clickListener).toBeCalledTimes(0);

    $test.current = "click";

    divElement.click();

    expect(clickListener).toBeCalledTimes(1);

    $test.current = "other";

    divElement.click();

    expect(clickListener).toBeCalledTimes(1);
  });
});
