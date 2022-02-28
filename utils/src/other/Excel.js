import XLSX from 'xlsx';

/**
 * 简单封装
 *
 * @param {object[]} tableColumns
 * @param {object[]} tableData
 * @param {string} filename
 */
export function exportData(tableColumns, tableData, filename) {
  let data = [];

  for (let i = 0; i < tableData.length; i++) {
    data[i] = {};
  }

  tableColumns.forEach((column) => {
    tableData.forEach((item, index) => {
      data[index][column.title] = item[column.value];
    });
  });

  jsonToExcel(data, filename);
}

/**
 * 导出excel(json)
 *
 * @param {object[]} data - 要导出的数据，key为列名
 * @param {string} filename - 导出文件名
 */
export function jsonToExcel(data, filename) {
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
}

/**
 * 读取excel
 * 只能在网页上使用 (FileReader)
 * 还需要根据data转化一下,title
 */
export async function readXLSX(file) {
  const XLSX = {};
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = (e) => {
      const data = e.target.result;
      let workBook = XLSX.read(data, {
        type: 'binary',
      });
      const sheetName = workBook.SheetNames[0];
      const sheet = workBook.Sheets[sheetName];
      try {
        let data = XLSX.utils.make_json(sheet);
        resolve(data);
      } catch {
        error('解析失败');
        reject();
      }
    };
    reader.readAsBinaryString(file);
  });
}

/**
 * 分页导出
 * @param api
 * @param searchKey
 */
export async function pageExport(api, searchKey, pageSize = 100) {
  let list = [];
  let data;
  let formContent = {
    ...searchKey,
    pageNum: 1,
    pageSize,
  };
  do {
    data = await request('get', api, formContent);
    formContent.pageNum++;
    list = list.concat(data.list);
    if (data.isLastPage) {
      break;
    }
  } while (true);
  return list;
}
