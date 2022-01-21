import http from 'http';
import https from 'https';
import logger from '../logger';
import { retry } from '@mrtujiawei/utils';

/**
 * http,https 适配
 * @param url - 根据请求其实使用相应的请求方式
 */
const getRequestSender = (url: string) => {
  if (/^https/.test(url)) {
    return https;
  }
  return http;
};

/**
 * 判断请求是否需要重定向
 */
const isRedirect = (message: http.IncomingMessage) => {
  const statusCode = String(message.statusCode as number);

  if ('3' == statusCode[0]) {
    return true;
  }

  return false;
};

/**
 * 请求重定向
 */
const redirect = (message: http.IncomingMessage, originUrl: string) => {
  let location = message.headers.location as string;
  if (location.startsWith('//')) {
    location = (/^https/.test(originUrl) ? 'https:' : 'http:') + location;
  }

  logger.trace('请求重定向');
  logger.trace(`${originUrl} => ${location}`);

  return request(location);
};

/**
 * 请求发送工具
 */
const request = (url: string): Promise<any[]> => {
  logger.trace(`request ${url}`);

  const requestSender = getRequestSender(url);

  /**
   * 请求超时时间
   */
  const timeout = 60 * 1000;

  return new Promise((resolve, reject) => {
    // 超时处理
    setTimeout(() => {
      reject(new Error('timeout'));
    }, timeout);

    const req = requestSender.request(url, {
      timeout,
    }, (res) => {
      if (isRedirect(res)) {
        return resolve(redirect(res, url));
      }

      const data: any[] = [];
      res.on('data', (chunk) => {
        data.push(chunk);
      });

      res.on('end', () => resolve(data));
    });

    req.on('timeout', () => {
      reject(new Error('timeout'));
      req.destroy();
    });

    req.on('error', (error: Error) => {
      reject(error);
    });

    req.end();
  });
};

export default async (url: string) => {
  try {
    const data: any[] = await retry(request)(url);
    return data;
  } catch (error) {
    logger.error('请求失败:' + error);
    throw error;
  }
};
