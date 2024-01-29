import { useEffect } from 'react';

const useMount = (fn: () => void) => {
  useEffect(() => {
    return () => {
      fn();
    };
  }, []);
};

export default useMount;
