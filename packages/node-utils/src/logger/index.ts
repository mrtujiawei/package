import { Logger, } from '@mrtujiawei/utils';

const logger = Logger.getLogger('@mrtujiawei/node-utils');

logger.setLevel(Logger.LOG_LEVEL.ALL);
logger.subscribe(message => {
  console.log(message.getFormattedMessage());
});

export default logger;
