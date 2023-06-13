import { FC, PropsWithChildren, useRef, useState, ReactElement } from 'react';
import { CSSTransition } from 'react-transition-group';
import './styles.less';

const Switch = () => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [inProp, setInProp] = useState(true);

  const changeHandle = () => {
    setInProp((flag) => !flag);
  };

  return (
    <>
      <button onClick={changeHandle}>change</button>
      <CSSTransition
        classNames="switch"
        nodeRef={nodeRef}
        in={inProp}
        timeout={500}
      >
        <div ref={nodeRef}>组件内容</div>
      </CSSTransition>
    </>
  );
};

export default Switch;
