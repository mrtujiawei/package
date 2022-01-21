#!/bin/env node

import Koa from 'koa';
import Static from 'koa-static';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { getIps } from '@mrtujiawei/node-utils';
import { logger } from './utils';

let port = 3000;

if (process.argv[2] == '-p' && process.argv.length == 4) {
  if (Number.isInteger(Number(process.argv[3]))) {
    port = Number(process.argv[3]);
  }
}

const server = new Koa();
const router = new Router();

server
  .use(bodyParser())
  .use(Static(process.cwd()))
  .use(router.routes())
  .use(router.allowedMethods());

server.listen(port, () => {
  const ips = getIps();
  logger.info('Server is running at:');
  ips.forEach((ip) => {
    logger.info(`\thttp://${ip}:${port}`);
  });
});
