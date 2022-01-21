# @mrtujiawei/web-utils

## Demo

### Scroller

弹性滚动

> 垂直滚动

```css
/* style.css */
* {
  margin: 0;
  padding: 0;
  color: #fff;
}

.list {
  /* 必须 */
  height: 100vh;
  overflow: hidden;
}

.list-item {
  list-style: none;
  text-align: center;
  padding: 20px;
  margin-bottom: 1px;
  background: #008c8c;
}
```

```javascript
/* App.js */
import { memo, useEffect, useRef, useState } from 'react';
import './style.css';

const List = memo(() => {
  return Array.from({ length: 50 }, (_, i) => i).map((value) => (
    <li key={value} className="list-item">
      {value}
    </li>
  ));
});

function App() {
  const [translateY, setTranslateY] = useState(0);
  const contentRef = useRef();

  useEffect(() => {
    const scroller = new window.TWebUtils.Scroller(setTranslateY);
    const cancel = scroller.addEvent(contentRef.current);
    return () => cancel();
  }, []);

  return (
    <div className="list">
      <ul
        ref={contentRef}
        style={{
          transform: `translateY(${translateY}px) translateZ(0)`,
        }}
      >
        <List></List>
      </ul>
    </div>
  );
}

export default App;
```

> 水平滚动


```css
/* style.css */
* {
  margin: 0;
  padding: 0;
}

.list {
  display: flex;
  flex-wrap: nowrap;
  color: #fff;
}

.list-item {
  flex-shrink: 0;
  list-style: none;
  text-align: center;
  width: 100px;
  padding: 20px;
  margin-bottom: 1px;
  background: #008c8c;
}
```

```javascript
/* App.js */
import { memo, useEffect, useRef, useState } from 'react';
import { preventDefaultEvent } from '@mrtujiawei/web-utils';
import './style.css';

const List = memo(() => {
  return Array.from({ length: 50 }, (_, i) => i).map((value) => (
    <li key={value} className="list-item">
      {value}
    </li>
  ));
});

function App() {
  const [translateY, setTranslateY] = useState(0);
  const contentRef = useRef();

  useEffect(() => {
    const data = new window.TWebUtils.Scroller(setTranslateY);
    const touchStart = (e) => {
      const content = contentRef.current;
      const childNodes = content?.childNodes;
      const lastChild = childNodes[childNodes.length - 1];
      // 关键是计算这个 min 能够向左滚动的最小值
      const min =
        content?.clientWidth - lastChild.offsetLeft - lastChild.clientWidth;
      data.touchStart(e.changedTouches[0].pageX, min);
    };

    const touchMove = (e) => {
      data.touchMove(e.changedTouches[0].pageX);
    };

    const touchEnd = (e) => {
      data.touchEnd(e.changedTouches[0].pageX);
    };

    preventDefaultEvent();

    const wrapper = contentRef.current?.parentNode;
    wrapper.addEventListener('touchstart', touchStart);
    wrapper.addEventListener('touchmove', touchMove);
    wrapper.addEventListener('touchend', touchEnd);
  }, []);

  return (
    <ul
      className="list"
      ref={contentRef}
      style={{
        transform: `translateX(${translateY}px) translateZ(0)`,
      }}
    >
      <List></List>
    </ul>
  );
}

export default App;
```
