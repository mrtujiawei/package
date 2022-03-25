/**
 * excel 导出
 * @filename: src/utils/xlsx.ts
 * @author: Mr Prince
 * @date: 2022-03-25 10:35:18
 */
import XLSX from 'xlsx';

type Columns = {
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
  normalize: (value: any) => string | number;
};

type FormattedData = Record<string, string | number>;

const json2Excel = (data: FormattedData[], filename: string) => {
  const workBook = {
    SheetNames: ['Sheet1'],
    Sheets: {
      Sheet1: XLSX.utils.json_to_sheet(data),
    },
    Props: {},
  };
  XLSX.writeFile(workBook, filename + '.xlsx', {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary',
  });
};

/**
 * @param columns - 列属性
 * @param dataList - 数据
 * @param filename - 文件名，不需要带.xlsx
 */
const excelExport = (
  columns: Columns[],
  dataList: FormattedData[],
  filename: string
) => {
  const formatedData: FormattedData[] = [];
  dataList.forEach((dataItem) => {
    const data: Record<string, string | number> = {};
    columns.forEach((column) => {
      if (column.normalize) {
        data[column.title] = column.normalize(dataItem[column.dataIndex]);
      } else {
        data[column.title] = dataItem[column.dataIndex];
      }
    });
    formatedData.push(data);
  });

  json2Excel(formatedData, filename);
};

export default excelExport;
