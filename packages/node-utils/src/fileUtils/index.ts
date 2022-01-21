import fs from 'fs';
import fsPromise from 'fs/promises';
import path from 'path';

/**
 * 路径解析
 */
export const pathResolve = (...paths: string[]) => {
  return path.resolve(...paths);
};

/**
 * 获取文件全名, 不包括后缀
 */
export const getFileName = (url: string): string => {
  return path.parse(url).base;
};

/**
 * 检查文件是否存在
 */
export const isFileExist = (path: string): Promise<boolean> => {
  return new Promise((resolve) => {
    fs.access(path, fs.constants.F_OK, (err) => {
      resolve(!err);
    });
  });
};

/**
 * 写 buffer 到文件
 */
export const writeBuffer = (path: string, buffer: any): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, buffer, { flag: 'a+' }, (err) => {
      err ? reject(err) : resolve(void 0);
    });
  });
};

/**
 * 写文件到硬盘
 */
export const writeFile = async (
  path: string,
  data: any | any[]
): Promise<void> => {
  if (data instanceof Array) {
    try {
      await rm(path);
    } catch (e) {}
    for (let i = 0; i < data.length; i++) {
      await writeBuffer(path, data[i]);
    }
  } else {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, data, (err) => {
        err ? reject(err) : resolve(void 0);
      });
    });
  }
};

/**
 * 删除文件
 * @param path
 */
export const rm = (path: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      err ? reject(err) : resolve(void 0);
    });
  });
};

/**
 * 获取当前运行的工作目录
 */
export const getCwd = (): string => {
  return process.cwd();
};

/**
 * 递归创建目录
 */
export const mkdir = (dir: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.mkdir(
      dir,
      {
        recursive: true,
      },
      (err) => {
        err ? reject(err) : resolve(void 0);
      }
    );
  });
};

/**
 * 删除目录
 */
export const rmdir = (dir: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.rm(
      dir,
      {
        recursive: true,
        force: true,
      },
      (err) => {
        err ? reject(err) : resolve(void 0);
      }
    );
  });
};

/**
 * 复制文件
 */
export const copyFile = (src: string, dest: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.copyFile(src, dest, fs.constants.COPYFILE_EXCL, (err) => {
      err ? reject(err) : resolve(void 0);
    });
  });
};

/**
 * 移动文件
 */
export const mv = (from: string, to: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    fs.rename(from, to, (err) => {
      err ? reject(err) : resolve(void 0);
    });
  });
};

/**
 * 判断路径是否对应的是目录
 */
export const isDirectory = (path: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    fs.stat(path, (err, stats) => {
      if (err) {
        reject(err);
      } else {
        resolve(stats.isDirectory());
      }
    });
  });
};

/**
 * 获取指定目录中的所有目录
 */
export const getDirs = (dir: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, async (err, files) => {
      if (err) {
        return reject(err);
      }
      let dirs: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const isDir = await isDirectory(path.resolve(dir, files[i]));
        if (isDir) {
          dirs.push(files[i]);
        }
      }
      resolve(dirs);
    });
  });
};

/**
 * 读文件
 */
export const readFile = (path: string) => {
  return fsPromise.readFile(path, {
    encoding: 'utf8',
  });
};

/**
 * 读取目录下的所有文件(包括目录)
 */
export const getFiles = (path: string) => {
  return fsPromise.readdir(path);
};
