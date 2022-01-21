# @mrtujiawei/react-components

[![npm version](https://img.shields.io/npm/v/@mrtujiawei/react-components.svg?style=flat-square)](https://www.npmjs.org/package/@mrtujiawei/react-components)
[![install size](https://packagephobia.com/badge?p=@mrtujiawei/react-components)](https://packagephobia.com/result?p=@mrtujiawei/react-components)
[![npm downloads](https://img.shields.io/npm/dm/@mrtujiawei/react-components.svg?style=flat-square)](https://npm-stat.com/charts.html?package=@mrtujiawei/react-components)
[![js delivr downloads](https://data.jsdelivr.com/v1/package/npm/@mrtujiawei/react-components/badge)](https://www.jsdelivr.com/package/npm/@mrtujiawei/react-components)
[![license](https://img.shields.io/github/license/mrtujiawei/package)](https://github.com/mrtujiawei/package/blob/main/LICENSE)

## 安装

使用 npm:

```bash
$ npm install @mrtujiawei/react-components
```

使用 yarn:

```bash
$ yarn add @mrtujiawei/react-components
```

使用 unpkg CDN:

> 注意: 使用 CDN 时，需要将`React`暴露到全局中

```html
<!-- 开发环境 -->
<script src="https://unpkg.com/@mrtujiawei/react-components/dist/umd/index.js"></script>

<!-- 生产环境 -->
<script src="https://unpkg.com/@mrtujiawei/react-components/dist/umd/index.min.js"></script>
```

使用 jsdelivr CDN:

> 注意: 使用 CDN 时，需要将`React`暴露到全局中

```html
<!-- 开发环境 -->
<script src="https://cdn.jsdelivr.net/npm/@mrtujiawei/react-components/dist/umd/index.js"></script>

<!-- 生产环境 -->
<script src="https://cdn.jsdelivr.net/npm/@mrtujiawei/react-components/dist/umd/index.min.js"></script>
```

## 使用

### List

> 虚拟滚动列表

基本使用

```typescript
import { List } from '@mrtujiawei/react-components';
import type { ListProps } from '@mrtujiawei/react-components';

const BasicList = () => {
  const itemCount = 1000;
  const dataList: number[] = Array.from(
    { length: itemCount },
    (_, index) => index + Math.random()
  );
  const height = 500;

  const Item: ListProps<number>['children'] = (props) => (
    <div style={props.style}>
      {props.index == itemCount ? '加载中...' : dataList[props.index]}
    </div>
  );

  return (
    <List itemCount={itemCount} itemSize={50} height={height}>
      {Item}
    </List>
  );
};
```

上拉加载

```typescript
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
    <div style={props.style}>
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
```

Props

**height: number**

> 容器高度

**width: string | number = `100%`**

> 容器宽度

**itemSize: number**

> 单个列表项的高度

**itemCount: number**

> 数据总数

**overscanCount: number = `1`**

> 屏幕外显示的列表项数量;数量越大，性能消耗越大; 适当增加可以减少页面空白

**children: ComponentType<ListChildComponentProps<T>>**

> 子节点

**useIsScrolling: boolean = `false`**

> 开启滚动监听

**itemKey: (index: number, data: T) => string | number**

> 元素的`key`: 默认使用 index 作为下标

**itemData: T = `null`**

> 传递给`children`的数据

**initialScrollOffset: number = `0`**

> 初始滚动高度

**loadMore: (startIndex: number, endIndex: number) => void | Promise<void> =
`null`**

> 触发上拉记载的参数, `startIndex` 开始加载数据的下标  
> `startIndex == endIndex` 为 `true`  

**hasMore: boolean = `false`**

> 是否能够继续加载

**threshold: number = `15`**

> 滚动到最后15个的时候, 开始加载新的数据
> 
> 触发条件:  
> 1. 滚动
> 2. 初始列表项不能填满容器高度
> 
> 限制:  
> 如果`loadMore`执行结束时，列表已停止滚动
> 那么即使剩余的列表项少于 threshold
> 也不会再次触发下一次加载
