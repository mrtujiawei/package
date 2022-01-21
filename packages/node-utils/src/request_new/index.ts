import { isEqual } from '@mrtujiawei/utils';
import http from 'http';
import https from 'https';

/**
 * 请求发送工具
 *
 * @param extraOptions 一些请求以外的参数
 * @returns chunks 返回接收到的原始的chunk数组
 */
export default function request(
  options: http.RequestOptions,
  extraOptions?: {
    useHttps?: boolean;
    formData?: Record<string, any>;
  }
) {
  let sender: typeof http | typeof https;

  if (extraOptions?.useHttps) {
    sender = https;
  } else {
    sender = http;
  }

  return new Promise<any[]>((resolve, reject) => {
    const client = sender.request(options, (res) => {
      if (`${res.statusCode}`[0] == '3') {
        let { location } = res.headers;

        const getHost = () => {
          const reg = /(https?:)?\/\/([^:/]+)/;
          const match = location?.match(reg);
          return match ? match[1] : options.host;
        };

        const getPort = () => {
          const reg = /(https?:)?\/\/[^:]+:(\d+)/;
          const match = location?.match(reg);
          return match ? match[1] : options.port;
        };

        const getPath = () => {
          const reg = /(https?:)?\/\/[^/]+(\/.*)/;
          const match = location?.match(reg);
          if (!match) {
            reject(new Error('重定向为匹配到路径'));
          } else {
            return match[1];
          }
        };

        if (location) {
          resolve(
            request({
              method: 'GET',
              host: getHost(),
              port: getPort(),
              path: getPath(),
            })
          );
        } else {
          reject(new Error('location not found'));
        }
        return;
      }
      const chunks: any[] = [];
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        resolve(chunks);
      });
    });

    client.on('timeout', () => {
      reject(new Error('timeout'));
      client.destroy();
    });

    client.on('error', (error) => {
      reject(error);
    });

    if (
      isEqual(options.method!, 'POST', {
        ignoreCase: true,
      })
    ) {
      // post请求参数
      client.write(JSON.stringify(extraOptions?.formData || {}));
    }

    client.end();
  });
}
