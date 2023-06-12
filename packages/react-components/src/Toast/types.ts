import { CSSProperties, MouseEventHandler, PropsWithChildren } from 'react';
import { Position } from '../enum';

export type ToastProps = PropsWithChildren<{
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

  onEntered?: () => void;

  onExited?: () => void;

  /**
   * @default false
   * 禁止点击
   */
  forbidClick?: boolean;
}>;
