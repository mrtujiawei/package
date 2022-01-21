import { Toast, toast } from '@mrtujiawei/react-components';
import { Position } from '@mrtujiawei/react-components';
import { useState } from 'react';
import Random from '../../../../utils/src/utils/Random';

let count = 0;
const ToastDemo = () => {
  const [visible, setVisible] = useState(false);

  const toggle = () => {
    setVisible((visible) => {
      return !visible;
    });
  };

  const showToast = () => {
    toast(`Hello World ${count++} ${Random.getRandomString(20)}`);
  };

  const clear = () => {
    toast.clear();
    console.log(`clear`);
  };

  return (
    <div
      style={{
        height: '1000vh',
        background: 'linear-gradient(to bottom, #0ff, #f0f)',
      }}
    >
      <button onClick={toggle}>toggle</button>
      <button onClick={showToast}>showToast</button>
      <button onClick={clear}>clear</button>
      <Toast visible={visible} zIndex={2} position={Position.middle}>
        Hello World {count++} {Random.getRandomString(20)}
      </Toast>
    </div>
  );
};

export default ToastDemo;
