import { Logger } from '../src/index';

describe('Logger test', () => {
  test('Logger should has only instance', () => {
    const instance1 = Logger.getLogger();
    const instance2 = Logger.getLogger();

    expect(instance1).toBe(instance2);
    Logger.removeLoggerAll();
  });

  test('Logger should not output anything without config', () => {
    const instance = Logger.getLogger();
    const listener = () => {
      expect(0).toBe(1);
    };
    const content = 'Hello World';
    instance.subscribe(listener);
    instance.trace(content);
    instance.debug(content);
    instance.info(content);
    instance.warn(content);
    instance.error(content);
    instance.fatal(content);
    Logger.removeLoggerAll();
  });

  test('Logger should be call with "Hello World"', () => {
    const identifier = 'tujiawei';
    const message = 'Hello World';
    const instance = Logger.getLogger(identifier);
    instance.subscribe((content) => {
      expect(content.content).toBe(message);
      expect(content.identifier).toBe(identifier);
      expect(content.logLevel).toBe(Logger.LOG_LEVEL.DEBUG);
    });
    instance.setLevel(Logger.LOG_LEVEL.DEBUG);
    instance.debug(message);
    Logger.removeLoggerAll();
  });
});
