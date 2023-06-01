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
import { ListProps } from './types';

class List<T> extends Component<ListProps<T>> {
  /**
   * 列表
   */
  private fixedSizeListRef = createRef<FixedSizeList<T>>();

  /**
   * 无限加载
   */
  private infiniteLoaderRef = createRef<
    InfiniteLoader & {
      _listRef?: FixedSizeList<ListProps<T>>;
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
