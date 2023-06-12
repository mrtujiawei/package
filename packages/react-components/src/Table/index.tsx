import { FC, PropsWithChildren } from 'react';
import { createBEM } from '@mrtujiawei/utils';
import classNames from 'classnames';

interface Column {
  title: string;
  dataIndex: string;
}

type Props = PropsWithChildren<{
  columns: Column[];
  dataList: Record<string, any>[];
  rowKey?: string;

  /**
   * table 类名
   */
  className?: string;
}>;

/**
 * 不做复杂的样式，逻辑功能
 * 只是减少渲染的时候写的标签
 */
const Table: FC<Props> = (props) => {
  const columns = props.columns;
  const dataList = props.dataList;

  const bem = createBEM('t-table');

  // 检查
  if (!columns) {
    throw new Error('columns must not be null or undefined');
  }

  if (!dataList) {
    throw new Error('dataList must not be null or undefined');
  }

  return (
    <table className={classNames(props.className, bem())}>
      <thead className={classNames(bem('head'))}>
        <tr className={classNames(bem('head', 'row'))}>
          {columns?.map((column, index) => (
            <th key={index} className={classNames(bem('th'))}>
              {column?.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={classNames(bem('body'))}>
        {dataList.map((item, i) => (
          <tr
            key={item?.[props.rowKey!] ?? item?.key ?? i}
            className={classNames(bem('body', 'row'))}
          >
            {columns.map((column, j) => (
              <td key={j} className={classNames(bem('td'))}>
                {item?.[column?.dataIndex]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
