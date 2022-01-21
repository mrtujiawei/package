import request from './request';
import requestNew from './request_new';
import * as fileUtils from './fileUtils';
export * from './fileUtils';
import * as utils from './utils';
export * from './utils';

export { request, requestNew };

export default {
  request,
  requestNew,
  ...fileUtils,
  ...utils,
};
