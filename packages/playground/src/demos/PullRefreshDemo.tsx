import { useState } from 'react';
import { PullRefresh } from '@mrtujiawei/react-components';

const PullRefreshDemo = () => {
  const [loading, setLoading] = useState(false);

  return (
    <PullRefresh
      loading={loading}
      pullingElement={<div style={{ fontSize: 16 }}>下拉中</div>}
      loadingElement={<div style={{ fontSize: 16 }}>加载中</div>}
      loosingElement={<div style={{ fontSize: 16 }}>释放即可刷新</div>}
      successElement={<div style={{ fontSize: 16 }}>刷新成功</div>}
      onLoading={(loading) => {
        setLoading(loading);
      }}
      onRefresh={() => {
        console.log('refresh');
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }}
    >
      {new Array(100).fill(0).map((_, i) => (
        <div key={i} style={{ height: 30, fontSize: 16 }}>
          Hello World - {i + 1}
        </div>
      ))}
    </PullRefresh>
  );
};

export default PullRefreshDemo;
