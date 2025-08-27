/**
 * 前端分页
 * 数据逻辑处理
 * 主要是我不知道
 * 怎么把jsx或者dom操作等编译到这里面去
 */
interface TableData {
  pageNum: number;
  pageSize: number;
  total: number;
  list: any[];
}

interface Callback {
  (tableData: TableData): void;
}

class Pagination {
  private tableData: TableData;
  private callbacks: Callback[] = [];

  constructor(tableData: TableData) {
    this.tableData = tableData;
  }

  setOrder(key: string = 'order') {
    this.tableData.list.forEach((item, index) => {
      item[key] = index + 1;
    });
  }

  /**
   * 必须是能够排序的
   * 如果不能够排序，就另加一个字段来排序
   */
  sort(key: string, order: 'asc' | 'desc' = 'desc') {
    if (order == 'asc') {
      this.tableData.list.sort((a, b) => a[key] - b[key]);
    } else {
      this.tableData.list.sort((a, b) => b[key] - a[key]);
    }
  }

  /**
   * 跳转到指定页
   * 不传参默认跳转当前页
   * 不返回任何数据
   * 需要监听subscribe
   */
  to(pageNum?: number) {
    pageNum = pageNum || this.tableData.pageNum;
    this.tableData.pageNum = pageNum;
    let { pageSize } = this.tableData;
    let start = (pageNum - 1) * pageSize;
    let end = start + pageSize;
    let list = this.tableData.list.slice(start, end);
    this.publish({
      ...this.tableData,
      list,
    });
    return list;
  }

  setPageSize(pageSize: number) {
    this.tableData.pageSize = pageSize;
  }

  getPageCount() {
    return Math.ceil(this.tableData.total / this.tableData.pageSize);
  }

  private publish(tableData: TableData) {
    this.callbacks.forEach((callback) => callback(tableData));
  }

  subscribe(callback: Callback) {
    this.callbacks.push(callback);
    return callback;
  }

  /**
   * 取消订阅
   */
  unsubscribe(callback: Callback) {
    const index = this.callbacks.indexOf(callback);
    if (-1 != index) {
      this.callbacks.splice(index, 1);
    }
  }
}

export default Pagination;
