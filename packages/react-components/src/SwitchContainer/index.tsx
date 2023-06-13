export { CSSTransition } from 'react-transition-group';

import { createBEM } from '@mrtujiawei/utils';
import classNames from 'classnames';
import { CSSProperties, FC, PropsWithChildren, useRef } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';

type SwitchContainerProps = PropsWithChildren<{
  /**
   * 容器的宽高属性定义
   */
  className?: string;

  /**
   * 容器宽高定义
   */
  width?: number;
  height?: number;

  /**
   * 只有 state 奇偶性发生变化时
   * 才会触发切换效果
   */
  state?: number;

  /**
   * 动画结束回调
   */
  onAnimateEnd?: () => void;
}>;

export const SwitchContainer: FC<SwitchContainerProps> = (props) => {
  const bem = createBEM('switch-container');
  const currentRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const state = props.state;
  const nodeRef = (state || 0) % 2 == 0 ? currentRef : nextRef;
  const timeout = 500;

  const style: CSSProperties = {};

  props.height ?? (style.height = props.height);
  props.width ?? (style.width = props.width);

  return (
    <div className={classNames(bem(), props.className)} style={style}>
      <SwitchTransition mode="in-out">
        <CSSTransition
          key={state}
          nodeRef={nodeRef}
          timeout={{
            enter: timeout,
            exit: 0,
          }}
          classNames="switch"
          onEntered={props.onAnimateEnd}
        >
          <div
            style={style}
            className={classNames(bem('item'), props.className)}
            ref={nodeRef}
          >
            {props.children}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};
