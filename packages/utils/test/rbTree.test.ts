import { RBTree } from '../src/index';
import TreeNode from '../src/data-structure/RBTree/TreeNode';

const rbTree = new RBTree();

let treeNode = new TreeNode();
treeNode.key = 1;
treeNode.value = 1;
rbTree.insertMulti(treeNode);

for (let it = rbTree.rbegin(); !it.equals(rbTree.rend()); it.next()) {
  console.log(`key: ${it.key}, value: ${it.value}`);
}
