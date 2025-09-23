/**
 *
 * @filename packages/playground/src/demos/VirtualScroll/index.tsx
 * @author  tujiawei <jiaweitu@marchthepolo.com>
 * @date 2025-09-23 14:47:15
 */

import { Random, VirtualScroll } from '@mrtujiawei/utils';
import {
  CSSProperties,
  FC,
  PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from 'react';

const Item: FC<
  PropsWithChildren<{
    style?: CSSProperties;
    onUpdateHeight: (height: number) => void;
    onUpdate?: () => void;
    data: Item;
  }>
> = ({ style, onUpdateHeight, children, onUpdate, data }) => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onUpdateHeight(container?.current?.clientHeight || 0);
  }, [data]);

  return (
    <div ref={container}>
      <div style={style} onClick={onUpdate}>
        {children}
      </div>
    </div>
  );
};

type Item = {
  height: number;
  color: string;
  key: number;
};

const minHeight = 100;
const maxHeight = 200;

const VirtualScrollDemo: FC = () => {
  const containerHeight = 500;

  const pageSize = 20;

  const [data, setData] = useState<Item[]>([]);

  const createItem = () => {
    const height = Random.getRandomNumber(minHeight, maxHeight);
    const color = Random.getRandomRGBA();

    return {
      height,
      color,
    };
  };

  const scrollTopRef = useRef(0);
  const [paddingTop, setPaddingTop] = useState(0);
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [renderItems, setRenderItems] = useState<Item[]>([]);

  useEffect(() => {
    const data = Array.from({ length: pageSize }, (_, i) => {
      return {
        key: i,
        ...createItem(),
      };
    });
    setData(data);
    setRenderItems(data);
  }, []);

  const [virtualScroll] = useState(() => {
    return new VirtualScroll<Item>({
      threshold: maxHeight,
      containerHeight: 500,
      getItemKey(item) {
        return item?.key;
      },
      defaultItemHeight: 100,
    });
  });

  const [loading, setLoading] = useState(false);
  const loadMore = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setData((data) => {
        const newItems = Array.from({ length: pageSize }, (_, i) => {
          return {
            ...createItem(),
            key: data.length + i,
          };
        });
        return data.concat(newItems);
      });
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    virtualScroll.updateItems(data);
    const info = virtualScroll.onScroll(scrollTopRef.current);
    setPaddingTop(info.paddingTop);
    setPaddingBottom(info.paddingBottom);
    setRenderItems(info.renderItems);
  }, [data]);

  return (
    <div
      style={{
        border: '1px solid #008c8c',
        overflow: 'auto',
        height: `${containerHeight}px`,
      }}
      onScroll={(e) => {
        const container = e.target as HTMLDivElement;
        const scrollTop = container.scrollTop;
        if (
          scrollTop + container.clientHeight + minHeight * 2 >
          container.scrollHeight
        ) {
          loadMore();
        }
        const info = virtualScroll.onScroll(scrollTop);
        setPaddingTop(info.paddingTop);
        setPaddingBottom(info.paddingBottom);
        setRenderItems(info.renderItems);
        scrollTopRef.current = scrollTop;
      }}
    >
      <div
        style={{
          paddingTop: `${paddingTop}px`,
        }}
      />
      {renderItems.map((item) => {
        return (
          <Item
            key={item.key}
            style={{
              borderBottom: '1px solid #fF4400',
              height: `${item.height}px`,
              backgroundColor: item.color,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onUpdateHeight={(height) => {
              virtualScroll.updateItemHeight(item, height);
              console.log('update height', item.key, height);
            }}
            onUpdate={() => {
              setData((data) => {
                const index = data.findIndex((value) => value.key == item.key);
                const newData = data.slice();
                newData[index] = {
                  key: item.key,
                  ...createItem(),
                };
                return newData;
              });
            }}
            data={item}
          >
            {item.key}
          </Item>
        );
      })}
      <div
        style={{
          paddingBottom: `${paddingBottom}px`,
        }}
      />
    </div>
  );
};

export default VirtualScrollDemo;
