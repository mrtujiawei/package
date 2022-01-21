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

/**
 * 格式化数据
 * @param columns - 列属性
 * @param dataList - 数据
 */
function formatData(columns: Columns[], dataList: FormattedData[]) {
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
  return formatedData;
}

/**
 * 生成工作簿
 */
function createWorkBook(data: FormattedData[]) {
  const workBook: XLSX.WorkBook = {
    SheetNames: ['Sheet1'],
    Sheets: {
      Sheet1: XLSX.utils.json_to_sheet(data),
    },
    Props: {},
  };
  return workBook;
}

/**
 * @param columns - 列属性
 * @param dataList - 数据
 * @param filename - 文件名，不需要带.xlsx
 */
export function excelExport(
  columns: Columns[],
  dataList: FormattedData[],
  filename: string
) {
  const data = formatData(columns, dataList);
  const workBook = createWorkBook(data);
  XLSX.writeFile(workBook, filename + '.xlsx', {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary',
  });
}

/**
 * 读取excel文件
 */
export async function readXLSX(file: File) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const data = e.target!.result;
      let workBook = XLSX.read(data, {
        type: 'binary',
      });
      const sheetName = workBook.SheetNames[0];
      const sheet = workBook.Sheets[sheetName];
      try {
        // @ts-ignore
        let data = XLSX.utils.make_json(sheet);
        resolve(data);
      } catch (e) {
        reject(e);
      }
    };
    reader.readAsBinaryString(file);
  });
}

/**
 * 生成 xlsx 文件
 */
export function generateXLSXFile(
  columns: Columns[],
  dataList: FormattedData[],
  filename: string
): File {
  const formatedData = formatData(columns, dataList);
  const workBook = createWorkBook(formatedData);
  const data = XLSX.write(workBook, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'array',
  });
  const file = new File([data], filename + '.xlsx');
  return file;
}
