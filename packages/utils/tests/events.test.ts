import { Events, } from '../src/index';

describe('Events test', () => {
  test('Events call serval times test', () => {
    let events = new Events();
    let count = 0;

    events.on('click', (event) => {
      expect(event).toBe(count);
      count++;
    });

    events.emit('click', 0);
    events.emit('click', 1);
    events.emit('click', 2);
    events.emit('click', 3);
    events.emit('click', 4);
    events.emit('click', 5);
  });

  test('Events should only call once test', () => {
    let events = new Events();
    let count = 0;

    events.once('click', () => {
      count++;
      expect(count).toBe(1);
    });

    events.emit('click', 0);
    events.emit('click', 1);
    events.emit('click', 2);
    events.emit('click', 3);
    events.emit('click', 4);
    events.emit('click', 5);
  });

  test('Events off test', () => {
    let events = new Events();
    let count = 0;

    let listener = events.on('click', () => {
      count++;
      expect(count).toBe(1);
    });

    events.emit('click', 0);
    events.off('click', listener);

    events.emit('click', 1);
    events.emit('click', 2);
    events.emit('click', 3);
    events.emit('click', 4);
    events.emit('click', 5);
  });
});
