/**
 * 通知工具
 * @filename packages/web-utils/src/utils/NotificationUtil.ts
 * @author Mr Prince
 * @date 2023-04-14 14:09:34
 */
class NotificationUtil {
  private static readonly GRANTED = 'granted';
  private static readonly Notification = window.Notification;
  static readonly suppot = 'Notification' in window;

  /**
   * 判断是否有权限
   */
  static hasPermission() {
    return this.suppot && this.Notification.permission == this.GRANTED;
  }

  /**
   * 请求权限
   */
  static requestPermission() {
    return new Promise((resolve, reject) => {
      this.Notification.requestPermission((permission) => {
        if (permission == this.GRANTED) {
          resolve(null);
        } else {
          reject('');
        }
      });
    });
  }

  /**
   * 发送通知
   */
  static send(title: string, options?: NotificationOptions) {
    return new this.Notification(title, options);
  }
}

export default NotificationUtil;
