/**
 * 纯数值计算
 * 不包含任何dom操作
 *
 * @filename packages/web-utils/src/utils/Scroller.ts
 * @author Mr Prince
 * @date 2023-03-03 15:36:22
 */

import { Tween } from '@mrtujiawei/utils';
import { requestAnimFrame } from './index';

class Scroller {
  /**
   * 如果超过 TIME_LIMIT ms 没有移动
   * 不需要继续滚动
   */
  TIME_LIMIT = 50;

  /**
   * 滚动系数: 计算滚动距离用
   * 越大，滚动距离越远
   */
  SCROLL_COE = 500;

  /**
   * 滚动时间系数: 计算滚动时间用
   * 越大，滚动时间越长
   */
  TIME_COE = 1.3;

  /**
   * 更新间隔
   */
  INTERVAL = 1000 / 60;

  /**
   * 拉力系数
   */
  TC = 0.25;

  /**
   * 当前 Y 轴的偏移
   */
  translate = 0;

  /**
   * touchstart 时的位置
   */
  start = 0;

  /**
   * 最后一次触发事件的位置
   */
  end = 0;

  /**
   * touchstart 时的 translateY
   * 后续计算 translateY 时需要用到
   */
  offset = 0;

  /**
   * 最后一次触发事件的时间
   */
  time = 0;

  /**
   * 当前的速度
   * 只在 touchmove 事件中计算
   * touchend 中的时间 可能喝 touchmove 时间一样
   */
  speed = 0;

  /**
   * 运动的ID, 如果运动的id和当前的ID不一样，则上一个运动停止
   */
  playId = 0;

  /**
   * 更新位置用
   */
  callback = (_translate: number) => {};

  /**
   * 能够向下滚动的距离, 小于等于0的一个值
   */
  min = 0;

  /**
   * 向上滚动的距离，就是 0, 表示到容器顶部为止
   */
  max = 0;

  constructor(callback: (translate: number) => void) {
    this.callback = callback;
  }

  /**
   * touchstart 事件触发
   * 更新一些默认值
   * @param pos 当前位置
   * @param min 能够偏移的最小值
   */
  touchStart(pos: number, min: number) {
    this.stop();
    this.start = this.end = pos;
    this.offset = this.translate;
    this.time = this.now();
    this.speed = 0;
    this.min = Math.min(min, 0);

    // 处理弹性过程中触发 touch 事件时的瞬间移动
    if (this.offset > this.max) {
      this.offset /= this.TC;
    } else if (this.offset < this.min) {
      this.offset = (this.offset - this.min) / this.TC + this.min;
    }
  }

  /**
   * touchmove 事件触发
   * 计算最新的 translateY 和 speed
   * 更新 time 和 endY
   * @param pos 当前位置
   */
  touchMove(pos: number) {
    this.translate = this.bounce(this.offset + pos - this.start);
    this.callback(this.translate);
    const time = this.now();
    this.speed = this.testSpeed(pos, time);
    this.time = time;
    this.end = pos;
  }

  /**
   * touchend 事件触发
   * @param pos 当前位置
   */
  touchEnd(pos: number) {
    const time = this.now();
    if (this.time + this.TIME_LIMIT <= time) {
      this.speed = 0;
    }

    // 滚动距离
    let dist = this.speed * this.SCROLL_COE;
    // 是否需要回弹
    let back = false;
    // 开始位置
    let start = this.bounce(this.offset + pos - this.start);
    let target = start + dist;

    if (target > this.max) {
      dist = -start;
      back = true;
    } else if (target < this.min) {
      dist = this.min - start;
      back = true;
    }
    const duration = Math.abs(dist) * this.TIME_COE + (back ? 500 : 0);
    const intervals = Math.ceil(duration / this.INTERVAL);
    this.animate(start, dist, intervals, back);
  }

  /**
   * 弹性计算
   * @param pos 当前位置
   */
  bounce(pos: number) {
    if (pos > this.max) {
      pos *= this.TC;
    } else if (pos < this.min) {
      pos = (pos - this.min) * this.TC + this.min;
    }

    return pos;
  }

  /**
   * 测速
   * 可能出现新的时间和原来的时间一样
   * @param pos 当前位置
   * @param time 当前时间
   */
  testSpeed(pos: number, time: number) {
    return (pos - this.end) / Math.max(time - this.time, 1);
  }

  /**
   * 开始自动滚动
   * @param start 开始位置
   * @param change 变化的距离
   * @param intervals 时间间隔数
   * @param back 是否需要回弹
   */
  animate(start: number, change: number, intervals: number, back: boolean) {
    const id = ++this.playId;
    let i = 0;
    const callback = () => {
      // 开始前判断是否已经停止运动
      if (this.playId != id) {
        return;
      }
      if (back) {
        this.translate = Tween.Back.easeOut(i++, start, change, intervals);
      } else {
        this.translate = Tween.Quadratic.easeOut(i++, start, change, intervals);
      }
      this.callback(this.translate);
      // 下一个运动是否还需要继续执行
      if (i < intervals) {
        requestAnimFrame(callback);
      }
    };
    if (intervals != 0) {
      callback();
      requestAnimFrame(callback);
    }
  }

  /**
   * 停止自动滚动: 手动点击
   */
  stop() {
    // 以防万一，实际不太可能达到
    if (this.playId >= Number.MAX_SAFE_INTEGER) {
      this.playId = 0;
    }
    this.playId++;
  }

  /**
   * 获取当前时间
   */
  now() {
    return new Date().getTime();
  }

  /**
   * 添加事件绑定
   */
  addEvent(el: HTMLElement) {
    const parentNode = el?.parentNode! as HTMLElement;
    const touchStart = (e: TouchEvent) => {
      const min = parentNode.clientHeight - el?.offsetHeight;
      this.touchStart(e.changedTouches[0].pageY, min);
    };

    const touchMove = (e: TouchEvent) => {
      this.touchMove(e.changedTouches[0].pageY);
    };

    const touchEnd = (e: TouchEvent) => {
      this.touchEnd(e.changedTouches[0].pageY);
    };

    const option: AddEventListenerOptions = {
      passive: false,
    };

    parentNode.addEventListener('touchstart', touchStart, option);
    parentNode.addEventListener('touchmove', touchMove, option);
    parentNode.addEventListener('touchend', touchEnd, option);

    return () => {
      parentNode.removeEventListener('touchstart', touchStart, option);
      parentNode.removeEventListener('touchmove', touchMove, option);
      parentNode.removeEventListener('touchend', touchEnd, option);
    };
  }
}

export default Scroller;
