/**
 * node相关的工具函数
 * @filename: src/utils/index.ts
 * @author: Mr Prince
 * @date: 2022-01-18 11:52:12
 */
import os from 'os';
import { exec as _exec, ExecOptionsWithStringEncoding } from 'child_process';

/**
 * 获取本机ip
 */
export const getIps = () => {
  const interfaces = os.networkInterfaces();

  const ips: string[] = [];
  Object.values(interfaces).forEach((networkInterfaceInfo) => {
    networkInterfaceInfo &&
      networkInterfaceInfo.forEach((info) => {
        if ('IPv4' == info.family) {
          ips.push(info.address);
        }
      });
  });

  return ips;
};

/**
 * 执行命令行命令
 */
export const exec = async (
  command: string,
  options?: ExecOptionsWithStringEncoding
): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    _exec(command, options, (error, stdout, stderr) => {
      if (error) {
        reject(stderr.toString() || stdout.toString());
      } else {
        const result = stdout.toString();
        resolve(result);
      }
    });
  });
};
