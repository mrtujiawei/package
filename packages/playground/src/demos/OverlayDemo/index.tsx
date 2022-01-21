import { Overlay } from '@mrtujiawei/react-components';
import { useState } from 'react';
import './index.less';

const OverlayDemo = () => {
  const [visible, setVisible] = useState(false);

  const toggle = () => {
    setVisible((visible) => !visible);
  };

  return (
    <div className="overlay-demo">
      <button onClick={toggle}>toggle</button>
      <Overlay visible={visible} onClick={toggle}>
        <div className="wrapper">
          <div className="block">内容区</div>
        </div>
      </Overlay>
    </div>
  );
};

export default OverlayDemo;
