import CryptoJS from 'crypto-js';
import { Base64 } from 'js-base64';

class AesEncrypt {
  /**
   * size invalid error
   */
  static readonly InvalidKeyError = class extends Error {
    constructor(message: string = 'key.length is not 16') {
      super(message);
    }
  };

  /**
   * 处理过的密钥
   */
  private key: CryptoJS.lib.WordArray;

  /**
   * 加解密配置
   */
  private cipherConfig = {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  };

  /**
   * @param key - 长度为16位的字符串
   */
  constructor(key: string) {
    this.checkKey(key);
    this.key = CryptoJS.enc.Utf8.parse(key);
  }

  private checkKey(key: string) {
    if (key.length != 16) {
      throw new AesEncrypt.InvalidKeyError();
    }
  }

  /**
   * 加密
   *
   * @param content 需要加密的内容
   */
  public encode(content: string) {
    return CryptoJS.enc.Base64.stringify(
      CryptoJS.AES.encrypt(Base64.encode(content), this.key, this.cipherConfig)
        .ciphertext
    );
  }

  /**
   * 解密
   *
   * @param content
   */
  public decode(content: string) {
    return Base64.decode(
      CryptoJS.AES.decrypt(content, this.key, this.cipherConfig).toString(
        CryptoJS.enc.Utf8
      )
    );
  }
}

export default AesEncrypt;
