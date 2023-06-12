import { ReactNode, useEffect, useState } from 'react';
import { createRoot, Root } from 'react-dom/client';
import Toast, { ToastProps } from '.';
import { Counter, Types } from '@mrtujiawei/utils';

export type ToastOptions = Partial<Omit<ToastProps, 'visible'>>;

type QueueItem = {
  element: JSX.Element;
  clear(): void;
  key: number;
};

let container: HTMLDivElement | null = null;
let root: Root | null = null;

let queue: QueueItem[] = [];

let update = () => {};

/**
 * 渲染多个toast用
 */
const Container = () => {
  // 只是触发渲染用的
  const [_key, setKey] = useState(0);

  useEffect(() => {
    update = () => {
      setKey((key) => key + 1);
    };
  }, []);

  return <>{queue.map((item) => item.element)}</>;
};

const zIndexCounter = new Counter(2000);
const keyCounter = new Counter(0);

const createInstance = () => {
  if (!container) {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    root.render(<Container></Container>);
  }
  return root!;
};

export const toast = (children: ReactNode, options: ToastOptions = {}) => {
  createInstance();
  const zIndex = options.zIndex || zIndexCounter.next();
  const props = {
    ...options,
    zIndex,
  };

  let unmount = false;

  const Item = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const removeFromQueue = () => {
        for (let i = 0; i < queue.length; i++) {
          const it = queue[i];
          if (it == item) {
            queue.splice(i, 1);
            break;
          }
        }
      };
      if (unmount) {
        // 显示之前就已经卸载了
        removeFromQueue();
      } else {
        item.clear = () => {
          setVisible(false);
          setTimeout(() => {
            removeFromQueue();
          }, 300);
        };
        setVisible(true);
        setTimeout(() => {
          item.clear();
        }, props.duration || 3000);
      }
    }, []);

    return (
      <Toast {...props} visible={visible}>
        {children}
      </Toast>
    );
  };

  const key = keyCounter.next();

  const item = {
    key,
    element: <Item key={key} />,
    clear() {
      unmount = true;
    },
  };

  queue.push(item);
  update();

  return item.key;
};

toast.clear = (key?: number) => {
  if (Types.isUndefined(key)) {
    queue.forEach((item) => item.clear());
  } else {
    for (let i = 0; i < queue.length; i++) {
      if (queue[i].key == key) {
        queue[i].clear();
        break;
      }
    }
  }
};
