//
//  types.d.ts
//  seraph
//
//  Created by d-exclaimation on 15 Apr 2023
//

/**
 * Verify type test is true
 * @param T The test expression
 */
export type Expect<T extends true> = T;

/**
 * Check if two types are equal
 * @param X The first type
 * @param Y The second type
 * @returns true if equal, false otherwise
 */
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2
  ? true
  : false;

/**
 * Check if two types are not equal
 * @param X The first type
 * @param Y The second type
 * @returns true if not equal, false otherwise
 */
export type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true;
