import { toString } from './utils/utils';

export class TYPES {
  static readonly UNDEFINED = toString(void 0);
  static readonly NULL = toString(null);
  static readonly STRING = toString('');
  static readonly NUMBER = toString(0);
  static readonly BOOLEAN = toString(false);
  static readonly FUNCTION = toString(Function.prototype);

  // symbol 可能会报错，直接写死吧
  static readonly SYMBOL = '[object Symbol]';
  static readonly OBJECT = toString({});
  static readonly ARRAY = toString([]);

  static readonly DATE = toString(new Date());
  static readonly ERROR = toString(new Error());
}

/**
 * 判断是否是浏览器环境
 */
export const isBrowser = typeof void 0 != typeof window;

