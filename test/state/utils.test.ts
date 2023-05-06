//
//  utils.test.ts
//  seraph
//
//  Created by d-exclaimation on 15 Apr 2023
//

import { beforeEach, describe, expectTypeOf, it, vi } from "vitest";
import {
  all,
  effect,
  mutable,
  state,
  transition,
  zip,
  type Inner,
  type State,
} from "../../src/seraph";

describe("Zipped states", () => {
  const $simple = state(1);
  const $complex = state({ name: "John", age: 20 });

  const $zipped = zip($simple, $complex);

  beforeEach(() => {
    $simple.current = 1;
    $complex.current = { name: "John", age: 20 };
  });

  it("Should have the correct typing", () => {
    expectTypeOf($zipped).toEqualTypeOf<
      State<[Inner<typeof $simple>, Inner<typeof $complex>]>
    >();
  });

  it("Should start with the initial data", ({ expect }) => {
    expect($zipped.current).toEqual([1, { name: "John", age: 20 }]);
  });

  it("Should be updated when any of the states are updated", ({ expect }) => {
    $simple.current = 2;
    expect($zipped.current).toEqual([2, { name: "John", age: 20 }]);

    $complex.current = { name: "John", age: 21 };
    expect($zipped.current).toEqual([2, { name: "John", age: 21 }]);
  });

  it("Should emit the new state to all listeners", ({ expect }) => {
    const zippedListener = vi.fn<[Inner<typeof $zipped>], void>();

    const unsub = $zipped.subscribe(zippedListener);

    $simple.current = 2;
    $complex.current = { name: "John", age: 21 };

    expect(zippedListener).toHaveBeenCalledWith([2, { name: "John", age: 21 }]);

    unsub();
  });

  it("Should be subscribable with effect", ({ expect }) => {
    const zippedListener = vi.fn<[Inner<typeof $zipped>], void>();

    const unsub = effect($zipped, zippedListener);

    $simple.current = 2;
    $complex.current = { name: "John", age: 21 };

    expect(zippedListener).toHaveBeenCalledWith([2, { name: "John", age: 21 }]);

    unsub();
  });

  it("Should be able to unsubscribe from the state", ({ expect }) => {
    const zippedListener = vi.fn<[Inner<typeof $zipped>], void>();

    const unsub = $zipped.subscribe(zippedListener);

    unsub();

    $simple.current = 2;
    $complex.current = { name: "John", age: 21 };

    expect(zippedListener).toHaveBeenCalledTimes(2);
  });
});

describe("All states", () => {
  const $simple = state(1);
  const $complex = state({ name: "John", age: 20 });

  const $all = all({ simple: $simple, complex: $complex });

  beforeEach(() => {
    $simple.current = 1;
    $complex.current = { name: "John", age: 20 };
  });

  it("Should have the correct typing", () => {
    expectTypeOf($all).toEqualTypeOf<
      State<{ simple: Inner<typeof $simple>; complex: Inner<typeof $complex> }>
    >();
  });

  it("Should start with the initial data", ({ expect }) => {
    expect($all.current).toEqual({
      simple: 1,
      complex: { name: "John", age: 20 },
    });
  });

  it("Should be updated when any of the states are updated", ({ expect }) => {
    $simple.current = 2;
    expect($all.current).toEqual({
      simple: 2,
      complex: { name: "John", age: 20 },
    });

    $complex.current = { name: "John", age: 21 };
    expect($all.current).toEqual({
      simple: 2,
      complex: { name: "John", age: 21 },
    });
  });

  it("Should emit the new state to all listeners", ({ expect }) => {
    const allListener = vi.fn<[Inner<typeof $all>], void>();

    const unsub = $all.subscribe(allListener);

    $simple.current = 2;
    $complex.current = { name: "John", age: 21 };

    expect(allListener).toHaveBeenCalledWith({
      simple: 2,
      complex: { name: "John", age: 21 },
    });

    unsub();
  });

  it("Should be subscribable with effect", ({ expect }) => {
    const allListener = vi.fn<[Inner<typeof $all>], void>();

    const unsub = effect($all, allListener);

    $simple.current = 2;
    $complex.current = { name: "John", age: 21 };

    expect(allListener).toHaveBeenCalledWith({
      simple: 2,
      complex: { name: "John", age: 21 },
    });

    unsub();
  });

  it("Should be able to unsubscribe from the state", ({ expect }) => {
    const allListener = vi.fn<[Inner<typeof $all>], void>();

    const unsub = $all.subscribe(allListener);

    unsub();

    $simple.current = 2;
    $complex.current = { name: "John", age: 21 };

    expect(allListener).toHaveBeenCalledTimes(2);
  });
});

describe("Mutable states", () => {
  const $complex = mutable({ name: "John", age: 20 });

  beforeEach(() => {
    $complex.current = { name: "John", age: 20 };
  });

  it("Should have the correct typing", () => {
    expectTypeOf($complex).toEqualTypeOf<
      State<{ name: string; age: number }>
    >();
  });

  it("Should start with the initial data", ({ expect }) => {
    expect($complex.current).toEqual({ name: "John", age: 20 });
  });

  it("Should be updated when any of the properties are updated", ({
    expect,
  }) => {
    $complex.current.name = "Jane";
    expect($complex.current).toEqual({ name: "Jane", age: 20 });

    $complex.current.age = 21;
    expect($complex.current).toEqual({ name: "Jane", age: 21 });
  });

  it("Should emit the new state to all listeners", ({ expect }) => {
    const complexListener = vi.fn<[Inner<typeof $complex>], void>();

    const unsub = $complex.subscribe(complexListener);

    $complex.current.name = "Jane";
    $complex.current.age = 21;

    expect(complexListener).toHaveBeenCalledWith({ name: "Jane", age: 21 });

    unsub();
  });

  it("Should be subscribable with effect", ({ expect }) => {
    const complexListener = vi.fn<[Inner<typeof $complex>], void>();

    const unsub = effect($complex, complexListener);

    $complex.current.name = "Jane";
    $complex.current.age = 21;

    expect(complexListener).toHaveBeenCalledWith({ name: "Jane", age: 21 });

    unsub();
  });

  it("Should be able to unsubscribe from the state", ({ expect }) => {
    const complexListener = vi.fn<[Inner<typeof $complex>], void>();

    const unsub = $complex.subscribe(complexListener);

    unsub();

    $complex.current.name = "Jane";
    $complex.current.age = 21;

    expect(complexListener).toHaveBeenCalledTimes(1);
  });
});

describe("Transition states", () => {
  const $complex = state({ name: "John", age: 20 });
  const $updating = transition();

  beforeEach(() => {
    $complex.current = { name: "John", age: 20 };
  });

  it("Should have the correct typing", () => {
    expectTypeOf($updating).toEqualTypeOf<
      State<boolean> & { start: (action: () => Promise<void>) => void }
    >();
  });

  it("Should start with the initial data", ({ expect }) => {
    expect($updating.current).toEqual(false);
  });

  it("Should be true while an action is taking place", async ({ expect }) => {
    expect($updating.current).toEqual(false);

    $updating.start(() => new Promise((resolve) => setTimeout(resolve, 100)));

    expect($updating.current).toEqual(true);

    await new Promise((resolve) => setTimeout(resolve, 200));

    expect($updating.current).toEqual(false);
  });
});
