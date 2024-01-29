import { useState } from 'react';

const useUpdate = () => {
  const [_, setState] = useState({});

  return () => {
    setState({});
  };
};

export default useUpdate;
