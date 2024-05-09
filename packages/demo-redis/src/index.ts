// import { getRedisClient, logger, print } from './utils';
//
// const main = async () => {
//   console.clear();
//   logger.info('-------- start --------');
//   const client = await getRedisClient();
//
//   const fieldsAdded = await client.hSet('bike:1', {
//     model: 'Deimos',
//     brand: 'Ergonom',
//     type: 'Enduro bikes',
//     price: 4972,
//   });
//
//   logger.info(`Number of fields were added: ${fieldsAdded}`);
//
//   const model = await client.hGet('bike:1', 'model');
//   logger.info(`Model: ${model}`);
//
//   const price = await client.hGet('bike:1', 'price');
//   logger.info(`Price: ${typeof price}`);
//
//   const bike = await client.hGetAll('bike:1');
//
//   print(bike);
//
//   logger.info('-------- end --------');
//
//   client.quit();
// };
//
// main();

// import log4js from 'log4js';

// const logger = log4js.getLogger();
// logger.level = 'debug';
// logger.debug('Some debug messages');
