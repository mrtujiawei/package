/**
 *
 * @filename packages/type-util/index.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2025-12-15 15:54:11
 */

export type Primitive =
  | string
  | number
  | bigint
  | boolean
  | symbol
  | null
  | undefined;

export type Falsy = false | '' | 0 | null | undefined;

export type Nullish = null | undefined;

export type SetIntersection<A, B> = A extends B ? A : never;

export type SetDifference<A, B> = A extends B ? never : A;

export type SetComplement<A, A1 extends A> = SetDifference<A, A1>;

export type SymmetricDifference<A, B> = SetDifference<A | B, A & B>;

export type NonUndefined<A> = A extends undefined ? never : A;

// TODO 看不懂
export type FunctionKeys<T extends object> = {
  [K in keyof T]-?: NonUndefined<T[K]> extends Function ? K : never;
}[keyof T];

