import { Logger } from '@mrtujiawei/utils';

export const logger = Logger.getLogger();

class InvalidAgrumentsError extends Error {
  constructor(message = 'Invalid Arguments') {
    super(message);
  }
}

/**
 * 格式化参数
 */
export const formatArgvs = () => {
  type Options = {
    m3u8: string;
    [key: string]: string;
  };

  const argvs = process.argv.slice(2);
  const defaultKey = 'm3u8';
  let result: Options = {
    m3u8: '',
  };

  let key = '';
  argvs.forEach(argv => {
    if (argv.startsWith('-')) {
      key = argv.slice(1);
    } else {
      result[key || defaultKey] = argv;
      key = '';
    }
  });

  return result;
};

/**
 * @param - url http或https开头的url
 * @returns - 返回http或https开头的域名地址
 */
export const getDomain = (url: string): string => {
  checkUrl(url);
  const match = url.match(/^http[s]\:\/\/[^/]+/) || [];
  return match[0] || '';
};

/**
 * 是否是m3u8的注释行
 */
export const isComment = (line: string) => {
  if (!line) {
    return false;
  }
  return line.startsWith('#');
};

/**
 * 判断是否是完整的url, http开头
 * @param  url
 * @returns
 */
export const isCompleteUrl = (url: string): boolean => {
  if (!url) {
    return false;
  }
  return url.startsWith('http');
}

/**
 * 判断是否是完整的url, http开头
 * @param {string} url
 */
const checkUrl = (url: string): void => {
  if (!isCompleteUrl(url)) {
    throw new InvalidAgrumentsError();
  }
};
