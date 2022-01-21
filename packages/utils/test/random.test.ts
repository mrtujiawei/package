import { Random, } from '../src/index';

test('Generate my uuid', () => {
  expect(Random.getRandomID().length).toBe(36);
});

test('Random number is in range', () => {
  const number = Random.getRandomNumber(-100, 100);
  expect(number).toBeLessThan(100);
  expect(number).toBeGreaterThanOrEqual(-100);
});

test('Random string is valid', () => {
  const string = Random.getRandomString(20);
  expect(/^[a-zA-Z0-9]{20}$/.test(string)).toBe(true);
});

test('Randon boolean is false', () => {
  const bool = Random.getRandomBoolean(0);
  expect(bool).toBe(false);
});

test('Randon boolean is true', () => {
  const bool = Random.getRandomBoolean(1);
  expect(bool).toBe(true);
});

test('Random alphabet string is valid', () => {
  const string = Random.getRandomAlphabetString(20);
  expect(/^[a-zA-Z]{20}$/.test(string)).toBe(true);
});

test('Random lowercase string is valid', () => {
  const string = Random.getRandomLowercaseString(20);
  expect(/^[a-z]{20}$/.test(string)).toBe(true);
});

test('Random lowercase letter is valid', () => {
  const letter = Random.getRandomLowercaseLetter();
  expect(/^[a-z]$/.test(letter)).toBe(true);
});

test('Random uppercase string is valid', () => {
  const string = Random.getRandomUppercaseString(20);
  expect(/^[A-Z]{20}$/.test(string)).toBe(true);
});

test('Random uppercase letter is valid', () => {
  const letter = Random.getRandomUppercaseLetter();
  expect(/^[A-Z]$/.test(letter)).toBe(true);
});
