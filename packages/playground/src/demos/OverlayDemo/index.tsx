import { Overlay } from '@mrtujiawei/react-components';
import { useState } from 'react';
import './index.less';

const OverlayDemo = () => {
  const [visible, setVisible] = useState(false);
  console.log({ visible });

  const toggle = () => {
    setVisible((visible) => !visible);
  };

  return (
    <div className="overlay-demo">
      <button onClick={toggle} style={{fontSize: 20}}>toggle</button>
      <Overlay visible={visible} onClick={toggle}>
        <div className="wrapper">
          <div className="block" style={{fontSize: 15}}>内容区</div>
        </div>
      </Overlay>
    </div>
  );
};

export default OverlayDemo;
