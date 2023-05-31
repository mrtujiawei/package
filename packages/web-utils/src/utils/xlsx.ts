/**
 * excel 导出
 * @filename: src/utils/xlsx.ts
 * @author: Mr Prince
 * @date: 2022-03-25 10:35:18
 */
import XLSX from 'xlsx';
import { blobToArrayBuffer } from '.';

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
  normalize?: (value: any) => string | number;
};

type FormattedData = Record<string, string | number>;

const WRITING_OPTIONS: XLSX.WritingOptions = {
  bookType: 'xlsx',
  bookSST: false,
  type: 'array',
};

const normalizeFilename = (filename: string) =>
  /\.xlsx$/.test(filename) ? filename : `${filename}.xlsx`;

/**
 * @private
 *
 * 格式化数据
 * @param columns - 列属性
 * @param dataList - 数据
 */
const formatData = (columns: Columns[], dataList: FormattedData[]) =>
  dataList.map((dataItem) => {
    // 优化点
    const data: FormattedData = {};
    columns.forEach((column) => {
      if (column.normalize) {
        data[column.title] = column.normalize(dataItem[column.dataIndex]);
      } else {
        data[column.title] = dataItem[column.dataIndex];
      }
    });
    return data;
  });

/**
 * @private
 *
 * 生成工作簿
 *
 * 其实可以生成多个 sheet，
 * 生成多个 sheet 的话调用太麻烦了
 */
const createWorkBook = (data: FormattedData[]): XLSX.WorkBook => ({
  SheetNames: ['Sheet1'],
  Sheets: {
    Sheet1: XLSX.utils.json_to_sheet(data),
  },
  Props: {},
});

/**
 * @public
 *
 * @param columns - 列属性
 * @param dataList - 数据
 * @param filename - 文件名，不需要带.xlsx
 */
export function exportExcel(
  columns: Columns[],
  dataList: FormattedData[],
  filename: string
) {
  XLSX.writeFile(
    createWorkBook(formatData(columns, dataList)),
    normalizeFilename(filename),
    WRITING_OPTIONS
  );
}

/**
 * @public
 *
 * 读取excel文件
 *
 * 一般情况下直接取下标 0 就可以
 */
export async function readExcel(file: File) {
  const workBook = XLSX.read(await blobToArrayBuffer(file), {
    type: 'array',
  });
  const data = workBook.SheetNames.map((sheetName) =>
    XLSX.utils.sheet_to_json(workBook.Sheets[sheetName])
  );
  return data;
}

/**
 * @public
 *
 * 生成 xlsx 文件
 */
export function createExcel(
  columns: Columns[],
  dataList: FormattedData[],
  filename: string
): File {
  return new File(
    [
      XLSX.write(
        createWorkBook(formatData(columns, dataList)),
        WRITING_OPTIONS
      ),
    ],
    normalizeFilename(filename)
  );
}
