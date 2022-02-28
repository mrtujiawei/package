import CryptoJS from 'crypto-js';
import { Base64 } from 'js-base64';

/**
 * 加解密相关
 *
 * 依赖:
 *  yarn add js-base64
 *  yarn add crypto-js
 */
class Encrypt {
  /**
   * @param {string} aesKey - 长度为16位的字符串
   */
  constructor(aesKey) {
    if (16 != aesKey.length) {
      throw new Error('aesKey length is not 16');
    }
    this.aesKey = aesKey;
    this.key = CryptoJS.enc.Utf8.parse(config.aesKey);
    this.config = {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    };
  }

  /**
   * 加密密码
   *
   * @param {string} content
   * @returns {string}
   */
  encode(content) {
    let text = Base64.encode(content);
    let encrypt = CryptoJS.AES.encrypt(text, this.key, this.config);
    let encodedContent = CryptoJS.enc.Base64.stringify(encrypt.ciphertext);
    return encodedContent;
  }

  /**
   * 解密密码
   *
   * @param {string} content
   * @returns {string}
   */
  decode(content) {
    let decrpy = CryptoJS.AES.decrypt(content, AES_KEY, AES_CONFIG).toString(
      CryptoJS.enc.Utf8
    );
    let decodedContent = Base64.decode(decrpy);
    return decodedContent;
  }
}

export default Encrypt;
