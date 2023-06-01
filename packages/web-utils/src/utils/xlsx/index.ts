/**
 * excel 导出
 *
 * @filename packages/web-utils/src/utils/xlsx/xlsx.ts
 * @author Mr Prince
 * @date 2023-06-01 10:03:44
 */
import { read, write, writeFile, utils } from 'xlsx';
import { createWorkBook, formatData, normalizeFilename } from './utils';
import { WRITING_OPTIONS } from './option';
import { Columns, FormattedData } from './types';

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
  writeFile(
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
export async function readExcel<T extends Record<string, any>>(file: File) {
  const workBook = read(await file.arrayBuffer(), {
    type: 'array',
  });
  const data = workBook.SheetNames.map((sheetName) =>
    utils.sheet_to_json<T>(workBook.Sheets[sheetName])
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
    [write(createWorkBook(formatData(columns, dataList)), WRITING_OPTIONS)],
    normalizeFilename(filename)
  );
}
