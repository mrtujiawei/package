/**
 *
 * @filename packages/playground/src/demos/BoardcastChannel/index.tsx
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2025-04-29 14:50:16
 */

import { FC, useEffect, useRef, useState } from 'react';

const BoardcastChannelComp: FC = () => {
  const [value, setValue] = useState(0);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    const channel = new BroadcastChannel('boardcase');
    channelRef.current = channel;
    channel.onmessage = (event) => {
      console.log('receive message', event);
    };
  }, []);

  return (
    <div>
      <button
        onClick={() => {
          channelRef.current?.postMessage({
            value,
          });
          setValue((value) => value + 1);
        }}
      >
        send message {value}
      </button>
    </div>
  );
};

export default BoardcastChannelComp;
