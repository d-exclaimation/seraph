//
//  core.test.ts
//  seraph
//
//  Created by d-exclaimation on 15 Apr 2023
//

// @vitest-environment jsdom

import { afterEach, describe, expectTypeOf, it, vi } from "vitest";
import { apply, create } from "../../src/export";

describe("Apply props", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("Should apply classes to element", ({ expect }) => {
    document.body.innerHTML = `
      <div id="target"></div>
    `;

    const target = document.getElementById("target");
    expect(target).not.toBeNull();

    apply(target!, { classes: ["a", "b"] });

    expect(target!.classList.contains("a")).toBe(true);
    expect(target!.classList.contains("b")).toBe(true);

    apply(target!, { classes: "c" });

    expect(target!.className).toBe("c");
  });

  it("Should apply styles to element", ({ expect }) => {
    document.body.innerHTML = `
      <div id="target"></div>
    `;

    const target = document.getElementById("target");
    expect(target).not.toBeNull();

    apply(target!, { style: { color: "red" } });

    expect(target!.style.color).toBe("red");

    apply(target!, { style: { color: undefined } });

    expect(target!.style.color).toBe("");

    apply(target!, { style: { color: null as any } });

    expect(target!.style.color).toBe("");
  });

  it("Should apply attributes to element", ({ expect }) => {
    document.body.innerHTML = `
      <div id="target"></div>
    `;

    const target = document.getElementById("target");
    expect(target).not.toBeNull();

    apply(target!, { attr: { "data-test": "test" } });

    expect(target!.getAttribute("data-test")).toBe("test");

    apply(target!, { attr: { "data-test": "test2" } });

    expect(target!.getAttribute("data-test")).toBe("test2");

    apply(target!, { attr: { "data-test": undefined } });

    expect(target!.getAttribute("data-test")).toBe(null);
  });

  it("Should apply attributes directly if available", ({ expect }) => {
    document.body.innerHTML = `
      <input id="target"></input>
    `;
    const target = document.getElementById("target") as HTMLInputElement;
    expect(target).not.toBeNull();

    apply(target, { attr: { value: "test" } });

    expect(target.value).toBe("test");
  });

  it("Should apply text children to element", ({ expect }) => {
    document.body.innerHTML = `
      <div id="target"></div>
    `;

    const target = document.getElementById("target");
    expect(target).not.toBeNull();

    apply(target!, { c: ["test"] });

    expect(target!.innerHTML).toBe("test");
  });

  it("Should apply html children to element", ({ expect }) => {
    document.body.innerHTML = `
      <div id="target"></div>
    `;

    const target = document.getElementById("target");
    expect(target).not.toBeNull();

    apply(target!, { c: document.createElement("span") });

    expect(target!.innerHTML).toBe("<span></span>");
  });

  it("Should apply event listeners to element", ({ expect }) => {
    document.body.innerHTML = `
      <div id="target"></div>
    `;

    const target = document.getElementById("target");
    expect(target).not.toBeNull();

    const listener = vi.fn<[Event]>();
    apply(target!, { on: { click: listener } });

    target!.click();
    expect(listener).toBeCalled();

    target!.removeEventListener("click", listener);
  });
});

describe("Create component", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("Should create element with tag", ({ expect }) => {
    const elem = create("div", {});
    expect(elem.tagName).toBe("DIV");

    const elem2 = create("span", {});
    expect(elem2.tagName).toBe("SPAN");

    const elem3 = create("input", {});
    expect(elem3.tagName).toBe("INPUT");

    const elem4 = create("textarea", {});
    expect(elem4.tagName).toBe("TEXTAREA");

    const elem5 = create("button", {});
    expect(elem5.tagName).toBe("BUTTON");
  });

  it("Should have the correct types based on tag", () => {
    const divElem = create("div", {});

    expectTypeOf(divElem).toEqualTypeOf<HTMLDivElement>();

    const spanElem = create("span", {});

    expectTypeOf(spanElem).toEqualTypeOf<HTMLSpanElement>();

    const inputElem = create("input", {});

    expectTypeOf(inputElem).toEqualTypeOf<HTMLInputElement>();

    const textareaElem = create("textarea", {});

    expectTypeOf(textareaElem).toEqualTypeOf<HTMLTextAreaElement>();

    const buttonElem = create("button", {});

    expectTypeOf(buttonElem).toEqualTypeOf<HTMLButtonElement>();
  });

  it("Should create element with props", ({ expect }) => {
    const elem = create("div", {
      classes: ["a", "b"],
      style: { color: "red" },
      attr: { "data-test": "test" },
      c: ["test"],
    });

    expect(elem.classList.contains("a")).toBe(true);
    expect(elem.classList.contains("b")).toBe(true);
    expect(elem.style.color).toBe("red");
    expect(elem.getAttribute("data-test")).toBe("test");
    expect(elem.innerHTML).toBe("test");
  });
});
