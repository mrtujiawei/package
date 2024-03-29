/**
 * 遮罩层
 * @filename: packages/react-components/src/Overlay/index.tsx
 * @author: Mr Prince
 * @date: 2022-10-02 23:32:05
 */

import { createBEM, Types } from '@mrtujiawei/utils';
import classNames from 'classnames';
import { CSSProperties, FC, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useLockScroll } from '../hooks';
import { OverlayProps } from './tyles';
export * from './tyles';

export const Overlay: FC<OverlayProps> = (props) => {
  const bem = createBEM('overlay');

  const overlay = useRef<HTMLDivElement>(null);
  const { lockScroll = true } = props;
  const style: CSSProperties = {
    ...props.style,
    zIndex: props.zIndex,
  };

  if (!Types.isUndefined(props.duration)) {
    style.animationDuration = `${props.duration}s`;
  }

  useLockScroll({
    dom: overlay,
    lock: props.visible && lockScroll,
  });

  return (
    <CSSTransition
      nodeRef={overlay}
      in={props.visible}
      classNames="fade"
      timeout={300}
      unmountOnExit
    >
      <div
        ref={overlay}
        style={style}
        className={classNames(bem(), props.className)}
        onClick={props.onClick}
      >
        <div
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          {props.children}
        </div>
      </div>
    </CSSTransition>
  );
};
