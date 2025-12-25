/**
 *
 * @filename packages/type-challenges/type.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2025-12-12 10:04:02
 */

/**
 * disable Distributive Conditional Types
 * 1. <T>() => T extends X ? 1 : 2
 * 2. [T] extends [never]
 *
 * extends 前的类型是范型 才会触发 Distrubute
 */

export type MyPick<O, K extends keyof O> = {
  [P in K]: O[P];
};

export type MyOmit<T extends object, K extends keyof T> = MyPick<
  T,
  Exclude<keyof T, K>
>;

// 特殊的 as
// 可以用来限制 P 的范围
// export type MyOmit<T, K extends keyof T> = {
//   [P in keyof T as P extends K ? never : P]: T[P];
// };

export type MyReadonly<T> = {
  readonly [K in keyof T]: T[K];
};

/**
 * 部分 readonly
 */
export type MyReadonly2<T, K extends keyof T = keyof T> = Omit<T, K> &
  Readonly<Pick<T, K>>;

export type TupleToObject<T extends readonly any[]> = {
  [K in T[number]]: K;
};

export type First<T extends any[]> = T extends [infer F, ...infer _R]
  ? F
  : never;

export type Length<T extends any[]> = T['length'];

export type MyExclude<T, U> = T extends U ? never : T;

export type MyAwaited<T> = T extends PromiseLike<infer R> ? MyAwaited<R> : T;

export type If<C, T, F> = C extends true ? T : F;

type Ary = readonly any[];
export type Concat<T extends Ary, U extends Ary> = [...T, ...U];

/**
 * 不会对函数参数里的条件类型做分布式处理
 */
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;

export type NotEqual<X, Y> = true extends Equal<X, Y> ? false : true;

export type Includes<T extends readonly unknown[], U> = T extends [
  infer First,
  ...infer Rest,
]
  ? Equal<First, U> extends true
    ? true
    : Includes<Rest, U>
  : false;

export type Push<T extends any[], U> = [...T, U];

export type Unshift<T extends any[], U> = [U, ...T];

export type MyParameters<T extends (...args: any[]) => any> = T extends (
  ...args: infer A
) => any
  ? A
  : unknown;

export type MyReturnType<T> = T extends (...args: any[]) => infer R
  ? R
  : unknown;

export type DeepReadonly<T> = keyof T extends never
  ? T
  : {
      readonly [P in keyof T]: DeepReadonly<T[P]>;
    };

export type TupleToUnion<T> = T extends Array<infer V> ? V : unknown;

/**
 * 非常厉害的类型体操
 */
export type Chainable<T = unknown> = {
  option: <K extends string, V>(
    key: K extends keyof T ? never : K,
    value: V,
  ) => Chainable<Omit<T, K> & Record<K, V>>;
  get: () => T;
};

export type Last<T extends any[]> = [never, ...T][T['length']];

export type Pop<T extends any[]> = T extends [...infer A, any] ? A : never;

export type PromiseAll = <T extends any[]>(
  values: readonly [...T],
) => Promise<{ [K in keyof T]: Awaited<T[K]> }>;

export type LookUp<U, T> = U extends { type: T } ? U : never;

type Space = ' ' | '\t' | '\n';
export type TrimLeft<S extends string> = S extends `${Space}${infer L}`
  ? TrimLeft<L>
  : S;

export type TrimRight<S extends string> = S extends `${infer L}${Space}`
  ? TrimRight<L>
  : S;

export type Trim<S extends string> = TrimLeft<TrimRight<S>>;

export type MyCapitalize<S extends string> = S extends `${infer F}${infer R}`
  ? `${Uppercase<F>}${R}`
  : S;

export type Replace<
  S extends string,
  From extends string,
  To extends string,
> = From extends ''
  ? S
  : S extends `${infer V}${From}${infer R}`
    ? `${V}${To}${R}`
    : S;

export type ReplaceAll<
  S extends string,
  From extends string,
  To extends string,
> = From extends ''
  ? S
  : S extends `${infer L}${From}${infer R}`
    ? `${L}${To}${ReplaceAll<R, From, To>}`
    : S;

export type AppendArgument<
  Fn extends (...args: any[]) => unknown,
  A,
