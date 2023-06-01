import { utils } from 'xlsx';
import { Columns, FormattedData } from './types';

/**
 * 格式化文件名
 */
export const normalizeFilename = (filename: string) =>
  /\.xlsx$/.test(filename) ? filename : `${filename}.xlsx`;

/**
 * @private
 *
 * 格式化数据
 * @param columns - 列属性
 * @param dataList - 数据
 */
export const formatData = (columns: Columns[], dataList: FormattedData[]) => {
  const data: (string | number)[][] = Array.from(
    { length: dataList.length + 1 },
    () => new Array(columns.length)
  );

  columns.forEach((column, j) => {
    data[0][j] = column.title;
    dataList.forEach((item, i) => {
      if (column.normalize) {
        data[i + 1][j] = column.normalize(item[column.dataIndex]);
      } else {
        data[i + 1][j] = item[column.dataIndex];
      }
    });
  });

  return data;
};

/**
 * @private
 *
 * 生成工作簿
 *
 * 其实可以生成多个 sheet，
 * 生成多个 sheet 的话调用太麻烦了
 */
export const createWorkBook = (data: (string | number)[][]) => {
  const workBook = utils.book_new();
  const sheet = utils.aoa_to_sheet(data);
  utils.book_append_sheet(workBook, sheet);
  return workBook;
};
