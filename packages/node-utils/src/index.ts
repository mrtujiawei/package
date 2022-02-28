import request from './request';
import * as fileUtils from './fileUtils';
export * from './fileUtils';
import * as utils from './utils';
export * from './utils';

export { request };

export default {
  request,
  ...fileUtils,
  ...utils,
};
