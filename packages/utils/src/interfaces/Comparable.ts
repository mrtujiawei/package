/**
 * 比较器接口
 *
 * @filename: packages/utils/src/interfaces/Comparable.ts
 * @author: Mr Prince
 * @date: 2022-11-09 17:11:48
 */
interface Comparable<T> {
  compareTo(value: T): number;
}

export default Comparable;
