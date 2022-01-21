class TreeNode {
  /**
   * @param val 字符出现次数
   * @param char 待编码字符
   */
  constructor(
    public val: number,
    public char: string,
    public left: TreeNode | null = null,
    public right: TreeNode | null = null
  ) {}
}

export default TreeNode;
