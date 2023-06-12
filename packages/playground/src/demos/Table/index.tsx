import { Table as TableComp } from '@mrtujiawei/react-components';
import './styles.less';

const Table = () => {
  return (
    <div className="table-demo">
      <TableComp
        columns={[
          {
            title: '姓名',
            dataIndex: 'name',
          },
          {
            title: '年龄',
            dataIndex: 'age',
          },
        ]}
        dataList={[
          {
            name: '屠佳伟',
            age: 20,
          },
          {
            name: '陈绾',
            age: 19,
          },
        ]}
      ></TableComp>
    </div>
  );
};

export default Table;
