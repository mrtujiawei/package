import { Logger, } from '@mrtujiawei/utils';

const logger = Logger.getLogger();

logger.setLevel(Logger.LOG_LEVEL.ALL);
logger.subscribe(message => {
  console.log(message);
});

export default logger;
