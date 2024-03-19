import { Logger } from '@mrtujiawei/utils';
import { createClient } from 'redis';

export const logger = Logger.getLogger('redis');

logger.setDefaultConfig();

export const getRedisClient = async () => {
  const client = createClient();
  client.on('error', (err) => {
    console.log(err);
    logger.error(`Redis Client Error, ${err}`);
  });

  await client.connect();
  return client;
};

export const print = (args: any) => {
  logger.info(JSON.stringify(args));
};

