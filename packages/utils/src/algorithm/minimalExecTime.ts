/**
 * 在完成最下层任务的同时
 * 尽量把上层的任务往处理时间最短的任务上靠
 */
class TreeNode {
  val: number;
  left: TreeNode;
  right: TreeNode;
  constructor(val: number, left: TreeNode, right: TreeNode) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function minimalExecTime(root: TreeNode): number {
  if (!root) {
    return 0;
  }

  let time = 0;
  time += root.val;

  let nextLevelTime = [root];

  console.log(nextLevelTime);

  return time;
};

console.log(minimalExecTime);
