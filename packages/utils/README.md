# @mrtujiawei/utils

[![npm version](https://img.shields.io/npm/v/@mrtujiawei/utils.svg?style=flat-square)](https://www.npmjs.org/package/@mrtujiawei/utils)
[![install size](https://packagephobia.com/badge?p=@mrtujiawei/utils)](https://packagephobia.com/result?p=@mrtujiawei/utils)
[![npm downloads](https://img.shields.io/npm/dm/@mrtujiawei/utils.svg?style=flat-square)](https://npm-stat.com/charts.html?package=@mrtujiawei/utils)
[![js delivr downloads](https://data.jsdelivr.com/v1/package/npm/@mrtujiawei/utils/badge)](https://www.jsdelivr.com/package/npm/@mrtujiawei/utils)
[![license](https://img.shields.io/github/license/mrtujiawei/package)](https://github.com/mrtujiawei/package/blob/main/LICENSE)

<!-- 以下是自动生成的内容 -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [安装](#%E5%AE%89%E8%A3%85)
- [用法](#%E7%94%A8%E6%B3%95)
- [使用示例](#%E4%BD%BF%E7%94%A8%E7%A4%BA%E4%BE%8B)
  - [数据结构](#%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84)
    - [Stack](#stack)
    - [Queue](#queue)
    - [Deque](#deque)
    - [LinkedList](#linkedlist)
    - [DoublyLinkedList](#doublylinkedlist)
    - [Skiplist](#skiplist)
    - [Heap](#heap)
    - [UnionFind](#unionfind)
    - [BinarySearchTree](#binarysearchtree)
    - [AVLTree](#avltree)
    - [Trie](#trie)
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
  - [工具函数](#%E5%B7%A5%E5%85%B7%E5%87%BD%E6%95%B0)
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
- [TODO](#todo)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## 安装

使用 npm:

```bash
$ npm install @mrtujiawei/utils
```

使用 yarn:

```bash
$ yarn add @mrtujiawei/utils
```

使用 unpkg CDN:

```html
<script src="https://unpkg.com/@mrtujiawei/utils"></script>
```

使用 jsdelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/@mrtujiawei/utils"></script>
```

## 用法

直接在浏览器中使用

```html
<script src="https://cdn.jsdelivr.net/npm/@mrtujiawei/utils"></script>
<script>
  const { Stack } = TUtils;
</script>
```

通过 CommonJS 引入

```javascript
const { Stack } = require('@mrtujiawei/utils');
```

或者

```javascript
const utils = require('@mrtujiawei/utils');
const Stack = utils.Stack;
```

通过 ESModule 引入

```javascript
import { Stack } from '@mrtujiawei/utils';
```

或者

```javascript
import * as utils from '@mrtujiawei/utils';
const Stack = utils.Stack;
```

## 使用示例

### 数据结构

#### Stack

> 堆栈（链表实现）

引入

```javascript
import { Stack } from '@mrtujiawei/utils';
```

实例化

```javascript
const stack = new Stack();
```

获取当前元素个数

```javascript
stack.size;
```

判断栈是否为空

```javascript
stack.isEmpty();
```

判断栈是否非空

```javascript
stack.isNotEmpty();
```

入栈 

- _支持一次 `push` 多个元素_

```javascript
stack.push(value);
```

出栈

- _栈为空时,`pop`会抛出**StackEmptyError**_

```javascript
stack.pop();
```

获取栈顶元素

- _栈为空时,`peak`会抛出**StackEmptyError**_

```javascript
stack.peak();
```

异常

```javascript
// 栈为空时获取元素
Stack.StackEmptyError
```

#### Queue

> 队列（双端链表实现）

引入

```javascript
import { Queue } from '@mrtujiawei/utils';
```

实例化

```javascript
const queue = new Queue();
```

获取当前元素个数

```javascript
queue.size;
```

队首元素

- _队列为空时获取`front`会抛出**QueueEmptyError**_

```javascript
queue.front;
```

队尾元素

- _队列为空时获取`tail`会抛出**QueueEmptyError**_

```javascript
queue.tail;
```

判断队列是否为空

```javascript
queue.isEmpty();
```

入队

- _支持一次 `enqueue` 多个元素_

```javascript
queue.enqueue(value);
```

出队

- _队列为空时`dequeue`会抛出**QueueEmptyError**_

```javascript
queue.dequeue();
```

异常

```javascript
// 队列为空时仍获取元素
Queue.QueueEmptyError
```

#### Deque

> 双端队列（双端链表实现）

引入

```javascript
import { Deque } from '@mrtujiawei/utils';
```

实例化

```javascript
const deque = new Deque();
```

从队头入队

```javascript
deque.pushFront(value);
```

从队尾入队

```javascript
deque.pushBack(value);
```

判断队列是否为空

```javascript
deque.isEmpty();
```

判断队列是否非空

```javascript
deque.isNotEmpty();
```

获取队列元素个数

```javascript
deque.getSize();
```

获取队首元素

- _队列为空时`getFront`会抛出**DequeEmptyError**_

```javascript
deque.getFront();
```

获取队尾元素

- _队列为空时`getBack`会抛出**DequeEmptyError**_

```javascript
deque.getBack();
```

队列转数组

```javascript
deque.toArray();
```

从队头出队

- _队列为空时`popFront`会抛出**DequeEmptyError**_

```javascript
deque.popFront();
```

从队尾出队

- _队列为空时`popBack`会抛出**DequeEmptyError**_

```javascript
deque.popBack();
```

清空队列

```javascript
deque.clear();
```

异常

```javascript
// 队列未空时仍获取元素
Deque.DequeEmptyError;
```

#### LinkedList

> 单向链表

引入
```javascript
import { LinkedList } from '@mrtujiawei/utils';
```

实例化

```javascript
const list = new LinkedList();
```

获取当前元素个数

```javascript
list.getSize();
```

链表是否为空

```javascript
list.isEmpty();
```

链表是否非空

```javascript
list.isNotEmpty();
```

清空链表

```javascript
list.clear();
```

从链表头部插入

```javascript
list.insertFirst(value);
```

指定下标处插入

- `0 <= index <= list.getSize()`
- 下标范围不对时会抛出`InvalidIndexError`
- 建议尽量少用，最坏时间复杂度 O(n)

```javascript
list.insertAt(index, value);
```

链表尾部插入

- 建议尽量少用，时间复杂度 O(n)

```javascript
list.insertLast(value);
```

移除头结点

- 链表为空时`removeFirst`会抛出`LinkedListEmptyError`

```javascript
list.removeFirst();
```

移除尾节点

- 链表为空时`removeLast`会抛出`LinkedListEmptyError`

```javascript
list.removeLast();
```

移除指定下标的节点

- 下标范围不对时会抛出`InvalidIndexError`

```javascript
list.removeAt(index);
```

复制链表

```javascript
list.clone(oldList);
```

遍历链表

```javascript
list.forEach((value, index, context) => {
  // TODO ...
});
```

过滤出符合条件的新链表

- Boolean(returnValue) 为 `true` 保留, `false` 不保留

```javascript
list.filter((value, index, context) => {
  // TODO ...
});
```

查找第一个满足条件的值

- Boolean(returValue) 为 `true` 时，返回对应的`value`

```javascript
list.find((value, index, context) => {
  // TODO
});
```

获取第一个节点值

- 链表为空时`getFirst`会抛出`LinkedListEmptyError`

```javascript
list.getFirst();
```

转化成数组

```javascript
list.toArray();
```

从数组创建链表

```
let list = LinkedList.fromArray(arr);
```

`for..of` 遍历

```javascript
for (const value of list) {
  // TODO
}
```

异常
```javascript
// 为空时获取元素
LinkedList.LinkedListEmptyError;

// 传入不合理的下标
LinkedList.InvalidIndexError;
```

#### DoublyLinkedList

> 双向链表

引入

```javascript
import { DoublyLinkedList } from '@mrtujiawei/utils';
```

实例化

```javascript
const list = new DoublyLinkedList();
```

清空链表

```javascript
list.clear();
```

连接两个链表

- 只是单纯的尾节点连接头结点
- 继续操作原来的链表会影响连接后的链表

```javascript
const newList = list.concat(otherList);
```

是否包含

```javascript
list.contains(value);
```

过滤出符合条件的新链表
- Boolean(returnValue) 为 `true` 保留, `false` 不保留

```
const newList = list.filter((value, index, context) => {
  // TODO
});
```

查找第一个满足要求的元素

```javascript
const value = list.find((value, index, context) => {
  // TODO
});
```

查找第一个满足要求的元素下标

```javascript
const index = list.findIndex((value, index, context) => {
  // TODO
});
```

forEach遍历

```javascript
list.forEach((value, index, context) => {
  // TODO
});
```

获取指定下标的值

- 0 <= index && index < list.size()
- 不在范围内的下标会抛出 `InvalidIndexError`

```javascript
list.get(index);
```

获取链表中的第一个值

- 链表为空时,会抛出`EmptyError`

```javascript
const value = list.getFirst();
```

获取链表中的最后一个值

- 链表为空时,会抛出`EmptyError`

```javascript
const value = list.getLast();
```

是否包含某个值

```javascript
list.includes();
```

第一个等于指定值的下标

- 不存在时 `index = -1`

```javascript
const index = list.indexOf(value);
```

判断链表是否为空

```javascript
list.isEmpty();
```

根据参数合并成字符串

- 可以传入第二个参数，用来将元素转化成字符串

```javascript
const result = list.join(',');
```

最后一个满足条件的元素下标

```javascript
const index = lastIndexOf(value);
```

映射成一个新的链表

```javascript
const newList = list.map(value => {
  // TODO
  return newValue;
});
```

移除最后一个元素

- 链表为空时会抛出`EmptyError`

```javascript
const value = list.pop();
```

向尾部添加

```javascript
list.push(value);
```

元素汇总

```javascript
list.reduce((previousValue, currentValue, index, context) => {
  // TODO
  return nextValue;
});
```

元素反向汇总

```javascript
list.reduceRight((previousValue, currentValue, index, context) => {
  // TODO
  return nextValue;
});
```

移除指定下标的元素

- 0 <= index < list.size()
- 下标不合法时会抛出 `InvalidIndexError`

```javascript
const value = list.remove(index);
```

反转链表

```javascript
list.reverse();
```

设置指定位置的值

- 0 <= index < list.size()
- 下标不合法时会抛出 `InvalidIndexError`

```javascript
list.set(index, value);
```

移除第一个元素

- 链表为空时会抛出 `EmptyError`

```javascript
list.shift();
```

获取链表长度

```javascript
list.size();
```

复制链表中的一段

- 浅拷贝
- [startIndex, endIndex)

```javascript
list.slice(startIndex, endIndex);
```

查找是否有满足条件的值

```javascript
list.some((value, index, context) => {
  // TODO
  return false || true;
})
```

转化成数组

```javascript
const arr = list.toArray();
```

头部添加

```javascript
list.unshift(value);
```

链表排序

- 同数组排序

```javascript
sort((a, b) => number);
```

转化成字符串

```javascript
const str = list.toString();
```

移除所有满足条件的元素

```javascript
const removeSize = list.remove((value, index, context) => {
  // TODO
  return true || false;
});
```

反向遍历

```javascript
list.forEachReverse((value, index, context) => {
  // TODO
});
```

反向查找

```javascript
const value = list.findReverse((value, index, context) => {
  // TODO
  return true || false;
});
```

for..of 遍历

```javascript
for (const value of list) {
  // TODO
}
```

异常

```javascript
// 下标异常
DoublyLinkedList.InvalidIndexError

// 链表为空
DoublyLinkedList.EmptyError
```

#### Skiplist

引入

```javascript
import { Skiplist } from '@mrtujiawei/utils';
```

初始化

- _如果 a < b 预期返回小于0的数_
- _如果 a == b 预期返回0_
- _如果 a > b 预期返回大于0的数_
- 递减取相反数

```javascript
const list = new Skiplist((a, b) => a - b);
```

获取长度

```javascript
list.length;
```

查找是否存在指定值

```javascript
list.search(value);
```


获取第一个元素

```javascript
const firstValue = list.getFirst();
```

插入元素

```javascript
list.insert(value);
```

移除元素

```javascript
list.remove(value);
```

转化成数组

```javascript
list.toArray();
```

遍历

```javascript
list.forEach((value, index, context) => {
  // TODO
});
```

for..of 遍历

```javascript
for (const value of list) {
  // TODO
}
```

#### Heap

> 堆

引入

```javascript
import { Heap } from '@mrtujiawei/utils';
```

实例化(小顶堆) 

- _如果 a < b 预期返回小于0的数_
- _如果 a == b 预期返回0_
- _如果 a > b 预期返回大于0的数_
- 大顶堆取相反数

```javascript
const heap = new Heap((a, b) => a - b);
```

获取堆中元素数量

```javascript
heap.size;
```

判断堆是否为空

```javascript
heap.isEmpty();
```

判断堆是否非空

```javascript
Heap.isNotEmpty();
```

获取堆顶元素

- _堆为空时`peak`会抛出**Heap.HeapEmptyError**_

```javascript
heap.peak();
```

插入元素

```javascript
heap.insert(value);
```

移除堆顶元素

- _堆为空时`peak`会抛出**Heap.HeapEmptyError**_

```javascript
heap.remove();
```

替换堆顶元素

- 如堆为空则插入
- 非空则替换栈顶元素，并重新调整堆
- 两次O(logn)时间复杂度的操作减少为一次

```javascript
heap.replaceTop(0);
```

异常

```javascript
// 堆为空时获取元素
Heap.HeapEmptyError

// 比较器错误
Heap.CompareInvalidError
```

#### UnionFind

> 并查集

引入

```javascript
import { UnionFind } from '@mrtujiawei/utils';
```

实例化

- capacity不能小于1 `IllegaleArgumentException`

```javascript
const uf = new UnionFind(capacity);
```

合并集合

- 0 <= u1 < capacity
- 0 <= u2 < capacity

```javascript
uf.union(u1, u2);
```

查找集合的根节点

```javascript
uf.find(u);
```

是否属于同一个集合

```javascript
uf.isBelongSameUnion(u1, u2);
```

#### BinarySearchTree

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

#### AVLTree

> 平衡二叉搜索树

引入

```javascript
import { AVLTree } from '@mrtujiawei/utils';
```

实例化

- _如果 a < b 预期返回小于0的数_
- _如果 a == b 预期返回0_
- _如果 a > b 预期返回大于0的数_
- 取相反数时，左节点 > 父节点 > 右节点

```javascript
const tree = new AVLTree((a, b) => a - b);
```

添加节点

- 添加相同的`key`时会抛出`DuplicateValueError`

```javascript
tree.append(key, value);
```

根据 `key` 移除节点

- 返回`true`时删除成功，否则失败

```javascript
tree.remove(key);
```

判断是否存在`key`

```javascript
tree.has(key);
```

获取`key`对应的`value`

```javascript
const value = tree.getValue(key);
```

获取节点个数

```javascript
const size = tree.getSize();
```

清空树

```javascript
tree.clear();
```

异常

```javascript
// 插入已经存在的key
AVLTree.DuplicateValueError
```

#### Trie

> 前缀树(支持插入相同单词)

引入

```javascript
import { Trie } from '@mrtujiawei/utils';
```

实例化

```javascript
const trie = new Trie();
```

从数组实例化

```javascript
const trie = Trie.fromArray(words);
```

获取字典树中有多少个单词

```javascript
const count = trie.getWordCount();
```

插入单词

```javascript
trie.insert(word);
```

判断是否存在该单词

```javascript
trie.search(word);
```

判断指定前缀的单词是否存在

```javascript
trie.startsWith(prefix);
```

移除指定单词

- 返回`false`移除失败：单词不存在
- 返回`true`移除成功
- 如有多个相同个单词，只会移除一个

```javascript
trie.remove(word);
```

遍历

- 不保证遍历的顺序

```javascript
trie.forEach((word) => {
  // TODO
});
```

转化成数组

- 包含重复单词

```javascript
const words = trie.toArray();
```

清空前缀树

```javascript
trie.clear();
```

#### Lock

> 异步流程加锁

```javascript
import { Lock, sleep }  from '@mrtujiawei/utils';

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

#### TaskQueue

> 任务队列,主要是用来执行单任务

#### ResponsibilityChain

> 职责链

#### DateTimeTool

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

#### CountDown

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

#### Pagination

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

#### Logger

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

#### Events

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

#### Random

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

#### PriorityQueue

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

### 工具函数

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

## TODO

- [ ] 算法
- [ ] 树形数据结构
