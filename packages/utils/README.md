# @mrtujiawei/utils

[![npm version](https://img.shields.io/npm/v/@mrtujiawei/utils.svg?style=flat-square)](https://www.npmjs.org/package/@mrtujiawei/utils)
[![install size](https://packagephobia.com/badge?p=@mrtujiawei/utils)](https://packagephobia.com/result?p=@mrtujiawei/utils)
[![npm downloads](https://img.shields.io/npm/dm/@mrtujiawei/utils.svg?style=flat-square)](https://npm-stat.com/charts.html?package=@mrtujiawei/utils)
[![js delivr downloads](https://data.jsdelivr.com/v1/package/npm/@mrtujiawei/utils/badge)](https://www.jsdelivr.com/package/npm/@mrtujiawei/utils)
[![issues](https://img.shields.io/github/issues/mrtujiawei/utils)](https://github.com/mrtujiawei/utils/issues)
[![forks](https://img.shields.io/github/forks/mrtujiawei/utils)](https://github.com/mrtujiawei/utils)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/mrtujiawei/utils/pulls)
[![stars](https://img.shields.io/github/stars/mrtujiawei/utils)](https://github.com/mrtujiawei/utils)
[![license](https://img.shields.io/github/license/mrtujiawei/utils)](https://github.com/mrtujiawei/utils/blob/main/LICENSE)

<!-- 以下是自动生成的内容 -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installing](#installing)
- [Usage](#usage)
  - [note: Brower usage](#note-brower-usage)
  - [note: CommonJS usage](#note-commonjs-usage)
  - [note: ESModule usage](#note-esmodule-usage)
- [Example](#example)
  - [Stack](#stack)
  - [Queue](#queue)
  - [LinkList](#linklist)
  - [Heap](#heap)
  - [BinarySearchTree](#binarysearchtree)
  - [Lock](#lock)
  - [TaskQueue](#taskqueue)
  - [ResponsibilityChain](#responsibilitychain)
  - [DateTimeTool](#datetimetool)
  - [CountDown](#countdown)
  - [Pagination](#pagination)
  - [Logger](#logger)
  - [Events](#events)
  - [Random](#random)
  - [PriorityQueue](#priorityqueue)
  - [Trie](#trie)
  - [utils](#utils)
    - [reverseRange](#reverserange)
    - [swap](#swap)
    - [sleep](#sleep)
    - [debounce](#debounce)
    - [throttle](#throttle)
    - [isInteger](#isinteger)
    - [isNaturalNumber](#isnaturalnumber)
    - [isPromise](#ispromise)
    - [retry](#retry)
    - [reentrant](#reentrant)
    - [findFirstIndex](#findfirstindex)
    - [objectToString](#objecttostring)
    - [isSame](#issame)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

<!--
## algorithm ##

学习算法相关的代码

## other ##

一些需要安装依赖的函数

## sorts ##

排序算法

-->

## Installing

Using npm:

```bash
$ npm install @mrtujiawei/utils
```

Using yarn:

```bash
$ yarn add @mrtujiawei/utils
```

Using unpkg CDN:

```html
<script src="https://unpkg.com/@mrtujiawei/utils/dist/utils.js"></script>
```

## Usage

### note: Brower usage

```javascript
const { Stack } = utils.Stack;
```

### note: CommonJS usage

```javascript
const { Stack } = require('@mrtujiawei/utils');
```

or

```javascript
const utils = require('@mrtujiawei/utils');
const Stack = utils.Stack;
```

### note: ESModule usage

```javascript
import { Stack } from '@mrtujiawei/utils';
```

or

```javascript
import utils from '@mrtujiawei/utils';
const Stack = utils.Stack;
```

## Example

使用示例

### Stack

> 堆栈

```javascript
import { Stack } from '@mrtujiawei/utils';

const stack = new Stack();

stack.size; // 0
stack.isEmpty(); // true

stack.push(1); // [1]
stack.push(2, 3); // [1, 2, 3]
stack.size; // 3
stack.isEmpty(); // false

stack.pop(); // 3
stack.peak(); // 2
stack.pop(); // 2
stack.peak(); // 1
stack.pop(); // 1
stack.peak(); // throw Error: StackEmptyError
stack.pop(); // throw Error: StackEmptyError
```

### Queue

> 队列

```javascript
import { Queue } from '@mrtujiawei/utils';

const queue = new Queue();

queue.size; // 0
queue.isEmpty(); // true

queue.enqueue(1); // [1]
queue.enqueue(2); // [1, 2]
queue.dequeue(); // 1

queue.enqueue(3); // [2, 3]

queue.size; // 2
queue.isEmpty(); // false
queue.dequeue(); // 2
queue.dequeue(); // 3
queue.dequeue(); // throw Error: QueueEmptyError
```

### LinkList

> 双向链表

```javascript
import { LinkList } from '@mrtujiawei/utils';

const list = new LinkList();
```

### Heap

> 堆

```javascript
import { Heap } from '@mrtujiawei/utils';

// 小顶堆
const heap = new Heap((a, b) => a - b);

heap.insert(2);
heap.insert(3);
heap.insert(1);
heap.remove(); // 1
heap.remove(); // 2
heap.insert(0);
heap.remove(); // 0
heap.remove(); // 3
```

### BinarySearchTree

> 二叉搜索树

```javascript
import { BinarySearchTree } from '@mrtujiawei/utils';

const bTree = new BinarySearchTree((a, b) => a - b, []);
bTree.append(1);
bTree.append(2);
bTree.append(3);
bTree.append(4);

// 执行4次
// 1, 2, 3, 4
bTree.inorderTraversal((value) => {
  console.log(value);
});
bTree.getMin(); // 1
bTree.getMax(); // 4
bTree.toArray(); // [1, 2, 3, 4]
bTree.clear(); // []
```

### Lock

> 异步流程加锁

```javascript
import { Lock, sleep }  from '@/mrtujiawei/utils';

const lock = new Lock(1);

/**
 * 异步任务只有等上次任务结束后才会开始执行下一个异步任务
 */
const run = async (value, timeout) => {
  try {
    await lock.lock();
    // 异步任务
    await sleep(timeout);
    console.log(value);
  } finally {
    lock.unlock();
  }
};

run(0, 1000);
run(1, 100);
run(2, 0);

output: 0 1 2
```

### TaskQueue

> 任务队列,主要是用来执行单任务

### ResponsibilityChain

> 职责链

### DateTimeTool

> 日期时间处理类  
> 解析时间太复杂，没做

```javascript
import { DateTimeTool } from '@/mrtujiawei/utils';

DateTimeTool.timeFormat(new Date(), ':'); // hh:mm:ss
DateTimeTool.dateFormat(new Date(), '-'); // yyyy-mm-dd
DateTimeTool.dateTimeFormat(new Date()); // yyyy-mm-dd hh:mm:ss
DateTimeTool.getNthDayBefore(2); // 获取n天以前时间和当前日期时间
DateTimeTool.getNthHourBefore(2); // 获取n小时之前到当前时间
DateTimeTool.getNthMonthBefore(1); // 获取n月以前时间到当前月时间
DateTimeTool.toDayBegin(new Date()); // 设置到当前天的开始 00:00:00.000
DateTimeTool.toDayEnd(new Date()); // 设置到当前天的结束 23:59:59.999
DateTimeTool.isLeapYear(new Date()); // 是否是闰年
DateTimeTool.diffTimestamp(new Date(), new Date()); // 时间戳差值
DateTimeTool.diffSeconds(new Date(), new Date()); // 秒差值
DateTimeTool.diffMinutes(new Date(), new Date()); // 分钟差值
DateTimeTool.diffHours(new Date(), new Date()); // 小时差值
DateTimeTool.diffDays(new Date(), new Date()); // 天差值
DateTimeTool.addDays(new Date(), 10); // 日期往后加10天
DateTimeTool.timestampToTime(123); // hh:mm:ss
DateTimeTool.timestampToDate(123); // yyyy-mm-dd
DateTimeTool.timestampToDateTime(123); // yyyy-mm-dd hh:mm:ss
DateTimeTool.getCurrentWeek(new Date()); // 获取当周的日期范围
```

### CountDown

> 倒计时

```javascript
import { CountDown } from '@mrtujiawei/utils';

const countDown = new CountDown('默认信息');
const callback = countDown.subscribe((data) => {
  // 结束倒计时
  if (data.done) {
    data.message; // 默认信息
  } else {
    data.message; // 倒计时数字 60, 59...
  }
});

countDown.start({
  start: 60,
  end: 0,
  timeout: 1,
});

// 取消其中的一个订阅
countDown.unsubscribe(callback);

// 清空所有订阅函数
countDown.clear();
```

### Pagination

> 分页

```javascript
import { Pagination } from '@mrtujiawei/utils';

const tableData = {
  pageNum: 1,
  pageSize: 10,
  tableData: [],
  total: 0,
};

const pagination = new Pagination(tableData);
pagination.subscribe((tableData) => {
  console.log(tableData);
});
pagination.setPageSize(20);
const key = 'key';
pagination.setOrder(key); // 设置排序
pagination.sort(); // 重新排序
pagination.to(2); // 跳到第二页
```

### Logger

> 日志记录

```javascript
import { Logger } from '@mrtujiawei/utils';

const logger = Logger.getLogger();
const callback = logger.subscribe((message) => {
  console.log(message);
});
logger.setLevel(Logger.LOG_LEVEL.ALL);
logger.trace('info');
logger.info('info');
logger.debug('debug');
logger.warn('warn');
logger.error('error');
logger.fatal('fatal');
logger.unsubscribe(callback);
```

### Events

> 事件发射

```javascript
const events = new Events();

const listener = events.on('start', (...data) => {
  console.log(data);
});

events.once('start', (...data) => {
  console.log(data);
});

events.emit('start', 1, 2, 3);
// 1 2 3
// 1 2 3

events.off('start', listener);
events.emit('start');
// 没有输出
```

### Random

> 随机

```javascript
import { Random } from '@mrtujiawei/utils';

Random.getRandomNumber(100, 1000); // [100, 1000)
Random.getRandomBoolean(); // true | false
Random.getRandomUppercaseLetter(); // [A-Z]
Random.getRandomUppercaseString(n); // [A-Z]{n}
Random.getRandomLowercaseLetter(); // [a-z]
Random.getRandomLowercaseString(n); // [a-z]{n}
Random.getRandomAlphabetString(n); // [a-zA-Z]{n}
Random.getRandomString(n); // [a-zA-Z0-9]{n}
Random.getRandomID(); // ********-**************-************
```

### PriorityQueue

> 优先队列

```javascript
import { PriorityQueue } from '@mrtujiawei/utils';

// 数字越小优先级越高
const pq = new PriorityQueue((a, b) => a - b);
pq.isEmpty(); // true
pq.enqueue(5);
pq.isEmpty(); // false
pq.enqueue(3);
pq.enqueue(1);
pq.enqueue(2);
pq.peak(); // 1
pq.dequeue(); // 1
pq.dequeue(); // 2
```

### Trie

> 前缀树

```javascript
const trie = new Trie();
trie.insert('Hello');
trie.insert('World');
trie.search('Hello');   // true
trie.search('He');      // false
trie.startsWith('W');   // true
trie.startsWith('w');   // false
```

### utils

#### reverseRange

> 翻转数组中的某一段

```javascript
import { reverseRange } from '@mrtujiawei/utils';

const arr = [1, 2, 3];
reverseRange(arr, 1, 3); // [1, 3, 2]
```

#### swap 

> 交换数组中的两个元素

```javascript
import { swap } from '@mrtujiawei/utils';

const arr = [1, 2, 3];
swap(arr, 1, 2);  // [1, 3, 2];
```

#### sleep

> 延时一段时间

```javascript
// 延时 1s
await sleep(1);
```

#### debounce

> 防抖

```javascript
import { debounce } from '@mrtujiawei/utils';

const listener = debounce((event) => {
  console.log(event);
}, 500);

addEventListener('scroll', listener, {
  passive: true,
});
```

#### throttle

> 节流

```javascript
import { throttle } from '@mrtujiawei/utils';

const options = {
  // 100ms以内只触发一次
  timeout: 100,

  // 第一次是否直接触发
  // false 100ms以后才会触发
  leading: true,
};
const listener = throttle((data) => {
  console.log(data);
}, { timeout: 100, leading: true });

addEventListener('scroll', listener);
```

#### isInteger

> 是否是整数, 实际值

```javascript
import { isInteger } from '@mrtujiawei/utils';

isInteger(0);     // true
isInteger('1');   // true
isInteger(1.1);   // false
isInteger('a');   // false
```

#### isNaturalNumber

> 是否是自然数

```javascript
import { isNaturalNumber } from '@mrtujiawei/utils';

isNaturalNumber('123');   // true
isNaturalNumber(-1);      // false
isNaturalNumber('a');     // false
```

#### isPromise

> 判断是否是promise

```javascript
import { isPromise } from '@mrtujiawei/utils';
const promise = new Promise(() => {});
const number = 0;

isPromise(promise);   // true
isPromise(number);    // false
```

#### retry

> 重试

```javascript
import { retry } from '@mrtujiawei/utils';

// 如果回调执行失败，会重复执行直到成功或者执行次数超过10次
const listener = retry((data) => {
  console.log(data);
}, 9);
listener(1);
```

#### reentrant

> 重入

```javascript
import { reentrant, sleep, } from '@mrtujiawei/utils';

const func = reentrant(async (value) => {
  await sleep(1);
  return `#{value}#`;
});

const run = (data) => {
  const result = await func(data);
  console.log(result);
};

// 无输出
run(100);
run(200);   // #200#
```

#### findFirstIndex

> 二分查找第一个满足条件的下标

```javascript
import { findFirstIndex, } from '@mrtujiawei/utils';

findFirstIndex([1, 2, 3, 4, 5]);
```

#### objectToString

> 对象转字符串，不是json

```javascript
import { objectToString } from '@mrtujiawei/utils';

objectToString('asf');    // "asf"
objectToString([1, 2]);   // [1, 2, length: 2]
```

#### isSame

> 判断两个值是否相同,两个值都是 NaN 也是 true

```typescript
type isSame = (value1: unknown, value2: unknown) => boolean;
```

```javascript
import { isSame } from '@mrtujiawei/utils';

isSame(NaN, NaN); // true
isSame(null, null); // true
isSame('123', 123); // false
isSame(undefined, undefined); // true
```
