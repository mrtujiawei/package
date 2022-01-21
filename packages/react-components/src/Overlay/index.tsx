/**
 * 遮罩层
 * @filename: packages/react-components/src/Overlay/index.tsx
 * @author: Mr Prince
 * @date: 2022-10-02 23:32:05
 */

import { Types } from '@mrtujiawei/utils';
import { preventDefault } from '@mrtujiawei/web-utils';
import classNames from 'classnames';
import {
  CSSProperties,
  FC,
  MouseEventHandler,
  ReactElement,
  useEffect,
  useRef,
} from 'react';
import { CSSTransition } from 'react-transition-group';

export interface IOverlayProps {
  children: ReactElement;

  /**
   * 是否显示遮罩层
   */
  visible: boolean;

  /**
   * 手动调整 zIndex
   */
  zIndex?: number | string;

  /**
   * 显示时间(秒)
   */
  duration?: number;

  /**
   * 类名
   */
  className?: any;

  /**
   * 是否不能滚动
   * @default true
   */
  lockScroll?: boolean;

  /**
   * 自定义样式
   */
  style?: CSSProperties;

  /**
   * 点击事件
   * 如果需要点击遮罩层关闭，需要阻止内容区事件冒泡
   */
  onClick?: MouseEventHandler<HTMLDivElement>;
}

const Overlay: FC<IOverlayProps> = (props) => {
  const overlay = useRef<HTMLDivElement>(null);
  const { lockScroll = true } = props;
  const style = {
    ...props.style,
    zIndex: props.zIndex,
  };

  if (!Types.isUndefined(props.duration)) {
    style.animationDuration = `${props.duration}s`;
  }

  useEffect(() => {
    // react 不支持阻止默认事件
    const dom = overlay.current;

    // visible 存在时 dom 才不为null
    if (lockScroll && props.visible && dom) {
      const onTouchMove = (event: TouchEvent) => {
        preventDefault(event, true);
      };

      dom.addEventListener('touchmove', onTouchMove);
      return () => {
        dom.removeEventListener('touchmove', onTouchMove);
      };
    }
  }, [lockScroll, props.visible]);

  return (
    <CSSTransition
      in={props.visible}
      classNames="fade"
      timeout={300}
      unmountOnExit
    >
      <div
        ref={overlay}
        style={style}
        className={classNames('overlay', props.className)}
        onClick={props.onClick}
      >
        {props.children}
      </div>
    </CSSTransition>
  );
};

export default Overlay;
