/**
 * PerformanceObserver test
 * @filename: packages/playground/src/demos/Observer/index.tsx
 * @author: Mr Prince
 * @date: 2022-11-09 14:35:26
 */

import { observe } from '@mrtujiawei/web-utils';
import { useEffect } from 'react';

const Observer = () => {
  useEffect(() => {
    const cancelCallback = observe();
    return () => {
      cancelCallback();
    };
  }, []);
  return <div></div>;
};

export default Observer;
