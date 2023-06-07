//
//  base.test.ts
//  seraph
//
//  Created by d-exclaimation on 15 Apr 2023
//

// @vitest-environment jsdom

import { describe, expectTypeOf, it } from "vitest";
import { html } from "../../src/seraph";

describe("Base html components", () => {
  it("Should create element with tag", ({ expect }) => {
    const divElement = html["div"]({});
    expect(divElement.tagName).toBe("DIV");
    expectTypeOf(divElement).toEqualTypeOf<HTMLDivElement>();

    const spanElement = html["span"]({});
    expect(spanElement.tagName).toBe("SPAN");
    expectTypeOf(spanElement).toEqualTypeOf<HTMLSpanElement>();

    const pElement = html["p"]({});
    expect(pElement.tagName).toBe("P");
    expectTypeOf(pElement).toEqualTypeOf<HTMLParagraphElement>();

    const h1Element = html["h1"]({});
    expect(h1Element.tagName).toBe("H1");
    expectTypeOf(h1Element).toEqualTypeOf<HTMLHeadingElement>();

    const h2Element = html["h2"]({});
    expect(h2Element.tagName).toBe("H2");
    expectTypeOf(h2Element).toEqualTypeOf<HTMLHeadingElement>();

    const h3Element = html["h3"]({});
    expect(h3Element.tagName).toBe("H3");
    expectTypeOf(h3Element).toEqualTypeOf<HTMLHeadingElement>();

    const h4Element = html["h4"]({});
    expect(h4Element.tagName).toBe("H4");
    expectTypeOf(h4Element).toEqualTypeOf<HTMLHeadingElement>();

    const h5Element = html["h5"]({});
    expect(h5Element.tagName).toBe("H5");
    expectTypeOf(h5Element).toEqualTypeOf<HTMLHeadingElement>();

    const h6Element = html["h6"]({});
    expect(h6Element.tagName).toBe("H6");
    expectTypeOf(h6Element).toEqualTypeOf<HTMLHeadingElement>();

    const aElement = html["a"]({});
    expect(aElement.tagName).toBe("A");
    expectTypeOf(aElement).toEqualTypeOf<HTMLAnchorElement>();

    const imgElement = html["img"]({});
    expect(imgElement.tagName).toBe("IMG");
    expectTypeOf(imgElement).toEqualTypeOf<HTMLImageElement>();

    const buttonElement = html["button"]({});
    expect(buttonElement.tagName).toBe("BUTTON");
    expectTypeOf(buttonElement).toEqualTypeOf<HTMLButtonElement>();

    const inputElement = html["input"]({});
    expect(inputElement.tagName).toBe("INPUT");
    expectTypeOf(inputElement).toEqualTypeOf<HTMLInputElement>();

    const textareaElement = html["textarea"]({});
    expect(textareaElement.tagName).toBe("TEXTAREA");
    expectTypeOf(textareaElement).toEqualTypeOf<HTMLTextAreaElement>();

    const selectElement = html["select"]({});
    expect(selectElement.tagName).toBe("SELECT");
    expectTypeOf(selectElement).toEqualTypeOf<HTMLSelectElement>();

    const optionElement = html["option"]({});
    expect(optionElement.tagName).toBe("OPTION");
    expectTypeOf(optionElement).toEqualTypeOf<HTMLOptionElement>();

    const labelElement = html["label"]({});
    expect(labelElement.tagName).toBe("LABEL");
    expectTypeOf(labelElement).toEqualTypeOf<HTMLLabelElement>();

    const formElement = html["form"]({});
    expect(formElement.tagName).toBe("FORM");
    expectTypeOf(formElement).toEqualTypeOf<HTMLFormElement>();

    const ulElement = html["ul"]({});
    expect(ulElement.tagName).toBe("UL");
    expectTypeOf(ulElement).toEqualTypeOf<HTMLUListElement>();

    const liElement = html["li"]({});
    expect(liElement.tagName).toBe("LI");
    expectTypeOf(liElement).toEqualTypeOf<HTMLLIElement>();

    const tableElement = html["table"]({});
    expect(tableElement.tagName).toBe("TABLE");
    expectTypeOf(tableElement).toEqualTypeOf<HTMLTableElement>();

    const theadElement = html["thead"]({});
    expect(theadElement.tagName).toBe("THEAD");
    expectTypeOf(theadElement).toEqualTypeOf<HTMLTableSectionElement>();

    const tbodyElement = html["tbody"]({});
    expect(tbodyElement.tagName).toBe("TBODY");
    expectTypeOf(tbodyElement).toEqualTypeOf<HTMLTableSectionElement>();

    const tfootElement = html["tfoot"]({});
    expect(tfootElement.tagName).toBe("TFOOT");
    expectTypeOf(tfootElement).toEqualTypeOf<HTMLTableSectionElement>();

    const trElement = html["tr"]({});
    expect(trElement.tagName).toBe("TR");
    expectTypeOf(trElement).toEqualTypeOf<HTMLTableRowElement>();

    const thElement = html["th"]({});
    expect(thElement.tagName).toBe("TH");
    expectTypeOf(thElement).toEqualTypeOf<HTMLTableCellElement>();

    const tdElement = html["td"]({});
    expect(tdElement.tagName).toBe("TD");
    expectTypeOf(tdElement).toEqualTypeOf<HTMLTableCellElement>();

    const styleElement = html["style"]({});
    expect(styleElement.tagName).toBe("STYLE");
    expectTypeOf(styleElement).toEqualTypeOf<HTMLStyleElement>();

    const scriptElement = html["script"]({});
    expect(scriptElement.tagName).toBe("SCRIPT");
    expectTypeOf(scriptElement).toEqualTypeOf<HTMLScriptElement>();
  });
});
