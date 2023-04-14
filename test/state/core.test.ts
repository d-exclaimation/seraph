//
//  core.test.ts
//  seraph
//
//  Created by d-exclaimation on 15 Apr 2023
//

import { beforeEach, describe, expectTypeOf, it, vi } from "vitest";
import { Inner, State, from, state } from "../../src/seraph";

describe("State primitives", () => {
  const $simple = state(0);
  const $complex = state({ name: "John", age: 20 });

  beforeEach(() => {
    $simple.current = 0;
    $complex.current = { name: "John", age: 20 };
  });

  it("Should have the correct typing", () => {
    expectTypeOf($simple).toEqualTypeOf<State<number>>();
    expectTypeOf($complex).toEqualTypeOf<
      State<{ name: string; age: number }>
    >();

    expectTypeOf($simple.current).toEqualTypeOf<Inner<typeof $simple>>();
    expectTypeOf($complex.current).toEqualTypeOf<Inner<typeof $complex>>();
  });

  it("Should start with the initial data", ({ expect }) => {
    expect($simple.current).toBe(0);
    expect($complex.current).toEqual({ name: "John", age: 20 });
  });

  it("Should be able to update the state", ({ expect }) => {
    $simple.current = 1;
    $complex.current = { name: "John", age: 21 };

    expect($simple.current).toBe(1);
    expect($complex.current).toEqual({ name: "John", age: 21 });
  });

  it("Should emit the new state to all listeners", ({ expect }) => {
    const simpleListener = vi.fn<[Inner<typeof $simple>], void>();
    const complexListener = vi.fn<[Inner<typeof $complex>], void>();

    const unsubs = [
      $simple.subscribe(simpleListener),
      $complex.subscribe(complexListener),
    ];

    $simple.current = 2;
    $complex.current = { name: "John", age: 22 };

    expect(simpleListener).toHaveBeenCalledWith(2);
    expect(complexListener).toHaveBeenCalledWith({ name: "John", age: 22 });

    unsubs.forEach((unsub) => unsub());
  });

  it("Should be able to unsubscribe from the state", ({ expect }) => {
    const simpleListener = vi.fn<[Inner<typeof $simple>], void>();
    const complexListener = vi.fn<[Inner<typeof $complex>], void>();

    const unsubs = [
      $simple.subscribe(simpleListener),
      $complex.subscribe(complexListener),
    ];

    $simple.current = 3;
    $complex.current = { name: "John", age: 23 };

    expect(simpleListener).toHaveBeenCalledWith(3);
    expect(complexListener).toHaveBeenCalledWith({ name: "John", age: 23 });

    unsubs.forEach((unsub) => unsub());

    $simple.current = 4;

    expect(simpleListener).toHaveBeenCalledTimes(2);

    $complex.current = { name: "John", age: 24 };

    expect(complexListener).toHaveBeenCalledTimes(2);
  });

  it("Should only emit the new state to the listeners for itself", ({
    expect,
  }) => {
    const simpleListener = vi.fn<[Inner<typeof $simple>], void>();
    const complexListener = vi.fn<[Inner<typeof $complex>], void>();

    const unsubs = [
      $simple.subscribe(simpleListener),
      $complex.subscribe(complexListener),
    ];

    $simple.current = 5;

    expect(simpleListener).toHaveBeenCalledWith(5);
    expect(complexListener).toHaveBeenCalledTimes(1);

    $complex.current = { name: "John", age: 25 };

    expect(simpleListener).toHaveBeenCalledTimes(2);
    expect(complexListener).toHaveBeenCalledWith({ name: "John", age: 25 });

    unsubs.forEach((unsub) => unsub());
  });

  it("Should only emit the new state if `current` is reassigned", ({
    expect,
  }) => {
    const complexListener = vi.fn<[Inner<typeof $complex>], void>();

    const unsubs = [$complex.subscribe(complexListener)];

    expect(complexListener).toHaveBeenCalledTimes(1);

    $complex.current.name = "John";
    $complex.current.age = 25;

    expect(complexListener).toHaveBeenCalledTimes(1);

    $complex.current = $complex.current;

    expect(complexListener).toHaveBeenCalledTimes(2);

    unsubs.forEach((unsub) => unsub());
  });
});

describe("Computed states", () => {
  const $simple = state(0);

  const $computed = from($simple, (simple) => simple * 2);

  beforeEach(() => {
    $simple.current = 0;
  });

  it("Should have the correct typing", () => {
    expectTypeOf($computed).toEqualTypeOf<State<number>>();

    expectTypeOf($computed.current).toEqualTypeOf<Inner<typeof $computed>>();
  });

  it("Should start with the initial data given by the original state", ({
    expect,
  }) => {
    expect($computed.current).toBe(0);
  });

  it("Should be updated based on changes to the original state", ({
    expect,
  }) => {
    $simple.current = 1;

    expect($computed.current).toBe(2);
  });

  it("Should emit the new state to all listeners", ({ expect }) => {
    const computedListener = vi.fn<[Inner<typeof $computed>], void>();

    const unsub = $computed.subscribe(computedListener);

    $simple.current = 2;

    expect(computedListener).toHaveBeenCalledWith(4);

    unsub();
  });

  it("Should be able to unsubscribe from the state", ({ expect }) => {
    const computedListener = vi.fn<[Inner<typeof $computed>], void>();

    const unsub = $computed.subscribe(computedListener);

    $simple.current = 3;

    expect(computedListener).toHaveBeenCalledWith(6);

    unsub();

    $simple.current = 4;

    expect(computedListener).toHaveBeenCalledTimes(2);
  });
});
