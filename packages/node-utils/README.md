# @mrtujiawei/node-utils #

> node.js 相关的工具函数

[![npm version](https://img.shields.io/npm/v/@mrtujiawei/node-utils.svg?style=flat-square)](https://www.npmjs.org/package/@mrtujiawei/node-utils)
[![install size](https://packagephobia.com/badge?p=@mrtujiawei/node-utils)](https://packagephobia.com/result?p=@mrtujiawei/node-utils)
[![npm downloads](https://img.shields.io/npm/dm/@mrtujiawei/node-utils.svg?style=flat-square)](https://npm-stat.com/charts.html?package=@mrtujiawei/node-utils)
[![issues](https://img.shields.io/github/issues/Mr-Promise/node-utils)](https://github.com/Mr-Promise/node-utils/issues)
[![forks](https://img.shields.io/github/forks/Mr-Promise/node-utils)](https://github.com/Mr-Promise/node-utils)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/Mr-Promise/node-utils/pulls)
[![stars](https://img.shields.io/github/stars/Mr-Promise/node-utils)](https://github.com/Mr-Promise/node-utils)
[![license](https://img.shields.io/github/license/Mr-Promise/node-utils)](https://github.com/Mr-Promise/node-utils/blob/main/LICENSE)

<!-- 以下是自动生成的内容 -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**

- [Installing](#installing)
- [Usage](#usage)
  - [note: ESModule usage](#note-esmodule-usage)
- [Example](#example)
  - [request](#request)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installing ##

Using npm:

```bash
$ npm install @mrtujiawei/node-utils
```

Using yarn:

```bash
$ yarn add @mrtujiawei/node-utils
```

## Usage ##

```javascript
const utils = require('@mrtujiawei/node-utils');
```
or

```javascript
const utils = require('@mrtujiawei/node-utils');
```

### note: ESModule usage ###

```javascript
import utils from '@mrtujiawei/node-utils';
```
or

```javascript
import utils from '@mrtujiawei/node-utils';
```

## Example ##

使用示例

### request ###

> 为了能够支持流，返回 `Promise<chunk[]>`

```javascript
import { request } from '@mrtujiawei/node-utils';

request(url);
```
