import {isIP} from "net";
import {isEmail, isID} from "../src";

describe('RegExp utils test', () => {
  test('Email test', () => {
    expect(isEmail('tujiawei@mail.com')).toBeTruthy();
    expect(isEmail('tujiawei@mail')).toBeFalsy();
  });

  test('IP test', () => {
    expect(isIP('192.168.1.1')).toBeTruthy();
    expect(isIP('192.168.1.1.1')).toBeFalsy();
    expect(isIP('192.168.1.256')).toBeFalsy();
  });

  test('ID test', () => {
    expect(isID('330682199001012222')).toBeTruthy();
    expect(isID('33068219900101222x')).toBeTruthy();
    expect(isID('330682199001012')).toBeTruthy();
    expect(isID('33068219900101212')).toBeFalsy();
  });
});
