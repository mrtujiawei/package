export type Columns = {
  /**
   * 标题
   */
  title: string;

  /**
   * 值的key
   */
  dataIndex: string;

  /**
   * 有些数值需要格式化，比如 bigint
   * 用这个函数名是防止重名
   */
  normalize?: (value: any) => string | number;
};

export type FormattedData = Record<string, string | number>;
