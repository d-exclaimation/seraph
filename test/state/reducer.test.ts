//
//  core.test.ts
//  seraph
//
//  Created by d-exclaimation on 15 Apr 2023
//

import { beforeEach, describe, expectTypeOf, it, vi } from "vitest";
import { Inner, effect, reducer } from "../../src/export";

type CalcState = { count: number };
type CalcAction =
  | { type: "add"; payload: number }
  | { type: "sub"; payload: number }
  | { type: "mul"; payload: number }
  | { type: "div"; payload: number }
  | { type: "reset" };

describe("Reducer state", () => {
  const $calculator = reducer<CalcState, CalcAction>(
    ({ count }, action) => {
      switch (action.type) {
        case "add":
          return { count: count + action.payload };
        case "sub":
          return { count: count - action.payload };
        case "mul":
          return { count: count * action.payload };
        case "div":
          return { count: count / action.payload };
        case "reset":
          return { count: 0 };
      }
    },
    { count: 0 }
  );

  beforeEach(() => {
    $calculator.dispatch({ type: "reset" });
  });

  it("Should have the correct typing", () => {
    expectTypeOf($calculator.current).toEqualTypeOf<
      Inner<typeof $calculator>
    >();
  });

  it("Should start with the initial data", ({ expect }) => {
    expect($calculator.current.count).toBe(0);
    expect($calculator.current).toEqual({ count: 0 });
  });

  it("Should be able to update the state", ({ expect }) => {
    $calculator.dispatch({ type: "add", payload: 1 });
    expect($calculator.current.count).toBe(1);

    $calculator.dispatch({ type: "sub", payload: 1 });
    expect($calculator.current.count).toBe(0);

    $calculator.dispatch({ type: "mul", payload: 2 });
    expect($calculator.current.count).toBe(0);

    $calculator.dispatch({ type: "div", payload: 2 });
    expect($calculator.current.count).toBe(0);
  });

  it("Should emit the new state to all listeners", ({ expect }) => {
    const listener = vi.fn<[Inner<typeof $calculator>], void>();

    const unsub = $calculator.subscribe(listener);

    $calculator.dispatch({ type: "add", payload: 1 });

    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenCalledWith({ count: 1 });

    unsub();
  });

  it("Should be subscribable with effect", ({ expect }) => {
    const listener = vi.fn<[Inner<typeof $calculator>], void>();

    const unsub = effect($calculator, listener);

    $calculator.dispatch({ type: "add", payload: 1 });

    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenCalledWith({ count: 1 });

    unsub();
  });

  it("Should be able to unsubscribe from the state", ({ expect }) => {
    const listener = vi.fn<[Inner<typeof $calculator>], void>();

    const unsub = effect($calculator, listener);

    $calculator.dispatch({ type: "add", payload: 1 });

    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenCalledWith({ count: 1 });

    unsub();

    $calculator.dispatch({ type: "add", payload: 1 });

    expect(listener).toHaveBeenCalledTimes(2);
  });
});
