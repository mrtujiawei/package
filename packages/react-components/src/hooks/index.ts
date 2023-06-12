import { preventDefault } from '@mrtujiawei/web-utils';
import { RefObject, useEffect } from 'react';

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
