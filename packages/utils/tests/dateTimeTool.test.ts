/**
 * 日期时间类测试
 * @filename: dateTimeTool.test.ts
 * @author: Mr Prince
 * @date: 2021-11-05 09:47:20
 */
import { DateTimeTool, } from '../src/index';

describe('DateTimeTool', () => {
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

  test('milliseconds format', () => {
    expect(DateTimeTool.millisecondsFormat(1000)).toBe('00:00:01');
    expect(DateTimeTool.millisecondsFormat(1999)).toBe('00:00:01');
    expect(DateTimeTool.millisecondsFormat(2001)).toBe('00:00:02');
  });

  test('seconds format', () => {
    expect(DateTimeTool.secondsFormat(1)).toBe('00:00:01');
    expect(DateTimeTool.secondsFormat(1.2)).toBe('00:00:01');
    expect(DateTimeTool.secondsFormat(2.1)).toBe('00:00:02');
  });

  test('parse test', () => {
    // 不带毫秒的解析
    expect(DateTimeTool.parse(`2022-08-09T03:03:06.000+0000`)).toBe(1660014186000);

    // 带毫秒的解析
    expect(DateTimeTool.parse(`2022-08-09T03:03:06.123+0000`)).toBe(1660014186123);

    // 带小时偏移+
    expect(DateTimeTool.parse(`2022-08-09T03:03:06.123+0100`)).toBe(1660010586123);

    // 带小时偏移-
    expect(DateTimeTool.parse(`2022-08-09T03:03:06.123-0100`)).toBe(1660017786123);

    // 带分钟偏移+
    expect(DateTimeTool.parse(`2022-08-09T03:03:06.123+0102`)).toBe(1660010466123);

    // 带分钟偏移-
    expect(DateTimeTool.parse(`2022-08-09T03:03:06.123-0102`)).toBe(1660017906123);

    expect(DateTimeTool.parse(`2022-08-09T03:01:54.000+0000`)).toBe(1660014114000);

    // 另一种格式
    expect(DateTimeTool.parse(`2022-08-09T02:51:36.291Z`)).toBe(1660013496291);

    expect(DateTimeTool.parse(`2012-04-03T05:21:36.798Z`)).toBe(1333430496798);

    expect(DateTimeTool.parse(`2021-08-13T14:20:18.992847200-04:00`)).toBe(1628878818992);

    expect(DateTimeTool.parse(`2022-12-30 23:59:48`)).toBe(1672415988000);

    expect(DateTimeTool.parse(`2022/12/30 23:59:48`)).toBe(1672415988000);

    expect(DateTimeTool.parse(`1992/02/12 12:23:22+0800`)).toBe(697868602000);
    expect(DateTimeTool.parse(`1992/02/12 12:23:22+0000`)).toBe(697897402000);
    expect(DateTimeTool.parse(`1992/02/12 12:23:22+0100`)).toBe(697893802000);
  });
})
