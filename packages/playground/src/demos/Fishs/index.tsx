/**
 * 鱼动画播放
 * @filename: packages/playground/src/demos/Fishs/index.tsx
 * @author: Mr Prince
 * @date: 2022-11-17 17:47:52
 */

import { requestAnimFrame } from '@mrtujiawei/web-utils';
import { useEffect, useState } from 'react';

const Fishs = () => {
  const [fish, setFish] = useState('');
  useEffect(() => {
    const fishs = [
      '/imgs/bwy1.png',
      '/imgs/bwy2.png',
      '/imgs/bwy3.png',
      '/imgs/bwy4.png',
      '/imgs/bwy5.png',
      '/imgs/bwy6.png',
      '/imgs/bwy7.png',
      '/imgs/bwy8.png',
      '/imgs/bwy9.png',
      '/imgs/bwy10.png',
    ];
    let index = 0;
    let load = true;
    const empty = () => {
      requestAnimFrame(animate);
    };

    const animate = () => {
      if (!load) {
        return;
      }
      setFish(fishs[index]);
      index = (index + 1) % fishs.length;
      requestAnimFrame(() => {
        requestAnimFrame(empty);
      });
    };

    animate();

    return () => {
      load = false;
    };
  }, []);

  return (
    <div style={{ width: 132, height: 106 }}>
      {fish ? <img src={fish} alt="" /> : null}
    </div>
  );
};

export default Fishs;
