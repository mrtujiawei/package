/**
 * Swipe to show operate btn
 * need operate btn is out of content box
 *
 * @filename packages/web-utils/src/utils/Swipe.ts
 * @author Mr Prince
 * @date 2023-03-07 16:17:17
 */
import { Counter } from '@mrtujiawei/utils';
import { requestAnimFrame } from '.';

enum DIRECTION {
  PENDING,
  HORIZONTAL,
  VERTICAL,
}

class Swipe {
  /**
   * Move direction
   */
  private direction = DIRECTION.PENDING;

  /**
   * After move exceed limit * limitRate
   * should auto move to another side
   */
  private limit = 0;

  private limitRate = 1 / 3;

  /**
   * start position
   */
  private start = {
    x: 0,
    y: 0,
  };

  /**
   * start position for offset
   */
  private init = {
    x: 0,
  };

  /**
   * current position
   */
  private current = {
    x: 0,
  };

  private get turnLimit() {
    return this.limit * this.limitRate;
  }

  private counter = new Counter();

  private playId = 0;

  /**
   * A frame move limit
   */
  private moveLimit = 3;

  /**
   * @param updateCallback update offset outside
   */
  constructor(private updateCallback: (x: number) => void) {}

  /**
   * Update position outsize
   */
  private update(x: number) {
    this.current.x = x;
    this.updateCallback(x);
  }

  setLimit(limit: number) {
    this.limit = limit;
  }

  setLimiRate(limitRate: number) {
    this.limitRate = limitRate;
  }

  touchStart(x: number, y: number) {
    this.playId = this.counter.next();
    this.direction = DIRECTION.PENDING;
    this.start.x = x;
    this.start.y = y;
    this.init.x = this.current.x;
  }

  touchMove(x: number, y: number) {
    // First move, ensure direction
    if (this.direction == DIRECTION.PENDING) {
      const dx = Math.abs(x - this.start.x);
      const dy = Math.abs(y - this.start.y);
      this.direction = dx >= dy ? DIRECTION.HORIZONTAL : DIRECTION.VERTICAL;
    }

    // Direction is vertical, do nothing
    if (this.direction == DIRECTION.VERTICAL) {
      return;
    }

    // Relative move offset
    let offset = x - this.start.x;

    // Move position
    let currentX = this.init.x + offset;

    // when currentX out of boundary
    // update start.x to adapt next move
    if (currentX < -this.limit) {
      currentX = -this.limit;
      this.init.x = currentX - offset;
    } else if (currentX >= 0) {
      currentX = 0;
      this.init.x = -offset;
    }

    this.update(currentX);
  }

  touchEnd(x: number, _y?: number) {
    if (this.direction != DIRECTION.HORIZONTAL) {
      return;
    }
    let offset = x - this.start.x;
    let currentX = this.init.x + offset;

    // Ensurn which side to move
    if (offset <= -this.turnLimit) {
      currentX = -this.limit;
    } else if (offset >= this.turnLimit) {
      currentX = 0;
    } else {
      if (offset > 0) {
        currentX = -this.limit;
      } else if (offset < 0) {
        currentX = 0;
      } else {
        if (this.init.x + this.limit / 2 >= 0) {
          currentX = 0;
        } else {
          currentX = -this.limit;
        }
      }
    }

    this.move(currentX);
  }

  /**
   * Move to x smoothly
   */
  move(x: number) {
    const playId = this.playId;
    const callback = () => {
      if (playId != this.playId || x == this.current.x) {
        return;
      }
      let target = this.current.x;
      if (x < this.current.x) {
        target = Math.max(this.current.x - this.moveLimit, x);
      } else {
        target = Math.min(this.current.x + this.moveLimit, x);
      }
      this.update(target);
      requestAnimFrame(callback);
    };

    requestAnimFrame(callback);
  }
}

export default Swipe;
