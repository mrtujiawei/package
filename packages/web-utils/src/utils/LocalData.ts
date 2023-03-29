/**
 * 不能保存函数，建议funcname.toString() 后保存
 * 保存时，如果没有给value， 不会报错，
 * 但取值时，如果为undefined，会提示
 * 保存的类型为 Symbol 时，无法正常保存
 * 不提供遍历的方法，可以使用原生
 */

/**
 * localData 可以在构造的时候给个选项
 * localStorage 或者 sessionStorage
 * 就可以实现存储方式的改变
 */

/**
 * 保存数据到本地
 * 这里写成函数的形式
 * 是为了私有变量
 * @author 屠佳伟 Mrprince 2019-09-28
 * @param prefix 保存键值对的前缀，避免冲突
 *
 *
 * !!! 需要注意的是，不能保存函数到本地
 * 需要将函数装换成字符串再保存
 */

interface Options {
  /**
   * 过期时间
   * <= 0 表示永不过期
   */
  expiration: number;
}

const defaultOption: Options = {
  expiration: 0
};

/**
 * 保存100年
 */
const MAX_TIME_OUT = 100 * 365 * 24 * 60 * 60 * 1000;

class LocalData {
  /**
   * key前缀
   */
  prefix: string;

  /**
   * 过期时间 <= 0 表示永不过期
   */
  expiration: number;

  /**
   * @param prefix - key前缀
   */
  constructor(prefix = 'tujiawei', option?: Options) {
    this.prefix = prefix;
    this.expiration = (option || defaultOption).expiration;
  }

  /**
   * 获取对应值的字符串
   *
   * @param key - 属性
   */
  getString(key: string) {
    return localStorage.getItem(this.prefix + key);
  }

  /**
   * 获取对应值
   *
   */
  get(key: string) {
    const value = this.getString(key);
    if (value === null) {
      return null;
    }
    const result: { value: unknown, timeout: number } = JSON.parse(value);
    if (result.timeout < new Date().getTime()) {
      return null;
    }
    return result.value;
  }

  /**
   * @param key
   * @param value
   */
  set(key: string, value: Object, options?: Options) {
    let expiration = this.expiration;

    if (options) {
      expiration = options.expiration;
    }

    localStorage.setItem(this.prefix + key, JSON.stringify({
      value,
      timeout: new Date().getTime() + (expiration > 0 ? expiration : MAX_TIME_OUT)
    }));
  }

  /**
   * 清空
   */
  clear() {
    localStorage.clear();
  }

  /**
   * 移除
   *
   * @param key
   */
  remove(key: string) {
    localStorage.removeItem(this.prefix + key);
  }
}

export default LocalData;