> = Fn extends (...args: infer Args) => infer R
  ? (...args: [...Args, A]) => R
  : never;

/**
 * 递归
 * 字符串转字符串数组
 */
export type LengthOfString<
  S extends string,
  T extends string[] = [],
> = S extends `${infer F}${infer R}`
  ? LengthOfString<R, [...T, F]>
  : T['length'];

export type Flatten<T extends any[]> = T extends [infer F, ...infer R]
  ? F extends any[]
    ? [...Flatten<F>, ...Flatten<R>]
    : [F, ...Flatten<R>]
  : T;

export type AppendToObject<T extends object, U extends keyof any, V> = {
  [K in keyof T | U]: K extends keyof T ? T[K] : V;
};

export type Absolute<T extends number | string | bigint> =
  `${T}` extends `-${infer S}` ? `${S}` : `${T}`;

export type StringToUnion<T extends string> = T extends `${infer A}${infer B}`
  ? A | StringToUnion<B>
  : never;

export type Merge<F extends object, S extends object> = {
  [K in keyof F | keyof S]: K extends keyof S
    ? S[K]
    : K extends keyof F
      ? F[K]
      : never;
};

export type IsAny<T> = 0 extends 1 & T ? true : false;

export type Get<T, K> = K extends keyof T
  ? T[K]
  : K extends `${infer KF}.${infer KR}`
    ? Get<Get<T, KF>, KR>
    : never;

export type Filter<T extends any[], P> = T extends [infer F, ...infer R]
  ? F extends P
    ? [F, ...Filter<R, P>]
    : Filter<R, P>
  : [];

/**
 * U = XS[number] 将类型混合
 * U extends U ? keyof U : never 获取所有的key
 */
export type MergeAll<
  XS extends object[],
  U = XS[number],
  Keys extends PropertyKey = U extends U ? keyof U : never,
> = {
  [K in Keys]: U extends U ? U[K & keyof U] : never;
};

export type PublicType<T extends object> = {
  [P in keyof T as P extends `_${any}` ? never : P]: T[P];
};

export type DeepOmit<O, K> = K extends keyof O
  ? Omit<O, K>
  : K extends `${infer A}.${infer B}`
    ? {
        [Key in keyof O]: A extends Key ? DeepOmit<O[Key], B> : O[Key];
      }
    : O;

export type IsNever<T> = [T] extends [never] ? true : false;

/**
 * 如果是 联合类型 会自动扩展
 * 导致 C extends T 出现 false 值
 */
type IsUnionImpl<T, C extends T = T> = (
  T extends T ? (C extends T ? true : unknown) : never
) extends true
  ? false
  : true;

export type IsUnion<T> = IsUnionImpl<T>;

export type Combs<T extends string[]> = T extends [
  infer A extends string,
  ...infer B extends string[],
]
  ? `${A} ${B[number]}` | Combs<B>
  : never;

export type ToPrimitive<T> = T extends Function
  ? Function
  : T extends object
    ? {
        [Key in keyof T]: ToPrimitive<T[Key]>;
      }
    : T extends { valueOf: () => infer P }
      ? P
      : T;

export type DeepMutable<T extends Record<keyof any, any>> = T extends (
  ...args: any[]
) => any
  ? T
  : {
      -readonly [K in keyof T]: DeepMutable<T[K]>;
    };

export type DropChar<S, C extends string> = S extends `${infer L}${C}${infer R}`
  ? DropChar<`${L}${R}`, C>
  : S;

export type EndsWith<
  T extends string,
  U extends string,
> = T extends `${string}${U}` ? true : false;

export type Integer<T extends number> = `${T}` extends `${bigint}` ? T : never;

export type Flip<T extends Record<string, string | number | boolean>> = {
  [K in keyof T as `${T[K]}`]: K;
};

export type IndexOf<
  T extends unknown[],
  U,
  I extends number[] = [],
> = I['length'] extends T['length']
  ? -1
  : Equal<T[I['length']], U> extends true
    ? I['length']
    : IndexOf<T, U, [...I, number]>;

export type Join<
  T extends string[],
  U extends string | number = ',',
