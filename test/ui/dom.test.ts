//
//  dom.test.ts
//  seraph
//
//  Created by d-exclaimation on 15 Apr 2023
//

// @vitest-environment jsdom

import { afterEach, beforeEach, describe, it } from "vitest";
import { html, hydrate, mount, render } from "../../src/seraph";

describe("DOM rendering", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("Should render element", ({ expect }) => {
    const divElement = html.div({});
    render(divElement, document.body);

    expect(document.body.innerHTML).toBe("<div></div>");
  });

  it("Should remove any old element", ({ expect }) => {
    const divElement = html.div({});
    render(divElement, document.body);
    const spanElement = html.span({});
    render(spanElement, document.body);

    expect(document.body.innerHTML).toBe("<span></span>");
  });

  it("Should be able to render nested element", ({ expect }) => {
    const divElement = html.div({ c: html.span({}) });
    render(divElement, document.body);

    expect(document.body.innerHTML).toBe("<div><span></span></div>");
  });
});

describe("DOM mounting", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("Should mount element", ({ expect }) => {
    const divElement = html.div({});
    mount(divElement, document.body);

    expect(document.body.innerHTML).toBe("<div></div>");
  });

  it("Should not remove any old element", ({ expect }) => {
    const divElement = html.div({});
    mount(divElement, document.body);
    const spanElement = html.span({});
    mount(spanElement, document.body);

    expect(document.body.innerHTML).toBe("<div></div><span></span>");
  });

  it("Should be able to mount nested element", ({ expect }) => {
    const divElement = html.div({ c: html.span({}) });
    mount(divElement, document.body);

    expect(document.body.innerHTML).toBe("<div><span></span></div>");
  });
});

describe("DOM hydrating", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="target">
      </div>
    `;
  });

  it("Should hydrate element", ({ expect }) => {
    hydrate("target", {
      classes: ["a", "b"],
      style: { color: "red" },
      attr: { "data-test": "test" },
      c: ["test"],
    });

    const result = document.getElementById("target");
    expect(result).not.toBeNull();

    expect(result!.classList.contains("a")).toBe(true);
    expect(result!.classList.contains("b")).toBe(true);
    expect(result!.style.color).toBe("red");
    expect(result!.getAttribute("data-test")).toBe("test");
    expect(result!.innerHTML).toBe("test");
  });

  it("Should hydrate element with function", ({ expect }) => {
    hydrate("target", ({ className }) => ({
      classes: [className, "a", "b"],
      style: { color: "red" },
      attr: { "data-test": "test" },
      c: ["test"],
    }));

    const result = document.getElementById("target");
    expect(result).not.toBeNull();

    expect(result!.classList.contains("a")).toBe(true);
    expect(result!.classList.contains("b")).toBe(true);
    expect(result!.style.color).toBe("red");
    expect(result!.getAttribute("data-test")).toBe("test");
    expect(result!.innerHTML).toBe("test");
  });

  it("Should not change any other elements", ({ expect }) => {
    const divElement = html.div({
      attr: { id: "target2" },
    });
    mount(divElement, document.body);
    const spanElement = html.span({
      attr: { id: "target3" },
    });
    mount(spanElement, document.body);

    hydrate("target", {
      classes: ["a", "b"],
      style: { color: "red" },
      attr: { "data-test": "test" },
      c: ["test"],
    });

    const result = document.getElementById("target");
    expect(result).not.toBeNull();

    expect(result!.classList.contains("a")).toBe(true);
    expect(result!.classList.contains("b")).toBe(true);
    expect(result!.style.color).toBe("red");
    expect(result!.getAttribute("data-test")).toBe("test");
    expect(result!.innerHTML).toBe("test");

    const result2 = document.getElementById("target2");
    expect(result2).not.toBeNull();

    expect(result2!.classList.contains("a")).toBe(false);
    expect(result2!.classList.contains("b")).toBe(false);
    expect(result2!.style.color).toBe("");
    expect(result2!.getAttribute("data-test")).toBe(null);
    expect(result2!.innerHTML).toBe("");

    const result3 = document.getElementById("target3");
    expect(result3).not.toBeNull();

    expect(result3!.classList.contains("a")).toBe(false);
    expect(result3!.classList.contains("b")).toBe(false);
    expect(result3!.style.color).toBe("");
    expect(result3!.getAttribute("data-test")).toBe(null);
    expect(result3!.innerHTML).toBe("");
  });
});
