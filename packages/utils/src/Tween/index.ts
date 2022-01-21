/**
 * 各种运动计算方式
 * 补间动画: 用平滑的方式更改对象的属性
 * @filename packages/utils/src/Tween/index.ts
 * @author Mr Prince
 * @date 2023-03-02 13:57:54
 */

/**
 * t: current time（当前时间）；
 * b: beginning value（初始值）；
 * c: change in value（变化量）；
 * d: duration（持续时间）
 * s: （回弹系数）
 * a: （抖动振幅）
 * p: （抖动频率）
 */
class Tween {
  /**
   * 一次方
   */
  static linear(t: number, b: number, c: number, d: number) {
    return (c * t) / d + b;
  }

  /**
   * 二次方
   */
  static Quadratic = class Quadratic {
    static easeIn(t: number, b: number, c: number, d: number) {
      return c * (t /= d) * t + b;
    }

    static easeOut(t: number, b: number, c: number, d: number) {
      return -c * (t /= d) * (t - 2) + b;
    }

    static easeInOut(t: number, b: number, c: number, d: number) {
      if ((t /= d / 2) < 1) {
        return (c / 2) * t * t + b;
      }
      return (-c / 2) * (--t * (t - 2) - 1) + b;
    }
  };

  /**
   * 三次方
   */
  static Cubic = class Cubic {
    static easeIn(t: number, b: number, c: number, d: number) {
      return c * (t /= d) * t * t + b;
    }

    static easeOut(t: number, b: number, c: number, d: number) {
      return c * ((t = t / d - 1) * t * t + 1) + b;
    }

    static easeInOut(t: number, b: number, c: number, d: number) {
      if ((t /= d / 2) < 1) {
        return (c / 2) * t * t * t + b;
      }
      return (c / 2) * ((t -= 2) * t * t + 2) + b;
    }
  };

  /**
   * 四次方
   */
  static Quartic = class Quartic {
    static easeIn(t: number, b: number, c: number, d: number) {
      return c * (t /= d) * t * t * t + b;
    }

    static easeOut(t: number, b: number, c: number, d: number) {
      return -c * ((t = t / d - 1) * t * t * t - 1) + b;
    }

    static easeInOut(t: number, b: number, c: number, d: number) {
      if ((t /= d / 2) < 1) {
        return (c / 2) * t * t * t * t + b;
      }
      return (-c / 2) * ((t -= 2) * t * t * t - 2) + b;
    }
  };

  /**
   * 五次方
   */
  static Quintic = class Quintic {
    static easeIn(t: number, b: number, c: number, d: number) {
      return c * (t /= d) * t * t * t * t + b;
    }

    static easeOut(t: number, b: number, c: number, d: number) {
      return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
    }

    static easeInOut(t: number, b: number, c: number, d: number) {
      if ((t /= d / 2) < 1) {
        return (c / 2) * t * t * t * t * t + b;
      }
      return (c / 2) * ((t -= 2) * t * t * t * t + 2) + b;
    }
  };

  /**
   * 正弦
   */
  static Sinusoidal = class Sinusoidal {
    static easeIn(t: number, b: number, c: number, d: number) {
      return -c * Math.cos((t / d) * (Math.PI / 2)) + c + b;
    }

    static easeOut(t: number, b: number, c: number, d: number) {
      return c * Math.sin((t / d) * (Math.PI / 2)) + b;
    }

    static easeInOut(t: number, b: number, c: number, d: number) {
      return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + b;
    }
  };

  /**
   * 指数
   */
  static Exponential = class Exponential {
    static easeIn(t: number, b: number, c: number, d: number) {
      return t == 0 ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
    }

    static easeOut(t: number, b: number, c: number, d: number) {
      return t == d ? b + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + b;
    }

    static easeInOut(t: number, b: number, c: number, d: number) {
      if (t == 0) {
        return b;
      }
      if (t == d) {
        return b + c;
      }
      if ((t /= d / 2) < 1) {
        return (c / 2) * Math.pow(2, 10 * (t - 1)) + b;
      }
      return (c / 2) * (-Math.pow(2, -10 * --t) + 2) + b;
    }
  };

