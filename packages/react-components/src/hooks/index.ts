import { debounce } from '@mrtujiawei/utils';
import { preventDefault } from '@mrtujiawei/web-utils';
import { RefObject, useEffect, MutableRefObject } from 'react';

/**
 * 滚动锁定
 */
export const useLockScroll = ({
  dom,
  lock,
}: {
  dom?: RefObject<HTMLElement>;
  lock?: boolean;
}) => {
  useEffect(() => {
    const current = dom?.current;
    if (current && lock) {
      const onTouchMove = (event: TouchEvent) => {
        preventDefault(event, true);
      };

      current.addEventListener('touchmove', onTouchMove);
      return () => {
        current.removeEventListener('touchmove', onTouchMove);
      };
    }
  }, [dom, lock]);
};

export type Ref = MutableRefObject<() => any | Promise<any>>;
export type LoadMoreOptions = {
  /**
   * @default 300
   * @description 距离底部不足 delta 时触发回调，单位 px
   */
  delta?: number;

  /**
   * @default 10000
   * @description 如果 timeout ms 后还没有结束则可再次触发加载
   */
  timeout?: number;
};

/**
 * 判断是否需要触发
 */
const needTrigger = (delta: number) => {
  const clientHeight = document.documentElement.clientHeight;
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop =
    document.documentElement.scrollTop || document.body.scrollTop;

  return scrollTop + clientHeight + delta >= scrollHeight;
};

/**
 * 上拉加载更多
 *
 * @param ref 通过 ref 传递一个回调函数
 * @param delta 如果距离底部不足 delta px 触发回调加载更多，未加载完成之前不会再次触发
 * @description delta 和 timeout 只在第一次生效，如果变更的话会影响切换前后的加载
 */
export const useLoadMore = (ref: Ref, options: LoadMoreOptions = {}) => {
  const { delta = 300, timeout = 10000 } = options;

  useEffect(() => {
    let loading = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const listener = debounce(() => {
      const trigger = needTrigger(delta);
      if (loading || !trigger) {
        return;
      }
      loading = true;
      const clear = () => {
        if (id != timer) {
          return;
        }
        loading = false;
        if (timer) {
          clearTimeout(timer);
        }
        timer = null;
      };
      let id = (timer = setTimeout(clear, timeout));
      (async () => {
        await ref.current();
        clear();
      })();
    }, 100) as any;

    addEventListener('scroll', listener, {
      passive: false,
    });

    return () => {
      removeEventListener('scroll', listener);
    };
  }, []);
};
