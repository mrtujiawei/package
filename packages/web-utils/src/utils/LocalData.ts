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

// TODO 添加过期

class LocalData {
  /**
   * key前缀
   */
  prefix: string;

  /**
   * @param prefix - key前缀
   */
  constructor(prefix = 'tujiawei') {
    this.prefix = prefix;
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
    let res = this.getString(key);
    try {
      return JSON.parse(res as string);
    } catch (e) {
      console.warn('无法转换');
    }
    return res;
  }

  /**
   * @param key
   * @param value
   */
  set(key: string, value: Object) {
    localStorage.setItem(this.prefix + key, JSON.stringify(value));
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
