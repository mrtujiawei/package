import { useEffect } from 'react';
import useLatest from './useLatest';

const usePageHidden = (cb: () => void) => {
  const callback = useLatest(cb);
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState == 'hidden') {
        callback.current?.();
      }
    };

    document.addEventListener('visibilitychange', handler);

    return () => {
      document.removeEventListener('visibilitychange', handler);
    };
  }, []);
};

export default usePageHidden;
