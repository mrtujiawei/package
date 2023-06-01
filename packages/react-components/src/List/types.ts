import type { ComponentType } from 'react';
import type { ListChildComponentProps } from 'react-window';

export interface ListProps<T> {
  /**
   * 容器高度
   */
  height: number;

  /**
   * 容器宽度
   * @default 100%
   */
  width?: number | string;

  /**
   * 单个元素高度
   */
  itemSize: number;

  /**
   * 元素个数
   */
  itemCount: number;

  /**
   * 屏幕外显示的列表项数量
   * 数量越大，性能消耗越大
   * 适当增加可以减少页面空白
   * @default 1
   */
  overscanCount?: number;

  /**
   * 子节点,需要一个组件
   */
  children: ComponentType<ListChildComponentProps<T>>;

  /**
   * 开启滚动监听
   * 滚动时，children.props.isScrolling 会发生变化
   */
  useIsScrolling?: boolean;

  /**
   * 元素的key: 默认使用 index 作为下标
   * @default index
   */
  itemKey?: (index: number, data: unknown) => string | number;

  /**
   * 传递给单个 list item 的数据
   * 所有 list item 接收到的都是一样的
   * 一般都是给数据和处理函数
   *
   * @example { data: [], handle(index) => void }
   */
  itemData?: T;

  /**
   * 类名
   */
  className?: string;

  /**
   * 容器样式
   */
  style?: Record<string, string | number>;

  /**
   * 初始滚动高度
   * @default 0
   */
  initialScrollOffset?: number;

  /**
   * 加载更多,包含[startIndex, endIndex]
   * 传入loadMore时开启上拉记载更多
   *
   * 一般情况下 start == end
   * 如果有加载失败的情况 start 会小于 end
   */
  loadMore?: (startIndex: number, endIndex: number) => void | Promise<void>;

  /**
   * 是否还有更多
   * @default false
   */
  hasMore?: boolean;

  /**
   *
   * 滚动到最后15个的时候, 开始加载新的数据
   *
   * 触发条件:
   * 1. 滚动
   * 2. 初始列表项不能填满容器高度
   *
   * 限制:
   * 如果`loadMore`执行结束时，列表已停止滚动
   * 那么即使剩余的列表项少于 threshold
   * 也不会再次触发下一次加载
   *
   * @default 15
   */
  threshold?: number;
}