  /**
   * 圆
   */
  static Circular = class Circular {
    static easeIn(t: number, b: number, c: number, d: number) {
      return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
    }

    static easeOut(t: number, b: number, c: number, d: number) {
      return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
    }

    static easeInOut(t: number, b: number, c: number, d: number) {
      if ((t /= d / 2) < 1) {
        return (-c / 2) * (Math.sqrt(1 - t * t) - 1) + b;
      }
      return (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
    }
  };

  /**
   * 指数衰减
   */
  static Elastic = class Elastic {
    static easeIn(
      t: number,
      b: number,
      c: number,
      d: number,
      a?: number,
      p?: number
    ) {
      if (t == 0) return b;
      if ((t /= d) == 1) return b + c;
      if (!p) p = d * 0.3;
      if (!a || a < Math.abs(c)) {
        a = c;
        var s = p / 4;
      } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
      return (
        -(
          a *
          Math.pow(2, 10 * (t -= 1)) *
          Math.sin(((t * d - s) * (2 * Math.PI)) / p)
        ) + b
      );
    }

    static easeOut(
      t: number,
      b: number,
      c: number,
      d: number,
      a?: number,
      p?: number
    ) {
      if (t == 0) return b;
      if ((t /= d) == 1) return b + c;
      if (!p) p = d * 0.3;
      if (!a || a < Math.abs(c)) {
        a = c;
        var s = p / 4;
      } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
      return (
        a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
        c +
        b
      );
    }

    static easeInOut(
      t: number,
      b: number,
      c: number,
      d: number,
      a?: number,
      p?: number
    ) {
      if (t == 0) return b;
      if ((t /= d / 2) == 2) return b + c;
      if (!p) p = d * (0.3 * 1.5);
      if (!a || a < Math.abs(c)) {
        a = c;
        var s = p / 4;
      } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
      if (t < 1)
        return (
          -0.5 *
            (a *
              Math.pow(2, 10 * (t -= 1)) *
              Math.sin(((t * d - s) * (2 * Math.PI)) / p)) +
          b
        );
      return (
        a *
          Math.pow(2, -10 * (t -= 1)) *
          Math.sin(((t * d - s) * (2 * Math.PI)) / p) *
          0.5 +
        c +
        b
      );
    }
  };

  /**
   * 超过范围的三次方
   */
  static Back = class Back {
    /**
     * 回退系数
     * 越大，回退得越多
     */
    static s = 1.70158;
    static easeIn(t: number, b: number, c: number, d: number, s: number = Back.s) {
      return c * (t /= d) * t * ((s + 1) * t - s) + b;
    }

    static easeOut(t: number, b: number, c: number, d: number, s: number = Back.s) {
      return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
    }

    static easeInOut(t: number, b: number, c: number, d: number, s: number = Back.s) {
      if ((t /= d / 2) < 1)
        return (c / 2) * (t * t * (((s *= 1.525) + 1) * t - s)) + b;
      return (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + b;
    }
  };

  /**
   * 指数衰减的反弹
   */
  static Bounce = class Bounce {
    static easeIn(t: number, b: number, c: number, d: number) {
      return c - Tween.Bounce.easeOut(d - t, 0, c, d) + b;
    }

    static easeOut(t: number, b: number, c: number, d: number) {
      if ((t /= d) < 1 / 2.75) {
        return c * (7.5625 * t * t) + b;
      } else if (t < 2 / 2.75) {
        return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
      } else if (t < 2.5 / 2.75) {
        return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
      } else {
        return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
      }
    }

    static easeInOut(t: number, b: number, c: number, d: number) {
      if (t < d / 2) return Tween.Bounce.easeIn(t * 2, 0, c, d) * 0.5 + b;
      else return Tween.Bounce.easeOut(t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
    }
  };
}

export default Tween;