> = T extends [infer A, ...infer R extends string[]]
  ? `${A & string}${R['length'] extends 0 ? '' : U}${Join<R, U>}`
  : '';

/**
 * 生成从 0  到 V 的所有数字
 */
export type Range<
  V extends number,
  A extends unknown[] = [],
  E extends number = 0,
> = A['length'] extends V ? E | V : Range<V, [...A, unknown], E | A['length']>;

export type NumberRange<L extends number, H extends number> =
  | L
  | Exclude<Range<H>, Range<L>>;

export type Split<
  T extends string,
  C extends string,
> = T extends `${infer A}${C}${infer B}` ? A | Split<B, C> : T;

type PickParams<T extends string> = T extends `:${infer P}` ? P : never;

/**
 * type ParseUrlParams<T> = T extends `${string}:${infer R}`
 *  ? R extends `${infer P}/${infer L}`
 *  ? P | ParseUrlParams<L>
 *  : R
 *  : never
 */
export type ParseUrlParams<T extends string> = PickParams<Split<T, '/'>>;

export type GetMiddleElement<T extends unknown[]> = T['length'] extends
  | 0
  | 1
  | 2
  ? T
  : T extends [infer _A, ...infer R, infer _B]
    ? GetMiddleElement<R>
    : never;

/**
 * K extends K 触发联合类型的分发
 */
export type ObjectEntries<T, U = Required<T>> = {
  [K in keyof U]: [K, U[K] extends never ? undefined : U[K]];
}[keyof U];

/**
 * 根据值类型过滤
 */
export type OmitByType<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K];
};

export type Shift<T extends unknown[]> = T extends [infer _A, ...infer R]
  ? R
  : T;

export type TupleToNestedObject<T, U> = T extends [infer K, ...infer R]
  ? {
      [k in K & string]: TupleToNestedObject<R, U>;
    }
  : U;

export type Reverse<T extends unknown[]> = T extends [infer F, ...infer L]
  ? [...Reverse<L>, F]
  : [];

export type Mutable<T extends object> = {
  -readonly [K in keyof T]: T[K];
};

export type Triangular<
  N extends number,
  T extends unknown[] = [],
  V extends unknown[] = [],
> = T['length'] extends N
  ? [...V, ...T]['length']
  : Triangular<N, [...T, unknown], [...T, ...V]>;

export type Trunc<V extends string | number> = `${V}` extends `-.${string}`
  ? '-0'
  : `${V}` extends `.${string}`
    ? '0'
    : `${V}` extends `${infer Z}.${string}`
      ? Z
      : `${V}`;

export type IsTuple<T> = [T] extends [never]
  ? false
  : T extends readonly any[]
    ? number extends T['length']
      ? false
      : true
    : false;

export type BEM<
  B extends string,
  E extends string[],
  M extends string[],
> = `${B}${E extends [] ? '' : `__${E[number]}`}${M extends []
  ? ''
  : `--${M[number]}`}`;

export type StartsWith<
  T extends string,
  U extends string,
> = T extends `${U}${string}` ? true : false;

export type ConstructTuple<
  L extends number,
  C extends unknown[] = [],
> = C['length'] extends L ? C : ConstructTuple<L, [...C, unknown]>;

export type CompareArrayLength<
  T extends any[],
  U extends any[],
> = T['length'] extends U['length'] ? 0 : keyof T extends keyof U ? -1 : 1;

export type Trace<T extends any[][]> = {
  [P in keyof T]: T[P][P & keyof T[P]];
}[number];

export type IsAlphabet<T extends string> =
  Uppercase<T> extends Lowercase<T> ? false : true;

interface UppercaseMapping {
  a: 'A';
  b: 'B';
  c: 'C';
  d: 'D';
  e: 'E';
  f: 'F';
  g: 'G';
  h: 'H';
  i: 'I';
  j: 'J';
  k: 'K';
  l: 'L';
  m: 'M';
  n: 'N';
  o: 'O';
  p: 'P';
  q: 'Q';
  r: 'R';
  s: 'S';
  t: 'T';
  u: 'U';
  v: 'V';
  w: 'W';
  x: 'X';
  y: 'Y';
  z: 'Z';
}

