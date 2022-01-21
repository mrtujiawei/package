import { ReactNode } from 'react';

export interface Props {
  children: any;

  /**
   * 是否启用
   * @default false
   */
  disabled?: boolean;

  /**
   * 刷新成功
   */
  successElement?: ReactNode;

  /**
   * 下拉中
   */
  pullingElement?: ReactNode;

  /**
   * 释放中
   */
  loosingElement?: ReactNode;

  /**
   * 加载中
   */
  loadingElement?: ReactNode;

  /**
   * 成功提示时间 ms
   * @default 500
   */
  successDuration?: number;

  /**
   * 动画持续时间 ms
   * @default 300
   */
  animationDuration?: number;

  /**
   * 顶部高度 px
   * @default 50
   */
  headHeight?: number | string;

  /**
   * 触发下拉刷新的距离 px
   * @default 50
   */
  pullDistance?: number;

  /**
   * 是否正在刷新中
   */
  loading: boolean;

  /**
   * loading 变化
   */
  onLoading(loading: boolean): void;

  /**
   * 刷新
   */
  onRefresh: () => void;
}
