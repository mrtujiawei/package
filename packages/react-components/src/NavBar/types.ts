import { MouseEventHandler, ReactNode } from 'react';

export interface NavBarProps {
  /**
   * 中间的标题
   */
  title?: ReactNode;

  /**
   * 是否固定在顶部
   */
  fixed?: boolean;

  /**
   * 修改定位层级
   */
  zIndex?: number;

  /**
   * 左侧节点
   */
  left?: ReactNode;

  /**
   * 右侧节点
   */
  right?: ReactNode;

  /**
   * 是否显示左箭头
   */
  leftArrow?: boolean;

  /**
   * 是否在标签位置生成一个同样高度的容器占位
   */
  placeholder?: boolean;

  /**
   * 是否留安全顶部距离
   */
  safeAreaInsetTop?: boolean;

  /**
   * 左侧点击事件
   */
  onClickLeft?: MouseEventHandler<HTMLDivElement>;

  /**
   * 右侧点击事件
   */
  onClickRight?: MouseEventHandler<HTMLDivElement>;
}
