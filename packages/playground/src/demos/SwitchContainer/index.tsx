import { SwitchContainer } from '@mrtujiawei/react-components';
import { useRef, useState } from 'react';
import './styles.less';

function SwitchContainerDemo() {
  const [value, setValue] = useState(0);
  const animating = useRef(false);
  const increase = () => {
    setValue((value) => value + 1);
  };

  const [key, setKey] = useState(0);

  const increaseKey = () => {
    if (animating.current) {
      return;
    }
    animating.current = true;
    setKey((key) => key + 1);
  };

  const animateEndHandle = () => {
    animating.current = false;
  };

  return (
    <>
      <button onClick={increase}>increase</button>
      <button onClick={increaseKey}>increase key</button>
      <SwitchContainer
        className="switch-container-wrap"
        state={key}
        onAnimateEnd={animateEndHandle}
      >
        <div
          style={{ background: value % 2 == 0 ? 'blue' : 'green' }}
          className="wrap"
        >
          {value} + {key}
        </div>
      </SwitchContainer>
    </>
  );
}

export default SwitchContainerDemo;
