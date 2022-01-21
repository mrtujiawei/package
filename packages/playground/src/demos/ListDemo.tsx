import { useState } from 'react';
import { List } from '@mrtujiawei/react-components';
import type { ListProps } from '@mrtujiawei/react-components';

const ListDemo = () => {
  const [hasMore, _setHasMore] = useState(true);
  const [itemCount, setItemCount] = useState(0);
  const [winHeight] = useState(() => {
    return document.documentElement.clientHeight;
  });

  const loadMore = async (_start: number, _end: number) => {
    setItemCount((itemCount) => itemCount + 20);
  };

  const Item: ListProps<unknown>['children'] = (props) => (
    <div style={{ ...props.style, fontSize: '16px' }}>
      {props.index == itemCount ? '加载中...' : props.index}
    </div>
  );

  return (
    <List
      itemCount={itemCount}
      itemSize={50}
      height={winHeight}
      hasMore={hasMore}
      loadMore={loadMore}
    >
      {Item}
    </List>
  );
};

export default ListDemo;
