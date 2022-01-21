/**
 * 媒体查询测试
 * @filename: packages/playground/src/demos/MediaQuery/index.tsx
 * @author: Mr Prince
 * @date: 2022-11-05 10:34:54
 */

import { isPortrait, isPortraitCallback } from '@mrtujiawei/web-utils';

const MediaQuery = () => {
  const protrait = isPortrait();
  console.log({ protrait });

  isPortraitCallback((protrait) => {
    console.log({ protrait });
  });

  return null;
};

export default MediaQuery;
