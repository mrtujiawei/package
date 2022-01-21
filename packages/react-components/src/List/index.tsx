/**
 * 列表组件，支持上拉记载
 *
 * @filename: packages/react-components/src/components/List/index.tsx
 * @author: Mr Prince
 * @date: 2022-09-24 13:30:20
 */
import { Component, createRef } from 'react';
import { FixedSizeList } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { Lock } from '@mrtujiawei/utils';
import type { ComponentType } from 'react';
import type { ListChildComponentProps } from 'react-window';

export interface Props<T> {
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

class List<T> extends Component<Props<T>> {
  /**
   * 列表
   */
  private fixedSizeListRef = createRef<FixedSizeList<T>>();

  /**
   * 无限加载
   */
  private infiniteLoaderRef = createRef<
    InfiniteLoader & {
      _listRef?: FixedSizeList<Props<T>>;
    }
  >();

  private loadLock = new Lock();

  /**
   * 缓存重置: 重新加载所有项目
   * 排序发生变化或下拉刷新操作等
   */
  resetloadMoreItemsCache(autoload?: boolean) {
    this.infiniteLoaderRef.current?.resetloadMoreItemsCache(autoload);
  }

  private getListRef() {
    return (
      this.infiniteLoaderRef.current?._listRef || this.fixedSizeListRef.current
    );
  }

  /**
   * 滚动到指定偏移处
   * @param offset 单位: 像素
   */
  scrollTo(offset: number) {
    this.getListRef()?.scrollTo(offset);
  }

  /**
   * 滚动到指定下标处
   * @param align 对齐方式
   */
  scrollToItem(
    index: number,
    align?: 'auto' | 'smart' | 'center' | 'end' | 'start'
  ) {
    this.getListRef()?.scrollToItem(index, align);
  }

  private isItemLoaded = (index: number) => {
    return !this.props.hasMore || index < this.props.itemCount;
  };

  private loadMore = async (startIndex: number, stopIndex: number) => {
    await this.loadLock.lock();
    if (!this.props.hasMore) {
      return;
    }
    try {
      await this.props.loadMore?.(startIndex, stopIndex);
    } finally {
      this.loadLock.unlock();
    }
  };

  render() {
    const props = this.props;
    const { loadMore, hasMore, threshold, ...restProps } = props;

    if (loadMore) {
      let itemCount = props.itemCount + Number(props.hasMore);
      return (
        <InfiniteLoader
          ref={this.infiniteLoaderRef}
          isItemLoaded={this.isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={this.loadMore}
          threshold={threshold}
        >
          {({ onItemsRendered, ref }) => {
            return (
              <FixedSizeList
                ref={ref}
                width={'100%'}
                onItemsRendered={onItemsRendered}
                {...restProps}
                itemCount={itemCount}
              >
                {props.children}
              </FixedSizeList>
            );
          }}
        </InfiniteLoader>
      );
    }

    return (
      <FixedSizeList ref={this.fixedSizeListRef} width={'100%'} {...restProps}>
        {props.children}
      </FixedSizeList>
    );
  }
}

export default List;
