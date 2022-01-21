/**
 * 发布订阅
 * @filename: Events.ts
 * @author: Mr Prince
 * @date: 2021-09-24 10:42:28
 */
type Listener = (...args: any[]) => void;
type Listeners = Listener[];

class Events {
  private eventListeners = new Map<string, Listeners>();

  private getListeners(eventName: string): Listeners {
    return this.eventListeners.get(eventName) || [];
  }

  private setListeners(eventName: string, listeners: Listeners): void {
    if (0 == listeners.length) {
      this.eventListeners.delete(eventName);
    } else {
      this.eventListeners.set(eventName, listeners);
    }
  }

  on(eventName: string, listener: Listener): Listener {
    let listeners = this.getListeners(eventName);
    listeners.push(listener);
    this.setListeners(eventName, listeners);
    return listener;
  }

  /**
   * 只执行一次
   * 需要使用返回值来取消
   */
  once(eventName: string, listener: Listener): Listener {
    let listeners = this.getListeners(eventName);
    let listenerWrap: Listener = (...args: any[]) => {
      try {
        listener.apply(this, args);
      } catch (error) {
        this.emit('error', error);
      }
      this.off(eventName, listenerWrap);
    };

    listeners.push(listenerWrap);
    this.setListeners(eventName, listeners);

    return listenerWrap;
  }

  off(eventName: string, listener: Listener): void {
    let listeners = this.getListeners(eventName);
    let index = listeners.findIndex(item => item == listener);
    if (-1 != index) {
      listeners.splice(index, 1);
      this.setListeners(eventName, listeners);
    }
  }

  emit(eventName: string, ...args: any[]) {
    let listeners = this.getListeners(eventName);
    if ('error' == eventName && 0 == listeners.length) {
      // TODO 更好的处理方式
      console.error(...args);
    }
    listeners.forEach(listener => {
      try {
        listener.apply(this, args);
      } catch (error) {
        this.emit('error', error);
      }
    });
  }
}

export default Events;