export type MyUppercase<T extends string> = T extends `${infer F}${infer R}`
  ? `${F extends keyof UppercaseMapping
      ? UppercaseMapping[F]
      : F}${MyUppercase<R>}`
  : '';

export type FlipArguments<T extends (...args: any[]) => any> = T extends (
  ...args: infer A
) => infer R
  ? (...args: Reverse<A>) => R
  : T;

export type PartialByKeys<T, K extends keyof T = keyof T> = Omit<
  {
    [Key in keyof T as Key extends K ? never : Key]: T[Key];
  } & Partial<{
    [Key in K]: T[Key];
  }>,
  never
>;

export type RequiredByKeys<T, K extends keyof T = keyof T> = Omit<
  {
    [Key in keyof T as Key extends K ? never : Key]: T[Key];
  } & Required<{
    [Key in K]: T[Key];
  }>,
  never
>;

export type PickByType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

export type Falsy = false | '' | 0 | null | undefined;
export type isFalsy<T> = {} extends T
  ? true
  : T extends Falsy
    ? true
    : [] extends T
      ? true
      : false;

export type AnyOf<T extends readonly any[]> = T extends [infer F, ...infer R]
  ? isFalsy<F> extends true
    ? AnyOf<R>
    : true
  : false;

export type ReplaceKeys<U, T, Y> = {
  [K in keyof U]: K extends T ? (K extends keyof Y ? Y[K] : never) : U[K];
};

export type RemoveIndexSignature<T, P = PropertyKey> = {
  [K in keyof T as P extends K ? never : K extends P ? K : never]: T[K];
};

export type JSONSchema2TS<T> = T extends { enum: infer E extends any[] }
  ? E[number]
  : T extends { type: 'string' }
    ? string
    : T extends { type: 'number' }
      ? number
      : T extends { type: 'boolean' }
        ? boolean
        : T extends { type: 'array' }
          ? T extends { items: any }
            ? JSONSchema2TS<T['items']>[]
            : unknown[]
          : T extends { type: 'object' }
            ? T extends { properties: {} }
              ? T extends {
                  required: (infer R extends keyof T['properties'])[];
                }
                ? RequiredByKeys<
                    {
                      [Key in keyof T['properties']]?: JSONSchema2TS<
                        T['properties'][Key]
                      >;
                    },
                    R
                  >
                : {
                    [Key in keyof T['properties']]?: JSONSchema2TS<
                      T['properties'][Key]
                    >;
                  }
              : Record<string, unknown>
            : unknown;

type IsRepeat<T, V extends unknown[]> = V extends [infer F, ...infer R]
  ? true extends Equal<F, T>
    ? true
    : IsRepeat<T, R>
  : false;

export type CheckRepeatedTuple<T extends unknown[]> = T extends [
  infer F,
  ...infer R,
]
  ? true extends IsRepeat<F, R>
    ? true
    : CheckRepeatedTuple<R>
  : false;

export type ExtractToObject<T, U extends keyof T> = Omit<
  Omit<T, U> & T[U],
  never
>;

export type IsOdd<T extends number> = `${T}` extends `${string}e${string}`
  ? false
  : `${T}` extends `${string}.${string}`
    ? false
    : number extends T
      ? false
      : `${T}` extends `${string}${1 | 3 | 5 | 7 | 9}`
        ? true
        : false;

type ParseChar<C, R extends string[]> = C extends '+' | '-'
  ? [`${R[0]}${C}`, R[1], R[2]]
  : C extends `${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`
    ? [R[0], `${R[1]}${C}`, R[2]]
    : C extends '%'
      ? [R[0], R[1], `${R[2]}${C}`]
      : R;

type _PercentageParser<
  A extends string,
  R extends string[] = [],
> = A extends `${infer F}${infer T}`
  ? _PercentageParser<T, ParseChar<F, R>>
  : R;

export type PercentageParser<A extends string> = _PercentageParser<
  A,
  ['', '', '']
>;

/**
 * 更简洁的解法
 * type Diff<O, O1> = Omit<O & O1, keyof (O | O1)>;
 */
export type Diff<O, O1> = Omit<
  Pick<O, Exclude<keyof O, keyof O1>> & Pick<O1, Exclude<keyof O1, keyof O>>,
  never
