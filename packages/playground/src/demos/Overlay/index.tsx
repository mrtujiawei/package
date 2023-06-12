import { Overlay } from '@mrtujiawei/react-components';
import { useState } from 'react';
import styles from './styles.module.less';

const Content = () => {
  return (
    <div
      className={styles.content}
      onClick={() => {
        console.log('点击事件');
      }}
    >
      <div>内容区</div>
    </div>
  );
};

const OverlayDemo = () => {
  const [visible, setVisible] = useState(false);

  const toggle = () => {
    setVisible((visible) => !visible);
  };

  return (
    <div className={styles.demo}>
      <button onClick={toggle}>切换</button>
      <Overlay visible={visible} onClick={toggle}>
        <Content></Content>
      </Overlay>
    </div>
  );
};

export default OverlayDemo;
