class SegmentNode {
  left: SegmentNode = null!;
  right: SegmentNode = null!;
  value: boolean = false;
  add: boolean = false;
}

class SegmentTree {
  root: SegmentNode;

  constructor() {
    this.root = new SegmentNode();
  }

  update(
    node: SegmentNode,
    minStart: number,
    maxEnd: number,
    start: number,
    end: number,
    value: boolean
  ) {
    if (start <= minStart && maxEnd <= end) {
      node.value = value;
      node.add = true;
      return;
    }
    this.pushdown(node);
    const middle = Math.floor((minStart + maxEnd) / 2);
    if (start <= middle) {
      this.update(node.left, minStart, middle, start, end, value);
    }
    if (end > middle) {
      this.update(node.right, middle + 1, maxEnd, start, end, value);
    }
    this.pushup(node);
  }

  /**
   * 由子节点计算父节点的信息
   */
  pushup(node: SegmentNode) {
    node.value = node.left.value && node.right.value;
  }

  /**
   * 懒标记
   * 涉及区间修改时需要
   * 当前父节点的修改信息下传到子节点
   */
  pushdown(node: SegmentNode) {
    if (!node.left) {
      node.left = new SegmentNode();
    }
    if (!node.right) {
      node.right = new SegmentNode();
    }
    if (!node.add) {
      return;
    }
    node.left.add = node.right.add = true;
    node.left.value = node.right.value = node.value;
    node.add = false;
  }

  query(
    node: SegmentNode,
    minStart: number,
    maxEnd: number,
    start: number,
    end: number
  ): boolean {
    if (start <= minStart && maxEnd <= end) {
      return node.value;
    }
    this.pushdown(node);
    let ans = true;
    const middle = Math.floor((minStart + maxEnd) / 2);
    if (start <= middle) {
      ans = ans && this.query(node.left, minStart, middle, start, end);
    }
    if (end > middle) {
      ans = ans && this.query(node.right, middle + 1, maxEnd, start, end);
    }
    return ans;
  }
}

export default SegmentTree;