>;

export type MapTypes<T, R extends { mapFrom: any }> = {
  [K in keyof T]: T[K] extends R['mapFrom']
    ? R extends { mapFrom: T[K]; mapTo: infer MT }
      ? MT
      : never
    : T[K];
};

export type Fill<
  T extends unknown[],
  N,
  Start extends number = 0,
  End extends number = T['length'],
  I extends number[] = [0],
  R extends unknown[] = [],
> = T extends [infer F, ...infer RT]
  ? (
      Start extends I[number] ? (End extends I[number] ? false : true) : false
    ) extends true
    ? Fill<RT, N, Start, End, [...I, I['length']], [...R, N]>
    : Fill<RT, N, Start, End, [...I, I['length']], [...R, F]>
  : R;

export type ReplaceFirst<T extends readonly unknown[], S, R> = T extends [
  infer A,
  ...infer RT,
]
  ? A extends S
    ? [R, ...RT]
    : [A, ...ReplaceFirst<RT, S, R>]
  : T;

// export type Transpose<
//   M extends number[][],
//   I extends unknown[] = [],
//   J extends unknown[] = [],
//   R extends number[][] = [],
//   RR extends number[] = []
// > = 0 extends M['length']
//   ? R
//   : J['length'] extends M[0]['length']
//   ? R
//   : I['length'] extends M['length']
//   ? Transpose<M, [], [...J, unknown], [...R, RR], []>
//   : Transpose<M, [...I, unknown], J, R, [...RR, M[I['length']][J['length']]]>;

/**
 * 需要使用 R 是为了提前计算
 *
 * keyof () 中 类型会丢失
 */
export type Transpose<
  M extends number[][],
  R = M['length'] extends 0 ? [] : M[0],
> = {
  [X in keyof R]: {
    [Y in keyof M]: X extends keyof M[Y] ? M[Y][X] : never;
  };
};

export type IsFixedStringLiteralType<S extends string> =
  {} extends Record<S, 1> ? false : Equal<[S], S extends unknown ? [S] : never>;

export type FlattenDepth<
  T extends unknown[],
  N extends number = 1,
  C extends unknown[] = [],
> = C['length'] extends N
  ? T
  : T extends [infer F, ...infer RT]
    ? F extends any[]
      ? [...FlattenDepth<F, N, [...C, unknown]>, ...FlattenDepth<RT, N, C>]
      : [F, ...FlattenDepth<RT, N, C>]
    : T;

type isRepeatChar<T, C> = T extends `${infer F}${infer R}`
  ? C extends F
    ? true
    : isRepeatChar<R, C>
  : false;

export type CheckRepeatedChars<T extends string> = T extends ''
  ? false
  : T extends `${infer F}${infer R}`
    ? isRepeatChar<R, F> extends true
      ? true
      : CheckRepeatedChars<R>
    : false;

export type FirstUniqueCharIndex<
  T extends string,
  I extends unknown[] = [],
  C extends string = '',
> = T extends ''
  ? -1
  : T extends `${infer F}${infer R}`
    ? F extends C
      ? FirstUniqueCharIndex<R, [...I, unknown], C>
      : R extends `${string}${F}${string}`
        ? FirstUniqueCharIndex<R, [...I, unknown], C | F>
        : I['length']
    : 0;

type IsExist<T, V> = T extends [infer F, ...infer R]
  ? Equal<F, V> extends true
    ? true
    : IsExist<R, V>
  : false;

export type FindEles<
  T extends any[],
  A extends any[] = [],
  L extends any[] = [],
> = T extends [infer F, ...infer R]
  ? IsExist<[...L, ...R], F> extends true
    ? FindEles<R, A, [...L, F]>
    : FindEles<R, [...A, F], [...L, F]>
  : A;

export type DropString<
  S,
  R extends string,
  RR extends string = Split<R, ''>,
  A extends string = '',
> = R extends ''
  ? S
  : S extends `${infer F}${infer T}`
    ? F extends RR
      ? DropString<T, R, RR, A>
      : DropString<T, R, RR, `${A}${F}`>
    : A;

export type SplitToArray<
  S extends string,
  SEP extends string = `${S}${string}`,
