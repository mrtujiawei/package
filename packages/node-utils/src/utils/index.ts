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

export interface ResultType {
  [key: string]: boolean | string | string[];
  _: string[];
};

export const getFormattedArgs = (args: string[]) => {
  const result: ResultType = {
    _: [],
  };

  for (let i = 0; i < args.length; i++) {
    const argv = args[i];
    if (/^-/.test(argv)) {
      const key = argv.slice(1);
      if (i + 1 >= args.length || /^-/.test(args[i + 1])) {
        result[key] = true;
      } else {
        result[key] = args[++i];
      }
    } else {
      (result._ as string[]).push(argv);
    }
  }

  return result;
};
