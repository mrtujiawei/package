/**
 * 正则相关工具
 *
 * @filename packages/utils/src/utils/regexpUtils.ts
 * @author Mr Prince
 * @date 2023-06-09 15:20:53
 */

/**
 * 判断是否是邮箱
 */
export const isEmail = (email: string) => {
  return /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}$/.test(email);
};

/**
 * 判断是否是IP地址
 */
export const isIPAddress = (ip: string) => {
  return /^(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)\.(25[0-5]|2[0-4]\d|[0-1]\d{2}|[1-9]?\d)$/.test(
    ip
  );
};

/**
 * 判断是否是身份证
 */
export const isID = (id: string) => {
  return /^(\d{17}[\d|x]|\d{15})$/.test(id);
};