> = string extends S
  ? string[]
  : S extends ''
    ? SEP extends ''
      ? []
      : ['']
    : S extends `${infer L}${SEP}${infer R}`
      ? [L, ...SplitToArray<R, SEP>]
      : [S];

export type IsRequiredKey<T, K extends keyof T> = T extends { [Key in K]: any }
  ? true
  : false;

export type Assign<T extends Record<string, unknown>, U> = U extends [
  infer A,
  ...infer R,
]
  ? Assign<
      A extends object
        ? {
            [K in keyof T | keyof A]: K extends keyof A
              ? A[K]
              : K extends keyof T
                ? T[K]
                : never;
          }
        : T,
      R
    >
  : T;

export type ToNumber<
  S extends string,
  C extends unknown[] = [],
> = S extends `${number}`
  ? `${C['length']}` extends S
    ? C['length']
    : ToNumber<S, [...C, unknown]>
  : never;

export type FizzBuzz<
  N extends number,
  I extends unknown[] = [],
  FIZZ extends unknown[] = [],
  BUZZ extends unknown[] = [],
  A extends unknown[] = [],
> = I['length'] extends N
  ? A
  : FIZZ['length'] extends 2
    ? BUZZ['length'] extends 4
      ? FizzBuzz<N, [...I, unknown], [], [], [...A, 'FizzBuzz']>
      : FizzBuzz<N, [...I, unknown], [], [...BUZZ, unknown], [...A, 'Fizz']>
    : BUZZ['length'] extends 4
      ? FizzBuzz<N, [...I, unknown], [...FIZZ, unknown], [], [...A, 'Buzz']>
      : FizzBuzz<
          N,
          [...I, unknown],
          [...FIZZ, unknown],
          [...BUZZ, unknown],
          [...A, `${[...I, unknown]['length']}`]
        >;

export type BinaryToDecimal<
  S extends string,
  V extends unknown[] = [],
> = S extends `${infer F}${infer T}`
  ? F extends '1'
    ? BinaryToDecimal<T, [...V, ...V, unknown]>
    : BinaryToDecimal<T, [...V, ...V]>
  : V['length'];

export type SnakeCase<
  T extends string,
  R extends string = '',
> = T extends `${infer F}${infer T}`
  ? F extends Capitalize<F>
    ? SnakeCase<T, `${R}_${Lowercase<F>}`>
    : SnakeCase<T, `${R}${F}`>
  : R;

export type Unbox<
  T,
  D extends number = 0,
  C extends unknown[] = [1],
> = T extends (() => infer R) | (infer R)[] | Promise<infer R>
  ? D extends C['length']
    ? R
    : Unbox<R, D, [...C, unknown]>
  : T;

type Bit = 1 | 0;

type Carry<A, B, C> = A extends 1
  ? B extends 1
    ? 1
    : C extends 1
      ? 1
      : 0
  : B extends 1
    ? C extends 1
      ? 1
      : 0
    : 0;

type Current<A, B, C> = A extends 1
  ? B extends 1
    ? C extends 1
      ? 1
      : 0
    : C extends 1
      ? 0
      : 1
  : B extends 1
    ? C extends 1
      ? 0
      : 1
    : C;

export type BinaryAdd<
  A extends Bit[],
  B extends Bit[],
  C extends Bit = 0,
> = A extends [...infer AL extends Bit[], infer AT]
  ? B extends [...infer BL extends Bit[], infer BT]
    ? [...BinaryAdd<AL, BL, Carry<AT, BT, C>>, Current<AT, BT, C>]
    : C extends 1
      ? [1]
      : []
  : C extends 1
    ? [1]
    : [];

type Alphabet = Exclude<Split<'abcdefghijklmnopqrstuvwxyz', ''>, ''>;

export type CapitalizeWords<
  S extends string,
  U extends boolean = true,
  A extends string = '',
> = S extends `${infer F}${infer T}`
  ? Lowercase<F> extends Alphabet
    ? U extends true
      ? CapitalizeWords<T, false, `${A}${Uppercase<F>}`>
      : CapitalizeWords<T, U, `${A}${F}`>
    : CapitalizeWords<T, true, `${A}${F}`>
  : A;
