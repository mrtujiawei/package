/*
 * Key 升序排序
 */

/**
 * 是否是数字
 */
const isNumber = (number: any) => {
  return !isNaN(number);
};

/**
 * 根据key自然排序
 */
const sortOnKeys = (dict: any) => {
  const sorted: any[] = [];
  for (const key in dict) {
    sorted[sorted.length] = key;
  }
  sorted.sort();

  const tempDict: any = {};
  for (let i = 0; i < sorted.length; i++) {
    tempDict[sorted[i]] = dict[sorted[i]];
  }

  return tempDict;
};

/**
 * 检查是否所有 key 都是数字
 */
const allKeysAreNumeral = (dict: any) => {
  for (const key in dict) {
    if (!isNumber(key)) {
      return false;
    }
  }

  return true;
};

class TreeMap<Key, Value> {
  dict: any = {};

  get(key: any) {
    return this.dict[key];
  }

  containsKey(key: any) {
    return undefined !== this.get(key);
  }

  put(key: Key, value: Value) {
    this.dict[key] = value;
    if (isNumber(key)) {
      if (allKeysAreNumeral(this.dict)) {
        this.dict = sortOnKeys(this.dict);
      }
    }
  }

  remove(key: string) {
    delete this.dict[key];
  }

  clear() {
    this.dict = {};
  }

  forEach(callback: (value: Value, key: string) => void) {
    const len = this.size;
    for (let i = 0; i < len; i++) {
      const item = this.get(Object.keys(this.dict)[i]);
      callback(item, Object.keys(this.dict)[i]);
    }
  }

  get size() {
    return Object.keys(this.dict).length;
  }

  isEmpty() {
    return 0 == Object.keys(this.dict).length;
  }

  /**
   * 小于或等于给定key的key
   */
  floorKey(key: number): string {
    if (!isNumber(key)) {
      throw 'Invalid Operation: key has to be an integer value';
    }

    if (this.containsKey(key)) {
      return this.get(key);
    }

    return this.floorKey(key - 1);
  }

  /**
   * 大于或等于给定key的key
   */
  ceilingKey(key: number): string {
    if (!isNumber(key)) {
      throw 'Invalid Operation: key has to be an integer value';
    }

    if (this.containsKey(key)) {
      return this.get(key);
    }

    return this.floorKey(key + 1);
  }

  /**
   * 浅复制
   */
  clone() {
    return this.dict;
  }

  containsValue(value: any) {
    const len = this.size;
    for (let i = 0; i < len; i++) {
      const item = this.get(Object.keys(this.dict)[i]);
      if (value === item) {
        return true;
      }
    }

    return false;
  }

  keySet() {
    const set: any[] = [];
    const len = this.size;
    for (let i = 0; i < len; i++) {
      set.push(Object.keys(this.dict)[i]);
    }

    return set;
  }

  firstKey() {
    return Object.keys(this.dict)[0];
  }

  lastKey() {
    const len = this.size;
    return Object.keys(this.dict)[len - 1];
  }
}

export default TreeMap;
