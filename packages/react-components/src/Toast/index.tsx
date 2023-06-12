/**
 * 提示
 * @filename: packages/react-components/src/Toast/index.tsx
 * @author: Mr Prince
 * @date: 2022-10-03 20:16:03
 */
import { createBEM, Types } from '@mrtujiawei/utils';
import classNames from 'classnames';
import { CSSProperties, FC, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { Position } from '../enum';
import { useLockScroll } from '../hooks';
import { ToastProps } from './types';

export * from './types';

let lockCount = 0;

function lockClick(lock: boolean) {
  if (lock) {
    if (!lockCount) {
      document.body.classList.add('toast--unclickable');
    }

    lockCount++;
  } else {
    lockCount--;

    if (!lockCount) {
      document.body.classList.remove('toast--unclickable');
    }
  }
}

const Toast: FC<ToastProps> = (props) => {
  const bem = createBEM('toast');
  const toast = useRef<HTMLDivElement>(null);
  const clickable = useRef<boolean>(false);

  const { duration = 300, position = Position.middle } = props;

  const style: CSSProperties = {
    ...props.customStyle,
    zIndex: props.zIndex,
  };

  if (!Types.isUndefined(props.duration)) {
    style.animationDuration = `${duration}ms`;
  }

  useLockScroll({
    dom: toast,
    lock: props.visible && props.lockScroll,
  });

  useEffect(() => {
    const toggleClickable = () => {
      const forbidClick = props.visible && !!props.forbidClick;

      if (clickable.current != forbidClick) {
        clickable.current = forbidClick;
        lockClick(forbidClick);
      }
    };

    toggleClickable();

    return () => {
      toggleClickable();
    };
  }, [props.visible, props.forbidClick]);

  return (
    <CSSTransition
      in={props.visible}
      timeout={duration}
      classNames="fade"
      onEntered={props.onEntered}
      onExited={props.onExited}
      unmountOnExit
    >
      <div
        ref={toast}
        style={style}
        className={classNames([bem(), bem('', position), props.className])}
        onClick={props.onClick}
      >
        {props.children}
      </div>
    </CSSTransition>
  );
};

export default Toast;
