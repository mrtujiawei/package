import { Logger, } from '../src/index';

/**
 * 打印开关
 */
const logSwitch = false;

test('Logger should has only instance', () => {
  let instance1 = Logger.getLogger();
  let instance2 = Logger.getLogger();

  expect(instance1).toBe(instance2);
});

test('Logger should not output anything without config', () => {
  let instance = Logger.getLogger();

  let listener = () => {
    expect(0).toBe(1);
  };
  instance.subscribe(listener);
  instance.setLevel(Logger.LOG_LEVEL.OFF);
  instance.trace('Hello World');
  instance.unsubscribe(listener);
});

test('Logger should be call with "Hello World"', () => {
  let instance = Logger.getLogger();

  let listener = (message: string) => {
    expect(/Hello World/.test(message)).toBe(true);
  };

  instance.subscribe(listener);
  instance.setLevel(Logger.LOG_LEVEL.DEBUG);
  instance.debug('Hello World');
  instance.setLevel(Logger.LOG_LEVEL.OFF);
  instance.unsubscribe(listener);
});

test('Logger log test', () => {
  if (!logSwitch) {
    return ;
  }
  let instance = Logger.getLogger();
  let listener = (message: string) => {
    console.log(message);
  }
  instance.subscribe(listener);
  instance.setLevel(Logger.LOG_LEVEL.ALL);
  instance.trace('Hello World');
  instance.info(123123);
  instance.debug({
    name: 'tujiawei',
    age: 20,
    showName() {
      console.log(this.name);
      return 'name';
    },
    [Symbol.iterator]() {
      return '123';
    }
  });
  instance.warn(new Error('这是个错误'));
  instance.error(false);
  instance.fatal(undefined);
  instance.fatal(null);
  instance.trace(function () {});
  instance.info(Symbol('zhangjiayu'));
  instance.unsubscribe(listener);
});

test('Logger format Circular Structure Data', () => {
  if (!logSwitch) {
    return ;
  }
  let instance = Logger.getLogger();
  let listener = (message: string) => {
    console.log(message);
  }
  instance.subscribe(listener);
  instance.setLevel(Logger.LOG_LEVEL.ALL);

  const data: any = {};
  data.data = data;
  data.showName = function name() {
    console.log('name');
  };

  data.age = new Date();

  data.child = {
    data,
  };

  data.children = [
    data,
    data,
    data,
    data,
    {
      name: 'asdfjlk',
    },
  ];

  class Person {
    private age: number = 20;
    showAge() {
      console.log(this.age);
    }
  };

  data.customer = Person;
  data.person = new Person();

  instance.trace(data);
});
