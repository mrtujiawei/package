/**
 * 日期时间类测试
 * @filename: dateTimeTool.test.ts
 * @author: Mr Prince
 * @date: 2021-11-05 09:47:20
 */
import { DateTimeTool, } from '../src/index';

test('Is leap year test', () => {
  const leapYears = [
    '1952', '1956', '1960', '1964', '1968',
    '1972', '1976', '1980', '1984', '1988',
    '1992', '1996', '2000', '2004', '2008',
    '2012', '2016', '2020', '2024', '2028',
    '2032', '2036', '2040', '2044', '2048',
  ];

  leapYears.forEach(year => {
    expect(DateTimeTool.isLeapYear(new Date(year))).toBe(true);
  })

  const notLeapYears = [
    '1582', '1583', '1585', '1900', '1800',
    '1700', '1400', '1500', '2100', '2200',
  ];

  notLeapYears.forEach(year => {
    expect(DateTimeTool.isLeapYear(new Date(year))).toBe(false);
  });
});

test('Get n day after (not leap year)', () => {
  const current = new Date('2021/11/05');
  const after0 = DateTimeTool.getNthDayAfter(0, current)[1];
  const after1 = DateTimeTool.getNthDayAfter(10, current)[1];
  const after2 = DateTimeTool.getNthDayAfter(20, current)[1];
  const after3 = DateTimeTool.getNthDayAfter(30, current)[1];
  const after4 = DateTimeTool.getNthDayAfter(25, current)[1];

  expect(after0.getDate()).toBe(5);
  expect(after1.getDate()).toBe(15);
  expect(after2.getDate()).toBe(25);
  expect(after3.getDate()).toBe(5);
  expect(after4.getDate()).toBe(30);
});

test('Get n day after (leap year)', () => {
  const current = new Date('2020/02/28');
  const after0 = DateTimeTool.getNthDayAfter(0, current)[1];
  const after1 = DateTimeTool.getNthDayAfter(1, current)[1];
  const after2 = DateTimeTool.getNthDayAfter(2, current)[1];

  expect(after0.getDate()).toBe(28);
  expect(after1.getDate()).toBe(29);
  expect(after2.getDate()).toBe(1);
});

test('Diff days (leap year)', () => {
  const start = new Date('2020/01/01');
  const end = new Date('2021/01/01');
  expect(DateTimeTool.diffDays(start, end)).toBe(366);
  expect(DateTimeTool.diffDays(start.getTime(), end)).toBe(366);
  expect(DateTimeTool.diffDays(start, end.getTime())).toBe(366);
  expect(DateTimeTool.diffDays(start.getTime(), end.getTime())).toBe(366);
});

test('Diff days (not leap year)', () => {
  const start = new Date('2021/01/01');
  const end = new Date('2022/01/01');
  expect(DateTimeTool.diffDays(start, end)).toBe(365);
});
