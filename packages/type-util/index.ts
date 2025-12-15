/**
 *
 * @filename packages/type-util/index.ts
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2025-12-15 16:13:51
 */

import { Falsy, Nullish, Primitive } from './type';

export const isPrimitive = (val: unknown): val is Primitive => {
  if (val === null || val === undefined) {
    return true;
  }

  switch (typeof val) {
    case 'string':
    case 'number':
    case 'bigint':
    case 'boolean':
    case 'symbol': {
      return true;
    }
    default:
      return false;
  }
};

export const isFalsy = (val: unknown): val is Falsy => !val;

export const isNullish = (val: unknown): val is Nullish => val == null;
