import { useEffect, useRef, useState } from 'react';
import { Swipe } from '@mrtujiawei/web-utils';
import './index.less';

const SwipeDemo = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    const swipe = new Swipe(setTranslateX);
    const container = ref.current!;
    swipe.setLimit(60);

    const touchStart = (event: TouchEvent) => {
      const x = event.changedTouches[0].pageX;
      const y = event.changedTouches[0].pageY;
      swipe.touchStart(x, y);
    };

    const touchMove = (event: TouchEvent) => {
      const x = event.changedTouches[0].pageX;
      const y = event.changedTouches[0].pageY;
      swipe.touchMove(x, y);
    };

    const touchEnd = (event: TouchEvent) => {
      const x = event.changedTouches[0].pageX;
      const y = event.changedTouches[0].pageY;
      swipe.touchEnd(x, y);
    };

    container.addEventListener('touchstart', touchStart);
    container.addEventListener('touchmove', touchMove);
    container.addEventListener('touchend', touchEnd);
    return () => {
      container.removeEventListener('touchstart', touchStart);
      container.removeEventListener('touchmove', touchMove);
      container.removeEventListener('touchend', touchEnd);
    };
  }, []);

  return (
    <div className="swipe" ref={ref}>
      <div
        className="scroller"
        style={{
          transform: `translateX(${translateX}px) translateZ(0)`,
        }}
      >
        <div className="swipe-content"></div>
        <div className="swipe-ops">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default SwipeDemo;
