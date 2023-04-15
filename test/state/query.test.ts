//
//  query.test.ts
//  seraph
//
//  Created by d-exclaimation on 15 Apr 2023
//

import { describe, it, vi } from "vitest";
import { QueryResult, effect, query } from "../../src/seraph";

describe("Query states", () => {
  it("Should start with idle status", ({ expect }) => {
    const $idle = query({
      queryFn: () => Promise.resolve(1),
    });

    expect($idle.current).toEqual({
      status: "idle",
    });
  });

  it("May start with sucess if initial is given", ({ expect }) => {
    const $success = query({
      queryFn: () => Promise.resolve(1),
      initial: 0,
    });

    expect($success.current).toEqual({
      status: "success",
      data: 0,
    });
  });

  it("Should run fetcher if enabled", async ({ expect }) => {
    const $fetcher = query({
      queryFn: () =>
        new Promise<number>((resolve) => setTimeout(() => resolve(1), 200)),
      enabled: true,
    });

    expect($fetcher.current).toEqual({
      status: "idle",
    });

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect($fetcher.current).toEqual({
      status: "loading",
    });

    await new Promise((resolve) => setTimeout(resolve, 300));

    expect($fetcher.current).toEqual({
      status: "success",
      data: 1,
    });
  });

  it("Should run callback on success", async ({ expect }) => {
    const success = vi.fn<[number], void>();
    const $fetcher = query({
      queryFn: () => Promise.resolve(1),
      on: {
        success,
      },
    });

    await $fetcher.refetch();

    expect(success).toHaveBeenCalledWith(1);
  });

  it("Should run callback on error", async ({ expect }) => {
    const error = vi.fn<[unknown], void>();
    const $fetcher = query({
      queryFn: () => Promise.reject("error"),
      on: {
        error,
      },
    });

    await $fetcher.refetch();

    expect(error).toHaveBeenCalledWith("error");
  });

  it("Should run callback on settled (success)", async ({ expect }) => {
    const settled = vi.fn<[number | undefined, unknown], void>();
    const $fetcher = query({
      queryFn: () => Promise.resolve(1),
      on: {
        settled,
      },
    });

    await $fetcher.refetch();

    expect(settled).toHaveBeenCalledWith(1);
  });

  it("Should run callback on settled (error)", async ({ expect }) => {
    const settled = vi.fn<[number | undefined, unknown], void>();
    const $fetcher = query({
      queryFn: () => Promise.reject("error"),
      on: {
        settled,
      },
    });

    await $fetcher.refetch();

    expect(settled).toHaveBeenCalledWith(undefined, "error");
  });

  it("Should rerun fetcher if retry is given", async ({ expect }) => {
    let count = 0;
    const error = vi.fn<[unknown], void>();
    const $fetcher = query({
      queryFn: () => {
        if (count < 2) {
          count++;
          return Promise.reject("error");
        }
        return Promise.resolve(1);
      },
      retry: 3,
      on: {
        error,
      },
    });

    await $fetcher.refetch();

    expect(error).toHaveBeenCalledTimes(2);

    expect($fetcher.current).toEqual({
      status: "success",
      data: 1,
    });
  });

  it("Should be able to retry until success", async ({ expect }) => {
    let count = 0;
    const error = vi.fn<[unknown], void>();
    const $fetcher = query({
      queryFn: () => {
        if (Math.random() < 0.5) {
          count++;
          return Promise.reject("error");
        }
        return Promise.resolve(1);
      },
      retry: true,
      on: {
        error,
      },
    });

    await $fetcher.refetch();

    expect(error).toHaveBeenCalledTimes(count);

    expect($fetcher.current).toEqual({
      status: "success",
      data: 1,
    });
  });

  it("Should be able to be invalidated", async ({ expect }) => {
    let count = 0;
    const $fetcher = query({
      queryFn: () => {
        count++;
        return Promise.resolve(count);
      },
    });

    await $fetcher.refetch();

    expect($fetcher.current).toEqual({
      status: "success",
      data: 1,
    });

    $fetcher.invalidate();

    await new Promise((resolve) => setTimeout(resolve, 10));

    expect($fetcher.current).toEqual({
      status: "success",
      data: 2,
    });
  });

  it("Should be emit the new state to all listeners", async ({ expect }) => {
    const fetchListener = vi.fn<[QueryResult<number>], void>();
    const $fetcher = query({
      queryFn: () => Promise.resolve(1),
    });

    const unsub = $fetcher.subscribe(fetchListener);

    expect(fetchListener).toHaveBeenCalledTimes(1);

    await $fetcher.refetch();

    expect(fetchListener).toHaveBeenCalledTimes(3);

    unsub();
  });

  it("Should be subscribable with effect", async ({ expect }) => {
    const fetchListener = vi.fn<[QueryResult<number>], void>();
    const $fetcher = query({
      queryFn: () => Promise.resolve(1),
    });

    const unsub = effect($fetcher, fetchListener);

    expect(fetchListener).toHaveBeenCalledTimes(1);

    await $fetcher.refetch();

    expect(fetchListener).toHaveBeenCalledTimes(3);

    unsub();
  });
});
