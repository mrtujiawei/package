import LocalData from './utils/LocalData';
import Tween from './utils/Tween';
import Ripple from './utils/Ripple';
import Platform from './utils/Platform';
import ScrollControler from './utils/ScrollControl';
import Adaptation from './utils/Adaptation';
import * as utils from './utils/index';

export * from './utils/index';

export {
  Tween,
  LocalData,
  Ripple,
  Platform,
  Adaptation,
  ScrollControler,
};

export default {
  ...utils,
  Tween,
  LocalData,
  Ripple,
  Platform,
  Adaptation,
  ScrollControler,
};
