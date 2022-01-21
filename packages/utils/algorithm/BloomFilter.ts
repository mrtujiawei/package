/**
 * 布隆过滤器
 * 使用条件:
 * 1. 经常需要判断某个元素是否存在
 * 2. 数据量巨大，希望使用较少空间
 * 3. 允许有一定的误判率
 *
 * 没有继续往下讲，有机会补完吧
 * @filename: BloomFilter.ts
 * @author: Mr Prince
 * @date: 2021-06-13 20:06:15
 */
class BloomFilter<T> {
  static IllegalArgumentException = class IllegalArgumentException extends Error {
    constructor(message: string = 'Size of misjudgmentRate is not valid') {
      super(message);
    }
  };

  /**
   * 二进制向量长度
   */
  private readonly  bitSize: number;

  /**
   * 二进制向量
   */
  private readonly bits: number[];

  /**
   * 哈希函数个数
   */
  private readonly hashSize: number;

  /**
   * @param misjudgmentRate 取值范围 (0, 1)
   */
  constructor(size: number, misjudgmentRate: number) {
    if (size <= 0 || misjudgmentRate <= 0 || misjudgmentRate >= 1) {
      throw new BloomFilter.IllegalArgumentException();
    }

    let ln2 = Math.log(2);
    let n = size;
    let p = misjudgmentRate;

    this.bitSize = Math.floor(-(n * Math.log(p)) / Math.pow(ln2, 2));
    this.hashSize = Math.ceil(this.bitSize * ln2 / n);
    // js 能支持移位的最大数为 2 ^ 32
    let bitLength = Math.floor((this.bitSize + 31) / 32);

    this.bits = new Array(bitLength).fill(0);

    console.log(this.bitSize, this.hashSize, this.bits);
  }

  /**
   * TODO 最后还是没写完
   * 添加元素
   */
  put(value: T): void {
    console.log(value);
  }
  /**
   * 判断是否包含
   */
  contains(value: T): boolean {
    console.log(value);

    return true;
  }


  get getMisjudgmentRate() {
    let n = 1;
    let k = 1;
    let m = 1;
    // 因为数据规模较大，所以常数可以忽略
    // let exp = -(n + 0.5) * k / (m - 1);
    let exp = -n * k / m;
    return Math.pow((1 - Math.pow(Math.E, exp)), k);
  }
}

export default BloomFilter;
