import { CSSProperties, MouseEventHandler } from 'react';

export interface IOverlayProps {
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
