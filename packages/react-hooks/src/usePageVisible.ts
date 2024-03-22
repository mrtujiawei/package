import { useEffect } from 'react';
import useLatest from './useLatest';

const usePageVisible = (cb: () => void) => {
  const callback = useLatest(cb);
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState == 'visible') {
        callback.current?.();
      }
    };

    document.addEventListener('visibilitychange', handler);

    return () => {
      document.removeEventListener('visibilitychange', handler);
    };
  }, []);
};

export default usePageVisible;
