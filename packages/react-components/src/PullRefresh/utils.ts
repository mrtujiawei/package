import { DIRECTION } from './enums';

/**
 * 获取方向
 * @param x 水平方向的位移
 * @param y 垂直方向的位移
 */
export function getDirection(x: number, y: number) {
  if (x > y) {
    return DIRECTION.HORIZONTAL;
  }

  if (y > x) {
    return DIRECTION.VERTICAL;
  }

  return DIRECTION.DEFAULT;
}
