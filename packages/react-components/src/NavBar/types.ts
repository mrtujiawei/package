import { MouseEventHandler, ReactNode, PropsWithChildren } from 'react';

export type NavBarProps = PropsWithChildren<{
  /**
   * 是否固定在顶部
   *
   * @default false
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
   *
   * @default true
   */
  leftArrow?: boolean;

  /**
   * 是否在标签位置生成一个同样高度的容器占位
   */
  placeholder?: boolean;

  /**
   * 是否显示下边框
   *
   * @default true
   */
  border?: boolean;

  /**
   * 是否留安全顶部距离
   *
   * @default true
   */
  safeAreaInsetTop?: boolean;

  /**
   * 左侧点击事件
   */
  onClickLeft?: MouseEventHandler<HTMLDivElement>;

  /**
   * 中间点击事件
   */
  onClickCenter?: MouseEventHandler<HTMLDivElement>;

  /**
   * 右侧点击事件
   */
  onClickRight?: MouseEventHandler<HTMLDivElement>;
}>;
