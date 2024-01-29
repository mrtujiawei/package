import { useRef } from 'react';

/**
 * 获取最新的值
 */
const useLatest = <T>(value: T) => {
  const valueRef = useRef(value);
  valueRef.current = value;

  return valueRef;
};

export default useLatest;
