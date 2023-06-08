import { state } from "@lib/core";
import { routing } from "@lib/router";

export const $count = state(0);
export const router = routing.browser();
