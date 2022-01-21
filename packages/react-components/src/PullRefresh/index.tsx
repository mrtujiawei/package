/**
 * 下拉刷新
 * @filename: packages/react-components/src/components/PullRefresh/index.tsx
 * @author: Mr Prince
 * @date: 2022-09-24 13:30:42
 */
import {
  CSSProperties,
  FC,
  TouchEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  preventDefault,
  getElementScrollTop as getScrollTop,
  getScroller,
} from '@mrtujiawei/web-utils';
import { DIRECTION, STATUS } from './enums';
import { getDirection } from './utils';
import type { Props } from './types';

export type { Props } from './types';

const PullRefresh: FC<Props> = (props) => {
  const {
    successDuration = 500,
    animationDuration = 300,
    headHeight = 50,
    pullDistance = 50,
  } = props;
  const track = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);

  // 一些不会引起页面渲染变化的变量
  const variablesRef = useRef({
    ceiling: false,
    startX: 0,
    startY: 0,
    deltaX: 0,
    deltaY: 0,
    offsetX: 0,
    offsetY: 0,
    direction: DIRECTION.DEFAULT,
  });
  const variables = variablesRef.current;

  const [status, setStatus] = useState(STATUS.NORMAL);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);

  /**
   * 是否可以触发touch相关事件
   */
  const touchable =
    status != STATUS.LOADING && status != STATUS.SUCCESS && !props.disabled;

  const headStyle: CSSProperties = {
    height: `${headHeight}px`,
  };

  const checkPullStart: TouchEventHandler<HTMLDivElement> = (event) => {
    variables.ceiling = getScrollTop(getScroller(scroller.current!)) === 0;

    if (variables.ceiling) {
      setDuration(0);
      touchStart(event);
    }
  };

  const onTouchStart: TouchEventHandler<HTMLDivElement> = (event) => {
    if (touchable) {
      checkPullStart(event);
    }
  };

  const onTouchMove: TouchEventHandler<HTMLDivElement> = (event) => {
    if (!touchable) {
      return;
    }

    if (!variables.ceiling) {
      checkPullStart(event);
    }

    touchMove(event);

    if (
      variables.ceiling &&
      variables.deltaY >= 0 &&
      variables.direction === DIRECTION.VERTICAL
    ) {
      preventDefault(event as unknown as Event);
      updateStatus(ease(variables.deltaY));
    }
  };

  const onTouchEnd = () => {
    if (touchable && variables.ceiling && variables.deltaY) {
      setDuration(animationDuration);
      if (status == STATUS.LOOSING) {
        updateStatus(Number(headHeight), true);
        props.onLoading(true);
        // TODO setTimeout 是否需要
        setTimeout(() => {
          props.onRefresh();
        });
      } else {
        updateStatus(0);
      }
    }
  };

  const ease = (distance: number) => {
    const pullDistanceCurrent = +(pullDistance || headHeight);

    if (distance > pullDistanceCurrent) {
      if (distance < pullDistanceCurrent * 2) {
        distance = pullDistanceCurrent + (distance - pullDistanceCurrent) / 2;
      } else {
        distance =
          pullDistanceCurrent * 1.5 + (distance - pullDistanceCurrent * 2) / 4;
      }
    }

    return Math.round(distance);
  };

  const updateStatus = (distance: number, isLoading?: boolean) => {
    let status: STATUS;
    if (isLoading) {
      status = STATUS.LOADING;
    } else if (distance === 0) {
      status = STATUS.NORMAL;
    } else {
      status =
        distance < (pullDistance || headHeight)
          ? STATUS.PULLING
          : STATUS.LOOSING;
    }
    setDistance(distance);
    setStatus(status);
  };

  /**
   * 传入什么，显示什么
   */
  const genStatus = () => {
    if (status == STATUS.LOOSING) {
      return props.loosingElement;
    }

    if (status == STATUS.PULLING) {
      return props.pullingElement;
    }

    if (status == STATUS.LOADING) {
      return props.loadingElement;
    }

    if (status == STATUS.SUCCESS) {
      return props.successElement;
    }

    return null;
  };

  const touchStart: TouchEventHandler<HTMLDivElement> = (event) => {
    resetTouchStatus();
    variables.startX = event.touches[0].clientX;
    variables.startY = event.touches[0].clientY;
  };

  const touchMove: TouchEventHandler<HTMLDivElement> = (event) => {
    const touch = event.touches[0];
    // ios 上clientX可能出现负数
    const deltaX = touch.clientX < 0 ? 0 : touch.clientX - variables.startX;
    const deltaY = touch.clientY - variables.startY;

    variables.deltaX = deltaX;
    variables.deltaY = deltaY;

    const offsetX = Math.abs(deltaX);
    const offsetY = Math.abs(deltaY);
    variables.offsetX = offsetX;
    variables.offsetY = offsetY;

    // 当距离达到一定程度的时候锁定方向
    const LOCK_DIRECTION_DISTANCE = 10;
    if (
      variables.direction == DIRECTION.DEFAULT ||
      (offsetX < LOCK_DIRECTION_DISTANCE && offsetY < LOCK_DIRECTION_DISTANCE)
    ) {
      variables.direction = getDirection(offsetX, offsetY);
    }
  };

  /**
   * 重置状态
   */
  const resetTouchStatus = () => {
    variables.direction = DIRECTION.DEFAULT;
    variables.deltaX = 0;
    variables.deltaY = 0;
    variables.offsetX = 0;
    variables.offsetY = 0;
  };

  useEffect(() => {
    const showSuccessTip = () => {
      setStatus(STATUS.SUCCESS);

      setTimeout(() => {
        updateStatus(0);
      }, successDuration);
    };

    setDuration(animationDuration);

    if (props.loading) {
      updateStatus(Number(headHeight), true);
    } else if (props.successElement) {
      showSuccessTip();
    } else {
      updateStatus(0);
    }
  }, [props.loading]);

  const trackStyle = {
    transitionDuration: `${duration}ms`,
    transform: `translate3d(0, ${distance}px, 0)`,
  };

  return (
    <div className="pull-refresh" ref={scroller}>
      <div
        ref={track}
        className="pull-refresh__track"
        style={trackStyle}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <div className="pull-refresh__head" style={headStyle}>
          {genStatus()}
        </div>
        {props.children}
      </div>
    </div>
  );
};

export default PullRefresh;
