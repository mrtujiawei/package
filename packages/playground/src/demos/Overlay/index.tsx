import { Overlay } from '@mrtujiawei/react-components';
import { useState } from 'react';

const Content = () => {
  console.log('content render');

  return <div>内容区</div>;
};

const OverlayDemo = () => {
  const [visible, setVisible] = useState(false);

  const toggle = () => {
    setVisible((visible) => !visible);
  };

  return (
    <div>
      <button onClick={toggle}>切换</button>
      <Overlay visible={visible} onClick={toggle}>
        <Content></Content>
      </Overlay>
    </div>
  );
};

export default OverlayDemo;
