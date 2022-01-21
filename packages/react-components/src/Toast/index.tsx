/**
 * 提示
 * @filename: packages/react-components/src/Toast/index.tsx
 * @author: Mr Prince
 * @date: 2022-10-03 20:16:03
 */
import { Types } from '@mrtujiawei/utils';
import { preventDefault } from '@mrtujiawei/web-utils';
import classNames from 'classnames';
import {
  CSSProperties,
  FC,
  MouseEventHandler,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import { CSSTransition } from 'react-transition-group';
import { Position } from '../enum';

export interface IToastProps {
  /**
   * 是否显示
   */
  visible: boolean;

  /**
   * 调整定位层级
   */
  zIndex: number;

  /**
   * 动画时间 ms
   * @default 300
   */
  duration?: number;

  /**
   * 显示的位置
   */
  position?: Position;

  /**
   * 自定义类名
   */
  className?: string;

  /**
   * 自定义样式
   */
  customStyle?: CSSProperties;

  /**
   * @default false
   */
  lockScroll?: boolean;

  /**
   * 内部绑定事件
   */
  onClick?: MouseEventHandler<HTMLDivElement>;

  /**
   * 内容
   */
  children?: ReactNode;

  onEntered?: () => void;

  onExited?: () => void;

  /**
   * @default false
   * 禁止点击
   */
  forbidClick?: boolean;
}

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

const Toast: FC<IToastProps> = (props) => {
  const toast = useRef<HTMLDivElement>(null);
  const clickable = useRef<boolean>(false);

  const {
    duration = 300,
    position = Position.middle,
  } = props;

  const style: CSSProperties = {
    ...props.customStyle,
    zIndex: props.zIndex,
  };

  if (!Types.isUndefined(props.duration)) {
    style.animationDuration = `${duration}ms`;
  }

  useEffect(() => {
    // react 不支持阻止默认事件
    const dom = toast.current;

    // visible 存在时 dom 才不为null
    if (props.lockScroll && props.visible && dom) {
      const onTouchMove = (event: TouchEvent) => {
        preventDefault(event, true);
      };

      dom.addEventListener('touchmove', onTouchMove);
      return () => {
        dom.removeEventListener('touchmove', onTouchMove);
      };
    }
  }, [props.lockScroll, props.visible]);

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
        style={style}
        className={classNames(['toast', `toast--${position}`, props.className])}
        onClick={props.onClick}
      >
        {props.children}
      </div>
    </CSSTransition>
  );
};

export default Toast;
