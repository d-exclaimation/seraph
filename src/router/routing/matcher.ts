//
//  matcher.ts
//  seraph
//
//  Created by d-exclaimation on 08 Jun 2023
//

/**
 * A component for a path in the router
 */
export type PathComponent =
  | { __kind: "exact"; value: string }
  | { __kind: "param"; name: string }
  | { __kind: "wildcard" }
  | { __kind: "any" };

/**
 * A full path in the router consists of multiple path components
 */
export type Path = PathComponent[];

/**
 * Create a path from a string
 * @param href - Path string
 * @returns Path consisting of path components
 */
export const path = (href: string) =>
  href
    .split("/")
    .filter((p) => p)
    .map((p) => {
      if (p.startsWith(":")) {
        return { __kind: "param", name: p.slice(1) };
      }
      if (p === "*") {
        return { __kind: "wildcard" };
      }
      if (p === "**") {
        return { __kind: "any" };
      }
      return { __kind: "exact", value: p };
    }) satisfies Path;

/**
 * Match result
 * @property matched - Whether the path matched
 * @property params - Params object if matched
 */
export type MatchResult =
  | { matched: true; params: Record<string, string> }
  | { matched: false };

/**
 * Match a path with a href using path component matching algorithm
 * @param path - Path to match
 * @param href - Href to match
 * @returns Params object if matched, false otherwise
 */
export function match(path: Path, href: string): MatchResult {
  const parts = href.split("/").filter((p) => p);
  const params: Record<string, string> = {};

  if (path.length > parts.length) return { matched: false };
  if (!path.length && parts.length) return { matched: false };

  for (let i = 0; i < path.length; i++) {
    const p = path[i];
    const part = parts[i];

    if (p.__kind === "exact" && p.value !== part) return { matched: false };
    if (p.__kind === "param") {
      params[p.name] = part;
      continue;
    }
    if (p.__kind === "wildcard") continue;
    if (p.__kind === "any") return { matched: true, params };
  }

  if (parts.length > path.length) return { matched: false };

  return { matched: true, params };
}
