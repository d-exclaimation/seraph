import * as sr from "./seraph";

declare global {
  interface Window {
    seraph: () => typeof sr;
  }
}

if (typeof window !== "undefined") {
  window.seraph = () => sr;
}

export * from "./seraph";
