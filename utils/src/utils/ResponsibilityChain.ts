/**
 * 职责链模式
 * @filename: ResponsibilityChain.js
 * @author: Mr Prince
 * @date: 2020-09-09 20:19:27
 */

class ResponsibilityChain {
  chain: Function[] = [];

  /**
   * 验证一些事情，如果返回的值判断为true就不通过
   */
  add(callback: Function): void {
    this.chain.push(callback);
  }

  /**
   * 开始校验
   */
  doAction(...args: any[]): any {
    let res: any;
    for(let i = 0; i < this.chain.length; i++) {
      res = this.chain[i](...args);
      if(res) {
        break;
      }
    }
    return res;
  }
}

export default ResponsibilityChain;
