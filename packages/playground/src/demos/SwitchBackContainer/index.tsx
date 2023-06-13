import { useRef, useState } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import './styles.less';

function App() {
  const [state, setState] = useState(false);
  const helloRef = useRef<HTMLDivElement>(null);
  const goodbyeRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);
  const nodeRef = state ? goodbyeRef : helloRef;
  const key = state ? 'Goodbye, world!' : 'Hello, world!';
  const timeout = 500;

  console.log({ state, key });

  return (
    <div className="wrap">
      <SwitchTransition mode="in-out">
        <CSSTransition
          key={key}
          nodeRef={nodeRef}
          timeout={timeout}
          classNames="switch-back"
        >
          <div
            className="item"
            ref={nodeRef}
            onClick={() => {
              if (animating.current) {
                return;
              }
              setState((state) => !state);
              setTimeout(() => {
                animating.current = false;
              }, timeout);
              animating.current = true;
            }}
          >
            {state ? 'Goodbye, world!' : 'Hello, world!'}
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
}

export default App;
